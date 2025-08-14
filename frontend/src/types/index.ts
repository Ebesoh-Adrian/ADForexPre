export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
  role: 'employee' | 'hr_admin' | 'super_admin';
  profileData: UserProfile;
  financialHealthScore: number;
  createdAt: Date;
  lastLogin: Date;
}

export interface UserProfile {
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: Address;
  employmentInfo?: EmploymentInfo;
  dependents?: number;
  onboardingCompleted: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmploymentInfo {
  title: string;
  department: string;
  salary: number;
  startDate: Date;
  employeeId: string;
}

export interface Company {
  id: string;
  name: string;
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
  employeeCount: number;
  inviteCode: string;
  settings: CompanySettings;
  createdAt: Date;
}

export interface CompanySettings {
  brandColor: string;
  logo?: string;
  benefits: CompanyBenefits;
  features: string[];
}

export interface CompanyBenefits {
  match401k: number;
  hsaContribution: number;
  healthInsurance: boolean;
  lifeInsurance: boolean;
  dentalInsurance: boolean;
  visionInsurance: boolean;
}

export interface FinancialData {
  retirement: RetirementData;
  loans: StudentLoan[];
  emergencyFund: EmergencyFundData;
  budgets: Budget[];
  transactions: Transaction[];
  benefits: BenefitsData;
}

export interface RetirementData {
  currentBalance: number;
  monthlyContribution: number;
  employerMatch: number;
  retirementGoal: number;
  targetRetirementAge: number;
  investmentAllocation: InvestmentAllocation;
  projections: RetirementProjection[];
}

export interface InvestmentAllocation {
  stocks: number;
  bonds: number;
  international: number;
  cash: number;
}

export interface RetirementProjection {
  age: number;
  balance: number;
  monthlyIncome: number;
}

export interface StudentLoan {
  id: string;
  servicer: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'federal' | 'private';
  status: 'active' | 'deferment' | 'forbearance';
}

export interface EmergencyFundData {
  currentAmount: number;
  goalAmount: number;
  monthlyExpenses: number;
  monthsCovered: number;
  autoSavingsAmount: number;
}

export interface Budget {
  id: string;
  name: string;
  categories: BudgetCategory[];
  totalBudgeted: number;
  totalSpent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: Date;
  endDate: Date;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  account: string;
}

export interface BenefitsData {
  hsaBalance: number;
  fsaBalance: number;
  ptoBalance: number;
  ptoUsed: number;
  insurancePremiums: InsurancePremiums;
  wellnessPoints: number;
}

export interface InsurancePremiums {
  health: number;
  dental: number;
  vision: number;
  life: number;
}

export interface EducationModule {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isCompleted: boolean;
  progress: number;
}

export interface FinancialHealthMetrics {
  score: number;
  netWorthTrend: number;
  retirementReadiness: number;
  emergencyFundStatus: number;
  debtToIncome: number;
  savingsRate: number;
}