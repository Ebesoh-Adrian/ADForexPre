import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { useData } from '../../contexts/DataContext';
// Correct way to import icons from heroicons
// import {
//   TrendingUpIcon,
//   AlertTriangleIcon,
//   CheckCircleIcon
// } from '@heroicons/react/24/outline';

export const HealthScoreCard: React.FC = () => {
  const { healthMetrics, loading } = useData();

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </Card>
    );
  }

  if (!healthMetrics) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'amber';
    return 'red';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircleIcon className="w-6 h-6" />;
    if (score >= 60) return <AlertTriangleIcon className="w-6 h-6" />;
    return <TrendingUpIcon className="w-6 h-6" />;
  };

  const scoreColor = getScoreColor(healthMetrics.score);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${{
              green: 'bg-green-100 text-green-600',
              amber: 'bg-amber-100 text-amber-600',
              red: 'bg-red-100 text-red-600'
            }[scoreColor]}`}
          >
            {getScoreIcon(healthMetrics.score)}
          </div>
          Financial Health Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {healthMetrics.score}
            <span className="text-lg text-gray-500 dark:text-gray-400">
              /100
            </span>
          </div>
          <ProgressBar value={healthMetrics.score} color={scoreColor} size="lg" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {healthMetrics.retirementReadiness.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Retirement Ready
            </div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {healthMetrics.emergencyFundStatus.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Emergency Fund
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Recommendations
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            {healthMetrics.score < 60 && (
              <li>• Build your emergency fund to 3-6 months of expenses</li>
            )}
            {healthMetrics.retirementReadiness < 50 && (
              <li>• Increase 401(k) contributions to get full employer match</li>
            )}
            {healthMetrics.debtToIncome > 30 && (
              <li>• Focus on reducing high-interest debt</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};