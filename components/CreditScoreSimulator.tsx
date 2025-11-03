
import React, { useState, useCallback } from 'react';

interface CreditScoreSimulatorProps {
  currentScore: number;
  onSimulate: (action: string, amount: number) => void;
}

const CreditScoreSimulator: React.FC<CreditScoreSimulatorProps> = ({ currentScore, onSimulate }) => {
  const [action, setAction] = useState<'payment' | 'spending'>('payment');
  const [amount, setAmount] = useState<number>(0);
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null);

  const simulateScore = useCallback(() => {
    let newScore = currentScore;
    if (action === 'payment') {
      newScore += Math.floor(amount / 50); // Simple: +1 point for every $50 paid
    } else { // spending
      newScore -= Math.floor(amount / 100); // Simple: -1 point for every $100 spent
    }
    setSimulatedScore(Math.max(300, Math.min(850, newScore))); // Keep score within 300-850 range
    onSimulate(action, amount); // Propagate action to parent if needed for more complex simulation
  }, [action, amount, currentScore, onSimulate]);

  return (
    <div className="bg-card shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-text mb-4">Credit Score Simulator</h2>
      <p className="text-textLight mb-4">Current Score: <span className="font-bold text-primary text-xl">{currentScore}</span></p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={action}
          onChange={(e) => setAction(e.target.value as 'payment' | 'spending')}
        >
          <option value="payment">Make a Payment</option>
          <option value="spending">Increase Spending</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={amount === 0 ? '' : amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="0"
        />
      </div>
      <button
        onClick={simulateScore}
        className="w-full bg-secondary hover:bg-primary text-white font-bold py-3 px-4 rounded-md transition duration-300"
      >
        Simulate Score
      </button>

      {simulatedScore !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md text-center">
          <p className="text-textLight text-lg">Simulated Score:</p>
          <p className="text-3xl font-bold text-accent">{simulatedScore}</p>
          <p className="text-sm text-textLight mt-2">
            This is an estimate. Actual results may vary.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreditScoreSimulator;
