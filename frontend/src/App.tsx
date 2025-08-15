import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Calculator as CalculatorIcon, TrendingUp, History, LogIn, LogOut, User, BarChart3 } from 'lucide-react';
import AuthModal from './components/AuthModal';
import PriceTicker from './components/PriceTicker';
import ForexCalculator from './components/Calculator';
import TradeHistory from './components/TradeHistory';
import MarketOverview from './components/MarketOverview';
import { forexApi } from './services/forexApi';
import { authService } from './services/supabase';
import { ForexPair } from './types/forex';

type ActiveTab = 'calculator' | 'market' | 'history';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [pairs, setPairs] = useState<ForexPair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadMarketData();
    const interval = setInterval(loadMarketData, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const loadMarketData = async () => {
    try {
      const marketData = await forexApi.getMarketData();
      setPairs(marketData.pairs);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { id: 'calculator' as ActiveTab, label: 'Trade Calculator', icon: CalculatorIcon },
    { id: 'market' as ActiveTab, label: 'Market Overview', icon: BarChart3 },
    { id: 'history' as ActiveTab, label: 'Trade History', icon: History }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading ForexPro Calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 gap-3 py-3 sm:py-0">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">ADForexPre Calculator</h1>
                <p className="text-xs sm:text-sm text-gray-600">Professional Trading Tools</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 flex-wrap justify-center">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-700">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm"
                >
                  <LogIn className="w-4 h-4 mr-1 sm:mr-2" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Price Ticker */}
      <PriceTicker pairs={pairs} />

      {/* Navigation */}
      <nav className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6 sm:space-x-8 min-w-max">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-2 sm:px-3 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === item.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-2 sm:px-4">
        {activeTab === 'calculator' && <ForexCalculator pairs={pairs} user={user} />}
        {activeTab === 'market' && <MarketOverview pairs={pairs} />}
        {activeTab === 'history' && <TradeHistory user={user} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold">ADForexPre Calculator</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Professional forex trading calculator for risk management and position sizing.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Lot Size Calculator</li>
                <li>Risk Management</li>
                <li>Live Market Data</li>
                <li>Trade History</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Trading Tools</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Pip Value Calculator</li>
                <li>Margin Calculator</li>
                <li>P&L Calculator</li>
                <li>Risk-Reward Analysis</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Education</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Trading Formulas</li>
                <li>Risk Management</li>
                <li>Position Sizing</li>
                <li>Market Analysis</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs sm:text-sm text-gray-400 space-y-2">
            <p>&copy; 2025 ForexPro Calculator. Built for professional traders.</p>
            <p>
              <strong>Disclaimer:</strong> Trading forex involves significant risk. 
              This calculator is for educational purposes only.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={checkUser}
      />
    </div>
  );
}

export default App;
