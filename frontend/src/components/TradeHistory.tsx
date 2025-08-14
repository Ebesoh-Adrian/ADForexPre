import React, { useState, useEffect } from 'react';
import { History, Trash2, Download, Calendar } from 'lucide-react';
import { TradeSetup } from '../types/forex';
import { tradeService } from '../services/supabase';
import { formatCurrency, formatNumber } from '../utils/calculations';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface TradeHistoryProps {
  user: any;
}

export default function TradeHistory({ user }: TradeHistoryProps) {
  const [trades, setTrades] = useState<TradeSetup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrades();
    }
  }, [user]);

  const loadTrades = async () => {
    try {
      setLoading(true);
      const { data, error } = await tradeService.getTradeSetups();
      if (error) throw error;
      setTrades(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  const deleteTrade = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trade setup?')) return;

    try {
      const { error } = await tradeService.deleteTradeSetup(id);
      if (error) throw error;
      setTrades(trades.filter(trade => trade.id !== id));
      toast.success('Trade setup deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete trade');
    }
  };

  const exportTrades = () => {
    if (trades.length === 0) {
      toast.error('No trades to export');
      return;
    }

    const csvContent = [
      'Date,Pair,Direction,Lot Size,Risk %,Stop Loss,Take Profit,Potential Profit,Potential Loss',
      ...trades.map(trade => [
        format(new Date(trade.createdAt), 'yyyy-MM-dd'),
        trade.pair,
        trade.tradeType.toUpperCase(),
        trade.calculation.lotSize,
        trade.riskPercentage,
        trade.stopLossPips,
        trade.takeProfitPips,
        trade.calculation.potentialProfit,
        trade.calculation.potentialLoss
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forex-trades-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Trade history exported successfully');
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trade History</h2>
          <p className="text-gray-600">Sign in to view and manage your saved trade setups</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <History className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Trade History</h2>
          </div>
          {trades.length > 0 && (
            <button
              onClick={exportTrades}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading trade history...</p>
          </div>
        ) : trades.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Saved Trades</h3>
            <p>Start using the calculator to save your trade setups</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Pair</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Direction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Lot Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Risk %</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Potential P/L</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">R:R</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {format(new Date(trade.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-3 px-4 font-medium">{trade.pair}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trade.tradeType === 'buy' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {trade.tradeType.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatNumber(trade.calculation.lotSize, 2)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {trade.riskPercentage}%
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="space-y-1">
                        <div className="text-green-600">
                          +{formatCurrency(trade.calculation.potentialProfit, trade.accountCurrency)}
                        </div>
                        <div className="text-red-600">
                          -{formatCurrency(trade.calculation.potentialLoss, trade.accountCurrency)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      1:{formatNumber(trade.calculation.riskRewardRatio, 1)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteTrade(trade.id!)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete trade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}