import {
  Stock,
  StockRating,
  StockPrediction,
  RatingLabel,
  RatingColor,
  UserProfile,
  AdvisorRecommendation
} from '../types';

// AI Rating System
// Calculates comprehensive stock ratings based on multiple factors

/**
 * Calculate Technical Trend Score
 * Based on price momentum, moving averages, and trend strength
 */
const calculateTechnicalScore = (stock: Stock): { score: number; explanation: string } => {
  const priceHistory = stock.priceHistory;
  if (priceHistory.length < 50) {
    return { score: 50, explanation: 'Insufficient data for technical analysis' };
  }

  // Calculate short-term momentum (20 days)
  const recent20 = priceHistory.slice(-20);
  const avg20 = recent20.reduce((sum, p) => sum + p.close, 0) / 20;

  // Calculate medium-term momentum (50 days)
  const recent50 = priceHistory.slice(-50);
  const avg50 = recent50.reduce((sum, p) => sum + p.close, 0) / 50;

  // Calculate long-term momentum (200 days)
  const recent200 = priceHistory.slice(-200);
  const avg200 = recent200.reduce((sum, p) => sum + p.close, 0) / Math.min(200, recent200.length);

  // Price above moving averages is bullish
  const priceVs20 = (stock.price - avg20) / avg20;
  const priceVs50 = (stock.price - avg50) / avg50;
  const priceVs200 = (stock.price - avg200) / avg200;

  // Golden cross (20 > 50) is bullish
  const maAlignment = avg20 > avg50 ? 15 : -10;

  // Calculate RSI-like momentum
  let gains = 0, losses = 0;
  for (let i = 1; i < recent20.length; i++) {
    const change = recent20[i].close - recent20[i-1].close;
    if (change > 0) gains += change;
    else losses -= change;
  }
  const rsi = losses === 0 ? 100 : 100 - (100 / (1 + gains / losses));

  // Normalize RSI to score (30-70 is neutral, below 30 oversold, above 70 overbought)
  let rsiScore = 50;
  if (rsi < 30) rsiScore = 70; // Oversold = potential buy
  else if (rsi > 70) rsiScore = 30; // Overbought = potential sell
  else rsiScore = 50;

  // Combine factors
  let score = 50;
  score += priceVs20 * 100 * 0.3; // 30% weight
  score += priceVs50 * 80 * 0.2;  // 20% weight
  score += priceVs200 * 60 * 0.2; // 20% weight
  score += maAlignment;            // 15% weight
  score += (rsiScore - 50) * 0.3; // 15% weight

  score = Math.max(0, Math.min(100, score));

  let explanation = '';
  if (score >= 70) {
    explanation = 'Strong upward trend with positive momentum across timeframes';
  } else if (score >= 55) {
    explanation = 'Moderately bullish trend with improving momentum';
  } else if (score >= 45) {
    explanation = 'Neutral trend, consolidating within a range';
  } else if (score >= 30) {
    explanation = 'Weakening trend with declining momentum';
  } else {
    explanation = 'Strong downward trend with negative momentum';
  }

  return { score: Math.round(score), explanation };
};

/**
 * Calculate Financial Health Score
 * Based on PE ratio, earnings, and fundamentals
 */
const calculateFinancialHealth = (stock: Stock): { score: number; explanation: string } => {
  let score = 50;
  const factors: string[] = [];

  // PE Ratio analysis (lower is generally better, but negative is bad)
  if (stock.pe === null || stock.pe < 0) {
    score -= 20;
    factors.push('No positive earnings');
  } else if (stock.pe < 15) {
    score += 25;
    factors.push('Attractively valued');
  } else if (stock.pe < 25) {
    score += 15;
    factors.push('Reasonably valued');
  } else if (stock.pe < 40) {
    score += 5;
    factors.push('Growth premium priced in');
  } else {
    score -= 10;
    factors.push('High valuation');
  }

  // EPS analysis
  if (stock.eps !== null && stock.eps > 0) {
    score += 15;
    factors.push('Positive earnings');
  }

  // Dividend (if applicable)
  if (stock.dividend !== null && stock.dividend > 0) {
    const yieldPct = (stock.dividend / stock.price) * 100;
    if (yieldPct > 3) {
      score += 10;
      factors.push('Strong dividend yield');
    } else if (yieldPct > 1) {
      score += 5;
      factors.push('Pays dividend');
    }
  }

  // Market cap stability
  if (stock.marketCap > 200e9) {
    score += 10;
    factors.push('Large-cap stability');
  } else if (stock.marketCap > 10e9) {
    score += 5;
    factors.push('Mid-cap growth potential');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    explanation: factors.join('. '),
  };
};

