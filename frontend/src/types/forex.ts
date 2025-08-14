export interface ForexPair {
  symbol: string;
  name: string;
  category: 'major' | 'minor' | 'exotic';
  bid: number;
  ask: number;
  spread: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

export interface TradeCalculation {
  lotSize: number;
  positionSize: number;
  marginRequired: number;
  pipValue: number;
  riskAmount: number;
  potentialProfit: number;
  potentialLoss: number;
  riskRewardRatio: number;
}

export interface TradeSetup {
  id?: string;
  userId?: string;
  pair: string;
  accountBalance: number;
  accountCurrency: string;
  riskPercentage: number;
  stopLossPips: number;
  takeProfitPips: number;
  leverage: number;
  tradeType: 'buy' | 'sell';
  notes?: string;
  createdAt: string;
  calculation: TradeCalculation;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  accountCurrency: string;
  defaultLeverage: number;
  createdAt: string;
}

export interface MarketData {
  pairs: ForexPair[];
  lastUpdate: string;
}