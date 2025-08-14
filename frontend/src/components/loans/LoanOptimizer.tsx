import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { useData } from '../../contexts/DataContext';
import { StudentLoan } from '../../types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export const LoanOptimizer: React.FC = () => {
  const { financialData, updateFinancialData } = useData();
  const [newLoan, setNewLoan] = useState<Partial<StudentLoan>>({
    servicer: '',
    balance: 0,
    interestRate: 0,
    minimumPayment: 0,
    type: 'federal',
    status: 'active'
  });
  const [paymentStrategy, setPaymentStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [extraPayment, setExtraPayment] = useState(0);

  const addLoan = async () => {
    if (!financialData || !newLoan.servicer) return;
    
    const loan: StudentLoan = {
      id: Date.now().toString(),
      servicer: newLoan.servicer!,
      balance: newLoan.balance!,
      interestRate: newLoan.interestRate! / 100,
      minimumPayment: newLoan.minimumPayment!,
      type: newLoan.type!,
      status: newLoan.status!
    };
    
    await updateFinancialData({
      loans: [...financialData.loans, loan]
    });
    
    setNewLoan({
      servicer: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: 'federal',
      status: 'active'
    });
  };

  const removeLoan = async (loanId: string) => {
    if (!financialData) return;
    
    await updateFinancialData({
      loans: financialData.loans.filter(loan => loan.id !== loanId)
    });
  };

  const calculatePayoffStrategy = () => {
    if (!financialData) return [];
    
    const loans = [...financialData.loans];
    
    if (paymentStrategy === 'avalanche') {
      loans.sort((a, b) => b.interestRate - a.interestRate);
    } else {
      loans.sort((a, b) => a.balance - b.balance);
    }
    
    return loans.map((loan, index) => {
      const additionalPayment = index === 0 ? extraPayment : 0;
      const totalPayment = loan.minimumPayment + additionalPayment;
      const monthsToPayoff = Math.ceil(
        Math.log(1 + (loan.balance * loan.interestRate) / (12 * totalPayment)) /
        Math.log(1 + loan.interestRate / 12)
      );
      const totalInterest = (totalPayment * monthsToPayoff) - loan.balance;
      
      return {
        ...loan,
        monthsToPayoff: isFinite(monthsToPayoff) ? monthsToPayoff : 0,
        totalInterest: isFinite(totalInterest) ? totalInterest : 0,
        totalPayment,
        priority: index + 1
      };
    });
  };

  const optimizedLoans = calculatePayoffStrategy();
  const totalBalance = financialData?.loans.reduce((sum, loan) => sum + loan.balance, 0) || 0;
  const totalMinimumPayment = financialData?.loans.reduce((sum, loan) => sum + loan.minimumPayment, 0) || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Loan Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                ${totalBalance.toLocaleString()}
              </div>
              <div className="text-sm text-red-600">Total Balance</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                ${totalMinimumPayment.toLocaleString()}
              </div>
              <div className="text-sm text-amber-600">Monthly Payment</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {financialData?.loans.length || 0}
              </div>
              <div className="text-sm text-blue-600">Active Loans</div>
            </div>
          </div>

          <div className="space-y-4">
            {financialData?.loans.map((loan) => (
              <div key={loan.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{loan.servicer}</h4>
                    <p className="text-sm text-gray-500">{loan.type} • {loan.status}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLoan(loan.id)}
                    icon={<TrashIcon className="w-4 h-4" />}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      ${loan.balance.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Balance</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {(loan.interestRate * 100).toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-500">Interest Rate</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      ${loan.minimumPayment}
                    </div>
                    <div className="text-sm text-gray-500">Min Payment</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4">Add New Loan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Loan Servicer"
                value={newLoan.servicer}
                onChange={(e) => setNewLoan({ ...newLoan, servicer: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Balance"
                value={newLoan.balance}
                onChange={(e) => setNewLoan({ ...newLoan, balance: Number(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Interest Rate (%)"
                value={newLoan.interestRate}
                onChange={(e) => setNewLoan({ ...newLoan, interestRate: Number(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Minimum Payment"
                value={newLoan.minimumPayment}
                onChange={(e) => setNewLoan({ ...newLoan, minimumPayment: Number(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newLoan.type}
                onChange={(e) => setNewLoan({ ...newLoan, type: e.target.value as 'federal' | 'private' })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="federal">Federal</option>
                <option value="private">Private</option>
              </select>
              <Button onClick={addLoan} icon={<PlusIcon className="w-4 h-4" />}>
                Add Loan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Strategy Optimizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Strategy
                  </label>
                  <select
                    value={paymentStrategy}
                    onChange={(e) => setPaymentStrategy(e.target.value as 'avalanche' | 'snowball')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="avalanche">Avalanche (Highest Interest First)</option>
                    <option value="snowball">Snowball (Lowest Balance First)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extra Monthly Payment
                  </label>
                  <input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Optimized Payment Order</h4>
                {optimizedLoans.map((loan) => (
                  <div key={loan.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{loan.priority}. {loan.servicer}</span>
                      <span className="text-sm text-gray-500">
                        ${loan.totalPayment}/month
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Payoff in {loan.monthsToPayoff} months • 
                      Interest: ${loan.totalInterest.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};