/**
 * Calculate Volatility Score
 * Lower volatility = higher score (safer investment)
 */
const calculateVolatilityScore = (stock: Stock): { score: number; explanation: string } => {
  // Use beta as primary volatility measure
  let score = 100 - (stock.beta - 1) * 50;

  // Analyze recent price swings
  const recent30 = stock.priceHistory.slice(-30);
  const dailyReturns = [];
  for (let i = 1; i < recent30.length; i++) {
    dailyReturns.push((recent30[i].close - recent30[i-1].close) / recent30[i-1].close);
  }

  // Calculate standard deviation
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance);

  // Annualized volatility
  const annualizedVol = stdDev * Math.sqrt(252) * 100;

  // Adjust score based on volatility
  score -= annualizedVol * 0.5;

  score = Math.max(0, Math.min(100, score));

  let explanation = '';
  if (score >= 70) {
    explanation = `Low volatility (beta: ${stock.beta.toFixed(2)}). Stable price movements.`;
  } else if (score >= 50) {
    explanation = `Moderate volatility (beta: ${stock.beta.toFixed(2)}). Average price swings.`;
  } else if (score >= 30) {
    explanation = `High volatility (beta: ${stock.beta.toFixed(2)}). Larger price movements expected.`;
  } else {
    explanation = `Very high volatility (beta: ${stock.beta.toFixed(2)}). Significant price swings common.`;
  }

  return { score: Math.round(score), explanation };
};

/**
 * Calculate Market Sentiment Score
 * Based on volume, recent performance, and market conditions
 */
const calculateSentimentScore = (stock: Stock): { score: number; explanation: string } => {
  let score = 50;
  const factors: string[] = [];

  // Volume analysis
  const volumeRatio = stock.volume / stock.avgVolume;
  if (volumeRatio > 1.5 && stock.changePercent > 0) {
    score += 15;
    factors.push('High buying volume');
  } else if (volumeRatio > 1.5 && stock.changePercent < 0) {
    score -= 10;
    factors.push('High selling pressure');
  } else if (volumeRatio < 0.7) {
    score -= 5;
    factors.push('Below average interest');
  }

  // Recent performance sentiment
  if (stock.changePercent > 3) {
    score += 15;
    factors.push('Strong bullish momentum today');
  } else if (stock.changePercent > 1) {
    score += 10;
    factors.push('Positive sentiment');
  } else if (stock.changePercent < -3) {
    score -= 15;
    factors.push('Bearish pressure');
  } else if (stock.changePercent < -1) {
    score -= 10;
    factors.push('Negative sentiment');
  }

  // 52-week position
  const range52Week = stock.high52Week - stock.low52Week;
  const position = (stock.price - stock.low52Week) / range52Week;

  if (position > 0.9) {
    score += 5;
    factors.push('Near 52-week high');
  } else if (position < 0.2) {
    score -= 5;
    factors.push('Near 52-week low');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    explanation: factors.join('. ') || 'Neutral market sentiment',
  };
};

/**
 * Calculate Growth Potential Score
 * Based on sector, historical growth, and future outlook
 */
const calculateGrowthPotential = (stock: Stock): { score: number; explanation: string } => {
  let score = 50;
  const factors: string[] = [];

  // Sector growth potential
  const sectorScores: Record<string, number> = {
    'Technology': 20,
    'Healthcare': 15,
    'Financial Services': 10,
    'Consumer Cyclical': 10,
    'Communication Services': 10,
    'Consumer Defensive': 5,
    'ETF': 10,
  };

  score += sectorScores[stock.sector] || 0;
  factors.push(`${stock.sector} sector`);

  // Historical growth (1-year)
  if (stock.priceHistory.length >= 252) {
    const yearAgo = stock.priceHistory[stock.priceHistory.length - 252]?.close || stock.price;
    const yearReturn = (stock.price - yearAgo) / yearAgo * 100;

    if (yearReturn > 50) {
      score += 25;
      factors.push('Exceptional growth');
    } else if (yearReturn > 20) {
      score += 15;
      factors.push('Strong growth');
    } else if (yearReturn > 0) {
      score += 5;
      factors.push('Positive growth');
    } else if (yearReturn > -20) {
      score -= 10;
      factors.push('Negative performance');
    } else {
      score -= 20;
      factors.push('Significant decline');
    }
  }

  // Room to grow (vs 52-week high)
  const upsideToHigh = (stock.high52Week - stock.price) / stock.price * 100;
  if (upsideToHigh > 20) {
    score += 10;
    factors.push('Room to recover');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    explanation: factors.join('. '),
  };
};

