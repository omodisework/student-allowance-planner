
import React from 'react';
import { Bill } from '../types';

interface BillTimelineProps {
  bills: Bill[];
}

const BillTimeline: React.FC<BillTimelineProps> = ({ bills }) => {
  if (bills.length === 0) {
    return (
      <div className="bg-card shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-text mb-4">Upcoming Bills</h2>
        <p className="text-textLight text-center">No upcoming bills for this period.</p>
      </div>
    );
  }

  return (
    <div className="bg-card shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-text mb-4">Upcoming Bills</h2>
      <ul className="space-y-4">
        {bills
          .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
          .map((bill) => (
            <li key={bill.id} className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
              <div>
                <p className="font-medium text-text">{bill.name}: <span className="text-lg font-bold">${bill.amount.toFixed(2)}</span></p>
                <p className="text-sm text-textLight">Due: {bill.dueDate.toLocaleDateString()}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BillTimeline;
