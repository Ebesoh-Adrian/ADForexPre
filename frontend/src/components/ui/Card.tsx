import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  padding = 'md',
  hover = false 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
      paddingClasses[padding],
      hover && 'transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={clsx('mb-4', className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h3 className={clsx(
    'text-lg font-semibold text-gray-900 dark:text-white',
    className
  )}>
    {children}
  </h3>
);

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={clsx('text-gray-600 dark:text-gray-300', className)}>
    {children}
  </div>
);