/**
 * Get rating label and color based on score
 */
const getRatingLabelAndColor = (score: number): { label: RatingLabel; color: RatingColor } => {
  if (score >= 75) return { label: 'Strong Buy', color: 'green' };
  if (score >= 60) return { label: 'Good Opportunity', color: 'lime' };
  if (score >= 45) return { label: 'Neutral', color: 'yellow' };
  if (score >= 30) return { label: 'Caution', color: 'orange' };
  return { label: 'High Risk', color: 'red' };
};

/**
 * Calculate comprehensive stock rating
 */
export const calculateStockRating = (stock: Stock): StockRating => {
  const technical = calculateTechnicalScore(stock);
  const financial = calculateFinancialHealth(stock);
  const volatility = calculateVolatilityScore(stock);
  const sentiment = calculateSentimentScore(stock);
  const growth = calculateGrowthPotential(stock);

  // Weighted average
  const weights = {
    technical: 0.25,
    financial: 0.20,
    volatility: 0.20,
    sentiment: 0.15,
    growth: 0.20,
  };

  const overall = Math.round(
    technical.score * weights.technical +
    financial.score * weights.financial +
    volatility.score * weights.volatility +
    sentiment.score * weights.sentiment +
    growth.score * weights.growth
  );

  const { label, color } = getRatingLabelAndColor(overall);

  // Generate explanation
  const explanationParts: string[] = [];

  if (technical.score >= 60) explanationParts.push('strong technical setup');
  else if (technical.score <= 40) explanationParts.push('weak technicals');

  if (financial.score >= 60) explanationParts.push('solid financials');
  else if (financial.score <= 40) explanationParts.push('financial concerns');

  if (volatility.score >= 60) explanationParts.push('low volatility');
  else if (volatility.score <= 40) explanationParts.push('high volatility');

  if (growth.score >= 60) explanationParts.push('good growth potential');

  const explanation = explanationParts.length > 0
    ? `This stock shows ${explanationParts.join(', ')}.`
    : 'This stock has mixed signals across our rating factors.';

  return {
    overall,
    label,
    color,
    components: {
      technicalTrend: {
        score: technical.score,
        weight: weights.technical,
        label: 'Technical Trend',
        explanation: technical.explanation,
      },
      financialHealth: {
        score: financial.score,
        weight: weights.financial,
        label: 'Financial Health',
        explanation: financial.explanation,
      },
      volatility: {
        score: volatility.score,
        weight: weights.volatility,
        label: 'Volatility',
        explanation: volatility.explanation,
      },
      marketSentiment: {
        score: sentiment.score,
        weight: weights.sentiment,
        label: 'Market Sentiment',
        explanation: sentiment.explanation,
      },
      growthPotential: {
        score: growth.score,
        weight: weights.growth,
        label: 'Growth Potential',
        explanation: growth.explanation,
      },
    },
    explanation,
    lastUpdated: new Date(),
  };
};

/**
 * Generate stock predictions
 */
