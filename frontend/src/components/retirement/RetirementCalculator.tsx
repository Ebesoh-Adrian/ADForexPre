import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { useData } from '../../contexts/DataContext';
import { RetirementProjection } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const RetirementCalculator: React.FC = () => {
  const { financialData, updateFinancialData } = useData();
  const [currentAge, setCurrentAge] = useState(30);
  const [annualSalary, setAnnualSalary] = useState(75000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [employerMatch, setEmployerMatch] = useState(0.04);
  const [projections, setProjections] = useState<RetirementProjection[]>([]);

  const calculateProjections = () => {
    if (!financialData) return;

    const newProjections: RetirementProjection[] = [];
    let currentBalance = financialData.retirement.currentBalance;
    const annualReturn = 0.07; // 7% average return
    const targetRetirementAge = financialData.retirement.targetRetirementAge;
    
    for (let age = currentAge; age <= targetRetirementAge; age++) {
      const yearlyContribution = monthlyContribution * 12;
      const yearlyEmployerMatch = Math.min(yearlyContribution, annualSalary * employerMatch);
      const totalYearlyContribution = yearlyContribution + yearlyEmployerMatch;
      
      // Calculate balance at end of year
      currentBalance = (currentBalance + totalYearlyContribution) * (1 + annualReturn);
      
      // Calculate monthly income using 4% withdrawal rate
      const monthlyIncome = (currentBalance * 0.04) / 12;
      
      newProjections.push({
        age,
        balance: Math.round(currentBalance),
        monthlyIncome: Math.round(monthlyIncome)
      });
    }
    
    setProjections(newProjections);
  };

  useEffect(() => {
    calculateProjections();
  }, [currentAge, annualSalary, monthlyContribution, employerMatch, financialData]);

  const handleSaveSettings = async () => {
    if (!financialData) return;
    
    await updateFinancialData({
      retirement: {
        ...financialData.retirement,
        monthlyContribution,
        employerMatch: employerMatch * annualSalary / 12,
        projections
      }
    });
  };

  const finalProjection = projections[projections.length - 1];
  const monthlyIncomeGoal = 5000; // Example goal
  const readinessPercentage = finalProjection 
    ? Math.min((finalProjection.monthlyIncome / monthlyIncomeGoal) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Retirement Planning Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Salary
                </label>
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Contribution
                </label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer Match (%)
                </label>
                <input
                  type="number"
                  value={employerMatch * 100}
                  onChange={(e) => setEmployerMatch(Number(e.target.value) / 100)}
                  step="0.5"
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <Button onClick={handleSaveSettings} className="w-full">
                Save Settings
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Retirement Readiness</h4>
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  {readinessPercentage.toFixed(0)}%
                </div>
                <ProgressBar value={readinessPercentage} color="blue" />
              </div>
              
              {finalProjection && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-900">
                      ${finalProjection.balance.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">Final Balance</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-amber-900">
                      ${finalProjection.monthlyIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-amber-600">Monthly Income</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {projections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Retirement Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};