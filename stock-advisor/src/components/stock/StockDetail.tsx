import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ChevronRight,
  AlertTriangle,
  Target,
  BarChart3,
  Activity,
  DollarSign,
  Layers,
  Shield,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { useUser } from '../../contexts/UserContext';
import { stockService } from '../../services/stockData';
import { calculateStockRating, generatePrediction, generateAdvisorRecommendation } from '../../services/aiRating';
import RatingCircle from '../common/RatingCircle';
import { Stock, StockRating, StockPrediction } from '../../types';

type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

const StockDetail: React.FC = () => {
  const { selectedStock, showStockDetail, closeStockDetail, openStockDetail, setCurrentTab } = useApp();
  const { user, viewStock } = useUser();

  const stock = selectedStock ? stockService.getStockByTicker(selectedStock) : null;

  const rating = useMemo(() => {
    if (!stock) return null;
    return calculateStockRating(stock);
  }, [stock]);

  const prediction = useMemo(() => {
    if (!stock || !rating) return null;
    return generatePrediction(stock, rating);
  }, [stock, rating]);

  const recommendation = useMemo(() => {
    if (!stock || !rating || !prediction || !user) return null;
    return generateAdvisorRecommendation(stock, rating, prediction, user);
  }, [stock, rating, prediction, user]);

  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('1M');

  useEffect(() => {
    if (selectedStock) {
      viewStock(selectedStock);
    }
  }, [selectedStock, viewStock]);

  if (!stock || !rating || !prediction) return null;

  const isPositive = stock.changePercent > 0;
  const isNegative = stock.changePercent < 0;

  // Get chart data based on timeframe
  const getChartData = () => {
    const history = stock.priceHistory;
    let days: number;
    switch (timeFrame) {
      case '1D': days = 1; break;
      case '1W': days = 7; break;
      case '1M': days = 30; break;
      case '3M': days = 90; break;
      case '1Y': days = 252; break;
      default: days = history.length;
    }
    return history.slice(-days).map((p, i) => ({
      date: p.date,
      price: p.close,
      index: i,
    }));
  };

  const chartData = getChartData();
  const chartColor = chartData.length > 1 && chartData[chartData.length - 1].price >= chartData[0].price
    ? '#22c55e'
    : '#ef4444';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm">
          <p className="text-gray-400">{payload[0].payload.date}</p>
          <p className="font-semibold">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const getDirectionIcon = (direction: string) => {
    if (direction.includes('bullish')) return <TrendingUp className="w-4 h-4" />;
    if (direction.includes('bearish')) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getDirectionColor = (direction: string) => {
    if (direction.includes('bullish')) return 'text-success-400';
    if (direction.includes('bearish')) return 'text-danger-400';
    return 'text-warning-400';
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'low') return 'badge-success';
    if (risk === 'medium') return 'badge-warning';
    return 'badge-danger';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'bg-success-500';
      case 'sell': return 'bg-danger-500';
      case 'avoid': return 'bg-danger-500';
      default: return 'bg-warning-500';
    }
  };

  return (
    <AnimatePresence>
      {showStockDetail && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-10">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={closeStockDetail}
                className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <div className="font-bold">{stock.ticker}</div>
                <div className="text-sm text-gray-400">{stock.sector}</div>
              </div>
              <div className="w-10" />
            </div>
          </div>

          <div className="p-4 pb-24">
            {/* Stock Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{stock.logo}</span>
                <div>
                  <h1 className="text-2xl font-bold">{stock.name}</h1>
                  <p className="text-gray-400">{stock.ticker}</p>
                </div>
              </div>

              <div className="flex items-end gap-4">
                <span className="text-4xl font-bold">${stock.price.toFixed(2)}</span>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-lg font-medium ${
                  isPositive
                    ? 'bg-success-500/20 text-success-400'
                    : isNegative
                    ? 'bg-danger-500/20 text-danger-400'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {isPositive ? <TrendingUp className="w-5 h-5" /> : isNegative ? <TrendingDown className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </div>
              </div>
            </motion.div>

            {/* Price Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card mb-6"
            >
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as TimeFrame[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeFrame(tf)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timeFrame === tf
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={chartColor}
                      strokeWidth={2}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* AI Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card mb-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary-400" />
                AI Rating
              </h2>

              <div className="flex items-center justify-center mb-6">
                <RatingCircle rating={rating} size="lg" />
              </div>

              <p className="text-gray-300 text-center mb-6">{rating.explanation}</p>

              {/* Rating Components */}
              <div className="space-y-4">
                {Object.entries(rating.components).map(([key, component]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">{component.label}</span>
                      <span className={`font-medium ${
                        component.score >= 60 ? 'text-success-400' :
                        component.score >= 40 ? 'text-warning-400' :
                        'text-danger-400'
                      }`}>
                        {component.score}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${component.score}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${
                          component.score >= 60 ? 'bg-success-500' :
                          component.score >= 40 ? 'bg-warning-500' :
                          'bg-danger-500'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{component.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-700/50 rounded-xl text-xs text-gray-400">
                <Info className="w-4 h-4 inline mr-1" />
                Rating calculated from: Technical (25%), Financial (20%), Volatility (20%), Sentiment (15%), Growth (20%)
              </div>
            </motion.div>

            {/* Predictions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card mb-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-400" />
                AI Predictions
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'shortTerm', data: prediction.shortTerm },
                  { key: 'mediumTerm', data: prediction.mediumTerm },
                  { key: 'longTerm', data: prediction.longTerm },
                ].map(({ key, data }) => (
                  <div key={key} className="bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{data.period}</span>
                      <div className={`flex items-center gap-1 ${getDirectionColor(data.direction)}`}>
                        {getDirectionIcon(data.direction)}
                        <span className="capitalize">{data.direction.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Confidence</span>
                      <span className="font-medium">{data.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-400">Risk Level</span>
                      <span className={getRiskBadge(data.riskLevel)}>{data.riskLevel}</span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">Price Target Range</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-danger-400">${data.priceTarget.low}</span>
                      <div className="flex-1 h-1 bg-gray-600 rounded-full relative">
                        <div
                          className="absolute h-3 w-3 bg-primary-500 rounded-full top-1/2 -translate-y-1/2"
                          style={{
                            left: `${((stock.price - data.priceTarget.low) / (data.priceTarget.high - data.priceTarget.low)) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-success-400">${data.priceTarget.high}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{data.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-primary-500/10 rounded-xl text-sm text-primary-300">
                💡 {prediction.aiInsight}
              </div>

              <div className="mt-3 p-3 bg-warning-500/10 rounded-xl text-xs text-warning-400">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {prediction.disclaimer}
              </div>
            </motion.div>

            {/* AI Advisor Recommendation */}
            {recommendation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card mb-6"
              >
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-400" />
                  AI Advisor Says
                </h2>

                <div className="text-center mb-4">
                  <div className={`inline-block px-6 py-2 rounded-xl text-lg font-bold uppercase ${getActionColor(recommendation.action)} text-white`}>
                    {recommendation.action}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Confidence: {recommendation.confidence}%
                  </div>
                </div>

                {recommendation.reasoning.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Why:</h3>
                    <ul className="space-y-1">
                      {recommendation.reasoning.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendation.riskWarnings.length > 0 && (
                  <div className="mb-4 p-3 bg-danger-500/10 rounded-xl">
                    <h3 className="text-sm font-medium text-danger-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Warnings:
                    </h3>
                    <ul className="space-y-1">
                      {recommendation.riskWarnings.map((warning, i) => (
                        <li key={i} className="text-sm text-danger-300">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendation.alternatives && recommendation.alternatives.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Consider Instead:</h3>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.alternatives.map((alt) => (
                        <button
                          key={alt}
                          onClick={() => {
                            closeStockDetail();
                            setTimeout(() => openStockDetail(alt), 300);
                          }}
                          className="px-3 py-1 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                        >
                          {alt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 p-3 bg-gray-700/50 rounded-xl">
                  {recommendation.disclaimer}
                </div>

                <button
                  onClick={() => {
                    closeStockDetail();
                    setCurrentTab('advisor');
                  }}
                  className="btn-primary w-full mt-4"
                >
                  Ask AI Advisor More Questions
                </button>
              </motion.div>
            )}

            {/* Key Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card mb-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-400" />
                Key Statistics
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-400">Market Cap</span>
                  <div className="font-semibold">{stockService.formatMarketCap(stock.marketCap)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Volume</span>
                  <div className="font-semibold">{stockService.formatVolume(stock.volume)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">P/E Ratio</span>
                  <div className="font-semibold">{stock.pe?.toFixed(2) || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">EPS</span>
                  <div className="font-semibold">${stock.eps?.toFixed(2) || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">52W High</span>
                  <div className="font-semibold text-success-400">${stock.high52Week.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">52W Low</span>
                  <div className="font-semibold text-danger-400">${stock.low52Week.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Beta</span>
                  <div className={`font-semibold ${stock.beta > 1.5 ? 'text-danger-400' : stock.beta > 1 ? 'text-warning-400' : 'text-success-400'}`}>
                    {stock.beta.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Dividend</span>
                  <div className="font-semibold">
                    {stock.dividend ? `$${stock.dividend.toFixed(2)}` : 'None'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-400" />
                About {stock.name}
              </h2>
              <p className="text-gray-300 leading-relaxed">{stock.description}</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Missing Star import fix
const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default StockDetail;