export const generatePrediction = (stock: Stock, rating: StockRating): StockPrediction => {
  const recent = stock.priceHistory.slice(-30);
  const avgReturn = recent.reduce((sum, p, i) => {
    if (i === 0) return 0;
    return sum + (p.close - recent[i-1].close) / recent[i-1].close;
  }, 0) / (recent.length - 1);

  const annualizedReturn = avgReturn * 252;
  const trendBias = rating.overall > 50 ? 1 : rating.overall < 50 ? -1 : 0;

  // Short-term prediction (1-7 days)
  const shortTermDirection = rating.components.marketSentiment.score > 55
    ? (rating.components.technicalTrend.score > 55 ? 'bullish' : 'slightly-bullish')
    : rating.components.marketSentiment.score < 45
    ? (rating.components.technicalTrend.score < 45 ? 'bearish' : 'slightly-bearish')
    : 'neutral';

  const shortConfidence = Math.min(75, Math.max(35, 50 + (rating.overall - 50) * 0.5));

  // Medium-term prediction (1-3 months)
  const mediumScore = (rating.components.technicalTrend.score + rating.components.financialHealth.score) / 2;
  const mediumDirection = mediumScore > 60 ? 'bullish'
    : mediumScore > 55 ? 'slightly-bullish'
    : mediumScore < 40 ? 'bearish'
    : mediumScore < 45 ? 'slightly-bearish'
    : 'neutral';

  const mediumConfidence = Math.min(70, Math.max(30, 45 + (rating.overall - 50) * 0.4));

  // Long-term prediction (1+ year)
  const longScore = (rating.components.financialHealth.score + rating.components.growthPotential.score) / 2;
  const longDirection = longScore > 60 ? 'bullish'
    : longScore > 55 ? 'slightly-bullish'
    : longScore < 40 ? 'bearish'
    : longScore < 45 ? 'slightly-bearish'
    : 'neutral';

  const longConfidence = Math.min(60, Math.max(25, 40 + (rating.overall - 50) * 0.3));

  // Calculate price targets
  const volatilityFactor = (100 - rating.components.volatility.score) / 100;

  const shortTargets = {
    low: stock.price * (1 - 0.03 * volatilityFactor * 2),
    mid: stock.price * (1 + (shortTermDirection.includes('bullish') ? 0.02 : shortTermDirection.includes('bearish') ? -0.02 : 0)),
    high: stock.price * (1 + 0.05 * volatilityFactor * 2),
  };

  const mediumTargets = {
    low: stock.price * (1 - 0.15 * volatilityFactor),
    mid: stock.price * (1 + (annualizedReturn / 4) * trendBias),
    high: stock.price * (1 + 0.25 * volatilityFactor),
  };

  const longTargets = {
    low: stock.price * (1 - 0.25 * volatilityFactor),
    mid: stock.price * (1 + annualizedReturn * trendBias),
    high: stock.price * (1 + 0.50 * volatilityFactor),
  };

  // Generate insights
  const insights: string[] = [];

  if (rating.overall >= 60) {
    insights.push(`${stock.name} shows promising indicators across our analysis.`);
  } else if (rating.overall <= 40) {
    insights.push(`${stock.name} faces some headwinds that warrant caution.`);
  }

  if (stock.beta > 1.5) {
    insights.push(`Higher volatility means larger potential gains but also larger potential losses.`);
  }

  if (rating.components.financialHealth.score >= 60 && rating.components.growthPotential.score >= 60) {
    insights.push(`Strong fundamentals support the long-term outlook.`);
  }

  return {
    shortTerm: {
      period: '1-7 days',
      direction: shortTermDirection,
      confidence: Math.round(shortConfidence),
      riskLevel: stock.beta > 1.5 ? 'high' : stock.beta > 1 ? 'medium' : 'low',
      priceTarget: {
        low: Number(shortTargets.low.toFixed(2)),
        mid: Number(shortTargets.mid.toFixed(2)),
        high: Number(shortTargets.high.toFixed(2)),
      },
      explanation: `Based on current momentum and sentiment, expecting ${shortTermDirection.replace('-', ' ')} movement in the short term.`,
    },
    mediumTerm: {
      period: '1-3 months',
      direction: mediumDirection,
      confidence: Math.round(mediumConfidence),
      riskLevel: stock.beta > 1.3 ? 'high' : stock.beta > 0.9 ? 'medium' : 'low',
      priceTarget: {
        low: Number(mediumTargets.low.toFixed(2)),
        mid: Number(mediumTargets.mid.toFixed(2)),
        high: Number(mediumTargets.high.toFixed(2)),
      },
      explanation: `Technical trends and financial health suggest ${mediumDirection.replace('-', ' ')} outlook over the next quarter.`,
    },
    longTerm: {
      period: '1+ year',
      direction: longDirection,
      confidence: Math.round(longConfidence),
      riskLevel: rating.components.volatility.score < 40 ? 'high' : rating.components.volatility.score < 60 ? 'medium' : 'low',
      priceTarget: {
        low: Number(longTargets.low.toFixed(2)),
        mid: Number(longTargets.mid.toFixed(2)),
        high: Number(longTargets.high.toFixed(2)),
      },
      explanation: `Long-term fundamentals and growth potential indicate a ${longDirection.replace('-', ' ')} trajectory.`,
    },
    aiInsight: insights.join(' ') || `${stock.name} presents a balanced risk-reward profile.`,
    disclaimer: 'These predictions are AI-generated estimates based on historical data and current market conditions. Past performance does not guarantee future results. Always conduct your own research before investing.',
  };
};

/**
 * Generate personalized advisor recommendation
 */
