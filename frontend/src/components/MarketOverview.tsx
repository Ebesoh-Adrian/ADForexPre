import React, { useMemo, useCallback } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { ForexPair } from '../types/forex';
import { formatNumber } from '../utils/calculations';

interface MarketOverviewProps {
  pairs: ForexPair[];
}

interface MarketSentiment {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  color: string;
  icon: typeof TrendingUp;
}

interface PairCardProps {
  pair: ForexPair;
}

// Memoized pair card component for better performance
const PairCard: React.FC<PairCardProps> = React.memo(({ pair }) => {
  const isPositive = pair.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <article 
      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
      role="listitem"
      aria-label={`${pair.name} trading data`}
    >
      <div className="flex items-center space-x-3">
        <div>
          <h4 className="font-medium text-gray-900">{pair.symbol}</h4>
          <p className="text-sm text-gray-600">{pair.name}</p>
        </div>
      </div>
      
      <div className="text-right">
        <div className="flex items-center space-x-2">
          <div>
            <p className="font-medium" aria-label={`Bid price ${pair.bid}`}>
              {formatNumber(pair.bid, 5)}
            </p>
            <p className="text-sm text-gray-500" aria-label={`Spread ${pair.spread}`}>
              Spread: {pair.spread}
            </p>
          </div>
          
          <div className={`flex items-center ${trendColor}`} aria-label={`Change ${pair.changePercent}%`}>
            <TrendIcon className="w-4 h-4 mr-1" aria-hidden="true" />
            <span className="text-sm font-medium">
              {pair.changePercent >= 0 ? '+' : ''}{formatNumber(pair.changePercent, 2)}%
            </span>
          </div>
        </div>
      </div>
    </article>
  );
});

PairCard.displayName = 'PairCard';

// Statistics card component
interface StatCardProps {
  icon: typeof TrendingUp;
  title: string;
  value: number | string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = React.memo(({ icon: Icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
    <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} aria-hidden="true" />
    <h4 className="text-sm font-medium text-gray-600 mb-1">{title}</h4>
    <p className={`text-2xl font-bold ${color}`} aria-label={`${title}: ${value}`}>
      {value}
    </p>
  </div>
));

StatCard.displayName = 'StatCard';

export default function MarketOverview({ pairs }: MarketOverviewProps) {
  // Memoize expensive calculations
  const { majors, minors, marketSentiment, statistics } = useMemo(() => {
    const majorPairs = pairs.filter(pair => pair.category === 'major');
    const minorPairs = pairs.filter(pair => pair.category === 'minor');
    
    const gainers = pairs.filter(pair => pair.change > 0).length;
    const losers = pairs.filter(pair => pair.change < 0).length;
    
    let sentiment: MarketSentiment;
    if (gainers > losers) {
      sentiment = { sentiment: 'Bullish', color: 'text-green-600', icon: TrendingUp };
    } else if (losers > gainers) {
      sentiment = { sentiment: 'Bearish', color: 'text-red-600', icon: TrendingDown };
    } else {
      sentiment = { sentiment: 'Neutral', color: 'text-gray-600', icon: Activity };
    }
    
    const avgSpread = pairs.length > 0 
      ? pairs.reduce((sum, pair) => sum + pair.spread, 0) / pairs.length 
      : 0;
    
    return {
      majors: majorPairs,
      minors: minorPairs,
      marketSentiment: sentiment,
      statistics: {
        gainers,
        losers,
        totalPairs: pairs.length,
        avgSpread
      }
    };
  }, [pairs]);

  const currentTime = useMemo(() => new Date().toLocaleTimeString(), []);
  
  const MarketIcon = marketSentiment.icon;

  // Handle empty state
  if (!pairs || pairs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">No Market Data Available</h2>
          <p className="text-gray-500">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* SEO and Accessibility Headers */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Forex Market Overview - Real-time Currency Exchange Rates
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className={`flex items-center ${marketSentiment.color}`} role="status" aria-live="polite">
            <MarketIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            <span className="font-medium">Market Sentiment: {marketSentiment.sentiment}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Activity className="w-5 h-5 mr-2" aria-hidden="true" />
            <time dateTime={new Date().toISOString()}>
              Last Updated: {currentTime}
            </time>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Major Pairs Section */}
        <section className="bg-white rounded-xl shadow-lg p-6" aria-labelledby="major-pairs-heading">
          <header className="mb-4">
            <h2 id="major-pairs-heading" className="text-xl font-bold text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" aria-hidden="true" />
              Major Currency Pairs
            </h2>
          </header>
          
          {majors.length > 0 ? (
            <div className="space-y-3" role="list" aria-label="Major currency pairs">
              {majors.map((pair) => (
                <PairCard key={pair.symbol} pair={pair} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No major pairs available</p>
          )}
        </section>

        {/* Minor Pairs Section */}
        <section className="bg-white rounded-xl shadow-lg p-6" aria-labelledby="minor-pairs-heading">
          <header className="mb-4">
            <h2 id="minor-pairs-heading" className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" aria-hidden="true" />
              Minor Currency Pairs
            </h2>
          </header>
          
          {minors.length > 0 ? (
            <div className="space-y-3" role="list" aria-label="Minor currency pairs">
              {minors.map((pair) => (
                <PairCard key={pair.symbol} pair={pair} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No minor pairs available</p>
          )}
        </section>
      </div>

      {/* Market Statistics */}
      <section aria-labelledby="market-stats-heading">
        <h2 id="market-stats-heading" className="sr-only">Market Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={TrendingUp}
            title="Gainers"
            value={statistics.gainers}
            color="text-green-600"
          />
          
          <StatCard
            icon={TrendingDown}
            title="Decliners"
            value={statistics.losers}
            color="text-red-600"
          />
          
          <StatCard
            icon={Activity}
            title="Total Pairs"
            value={statistics.totalPairs}
            color="text-blue-600"
          />
          
          <StatCard
            icon={DollarSign}
            title="Avg Spread"
            value={formatNumber(statistics.avgSpread, 1)}
            color="text-purple-600"
          />
        </div>
      </section>

      {/* JSON-LD Structured Data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "Forex Market Overview",
            "description": "Real-time forex currency exchange rates and market data",
            "dateModified": new Date().toISOString(),
            "provider": {
              "@type": "Organization",
              "name": "ForexPro Calculator"
            },
            "distribution": {
              "@type": "DataDownload",
              "contentUrl": window.location.href,
              "encodingFormat": "application/json"
            }
          })
        }}
      />
    </main>
  );
}