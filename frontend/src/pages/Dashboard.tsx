import React from 'react';
import { HealthScoreCard } from '../components/dashboard/HealthScoreCard';
import { QuickStats } from '../components/dashboard/QuickStats';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BellIcon, TrendingUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const upcomingBills = [
    { name: 'Rent', amount: 1500, dueDate: '2025-01-05', category: 'Housing' },
    { name: 'Student Loan', amount: 300, dueDate: '2025-01-08', category: 'Debt' },
    { name: 'Car Insurance', amount: 150, dueDate: '2025-01-12', category: 'Insurance' },
  ];

  const financialTips = [
    "Consider increasing your 401(k) contribution by 1% to maximize employer match",
    "Your emergency fund goal is almost reached! Just $500 more to go.",
    "Review your student loan payment strategy - you could save $2,400 in interest",
  ];

  const recentTransactions = [
    { description: 'Salary Deposit', amount: 3750, type: 'income', date: '2025-01-02' },
    { description: 'Grocery Store', amount: -145, type: 'expense', date: '2025-01-02' },
    { description: '401(k) Contribution', amount: -500, type: 'investment', date: '2025-01-01' },
    { description: 'Emergency Fund Transfer', amount: -200, type: 'savings', date: '2024-12-30' },
  ];

  return (
    <div className="space-y-8">
      {/* Health Score and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <HealthScoreCard />
        </div>
        <div className="lg:col-span-2">
          <QuickStats />
        </div>
      </div>

      {/* Cash Flow Chart */}
      <CashFlowChart />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Bills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="w-5 h-5" />
              Upcoming Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBills.map((bill, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{bill.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Due {new Date(bill.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${bill.amount}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {bill.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View All Bills
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.amount > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Financial Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5" />
              Personalized Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialTips.map((tip, index) => (
                <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">{tip}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View More Tips
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};