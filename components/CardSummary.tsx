
import React from 'react';
import { CreditCardData } from '../types';

interface CardSummaryProps {
  card: CreditCardData;
}

const CardSummary: React.FC<CardSummaryProps> = ({ card }) => {
  const availableCredit = card.creditLimit - card.currentBalance;

  return (
    <div className="bg-card shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-text mb-4">{card.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-textLight text-sm">Credit Limit</p>
          <p className="text-xl font-bold text-primary">${card.creditLimit.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-textLight text-sm">Current Balance</p>
          <p className="text-xl font-bold text-danger">${card.currentBalance.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-textLight text-sm">Available Credit</p>
          <p className="text-xl font-bold text-success">${availableCredit.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-200 pt-4 text-center">
        <p className="text-textLight text-sm">Minimum Payment Due</p>
        <p className="text-lg font-bold text-info">${card.minPaymentDue.toFixed(2)} on {card.paymentDueDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default CardSummary;
