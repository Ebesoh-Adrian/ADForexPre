import { ForexPair, MarketData } from '../types/forex';

// Enhanced forex data with more pairs including commodities and crypto
const getEnhancedForexData = (): ForexPair[] => {
  const now = new Date();
  const baseTimestamp = now.toISOString();
  
  // Generate realistic market volatility
  const generateVolatility = (base: number, volatility: number = 0.001) => {
    return base + (Math.random() - 0.5) * volatility;
  };

  return [
    // Major Currency Pairs
    {
      symbol: 'EURUSD',
      name: 'Euro vs US Dollar',
      category: 'major',
      bid: generateVolatility(1.0300, 0.0050), // Based on recent market data
      ask: generateVolatility(1.0302, 0.0050),
      spread: 2,
      change: generateVolatility(0.0015, 0.005),
      changePercent: generateVolatility(0.15, 0.5),
      lastUpdate: baseTimestamp,
      dailyHigh: 1.0350,
      dailyLow: 1.0285,
      volume: Math.floor(Math.random() * 1000000) + 500000
    },
    {
      symbol: 'GBPUSD',
      name: 'British Pound vs US Dollar',
      category: 'major',
      bid: generateVolatility(1.2480, 0.0080),
      ask: generateVolatility(1.2482, 0.0080),
      spread: 2,
      change: generateVolatility(-0.0032, 0.008),
      changePercent: generateVolatility(-0.26, 0.6),
      lastUpdate: baseTimestamp,
      dailyHigh: 1.2520,
      dailyLow: 1.2445,
      volume: Math.floor(Math.random() * 800000) + 400000
    },
    {
      symbol: 'USDJPY',
      name: 'US Dollar vs Japanese Yen',
      category: 'major',
      bid: generateVolatility(155.20, 1.50),
      ask: generateVolatility(155.23, 1.50),
      spread: 3,
      change: generateVolatility(0.85, 2.0),
      changePercent: generateVolatility(0.55, 1.2),
      lastUpdate: baseTimestamp,
      dailyHigh: 156.80,
      dailyLow: 154.20,
      volume: Math.floor(Math.random() * 750000) + 350000
    },
    {
      symbol: 'USDCHF',
      name: 'US Dollar vs Swiss Franc',
      category: 'major',
      bid: generateVolatility(0.8890, 0.0040),
      ask: generateVolatility(0.8892, 0.0040),
      spread: 2,
      change: generateVolatility(-0.0025, 0.004),
      changePercent: generateVolatility(-0.28, 0.4),
      lastUpdate: baseTimestamp,
      dailyHigh: 0.8920,
      dailyLow: 0.8865,
      volume: Math.floor(Math.random() * 400000) + 200000
    },
    {
      symbol: 'AUDUSD',
      name: 'Australian Dollar vs US Dollar',
      category: 'major',
      bid: generateVolatility(0.6245, 0.0060),
      ask: generateVolatility(0.6247, 0.0060),
      spread: 2,
      change: generateVolatility(0.0042, 0.006),
      changePercent: generateVolatility(0.68, 0.9),
      lastUpdate: baseTimestamp,
      dailyHigh: 0.6280,
      dailyLow: 0.6220,
      volume: Math.floor(Math.random() * 450000) + 250000
    },
    {
      symbol: 'USDCAD',
      name: 'US Dollar vs Canadian Dollar',
      category: 'major',
      bid: generateVolatility(1.4420, 0.0070),
      ask: generateVolatility(1.4422, 0.0070),
      spread: 2,
      change: generateVolatility(-0.0035, 0.007),
      changePercent: generateVolatility(-0.24, 0.5),
      lastUpdate: baseTimestamp,
      dailyHigh: 1.4465,
      dailyLow: 1.4385,
      volume: Math.floor(Math.random() * 380000) + 180000
    },
    {
      symbol: 'NZDUSD',
      name: 'New Zealand Dollar vs US Dollar',
      category: 'major',
      bid: generateVolatility(0.5665, 0.0055),
      ask: generateVolatility(0.5667, 0.0055),
      spread: 2,
      change: generateVolatility(0.0028, 0.005),
      changePercent: generateVolatility(0.50, 0.8),
      lastUpdate: baseTimestamp,
      dailyHigh: 0.5695,
      dailyLow: 0.5640,
      volume: Math.floor(Math.random() * 320000) + 150000
    },

    // Minor Currency Pairs
    {
      symbol: 'EURGBP',
      name: 'Euro vs British Pound',
      category: 'minor',
      bid: generateVolatility(0.8256, 0.0040),
      ask: generateVolatility(0.8259, 0.0040),
      spread: 3,
      change: generateVolatility(0.0018, 0.004),
      changePercent: generateVolatility(0.22, 0.5),
      lastUpdate: baseTimestamp,
      dailyHigh: 0.8285,
      dailyLow: 0.8230,
      volume: Math.floor(Math.random() * 280000) + 120000
    },
    {
      symbol: 'EURJPY',
      name: 'Euro vs Japanese Yen',
      category: 'minor',
      bid: generateVolatility(159.85, 1.20),
      ask: generateVolatility(159.88, 1.20),
      spread: 3,
      change: generateVolatility(0.42, 1.5),
      changePercent: generateVolatility(0.26, 0.9),
      lastUpdate: baseTimestamp,
      dailyHigh: 161.20,
      dailyLow: 158.60,
      volume: Math.floor(Math.random() * 250000) + 100000
    },
    {
      symbol: 'GBPJPY',
      name: 'British Pound vs Japanese Yen',
      category: 'minor',
      bid: generateVolatility(193.75, 1.80),
      ask: generateVolatility(193.79, 1.80),
      spread: 4,
      change: generateVolatility(-0.65, 2.0),
      changePercent: generateVolatility(-0.33, 1.0),
      lastUpdate: baseTimestamp,
      dailyHigh: 195.40,
      dailyLow: 192.80,
      volume: Math.floor(Math.random() * 220000) + 90000
    },
    {
      symbol: 'EURCHF',
      name: 'Euro vs Swiss Franc',
      category: 'minor',
      bid: generateVolatility(0.9158, 0.0045),
      ask: generateVolatility(0.9161, 0.0045),
      spread: 3,
      change: generateVolatility(-0.0022, 0.004),
      changePercent: generateVolatility(-0.24, 0.4),
      lastUpdate: baseTimestamp,
      dailyHigh: 0.9185,
      dailyLow: 0.9140,
      volume: Math.floor(Math.random() * 180000) + 80000
    },
    {
      symbol: 'GBPCHF',
      name: 'British Pound vs Swiss Franc',
      category: 'minor',
      bid: generateVolatility(1.1095, 0.0065),
      ask: generateVolatility(1.1098, 0.0065),
      spread: 3,
      change: generateVolatility(-0.0038, 0.006),
      changePercent: generateVolatility(-0.34, 0.5),
      lastUpdate: baseTimestamp,
      dailyHigh: 1.1135,
      dailyLow: 1.1065,
      volume: Math.floor(Math.random() * 160000) + 70000
    },

    // Exotic/Commodity Currency Pairs
    {
      symbol: 'USDSGD',
      name: 'US Dollar vs Singapore Dollar',
      category: 'exotic',
      bid: generateVolatility(1.3685, 0.0050),
      ask: generateVolatility(1.3688, 0.0050),
      spread: 3,
      change: generateVolatility(0.0025, 0.005),
      changePercent: generateVolatility(0.18, 0.4),
      lastUpdate: baseTimestamp,
      dailyHigh: 1.3720,
      dailyLow: 1.3665,
      volume: Math.floor(Math.random() * 140000) + 60000
    },
    {
      symbol: 'USDZAR',
      name: 'US Dollar vs South African Rand',
      category: 'exotic',
      bid: generateVolatility(18.845, 0.200),
      ask: generateVolatility(18.852, 0.200),
      spread: 7,
      change: generateVolatility(0.125, 0.3),
      changePercent: generateVolatility(0.66, 1.5),
      lastUpdate: baseTimestamp,
      dailyHigh: 19.050,
      dailyLow: 18.720,
      volume: Math.floor(Math.random() * 120000) + 50000
    },

    // Precious Metals (Gold, Silver)
    {
      symbol: 'XAUUSD',
      name: 'Gold vs US Dollar',
      category: 'commodity',
      bid: generateVolatility(2630.50, 25.0), // Gold around $2630 based on recent data
      ask: generateVolatility(2631.00, 25.0),
      spread: 0.50,
      change: generateVolatility(-12.50, 30.0),
      changePercent: generateVolatility(-0.47, 1.1),
      lastUpdate: baseTimestamp,
      dailyHigh: 2658.20,
      dailyLow: 2615.80,
      volume: Math.floor(Math.random() * 500000) + 300000
    },
    {
      symbol: 'XAGUSD',
      name: 'Silver vs US Dollar',
      category: 'commodity',
      bid: generateVolatility(29.85, 1.50),
      ask: generateVolatility(29.90, 1.50),
      spread: 0.05,
      change: generateVolatility(-0.65, 2.0),
      changePercent: generateVolatility(-2.13, 6.0),
      lastUpdate: baseTimestamp,
      dailyHigh: 30.85,
      dailyLow: 29.20,
      volume: Math.floor(Math.random() * 200000) + 100000
    },

    // Cryptocurrency pairs
    {
      symbol: 'BTCUSD',
      name: 'Bitcoin vs US Dollar',
      category: 'crypto',
      bid: generateVolatility(98500.00, 2500.0),
      ask: generateVolatility(98520.00, 2500.0),
      spread: 20.0,
      change: generateVolatility(-1850.0, 4000.0),
      changePercent: generateVolatility(-1.84, 4.0),
      lastUpdate: baseTimestamp,
      dailyHigh: 102500.00,
      dailyLow: 96200.00,
      volume: Math.floor(Math.random() * 1000000) + 500000
    },
    {
      symbol: 'ETHUSD',
      name: 'Ethereum vs US Dollar',
      category: 'crypto',
      bid: generateVolatility(3285.50, 150.0),
      ask: generateVolatility(3287.00, 150.0),
      spread: 1.50,
      change: generateVolatility(-125.0, 200.0),
      changePercent: generateVolatility(-3.67, 6.0),
      lastUpdate: baseTimestamp,
      dailyHigh: 3450.00,
      dailyLow: 3180.00,
      volume: Math.floor(Math.random() * 800000) + 400000
    },

    // Oil
    {
      symbol: 'USOIL',
      name: 'US Crude Oil',
      category: 'commodity',
      bid: generateVolatility(79.85, 2.00),
      ask: generateVolatility(79.90, 2.00),
      spread: 0.05,
      change: generateVolatility(1.25, 3.0),
      changePercent: generateVolatility(1.59, 3.5),
      lastUpdate: baseTimestamp,
      dailyHigh: 81.20,
      dailyLow: 78.50,
      volume: Math.floor(Math.random() * 600000) + 300000
    }
  ];
};

