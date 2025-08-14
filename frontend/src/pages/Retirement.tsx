import React from 'react';
import { RetirementCalculator } from '../components/retirement/RetirementCalculator';

export const Retirement: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Retirement Planning</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Plan for your future with comprehensive retirement tools and projections.
        </p>
      </div>
      
      <RetirementCalculator />
    </div>
  );
};