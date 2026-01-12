// User Profile Types
export type AgeRange = '18-21' | '22-25' | '26-30' | '31-40' | '40+';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type RiskTolerance = 'low' | 'medium' | 'high';
export type InvestmentGoal = 'day-trading' | 'swing-trading' | 'long-term';
export type TimeHorizon = 'short' | 'medium' | 'long';

export interface UserProfile {
  id: string;
  name: string;
  ageRange: AgeRange;
  experience: ExperienceLevel;
  riskTolerance: RiskTolerance;
  investmentGoal: InvestmentGoal;
  timeHorizon: TimeHorizon;
  onboardingComplete: boolean;
  createdAt: Date;
  badges: Badge[];
  completedLessons: string[];
  viewedStocks: string[];
  streak: number;
  lastActive: Date;
}

// Stock Types
export interface Stock {
  ticker: string;
  name: string;
  logo: string;
  sector: string;
  description: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  avgVolume: number;
  high52Week: number;
  low52Week: number;
  pe: number | null;
  eps: number | null;
  dividend: number | null;
  beta: number;
  priceHistory: PricePoint[];
}

export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Rating Types
export interface StockRating {
  overall: number; // 0-100
  label: RatingLabel;
  color: RatingColor;
  components: RatingComponents;
  explanation: string;
  lastUpdated: Date;
}

export type RatingLabel = 'Strong Buy' | 'Good Opportunity' | 'Neutral' | 'Caution' | 'High Risk';
export type RatingColor = 'green' | 'lime' | 'yellow' | 'orange' | 'red';

export interface RatingComponents {
  technicalTrend: ComponentScore;
  financialHealth: ComponentScore;
  volatility: ComponentScore;
  marketSentiment: ComponentScore;
  growthPotential: ComponentScore;
}

export interface ComponentScore {
  score: number; // 0-100
  weight: number; // 0-1
  label: string;
  explanation: string;
}

// Prediction Types
export interface StockPrediction {
  shortTerm: PredictionTimeframe;
  mediumTerm: PredictionTimeframe;
  longTerm: PredictionTimeframe;
  aiInsight: string;
  disclaimer: string;
}

export interface PredictionTimeframe {
  period: string;
  direction: 'bullish' | 'slightly-bullish' | 'neutral' | 'slightly-bearish' | 'bearish';
  confidence: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  priceTarget: {
    low: number;
    mid: number;
    high: number;
  };
  explanation: string;
}

// AI Advisor Types
export interface AdvisorMessage {
  id: string;
  type: 'user' | 'advisor';
  content: string;
  timestamp: Date;
  stockContext?: string;
}

export interface AdvisorRecommendation {
  action: 'buy' | 'hold' | 'sell' | 'avoid';
  reasoning: string[];
  riskWarnings: string[];
  alternatives?: string[];
  confidence: number;
  disclaimer: string;
}

// Beginner Guide Types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // minutes
  content: LessonContent[];
  quiz?: Quiz;
  badge?: Badge;
}

export type LessonCategory = 'basics' | 'reading-stocks' | 'risk-safety' | 'strategies' | 'advanced';

export interface LessonContent {
  type: 'text' | 'example' | 'tip' | 'warning' | 'interactive';
  title?: string;
  content: string;
  icon?: string;
}

export interface Quiz {
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  category: 'learning' | 'activity' | 'achievement';
}

export interface Progress {
  lessonsCompleted: number;
  totalLessons: number;
  quizzesPassed: number;
  stocksViewed: number;
  daysActive: number;
  currentStreak: number;
  longestStreak: number;
}

// Market Types
export interface MarketMood {
  overall: 'bullish' | 'neutral' | 'bearish';
  score: number; // -100 to 100
  indicators: {
    sp500Change: number;
    vix: number;
    advanceDecline: number;
    newHighsLows: number;
  };
  summary: string;
}

// App State Types
export type AppTab = 'home' | 'search' | 'advisor' | 'learn' | 'profile';

export interface AppState {
  currentTab: AppTab;
  selectedStock: string | null;
  isLoading: boolean;
  error: string | null;
}
