import React from 'react';
import { LoanOptimizer } from '../components/loans/LoanOptimizer';

export const StudentLoans: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Loan Optimization</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your student loans and optimize your repayment strategy.
        </p>
      </div>
      
      <LoanOptimizer />
    </div>
  );
};