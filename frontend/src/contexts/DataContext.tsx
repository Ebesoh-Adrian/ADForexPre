import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { FinancialData, FinancialHealthMetrics } from '../types';

interface DataContextType {
  financialData: FinancialData | null;
  healthMetrics: FinancialHealthMetrics | null;
  loading: boolean;
  updateFinancialData: (data: Partial<FinancialData>) => Promise<void>;
  calculateHealthScore: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<FinancialHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const loadFinancialData = async () => {
    if (!currentUser) return;

    try {
      const dataDoc = await getDoc(doc(db, 'financial_data', currentUser.id));
      if (dataDoc.exists()) {
        setFinancialData(dataDoc.data() as FinancialData);
      } else {
        // Initialize empty financial data
        const initialData: FinancialData = {
          retirement: {
            currentBalance: 0,
            monthlyContribution: 0,
            employerMatch: 0,
            retirementGoal: 1000000,
            targetRetirementAge: 65,
            investmentAllocation: {
              stocks: 70,
              bonds: 20,
              international: 10,
              cash: 0
            },
            projections: []
          },
          loans: [],
          emergencyFund: {
            currentAmount: 0,
            goalAmount: 0,
            monthlyExpenses: 0,
            monthsCovered: 0,
            autoSavingsAmount: 0
          },
          budgets: [],
          transactions: [],
          benefits: {
            hsaBalance: 0,
            fsaBalance: 0,
            ptoBalance: 0,
            ptoUsed: 0,
            insurancePremiums: {
              health: 0,
              dental: 0,
              vision: 0,
              life: 0
            },
            wellnessPoints: 0
          }
        };
        
        await setDoc(doc(db, 'financial_data', currentUser.id), initialData);
        setFinancialData(initialData);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
  };

  const updateFinancialData = async (data: Partial<FinancialData>) => {
    if (!currentUser || !financialData) return;
    
    const updatedData = { ...financialData, ...data };
    await setDoc(doc(db, 'financial_data', currentUser.id), updatedData);
    setFinancialData(updatedData);
    await calculateHealthScore();
  };

  const calculateHealthScore = async () => {
    if (!financialData) return;

    // Simplified health score calculation
    let score = 0;
    let factors = 0;

    // Emergency fund (25 points)
    if (financialData.emergencyFund.monthsCovered >= 6) {
      score += 25;
    } else if (financialData.emergencyFund.monthsCovered >= 3) {
      score += 15;
    } else if (financialData.emergencyFund.monthsCovered >= 1) {
      score += 8;
    }
    factors++;

    // Retirement savings (25 points)
    const retirementScore = Math.min(financialData.retirement.currentBalance / 100000, 1) * 25;
    score += retirementScore;
    factors++;

    // Debt management (25 points)
    const totalDebt = financialData.loans.reduce((sum, loan) => sum + loan.balance, 0);
    if (totalDebt === 0) {
      score += 25;
    } else if (totalDebt < 50000) {
      score += 15;
    } else if (totalDebt < 100000) {
      score += 10;
    }
    factors++;

    // Benefits utilization (25 points)
    if (financialData.benefits.hsaBalance > 0) score += 10;
    if (financialData.benefits.wellnessPoints > 0) score += 10;
    score += 5; // Base for having benefits
    factors++;

    const finalScore = Math.round(score);
    
    const metrics: FinancialHealthMetrics = {
      score: finalScore,
      netWorthTrend: 5.2,
      retirementReadiness: Math.min((financialData.retirement.currentBalance / 500000) * 100, 100),
      emergencyFundStatus: (financialData.emergencyFund.monthsCovered / 6) * 100,
      debtToIncome: totalDebt / 75000 * 100, // Assuming average income
      savingsRate: 15
    };

    setHealthMetrics(metrics);

    // Update user's health score
    if (currentUser) {
      await setDoc(doc(db, 'users', currentUser.id), {
        ...currentUser,
        financialHealthScore: finalScore
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        await loadFinancialData();
        await calculateHealthScore();
      }
      setLoading(false);
    };

    loadData();
  }, [currentUser]);

  const value: DataContextType = {
    financialData,
    healthMetrics,
    loading,
    updateFinancialData,
    calculateHealthScore
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};