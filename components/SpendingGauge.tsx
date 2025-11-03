
import React from 'react';
import { SAFE_SPENDING_THRESHOLD, WARNING_SPENDING_THRESHOLD, SPENDING_GAUGE_COLORS, SPENDING_GAUGE_LABELS } from '../constants';

interface SpendingGaugeProps {
  currentBalance: number;
  creditLimit: number;
}

const SpendingGauge: React.FC<SpendingGaugeProps> = ({ currentBalance, creditLimit }) => {
  const utilization = creditLimit > 0 ? (currentBalance / creditLimit) : 0;
  const percentage = Math.min(100, Math.max(0, utilization * 100));

  let gaugeColorClass = SPENDING_GAUGE_COLORS.safe;
  let label = SPENDING_GAUGE_LABELS.safe;

  if (utilization >= WARNING_SPENDING_THRESHOLD) {
    gaugeColorClass = SPENDING_GAUGE_COLORS.danger;
    label = SPENDING_GAUGE_LABELS.danger;
  } else if (utilization >= SAFE_SPENDING_THRESHOLD) {
    gaugeColorClass = SPENDING_GAUGE_COLORS.warning;
    label = SPENDING_GAUGE_LABELS.warning;
  }

  return (
    <div className="bg-card shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-text mb-4">Safe-Zone Spending</h2>
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${gaugeColorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-textLight mb-2">
        <span>0%</span>
        <span>{Math.round(SAFE_SPENDING_THRESHOLD * 100)}%</span>
        <span>{Math.round(WARNING_SPENDING_THRESHOLD * 100)}%</span>
        <span>100%</span>
      </div>
      <p className={`text-center text-xl font-bold ${gaugeColorClass.replace('bg-', 'text-')}`}>
        {percentage.toFixed(0)}% Used - {label}
      </p>
      <p className="text-center text-sm text-textLight mt-2">
        Credit Utilization: ${currentBalance.toFixed(2)} / ${creditLimit.toFixed(2)}
      </p>
    </div>
  );
};

export default SpendingGauge;
