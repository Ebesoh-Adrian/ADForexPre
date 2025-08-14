import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'amber' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'blue',
  size = 'md',
  showPercentage = false,
  label
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600'
  };
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {showPercentage && <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={clsx(
        'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
        sizes[size]
      )}>
        <div
          className={clsx(colors[color], 'transition-all duration-300 ease-out', sizes[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};