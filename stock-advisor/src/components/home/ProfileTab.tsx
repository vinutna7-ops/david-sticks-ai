import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Settings,
  Shield,
  Target,
  Clock,
  TrendingUp,
  Award,
  LogOut,
  ChevronRight,
  AlertTriangle,
  Info,
  Edit3,
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { learningService } from '../../services/learningContent';

const ProfileTab: React.FC = () => {
  const { user, resetUser, updateUser } = useUser();
  const [showReset, setShowReset] = useState(false);

  if (!user) return null;

  const progress = learningService.calculateProgress(user.completedLessons);
  const earnedBadges = user.badges;

  const profileItems = [
    {
      icon: <User className="w-5 h-5" />,
      label: 'Age Range',
      value: user.ageRange,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Experience',
      value: user.experience.charAt(0).toUpperCase() + user.experience.slice(1),
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Risk Tolerance',
      value: user.riskTolerance.charAt(0).toUpperCase() + user.riskTolerance.slice(1),
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Investment Style',
      value: user.investmentGoal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Time Horizon',
      value: user.timeHorizon.charAt(0).toUpperCase() + user.timeHorizon.slice(1),
    },
  ];

  const stats = [
    { label: 'Lessons', value: `${progress.completed}/${progress.total}` },
    { label: 'Badges', value: earnedBadges.length },
    { label: 'Stocks Viewed', value: user.viewedStocks.length },
    { label: 'Day Streak', value: user.streak },
  ];

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-400">
              {user.experience.charAt(0).toUpperCase() + user.experience.slice(1)} Investor
            </p>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-2 mb-6"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center p-3 bg-gray-800 rounded-xl">
              <div className="text-xl font-bold text-primary-400">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-primary-400" />
            <span className="font-semibold">Your Badges</span>
          </div>
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-2 bg-gray-700/50 rounded-xl"
                >
                  <span className="text-2xl mb-1">{badge.icon}</span>
                  <span className="text-xs text-gray-400 text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-sm">Complete lessons and explore stocks to earn badges!</p>
            </div>
          )}
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-primary-400" />
            <span className="font-semibold">Your Profile</span>
          </div>
          <div className="space-y-3">
            {profileItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">{item.icon}</div>
                  <span className="text-gray-400">{item.label}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-6 bg-warning-500/10 border-warning-500/30"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-warning-400 mb-1">Risk Disclaimer</h3>
              <p className="text-sm text-warning-300/80">
                This app provides AI-generated insights for educational purposes only.
                It is not financial advice. Always consult a qualified financial advisor
                before making investment decisions. Past performance does not guarantee
                future results.
              </p>
            </div>
          </div>
        </motion.div>

        {/* About AI Ratings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-primary-400" />
            <span className="font-semibold">How AI Ratings Work</span>
          </div>
          <div className="text-sm text-gray-300 space-y-3">
            <p>
              Our AI rating system analyzes stocks using multiple factors:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Technical Trend (25%) - Price momentum and moving averages</li>
              <li>Financial Health (20%) - P/E ratio, earnings, dividends</li>
              <li>Volatility (20%) - Beta and price stability</li>
              <li>Market Sentiment (15%) - Volume and recent performance</li>
              <li>Growth Potential (20%) - Sector and historical growth</li>
            </ul>
            <p className="text-gray-400">
              Ratings are recalculated regularly based on latest market data.
              They are designed to help inform your research, not replace it.
            </p>
          </div>
        </motion.div>

        {/* Reset Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full p-4 bg-gray-800 rounded-xl flex items-center justify-between text-gray-400 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span>Reset Profile</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="card bg-danger-500/10 border-danger-500/30">
              <h3 className="font-semibold text-danger-400 mb-2">Reset Profile?</h3>
              <p className="text-sm text-gray-400 mb-4">
                This will delete all your data including progress, badges, and preferences.
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReset(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={resetUser}
                  className="btn-danger flex-1"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* App Version */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>StockAdvisor AI v1.0.0</p>
          <p>Built with ❤️ for young investors</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
