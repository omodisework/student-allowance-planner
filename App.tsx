
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CardSummary from './components/CardSummary';
import BillTimeline from './components/BillTimeline';
import CreditScoreSimulator from './components/CreditScoreSimulator';
import SpendingGauge from './components/SpendingGauge';
import GuidancePanel from './components/GuidancePanel';
import { CreditCardData, Bill, SpendingEntry, GeminiGuidanceRequest } from './types';
import { INITIAL_CREDIT_CARD_DATA, INITIAL_CREDIT_SCORE } from './constants';
import { getSmartGuidance } from './services/geminiService';

const App: React.FC = () => {
  const [cardData, setCardData] = useState<CreditCardData>(INITIAL_CREDIT_CARD_DATA);
  const [creditScore, setCreditScore] = useState<number>(INITIAL_CREDIT_SCORE);
  const [guidanceMessage, setGuidanceMessage] = useState<string | null>(null);
  const [isLoadingGuidance, setIsLoadingGuidance] = useState<boolean>(false);
  const [guidanceError, setGuidanceError] = useState<string | null>(null);
  const [isApiKeySelected, setIsApiKeySelected] = useState<boolean>(false);

  // Derive upcoming bills from cardData for simplicity, could be more complex with multiple bills
  const upcomingBills: Bill[] = [
    {
      id: 'cc-payment',
      name: `${cardData.name} Minimum Payment`,
      amount: cardData.minPaymentDue,
      dueDate: cardData.paymentDueDate,
      isPaid: false,
    },
  ];

  const handleSimulateCreditScore = useCallback(<T,>(action: string, amount: T) => {
    // A simple simulation logic, could be more complex
    setCreditScore(prevScore => {
      let newScore = prevScore;
      if (action === 'payment' && typeof amount === 'number') {
        newScore += Math.floor(amount / 50);
      } else if (action === 'spending' && typeof amount === 'number') {
        newScore -= Math.floor(amount / 100);
      }
      return Math.max(300, Math.min(850, newScore));
    });
  }, []);

  const checkApiKeyStatus = useCallback(async () => {
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const selected = await window.aistudio.hasSelectedApiKey();
      setIsApiKeySelected(selected);
    } else {
      // Assume API key is available via environment for local dev if aistudio is not present
      setIsApiKeySelected(true);
    }
  }, []);

  useEffect(() => {
    checkApiKeyStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleOpenSelectApiKey = useCallback(async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      // Assume success and update state to allow guidance generation
      setIsApiKeySelected(true);
      setGuidanceError(null); // Clear previous API key errors
    } else {
      setGuidanceError("AI Studio API key selection not available in this environment.");
    }
  }, []);

  const handleGetGuidance = useCallback(async () => {
    if (!isApiKeySelected) {
      setGuidanceError("Please select your Gemini API key first to get guidance.");
      return;
    }

    setIsLoadingGuidance(true);
    setGuidanceError(null);
    setGuidanceMessage(null);

    const guidanceRequest: GeminiGuidanceRequest = {
      currentBalance: cardData.currentBalance,
      creditLimit: cardData.creditLimit,
      minPaymentDue: cardData.minPaymentDue,
      paymentDueDate: cardData.paymentDueDate.toISOString().split('T')[0], // YYYY-MM-DD
      recentSpending: cardData.spendingHistory,
      creditScore: creditScore,
    };

    try {
      const guidance = await getSmartGuidance(guidanceRequest);
      setGuidanceMessage(guidance);
    } catch (error) {
      console.error("Failed to get guidance:", error);
      let errorMessage = "Failed to get guidance. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes("Requested entity was not found.")) {
          errorMessage = "It looks like the API key is not valid or not selected. Please select your API key again.";
          setIsApiKeySelected(false); // Reset key selection state if it fails
        }
      }
      setGuidanceError(errorMessage);
    } finally {
      setIsLoadingGuidance(false);
    }
  }, [cardData, creditScore, isApiKeySelected]);


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left Column (or top on mobile) */}
        <div className="lg:col-span-2">
          <CardSummary card={cardData} />
          <SpendingGauge
            currentBalance={cardData.currentBalance}
            creditLimit={cardData.creditLimit}
          />
          <BillTimeline bills={upcomingBills} />
        </div>

        {/* Right Column (or bottom on mobile) */}
        <div className="lg:col-span-1">
          <CreditScoreSimulator
            currentScore={creditScore}
            onSimulate={handleSimulateCreditScore}
          />

          {!isApiKeySelected && (
            <div className="bg-warning-100 border border-warning text-warning rounded-lg p-6 mb-6 text-center">
              <p className="font-semibold text-lg mb-3">Gemini API Key Required</p>
              <p className="mb-4">Please select your Gemini API key to enable smart guidance features.</p>
              <button
                onClick={handleOpenSelectApiKey}
                className="w-full bg-warning hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-md transition duration-300"
              >
                Select API Key
              </button>
              <p className="text-sm text-textLight mt-4">
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  Learn more about Gemini API billing.
                </a>
              </p>
            </div>
          )}

          <GuidancePanel
            guidanceMessage={guidanceMessage}
            isLoading={isLoadingGuidance}
            error={guidanceError}
            onGetGuidance={handleGetGuidance}
          />
        </div>
      </main>
    </div>
  );
};

export default App;