
import { GoogleGenAI } from "@google/genai";
import { GeminiGuidanceRequest, SpendingEntry } from '../types';

/**
 * Encodes a Uint8Array to a base64 string.
 * This is a helper function for audio encoding/decoding, not directly used for text,
 * but included for completeness as per guidelines.
 */
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a base64 string to a Uint8Array.
 * This is a helper function for audio encoding/decoding, not directly used for text,
 * but included for completeness as per guidelines.
 */
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Initializes the GoogleGenAI client.
 * This function should be called right before making an API call to ensure the latest API key is used.
 */
function initGemini(): GoogleGenAI {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

/**
 * Provides smart credit card guidance using the Gemini API.
 * @param data - The financial data for the student's credit card.
 * @returns A promise that resolves to the guidance message string.
 */
export async function getSmartGuidance(data: GeminiGuidanceRequest): Promise<string> {
  try {
    const ai = initGemini();

    const spendingSummary = data.recentSpending
      .map(s => `- ${s.date.toLocaleDateString()}: $${s.amount.toFixed(2)} (${s.description || 'N/A'})`)
      .join('\n');

    const prompt = `
      You are a friendly and helpful financial advisor for college students.
      Your goal is to provide smart, actionable guidance on credit card management, especially regarding timely payments and safe spending habits.
      The student is asking for advice, specifically on the question "Pay same day?".

      Here's the student's current credit card situation:
      - Credit Limit: $${data.creditLimit.toFixed(2)}
      - Current Balance: $${data.currentBalance.toFixed(2)}
      - Minimum Payment Due: $${data.minPaymentDue.toFixed(2)}
      - Payment Due Date: ${data.paymentDueDate}
      - Current Estimated Credit Score: ${data.creditScore}
      - Recent Spending Habits (last few entries):
      ${spendingSummary || '- No recent spending data available.'}

      Based on this information, provide clear guidance.
      Specifically address the "Pay same day?" question.
      Consider:
      1. Their current credit utilization (Current Balance / Credit Limit).
      2. The proximity of the payment due date.
      3. The impact on their credit score.
      4. General best practices for students (e.g., paying more than minimum, avoiding high utilization).
      5. Keep the advice concise and encouraging, tailored for a student audience.
      Do not ask for more information. Provide direct advice.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 500, // Reasonable limit for guidance
        systemInstruction: "You are a friendly and helpful financial advisor for college students.",
      },
    });

    const guidanceText = response.text;
    if (!guidanceText) {
      throw new Error("Gemini API returned an empty response.");
    }
    return guidanceText.trim();

  } catch (error) {
    console.error("Error fetching Gemini guidance:", error);
    if (error instanceof Error) {
      // Check for specific error messages from the API key selection process
      if (error.message.includes("Requested entity was not found.")) {
        // This might indicate an invalid or unselected API key in the environment
        // The UI should handle prompting the user to select a key again.
        return `Failed to get guidance. It looks like there's an issue with the API key or service. Please try selecting your API key again.`;
      }
      throw new Error(`Failed to get guidance: ${error.message}`);
    }
    throw new Error("An unknown error occurred while getting guidance.");
  }
}
