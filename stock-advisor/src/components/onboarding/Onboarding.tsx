import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  User,
  TrendingUp,
  Shield,
  Target,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import {
  AgeRange,
  ExperienceLevel,
  RiskTolerance,
  InvestmentGoal,
  TimeHorizon,
} from '../../types';

interface OnboardingData {
  name: string;
  ageRange: AgeRange | null;
  experience: ExperienceLevel | null;
  riskTolerance: RiskTolerance | null;
  investmentGoal: InvestmentGoal | null;
  timeHorizon: TimeHorizon | null;
}

const Onboarding: React.FC = () => {
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    ageRange: null,
    experience: null,
    riskTolerance: null,
    investmentGoal: null,
    timeHorizon: null,
  });

  const totalSteps = 7;

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Welcome
      case 1: return data.name.trim().length >= 2;
      case 2: return data.ageRange !== null;
      case 3: return data.experience !== null;
      case 4: return data.riskTolerance !== null;
      case 5: return data.investmentGoal !== null;
      case 6: return data.timeHorizon !== null;
      default: return false;
    }
  };

  const handleComplete = () => {
    if (
      data.name &&
      data.ageRange &&
      data.experience &&
      data.riskTolerance &&
      data.investmentGoal &&
      data.timeHorizon
    ) {
      completeOnboarding({
        name: data.name,
        ageRange: data.ageRange,
        experience: data.experience,
        riskTolerance: data.riskTolerance,
        investmentGoal: data.investmentGoal,
        timeHorizon: data.timeHorizon,
      });
    }
  };

  const SelectOption: React.FC<{
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    selected: boolean;
    onClick: () => void;
  }> = ({ value, label, description, icon, selected, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`${selected ? 'text-primary-400' : 'text-gray-400'}`}>
            {icon}
          </div>
        )}
        <div>
          <div className={`font-semibold ${selected ? 'text-primary-400' : 'text-white'}`}>
            {label}
          </div>
          {description && (
            <div className="text-sm text-gray-400 mt-1">{description}</div>
          )}
        </div>
      </div>
    </motion.button>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-8xl mb-6"
            >
              📈
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">
              Welcome to <span className="text-gradient">StockAdvisor AI</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Your intelligent companion for smarter investing decisions. Let's personalize your experience.
            </p>
            <div className="flex items-center justify-center gap-2 text-warning-400 bg-warning-400/10 p-4 rounded-xl">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">
                This app provides educational content and AI-generated insights. It is not financial advice.
              </span>
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <User className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">What's your name?</h2>
                <p className="text-gray-400">We'll use this to personalize your experience</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="input w-full text-lg"
              autoFocus
            />
          </div>
        );

      case 2:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <User className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">How old are you?</h2>
                <p className="text-gray-400">This helps us tailor advice for your life stage</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '18-21', label: '18-21', desc: 'Just getting started' },
                { value: '22-25', label: '22-25', desc: 'Early career' },
                { value: '26-30', label: '26-30', desc: 'Building wealth' },
                { value: '31-40', label: '31-40', desc: 'Peak earning years' },
                { value: '40+', label: '40+', desc: 'Experienced investor' },
              ].map((option) => (
                <SelectOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  description={option.desc}
                  selected={data.ageRange === option.value}
                  onClick={() => setData({ ...data, ageRange: option.value as AgeRange })}
                />
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your investing experience?</h2>
                <p className="text-gray-400">We'll adjust the complexity of our insights</p>
              </div>
            </div>
            <div className="space-y-3">
              <SelectOption
                value="beginner"
                label="Beginner"
                description="New to investing, still learning the basics"
                icon={<span className="text-2xl">🌱</span>}
                selected={data.experience === 'beginner'}
                onClick={() => setData({ ...data, experience: 'beginner' })}
              />
              <SelectOption
                value="intermediate"
                label="Intermediate"
                description="Have some experience, understand basic concepts"
                icon={<span className="text-2xl">📊</span>}
                selected={data.experience === 'intermediate'}
                onClick={() => setData({ ...data, experience: 'intermediate' })}
              />
              <SelectOption
                value="advanced"
                label="Advanced"
                description="Experienced investor, comfortable with complex strategies"
                icon={<span className="text-2xl">🎯</span>}
                selected={data.experience === 'advanced'}
                onClick={() => setData({ ...data, experience: 'advanced' })}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Risk tolerance?</h2>
                <p className="text-gray-400">How comfortable are you with potential losses?</p>
              </div>
            </div>
            <div className="space-y-3">
              <SelectOption
                value="low"
                label="Conservative"
                description="Prefer stability, willing to accept lower returns for less risk"
                icon={<span className="text-2xl">🛡️</span>}
                selected={data.riskTolerance === 'low'}
                onClick={() => setData({ ...data, riskTolerance: 'low' })}
              />
              <SelectOption
                value="medium"
                label="Moderate"
                description="Balanced approach, some risk for potential growth"
                icon={<span className="text-2xl">⚖️</span>}
                selected={data.riskTolerance === 'medium'}
                onClick={() => setData({ ...data, riskTolerance: 'medium' })}
              />
              <SelectOption
                value="high"
                label="Aggressive"
                description="Comfortable with volatility for higher potential returns"
                icon={<span className="text-2xl">🚀</span>}
                selected={data.riskTolerance === 'high'}
                onClick={() => setData({ ...data, riskTolerance: 'high' })}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Target className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Investment goal?</h2>
                <p className="text-gray-400">What's your primary investing style?</p>
              </div>
            </div>
            <div className="space-y-3">
              <SelectOption
                value="day-trading"
                label="Day Trading"
                description="Active trading, multiple trades per day"
                icon={<span className="text-2xl">⚡</span>}
                selected={data.investmentGoal === 'day-trading'}
                onClick={() => setData({ ...data, investmentGoal: 'day-trading' })}
              />
              <SelectOption
                value="swing-trading"
                label="Swing Trading"
                description="Hold positions for days to weeks"
                icon={<span className="text-2xl">🏄</span>}
                selected={data.investmentGoal === 'swing-trading'}
                onClick={() => setData({ ...data, investmentGoal: 'swing-trading' })}
              />
              <SelectOption
                value="long-term"
                label="Long-Term Investing"
                description="Buy and hold for months or years"
                icon={<span className="text-2xl">🏠</span>}
                selected={data.investmentGoal === 'long-term'}
                onClick={() => setData({ ...data, investmentGoal: 'long-term' })}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Time horizon?</h2>
                <p className="text-gray-400">When do you plan to use this money?</p>
              </div>
            </div>
            <div className="space-y-3">
              <SelectOption
                value="short"
                label="Short-term (under 1 year)"
                description="Need the money soon, prioritize liquidity"
                icon={<span className="text-2xl">🏃</span>}
                selected={data.timeHorizon === 'short'}
                onClick={() => setData({ ...data, timeHorizon: 'short' })}
              />
              <SelectOption
                value="medium"
                label="Medium-term (1-5 years)"
                description="Have some time, can ride out volatility"
                icon={<span className="text-2xl">🚶</span>}
                selected={data.timeHorizon === 'medium'}
                onClick={() => setData({ ...data, timeHorizon: 'medium' })}
              />
              <SelectOption
                value="long"
                label="Long-term (5+ years)"
                description="Don't need the money soon, can invest aggressively"
                icon={<span className="text-2xl">🧘</span>}
                selected={data.timeHorizon === 'long'}
                onClick={() => setData({ ...data, timeHorizon: 'long' })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Progress Bar */}
      {step > 0 && (
        <div className="p-4">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
              initial={{ width: 0 }}
              animate={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            Step {step} of {totalSteps - 1}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 pb-8">
        <div className="flex gap-3 max-w-md mx-auto">
          {step > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(step - 1)}
              className="btn-secondary flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (step < totalSteps - 1) {
                setStep(step + 1);
              } else {
                handleComplete();
              }
            }}
            disabled={!canProceed()}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {step === 0 ? (
              <>
                <Sparkles className="w-5 h-5" />
                Get Started
              </>
            ) : step === totalSteps - 1 ? (
              <>
                <Sparkles className="w-5 h-5" />
                Complete Setup
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
