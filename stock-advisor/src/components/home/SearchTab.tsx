import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, TrendingUp } from 'lucide-react';
import { stockService } from '../../services/stockData';
import { calculateStockRating } from '../../services/aiRating';
import StockCard from '../common/StockCard';

type FilterCategory = 'all' | 'tech' | 'finance' | 'healthcare' | 'consumer' | 'etf';

const SearchTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterCategory>('all');

  const allStocks = stockService.getAllStocks();

  // Calculate ratings
  const stockRatings = useMemo(() => {
    const ratings = new Map<string, ReturnType<typeof calculateStockRating>>();
    allStocks.forEach(stock => {
      ratings.set(stock.ticker, calculateStockRating(stock));
    });
    return ratings;
  }, [allStocks]);

  // Filter stocks
  const filteredStocks = useMemo(() => {
    let stocks = allStocks;

    // Apply category filter
    if (filter !== 'all') {
      stocks = stockService.getStocksByCategory(filter);
    }

    // Apply search query
    if (query.trim()) {
      const q = query.toLowerCase();
      stocks = stocks.filter(
        s =>
          s.ticker.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q)
      );
    }

    return stocks;
  }, [allStocks, filter, query]);

  const filterOptions: { id: FilterCategory; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '🌐' },
    { id: 'tech', label: 'Tech', emoji: '💻' },
    { id: 'finance', label: 'Finance', emoji: '🏦' },
    { id: 'healthcare', label: 'Health', emoji: '💊' },
    { id: 'consumer', label: 'Consumer', emoji: '🛒' },
    { id: 'etf', label: 'ETFs', emoji: '📊' },
  ];

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="p-4 pb-0">
        <h1 className="text-2xl font-bold mb-4">Explore Stocks</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ticker, or sector..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input w-full pl-12 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === option.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">
            {filteredStocks.length} {filteredStocks.length === 1 ? 'stock' : 'stocks'} found
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredStocks.length > 0 ? (
            <div className="space-y-3">
              {filteredStocks.map((stock, index) => (
                <motion.div
                  key={stock.ticker}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <StockCard
                    stock={stock}
                    rating={stockRatings.get(stock.ticker)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-lg mb-2">No stocks found</h3>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchTab;
