import React, { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon, Save, TrendingUp, TrendingDown, AlertTriangle, Target, DollarSign } from 'lucide-react';
import { ForexPair, TradeSetup } from '../types/forex';
import { calculateTradeDetails, formatCurrency, formatNumber } from '../utils/calculations';
import { tradeService } from '../services/supabase';
import toast from 'react-hot-toast';

interface CalculatorProps {
  pairs: ForexPair[];
  user: any;
}

export default function Calculator({ pairs, user }: CalculatorProps) {
  const [formData, setFormData] = useState({
    pair: 'EURUSD',
    accountBalance: 10000,
    accountCurrency: 'USD',
    riskPercentage: 2,
    stopLossPips: 20,
    takeProfitPips: 40,
    leverage: 100,
    tradeType: 'buy' as 'buy' | 'sell',
    notes: ''
  });

  const [calculation, setCalculation] = useState<any>(null);
  const [selectedPair, setSelectedPair] = useState<ForexPair | null>(null);

  useEffect(() => {
    const pair = pairs.find(p => p.symbol === formData.pair);
    setSelectedPair(pair || null);

    if (pair) {
      const calc = calculateTradeDetails(
        formData.pair,
        pair,
        formData.accountBalance,
        formData.accountCurrency,
        formData.riskPercentage,
        formData.stopLossPips,
        formData.takeProfitPips,
        formData.leverage,
        formData.tradeType
      );
      setCalculation(calc);
    }
  }, [formData, pairs]);

  const handleSave = async () => {
    if (!user || !calculation) {
      toast.error('Please sign in to save trades');
      return;
    }

    try {
      const tradeSetup: Omit<TradeSetup, 'id' | 'userId' | 'createdAt'> = {
        ...formData,
        calculation,
        createdAt: new Date().toISOString()
      };

      const { error } = await tradeService.saveTradeSetup(tradeSetup);
      if (error) throw error;
      
      toast.success('Trade setup saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save trade');
    }
  };

  const getRiskLevel = (riskPercentage: number) => {
    if (riskPercentage <= 1) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (riskPercentage <= 2) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const riskLevel = getRiskLevel(formData.riskPercentage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <CalculatorIcon className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Trade Calculator</h2>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Pair
                </label>
                <select
                  value={formData.pair}
                  onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {pairs.map((pair) => (
                    <option key={pair.symbol} value={pair.symbol}>
                      {pair.symbol} - {pair.name}
                    </option>
                  ))}
                </select>
                {selectedPair && (
                  <div className="mt-2 flex items-center space-x-2 text-sm">
                    <span>Current: {formatNumber(selectedPair.bid, 5)}</span>
                    <div className={`flex items-center ${
                      selectedPair.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedPair.change >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {selectedPair.changePercent >= 0 ? '+' : ''}{formatNumber(selectedPair.changePercent, 2)}%
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trade Direction
                </label>
                <select
                  value={formData.tradeType}
                  onChange={(e) => setFormData({ ...formData, tradeType: e.target.value as 'buy' | 'sell' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="buy">Buy (Long)</option>
                  <option value="sell">Sell (Short)</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Balance
                </label>
                <input
                  type="number"
                  value={formData.accountBalance}
                  onChange={(e) => setFormData({ ...formData, accountBalance: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Currency
                </label>
                <select
                  value={formData.accountCurrency}
                  onChange={(e) => setFormData({ ...formData, accountCurrency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="CHF">CHF</option>
                  <option value="AUD">AUD</option>
                  <option value="CAD">CAD</option>
                  <option value="NZD">NZD</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Percentage
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.riskPercentage}
                  onChange={(e) => setFormData({ ...formData, riskPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2"
                />
                <div className={`mt-1 px-2 py-1 rounded-full text-xs inline-block ${riskLevel.bg} ${riskLevel.color}`}>
                  {riskLevel.level} Risk
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stop Loss (Pips)
                </label>
                <input
                  type="number"
                  value={formData.stopLossPips}
                  onChange={(e) => setFormData({ ...formData, stopLossPips: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Take Profit (Pips)
                </label>
                <input
                  type="number"
                  value={formData.takeProfitPips}
                  onChange={(e) => setFormData({ ...formData, takeProfitPips: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leverage
              </label>
              <select
                value={formData.leverage}
                onChange={(e) => setFormData({ ...formData, leverage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>1:10</option>
                <option value={20}>1:20</option>
                <option value={50}>1:50</option>
                <option value={100}>1:100</option>
                <option value={200}>1:200</option>
                <option value={500}>1:500</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Add your trade analysis or notes..."
              />
            </div>

            {user && (
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Trade Setup
              </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Calculation Results</h3>
          
          {calculation ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Lot Size</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatNumber(calculation.lotSize, 2)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Standard Lots</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Pip Value</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(calculation.pipValue, formData.accountCurrency)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Per Pip</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">Margin Required</span>
                </div>
                <p className="text-2xl font-bold text-yellow-900">
                  {formatCurrency(calculation.marginRequired, formData.accountCurrency)}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {formatNumber((calculation.marginRequired / formData.accountBalance) * 100, 1)}% of account
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">Potential Loss</span>
                  </div>
                  <p className="text-xl font-bold text-red-900">
                    {formatCurrency(calculation.potentialLoss, formData.accountCurrency)}
                  </p>
                  <p className="text-xs text-red-600 mt-1">At Stop Loss</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Potential Profit</span>
                  </div>
                  <p className="text-xl font-bold text-green-900">
                    {formatCurrency(calculation.potentialProfit, formData.accountCurrency)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">At Take Profit</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Risk-Reward Ratio</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    calculation.riskRewardRatio >= 2 
                      ? 'bg-green-100 text-green-800' 
                      : calculation.riskRewardRatio >= 1.5
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {calculation.riskRewardRatio >= 2 ? 'Excellent' : 
                     calculation.riskRewardRatio >= 1.5 ? 'Good' : 'Poor'}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  1:{formatNumber(calculation.riskRewardRatio, 1)}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Trade Summary</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>Position Size: {formatNumber(calculation.positionSize, 0)} units</p>
                  <p>Risk Amount: {formatCurrency(calculation.riskAmount, formData.accountCurrency)}</p>
                  <p>Risk Percentage: {formData.riskPercentage}% of account</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalculatorIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Configure your trade parameters to see calculations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}