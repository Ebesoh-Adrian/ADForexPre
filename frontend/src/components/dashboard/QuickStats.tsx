import React from 'react';
import { StatCard } from '../ui/StatCard';
import { useData } from '../../contexts/DataContext';
import { 
  BanknotesIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline';

export const QuickStats: React.FC = () => {
  const { financialData, healthMetrics, loading } = useData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <StatCard
            key={i}
            title="Loading..."
            value="--"
            loading={true}
          />
        ))}
      </div>
    );
  }

  if (!financialData || !healthMetrics) return null;

  const netWorth = financialData.retirement.currentBalance - 
    financialData.loans.reduce((sum, loan) => sum + loan.balance, 0);

  const totalDebt = financialData.loans.reduce((sum, loan) => sum + loan.balance, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Net Worth"
        value={`$${netWorth.toLocaleString()}`}
        change={healthMetrics.netWorthTrend}
        changeLabel="this month"
        icon={<TrendingUpIcon className="w-6 h-6" />}
        color="green"
      />
      
      <StatCard
        title="Retirement Balance"
        value={`$${financialData.retirement.currentBalance.toLocaleString()}`}
        change={12.5}
        changeLabel="this year"
        icon={<BanknotesIcon className="w-6 h-6" />}
        color="blue"
      />
      
      <StatCard
        title="Emergency Fund"
        value={`${financialData.emergencyFund.monthsCovered.toFixed(1)} months`}
        icon={<ShieldCheckIcon className="w-6 h-6" />}
        color={financialData.emergencyFund.monthsCovered >= 3 ? 'green' : 'amber'}
      />
      
      <StatCard
        title="Total Debt"
        value={`$${totalDebt.toLocaleString()}`}
        change={-2.3}
        changeLabel="this month"
        icon={<CreditCardIcon className="w-6 h-6" />}
        color={totalDebt > 0 ? 'red' : 'green'}
      />
    </div>
  );
};