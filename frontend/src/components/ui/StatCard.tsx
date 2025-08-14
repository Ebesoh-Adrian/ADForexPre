import React, { ReactNode } from 'react';
import { Card } from './Card';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red';
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = 'blue',
  loading = false
}) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    amber: 'text-amber-600 bg-amber-100',
    red: 'text-red-600 bg-red-100'
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover className="transition-all duration-200">
      <div className="flex items-center">
        {icon && (
          <div className={clsx('p-2 rounded-lg mr-3', colors[color])}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <span className={clsx(
                'text-sm font-medium',
                change >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-gray-500 ml-1">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};