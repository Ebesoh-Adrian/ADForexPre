import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const mockData = [
  { month: 'Jan', income: 7500, expenses: 5200, savings: 2300 },
  { month: 'Feb', income: 7500, expenses: 4800, savings: 2700 },
  { month: 'Mar', income: 7500, expenses: 5500, savings: 2000 },
  { month: 'Apr', income: 7500, expenses: 5100, savings: 2400 },
  { month: 'May', income: 8000, expenses: 5300, savings: 2700 },
  { month: 'Jun', income: 8000, expenses: 5600, savings: 2400 },
];

export const CashFlowChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Cash Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#10B981"
                fill="url(#incomeGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#EF4444"
                fill="url(#expensesGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stackId="3"
                stroke="#3B82F6"
                fill="url(#savingsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">$8,000</div>
            <div className="text-sm text-green-600">Average Income</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-semibold text-red-600">$5,250</div>
            <div className="text-sm text-red-600">Average Expenses</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">$2,420</div>
            <div className="text-sm text-blue-600">Average Savings</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};