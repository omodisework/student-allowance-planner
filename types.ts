
export interface CreditCardData {
  id: string;
  name: string;
  creditLimit: number;
  currentBalance: number;
  minPaymentDue: number;
  paymentDueDate: Date;
  spendingHistory: SpendingEntry[];
}

export interface SpendingEntry {
  date: Date;
  amount: number;
  description?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
}

export interface GeminiGuidanceRequest {
  currentBalance: number;
  creditLimit: number;
  minPaymentDue: number;
  paymentDueDate: string; // ISO string
  recentSpending: SpendingEntry[];
  creditScore: number;
}

// Declares the aistudio object on the global Window interface
// This is moved here from App.tsx to ensure a single, consistent global declaration.
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}