// Enhanced API service with real-world considerations
class EnhancedForexApiService {
  private static instance: EnhancedForexApiService;
  private marketData: MarketData;
  private lastUpdateTime: number = 0;
  private updateInterval: number = 10000; // 10 seconds
  private isMarketOpen: boolean = true;

  private constructor() {
    this.marketData = {
      pairs: getEnhancedForexData(),
      lastUpdate: new Date().toISOString()
    };
    this.startRealTimeUpdates();
  }

  static getInstance(): EnhancedForexApiService {
    if (!EnhancedForexApiService.instance) {
      EnhancedForexApiService.instance = new EnhancedForexApiService();
    }
    return EnhancedForexApiService.instance;
  }

  private isForexMarketOpen(): boolean {
    const now = new Date();
    const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    
    // Forex market is closed from Friday 22:00 UTC to Sunday 22:00 UTC
    if (day === 6) return false; // Saturday
    if (day === 0 && hour < 22) return false; // Sunday before 22:00
    if (day === 5 && hour >= 22) return false; // Friday after 22:00
    
    return true;
  }

  private generateRealisticPriceMovement(currentPrice: number, volatility: number): number {
    // Use more sophisticated price movement simulation
    const trend = (Math.random() - 0.5) * 0.3; // Slight trend bias
    const noise = (Math.random() - 0.5) * volatility;
    return currentPrice + trend + noise;
  }

