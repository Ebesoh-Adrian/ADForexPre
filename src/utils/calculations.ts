import { ForexPair, TradeCalculation } from '../types/forex';

export const calculatePipValue = (
  pair: string,
  lotSize: number,
  accountCurrency: string,
  currentPrice: number
): number => {
  const baseCurrency = pair.substring(0, 3);
  const quoteCurrency = pair.substring(3, 6);
  
  // Standard lot size is 100,000 units
  const contractSize = 100000;
  const actualLotSize = lotSize * contractSize;
  
  // For JPY pairs, pip is 0.01, for others it's 0.0001
  const pipSize = quoteCurrency === 'JPY' ? 0.01 : 0.0001;
  
  let pipValue: number;
  
  if (quoteCurrency === accountCurrency) {
    // Direct calculation
    pipValue = (pipSize * actualLotSize) / contractSize;
  } else if (baseCurrency === accountCurrency) {
    // Inverse calculation
    pipValue = (pipSize * actualLotSize) / (currentPrice * contractSize);
  } else {
    // Cross currency calculation (simplified)
    pipValue = (pipSize * actualLotSize) / contractSize;
  }
  
  return pipValue;
};

export const calculateLotSize = (
  accountBalance: number,
  riskPercentage: number,
  stopLossPips: number,
  pipValue: number
): number => {
  const riskAmount = accountBalance * (riskPercentage / 100);
  const lotSize = riskAmount / (stopLossPips * pipValue);
  return Math.round(lotSize * 100) / 100; // Round to 2 decimal places
};

export const calculateMargin = (
  lotSize: number,
  currentPrice: number,
  leverage: number,
  pair: string
): number => {
  const contractSize = 100000;
  const positionSize = lotSize * contractSize;
  
  // For JPY pairs, the calculation is slightly different
  const quoteCurrency = pair.substring(3, 6);
  let margin: number;
  
  if (quoteCurrency === 'JPY') {
    margin = (positionSize * currentPrice) / (leverage * 100);
  } else {
    margin = (positionSize * currentPrice) / leverage;
  }
  
  return Math.round(margin * 100) / 100;
};

export const calculateTradeDetails = (
  pair: string,
  forexData: ForexPair,
  accountBalance: number,
  accountCurrency: string,
  riskPercentage: number,
  stopLossPips: number,
  takeProfitPips: number,
  leverage: number,
  tradeType: 'buy' | 'sell'
): TradeCalculation => {
  const currentPrice = tradeType === 'buy' ? forexData.ask : forexData.bid;
  
  // Calculate pip value first
  const pipValue = calculatePipValue(pair, 1, accountCurrency, currentPrice);
  
  // Calculate lot size
  const lotSize = calculateLotSize(accountBalance, riskPercentage, stopLossPips, pipValue);
  
  // Calculate position size in base currency
  const contractSize = 100000;
  const positionSize = lotSize * contractSize;
  
  // Calculate margin required
  const marginRequired = calculateMargin(lotSize, currentPrice, leverage, pair);
  
  // Calculate risk amount
  const riskAmount = accountBalance * (riskPercentage / 100);
  
  // Calculate potential profit and loss
  const potentialLoss = stopLossPips * pipValue * lotSize;
  const potentialProfit = takeProfitPips * pipValue * lotSize;
  
  // Calculate risk-reward ratio
  const riskRewardRatio = takeProfitPips / stopLossPips;
  
  return {
    lotSize,
    positionSize,
    marginRequired,
    pipValue: pipValue * lotSize,
    riskAmount,
    potentialProfit,
    potentialLoss,
    riskRewardRatio
  };
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};