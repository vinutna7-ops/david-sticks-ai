import React from 'react';
import { motion } from 'framer-motion';
import { StockRating } from '../../types';

interface RatingCircleProps {
  rating: StockRating;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const RatingCircle: React.FC<RatingCircleProps> = ({ rating, size = 'md', showLabel = true }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const radius = size === 'sm' ? 28 : size === 'md' ? 42 : 56;
  const circumference = 2 * Math.PI * radius;
  const progress = (rating.overall / 100) * circumference;

  const getColor = () => {
    if (rating.overall >= 70) return { stroke: '#22c55e', glow: 'shadow-success-500/30' };
    if (rating.overall >= 55) return { stroke: '#84cc16', glow: 'shadow-lime-500/30' };
    if (rating.overall >= 45) return { stroke: '#fbbf24', glow: 'shadow-warning-500/30' };
    if (rating.overall >= 30) return { stroke: '#f97316', glow: 'shadow-orange-500/30' };
    return { stroke: '#ef4444', glow: 'shadow-danger-500/30' };
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]} ${color.glow} shadow-lg rounded-full`}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="#374151"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`font-bold ${textSizes[size]}`}
            style={{ color: color.stroke }}
          >
            {rating.overall}
          </motion.span>
        </div>
      </div>
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            rating.overall >= 70
              ? 'bg-success-500/20 text-success-400'
              : rating.overall >= 55
              ? 'bg-lime-500/20 text-lime-400'
              : rating.overall >= 45
              ? 'bg-warning-500/20 text-warning-400'
              : rating.overall >= 30
              ? 'bg-orange-500/20 text-orange-400'
              : 'bg-danger-500/20 text-danger-400'
          }`}
        >
          {rating.label}
        </motion.div>
      )}
    </div>
  );
};

export default RatingCircle;