  private startRealTimeUpdates(): void {
    setInterval(() => {
      if (Date.now() - this.lastUpdateTime < this.updateInterval) return;
      
      this.isMarketOpen = this.isForexMarketOpen();
      
      if (this.isMarketOpen) {
        this.updatePrices();
      }
      
      this.lastUpdateTime = Date.now();
    }, 1000);
  }

  private updatePrices(): void {
    this.marketData.pairs = this.marketData.pairs.map(pair => {
      const volatilityMap: { [key: string]: number } = {
        'EURUSD': 0.0008,
        'GBPUSD': 0.0012,
        'USDJPY': 0.3,
        'XAUUSD': 5.0,
        'BTCUSD': 500.0,
        'ETHUSD': 50.0,
        'USOIL': 0.5
      };

      const volatility = volatilityMap[pair.symbol] || 0.0005;
      const newBid = this.generateRealisticPriceMovement(pair.bid, volatility);
      const newAsk = newBid + (pair.spread / 10000); // Convert spread to price difference
      
      const change = newBid - pair.bid;
      const changePercent = (change / pair.bid) * 100;

      return {
        ...pair,
        bid: Number(newBid.toFixed(pair.symbol.includes('JPY') ? 3 : 5)),
        ask: Number(newAsk.toFixed(pair.symbol.includes('JPY') ? 3 : 5)),
        change: Number(change.toFixed(pair.symbol.includes('JPY') ? 3 : 5)),
        changePercent: Number(changePercent.toFixed(2)),
        lastUpdate: new Date().toISOString()
      };
    });

    this.marketData.lastUpdate = new Date().toISOString();
  }