export const generateAdvisorRecommendation = (
  stock: Stock,
  rating: StockRating,
  prediction: StockPrediction,
  userProfile: UserProfile
): AdvisorRecommendation => {
  const reasoning: string[] = [];
  const riskWarnings: string[] = [];
  const alternatives: string[] = [];
  let action: 'buy' | 'hold' | 'sell' | 'avoid' = 'hold';
  let confidence = 50;

  // Risk tolerance alignment
  const volatilityScore = rating.components.volatility.score;
  const isHighVolatility = volatilityScore < 40;
  const isMediumVolatility = volatilityScore >= 40 && volatilityScore < 60;

  if (userProfile.riskTolerance === 'low') {
    if (isHighVolatility) {
      riskWarnings.push(`This stock's volatility (beta: ${stock.beta.toFixed(2)}) may be too high for your low risk tolerance.`);
      action = 'avoid';
      alternatives.push('SPY', 'VTI', 'JNJ', 'KO');
    } else if (isMediumVolatility && rating.overall < 55) {
      riskWarnings.push('Consider lower volatility alternatives that match your conservative profile.');
      alternatives.push('WMT', 'V');
    }
  } else if (userProfile.riskTolerance === 'medium') {
    if (isHighVolatility && stock.beta > 2) {
      riskWarnings.push('This is a highly volatile stock. Consider sizing your position appropriately.');
    }
  }

  // Investment goal alignment
  if (userProfile.investmentGoal === 'day-trading') {
    if (stock.volume < stock.avgVolume * 0.5) {
      riskWarnings.push('Low trading volume may make day trading difficult.');
    }
    if (rating.components.marketSentiment.score > 60 && rating.components.technicalTrend.score > 55) {
      reasoning.push('Strong short-term momentum supports day trading opportunities.');
      action = 'buy';
      confidence += 10;
    }
  } else if (userProfile.investmentGoal === 'swing-trading') {
    if (rating.components.technicalTrend.score > 60) {
      reasoning.push('Technical setup favors swing trading entry.');
      action = rating.overall > 55 ? 'buy' : 'hold';
      confidence += 5;
    }
  } else if (userProfile.investmentGoal === 'long-term') {
    if (rating.components.financialHealth.score > 60 && rating.components.growthPotential.score > 55) {
      reasoning.push('Strong fundamentals support long-term holding.');
      action = rating.overall > 55 ? 'buy' : 'hold';
      confidence += 10;
    }
    if (stock.dividend && stock.dividend > 0) {
      reasoning.push(`Dividend income (${((stock.dividend / stock.price) * 100).toFixed(2)}% yield) adds to total return.`);
    }
  }

  // Experience level adjustments
  if (userProfile.experience === 'beginner') {
    if (stock.sector === 'ETF') {
      reasoning.push('ETFs provide diversification, which is great for beginners.');
      confidence += 5;
    }
    if (isHighVolatility) {
      riskWarnings.push('As a beginner, consider starting with less volatile stocks to learn market behavior.');
    }
    if (stock.marketCap < 10e9) {
      riskWarnings.push('Smaller companies can be riskier. Consider larger, more established companies.');
    }
  }

  // Rating-based action
  if (action === 'hold') { // Only override if not already set
    if (rating.overall >= 70) {
      action = 'buy';
      reasoning.push(`Strong overall rating of ${rating.overall}/100 across all factors.`);
      confidence += 15;
    } else if (rating.overall >= 55) {
      action = userProfile.riskTolerance === 'high' ? 'buy' : 'hold';
      reasoning.push(`Positive rating of ${rating.overall}/100 with some favorable factors.`);
      confidence += 5;
    } else if (rating.overall <= 35) {
      action = 'avoid';
      reasoning.push(`Low rating of ${rating.overall}/100 suggests significant concerns.`);
      riskWarnings.push('Multiple factors indicate elevated risk.');
    }
  }

  // Time horizon considerations
  if (userProfile.timeHorizon === 'short' && prediction.shortTerm.direction.includes('bearish')) {
    riskWarnings.push('Short-term outlook is negative. Consider waiting for a better entry point.');
    if (action === 'buy') action = 'hold';
  }

  if (userProfile.timeHorizon === 'long' && prediction.longTerm.direction.includes('bearish')) {
    riskWarnings.push('Long-term fundamentals show some concerns. Research thoroughly before committing.');
  }

  // Final confidence adjustment
  confidence = Math.max(30, Math.min(85, confidence));

  return {
    action,
    reasoning: reasoning.length > 0 ? reasoning : ['Based on current market conditions and your profile.'],
    riskWarnings,
    alternatives: alternatives.length > 0 ? alternatives : undefined,
    confidence,
    disclaimer: 'This is AI-generated guidance for educational purposes only. It is not personalized financial advice. Always consult with a qualified financial advisor before making investment decisions.',
  };
};
