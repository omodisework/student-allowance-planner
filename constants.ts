
import { CreditCardData } from './types';

export const INITIAL_CREDIT_CARD_DATA: CreditCardData = {
  id: 'card-123',
  name: 'Student Discover IT',
  creditLimit: 1500,
  currentBalance: 450,
  minPaymentDue: 35,
  paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 10)), // 10 days from now
  spendingHistory: [
    { date: new Date(new Date().setDate(new Date().getDate() - 1)), amount: 25.50, description: 'Coffee' },
    { date: new Date(new Date().setDate(new Date().getDate() - 3)), amount: 75.00, description: 'Groceries' },
    { date: new Date(new Date().setDate(new Date().getDate() - 7)), amount: 40.00, description: 'Bookstore' },
    { date: new Date(new Date().setDate(new Date().getDate() - 10)), amount: 150.00, description: 'Dining out' },
  ],
};

export const INITIAL_CREDIT_SCORE = 720;
export const SAFE_SPENDING_THRESHOLD = 0.3; // 30% of credit limit
export const WARNING_SPENDING_THRESHOLD = 0.6; // 60% of credit limit

export const SPENDING_GAUGE_COLORS = {
  safe: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export const SPENDING_GAUGE_LABELS = {
  safe: 'Great!',
  warning: 'Careful!',
  danger: 'High Usage!',
};