  // Integration with real APIs (example implementation)
  private async fetchFromExternalAPI(): Promise<ForexPair[]> {
    try {
      // Example: Integration with exchangerate.host (free tier)
      const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP,JPY,CHF,AUD,CAD,NZD');
      const data = await response.json();
      
      if (data && data.rates) {
        // Convert external data to our format
        return this.convertExternalData(data.rates);
      }
    } catch (error) {
      console.warn('External API failed, using mock data:', error);
    }
    
    // Fallback to enhanced mock data
    return getEnhancedForexData();
  }

  private convertExternalData(rates: any): ForexPair[] {
    // Convert external API data to our ForexPair format
    // This would need to be customized based on the chosen API
    return getEnhancedForexData(); // Placeholder
  }

  async getMarketData(): Promise<MarketData> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      ...this.marketData,
      marketStatus: this.isMarketOpen ? 'open' : 'closed',
      serverTime: new Date().toISOString()
    };
  }

  async getPairData(symbol: string): Promise<ForexPair | null> {
    const marketData = await this.getMarketData();
    return marketData.pairs.find(pair => pair.symbol === symbol) || null;
  }

  getAvailablePairs(): string[] {
    return this.marketData.pairs.map(pair => pair.symbol);
  }

  getCurrencyPairs(category?: 'major' | 'minor' | 'exotic' | 'commodity' | 'crypto'): ForexPair[] {
    if (!category) return this.marketData.pairs;
    return this.marketData.pairs.filter(pair => pair.category === category);
  }

  // Get trending pairs based on volatility
  getTrendingPairs(limit: number = 5): ForexPair[] {
    return [...this.marketData.pairs]
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, limit);
  }

  // Get market sentiment analysis
  getMarketSentiment() {
    const pairs = this.marketData.pairs;
    const gainers = pairs.filter(p => p.change > 0).length;
    const losers = pairs.filter(p => p.change < 0).length;
    const total = pairs.length;

    return {
      bullish: Math.round((gainers / total) * 100),
      bearish: Math.round((losers / total) * 100),
      neutral: Math.round(((total - gainers - losers) / total) * 100),
      sentiment: gainers > losers ? 'bullish' : losers > gainers ? 'bearish' : 'neutral'
    };
  }

  // Economic calendar integration (placeholder)
  async getEconomicEvents() {
    // Integration with economic calendar APIs
    return [
      {
        time: '14:30',
        currency: 'USD',
        event: 'Non-Farm Payrolls',
        impact: 'high',
        forecast: '200K',
        previous: '199K'
      },
      {
        time: '10:00',
        currency: 'EUR',
        event: 'ECB Interest Rate Decision',
        impact: 'high',
        forecast: '4.50%',
        previous: '4.50%'
      }
    ];
  }
}

// Export singleton instance
export const forexApi = EnhancedForexApiService.getInstance();