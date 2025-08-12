import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ForexPair } from '../types/forex';
import { formatNumber } from '../utils/calculations';

interface PriceTickerProps {
  pairs: ForexPair[];
}

export default function PriceTicker({ pairs }: PriceTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pairs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [pairs.length]);

  if (pairs.length === 0) return null;

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-8 animate-pulse">
          {pairs.slice(currentIndex, currentIndex + 4).map((pair) => (
            <div key={pair.symbol} className="flex items-center space-x-2 min-w-0">
              <span className="font-medium text-sm">{pair.symbol}</span>
              <span className="text-sm">{formatNumber(pair.bid, 5)}</span>
              <div className={`flex items-center text-xs ${
                pair.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {pair.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {pair.changePercent >= 0 ? '+' : ''}{formatNumber(pair.changePercent, 2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}