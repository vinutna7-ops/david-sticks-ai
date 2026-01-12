import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Stock, StockRating } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface StockCardProps {
  stock: Stock;
  rating?: StockRating;
  variant?: 'default' | 'compact' | 'featured';
}

const StockCard: React.FC<StockCardProps> = ({ stock, rating, variant = 'default' }) => {
  const { openStockDetail } = useApp();
  const isPositive = stock.changePercent > 0;
  const isNegative = stock.changePercent < 0;

  const getRatingColor = (score: number) => {
    if (score >= 70) return 'text-success-400';
    if (score >= 50) return 'text-warning-400';
    return 'text-danger-400';
  };

  if (variant === 'compact') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openStockDetail(stock.ticker)}
        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl w-full text-left hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{stock.logo}</span>
          <div>
            <div className="font-semibold">{stock.ticker}</div>
            <div className="text-sm text-gray-400 truncate max-w-[100px]">{stock.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">${stock.price.toFixed(2)}</div>
          <div className={`text-sm flex items-center gap-1 ${
            isPositive ? 'text-success-400' : isNegative ? 'text-danger-400' : 'text-gray-400'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </div>
        </div>
      </motion.button>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openStockDetail(stock.ticker)}
        className="card-hover min-w-[200px] text-left"
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{stock.logo}</span>
          {rating && (
            <div className={`text-lg font-bold ${getRatingColor(rating.overall)}`}>
              {rating.overall}
            </div>
          )}
        </div>
        <div className="font-bold text-lg mb-1">{stock.ticker}</div>
        <div className="text-sm text-gray-400 mb-3 truncate">{stock.name}</div>
        <div className="flex items-end justify-between">
          <div className="text-xl font-bold">${stock.price.toFixed(2)}</div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
            isPositive
              ? 'bg-success-500/20 text-success-400'
              : isNegative
              ? 'bg-danger-500/20 text-danger-400'
              : 'bg-gray-700 text-gray-400'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : isNegative ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </div>
        </div>
      </motion.button>
    );
  }

  // Default variant
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => openStockDetail(stock.ticker)}
      className="card-hover w-full text-left"
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl">{stock.logo}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{stock.ticker}</span>
            {rating && (
              <span className={`text-sm font-medium ${getRatingColor(rating.overall)}`}>
                {rating.overall}/100
              </span>
            )}
          </div>
          <div className="text-sm text-gray-400 truncate">{stock.name}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg">${stock.price.toFixed(2)}</div>
          <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
            isPositive ? 'text-success-400' : isNegative ? 'text-danger-400' : 'text-gray-400'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : isNegative ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
      {rating && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">AI Rating</span>
            <span className={`font-medium ${getRatingColor(rating.overall)}`}>
              {rating.label}
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rating.overall}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`h-full rounded-full ${
                rating.overall >= 70
                  ? 'bg-success-500'
                  : rating.overall >= 50
                  ? 'bg-warning-500'
                  : 'bg-danger-500'
              }`}
            />
          </div>
        </div>
      )}
    </motion.button>
  );
};

export default StockCard;
