import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Star,
  Zap,
  ChevronRight,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { stockService } from '../../services/stockData';
import { calculateStockRating } from '../../services/aiRating';
import StockCard from '../common/StockCard';

const HomeTab: React.FC = () => {
  const { user } = useUser();
  const { marketMood, refreshMarketMood, setCurrentTab } = useApp();

  // Calculate ratings for all stocks
  const stockRatings = useMemo(() => {
    const ratings = new Map<string, ReturnType<typeof calculateStockRating>>();
    stockService.getAllStocks().forEach(stock => {
      ratings.set(stock.ticker, calculateStockRating(stock));
    });
    return ratings;
  }, []);

  // Get categorized stocks
  const trendingStocks = stockService.getTrendingStocks();
  const topRatedStocks = useMemo(() => {
    const ratingScores = new Map<string, number>();
    stockRatings.forEach((rating, ticker) => {
      ratingScores.set(ticker, rating.overall);
    });
    return stockService.getTopRatedStocks(ratingScores);
  }, [stockRatings]);
  const highRiskStocks = stockService.getHighRiskHighReward();

  const getMoodEmoji = () => {
    if (marketMood.overall === 'bullish') return '🐂';
    if (marketMood.overall === 'bearish') return '🐻';
    return '😐';
  };

  const getMoodColor = () => {
    if (marketMood.overall === 'bullish') return 'text-success-400 bg-success-500/10';
    if (marketMood.overall === 'bearish') return 'text-danger-400 bg-danger-500/10';
    return 'text-warning-400 bg-warning-500/10';
  };

  const SectionHeader: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    action?: () => void;
  }> = ({ icon, title, subtitle, action }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-500/20 rounded-xl text-primary-400">
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-lg">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button
          onClick={action}
          className="flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors"
        >
          <span className="text-sm">See all</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="p-4 pb-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">
            Hey, {user?.name || 'Investor'}! 👋
          </h1>
          <p className="text-gray-400">Here's what's moving today</p>
        </motion.div>

        {/* Market Mood Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`card mb-6 ${getMoodColor()}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMoodEmoji()}</span>
              <span className="font-semibold">Market Mood</span>
            </div>
            <button
              onClick={refreshMarketMood}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm opacity-80">{marketMood.summary}</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="text-xs opacity-60">S&P 500</div>
              <div className={`font-semibold ${
                marketMood.indicators.sp500Change >= 0 ? 'text-success-400' : 'text-danger-400'
              }`}>
                {marketMood.indicators.sp500Change >= 0 ? '+' : ''}{marketMood.indicators.sp500Change}%
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="text-xs opacity-60">VIX (Fear)</div>
              <div className="font-semibold">{marketMood.indicators.vix}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trending Stocks */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="px-4">
          <SectionHeader
            icon={<TrendingUp className="w-5 h-5" />}
            title="Trending Now"
            subtitle="Biggest movers today"
            action={() => setCurrentTab('search')}
          />
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {trendingStocks.map((stock, index) => (
              <motion.div
                key={stock.ticker}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <StockCard
                  stock={stock}
                  rating={stockRatings.get(stock.ticker)}
                  variant="featured"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Top Rated Stocks */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-4 mb-8"
      >
        <SectionHeader
          icon={<Star className="w-5 h-5" />}
          title="Top AI Ratings"
          subtitle="Highest scoring stocks"
          action={() => setCurrentTab('search')}
        />
        <div className="space-y-3">
          {topRatedStocks.slice(0, 4).map((stock, index) => (
            <motion.div
              key={stock.ticker}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <StockCard
                stock={stock}
                rating={stockRatings.get(stock.ticker)}
                variant="compact"
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* High Risk High Reward */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-4 mb-8"
      >
        <SectionHeader
          icon={<Zap className="w-5 h-5" />}
          title="High Risk / High Reward"
          subtitle="Volatile stocks for experienced traders"
        />
        <div className="grid grid-cols-2 gap-3">
          {highRiskStocks.slice(0, 4).map((stock, index) => (
            <motion.div
              key={stock.ticker}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="card-hover p-3"
              onClick={() => {}}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{stock.logo}</span>
                <span className="font-semibold">{stock.ticker}</span>
              </div>
              <div className="text-lg font-bold">${stock.price.toFixed(2)}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">Beta</span>
                <span className="text-danger-400 font-medium">{stock.beta.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCurrentTab('advisor')}
            className="card-hover p-4 text-left bg-gradient-to-br from-primary-500/20 to-primary-600/10"
          >
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-semibold">AI Advisor</div>
            <div className="text-sm text-gray-400">Get personalized advice</div>
          </button>
          <button
            onClick={() => setCurrentTab('learn')}
            className="card-hover p-4 text-left bg-gradient-to-br from-success-500/20 to-success-600/10"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold">Learn</div>
            <div className="text-sm text-gray-400">Master the basics</div>
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default HomeTab;
