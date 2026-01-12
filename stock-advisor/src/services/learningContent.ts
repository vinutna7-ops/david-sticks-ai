import { Lesson, Badge, MarketMood } from '../types';

// Comprehensive learning content for beginners
export const lessons: Lesson[] = [
  // BASICS CATEGORY
  {
    id: 'what-is-stock',
    title: 'What is a Stock?',
    description: 'Learn what stocks are and why companies sell them',
    category: 'basics',
    difficulty: 'easy',
    duration: 5,
    content: [
      {
        type: 'text',
        content: 'A stock represents a tiny piece of ownership in a company. When you buy a stock, you become a "shareholder" - you literally own a share of that company!',
      },
      {
        type: 'example',
        title: 'Real World Example',
        content: 'Imagine Apple is a pizza with 1 billion slices. Each slice is one share of stock. If you buy 100 shares, you own 100 slices of that pizza. As Apple grows and makes more money, each slice becomes more valuable!',
      },
      {
        type: 'tip',
        title: 'Why Companies Sell Stock',
        content: 'Companies sell stocks to raise money without taking on debt. Instead of borrowing from a bank, they sell pieces of ownership. This money helps them grow, hire employees, and build new products.',
      },
      {
        type: 'text',
        content: 'As a shareholder, you can make money in two ways:\n\n1. **Price Appreciation**: If the stock price goes up, your shares are worth more\n2. **Dividends**: Some companies share profits with shareholders through regular payments',
      },
      {
        type: 'warning',
        title: 'Important',
        content: 'Stock prices can go down too! If a company struggles, your investment could lose value. That\'s why understanding risk is so important.',
      },
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What does owning a stock mean?',
          options: [
            'You loaned money to the company',
            'You own a piece of the company',
            'You work for the company',
            'You owe money to the company',
          ],
          correctIndex: 1,
          explanation: 'Correct! A stock represents ownership. When you buy shares, you literally own a small piece of that company.',
        },
        {
          id: 'q2',
          question: 'How can stockholders make money?',
          options: [
            'Only through dividends',
            'Only when the stock price goes up',
            'Through price appreciation and dividends',
            'By working for the company',
          ],
          correctIndex: 2,
          explanation: 'Shareholders can profit from both rising stock prices (capital gains) and dividend payments.',
        },
      ],
      passingScore: 50,
    },
    badge: {
      id: 'first-lesson',
      name: 'First Steps',
      description: 'Completed your first investing lesson',
      icon: '🎓',
      category: 'learning',
    },
  },
  {
    id: 'stock-market-basics',
    title: 'The Stock Market Explained',
    description: 'Understand how the stock market works',
    category: 'basics',
    difficulty: 'easy',
    duration: 7,
    content: [
      {
        type: 'text',
        content: 'The stock market is like a giant marketplace where people buy and sell stocks. Just like a farmers market where people trade vegetables, the stock market is where people trade ownership in companies.',
      },
      {
        type: 'example',
        title: 'Major Stock Exchanges',
        content: '**NYSE (New York Stock Exchange)**: The largest in the world, located on Wall Street. Known for big, established companies.\n\n**NASDAQ**: Known for tech companies like Apple, Microsoft, and Google.\n\n**These exchanges match buyers with sellers** millions of times per second!',
      },
      {
        type: 'text',
        content: '**How Prices Are Set**\n\nStock prices are determined by supply and demand:\n\n- **More buyers than sellers** → Price goes UP\n- **More sellers than buyers** → Price goes DOWN\n\nThis happens continuously during market hours (9:30 AM - 4:00 PM ET on weekdays).',
      },
      {
        type: 'tip',
        title: 'Market Hours',
        content: 'The US stock market is open Monday-Friday, 9:30 AM to 4:00 PM Eastern Time. It\'s closed on weekends and major holidays. Some brokers offer "extended hours" trading, but it can be riskier.',
      },
      {
        type: 'interactive',
        title: 'Think About It',
        content: 'When you hear "the market is up today," it usually refers to major indexes like the S&P 500 or Dow Jones. These track the performance of groups of stocks and give us a snapshot of how the overall market is doing.',
      },
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What happens when more people want to buy a stock than sell it?',
          options: [
            'The price stays the same',
            'The price goes down',
            'The price goes up',
            'The stock is removed from the market',
          ],
          correctIndex: 2,
          explanation: 'When demand exceeds supply, prices rise. This is basic economics at work in the stock market.',
        },
      ],
      passingScore: 100,
    },
  },
  {
    id: 'stocks-etfs-indexes',
    title: 'Stocks vs ETFs vs Indexes',
    description: 'Learn the difference between these investment types',
    category: 'basics',
    difficulty: 'easy',
    duration: 8,
    content: [
      {
        type: 'text',
        content: 'Not all investments are the same. Let\'s break down three common types you\'ll encounter:',
      },
      {
        type: 'text',
        title: '📈 Individual Stocks',
        content: '**What**: Shares of a single company\n**Example**: Buying Apple (AAPL) stock\n**Risk**: Higher - your money depends on one company\n**Reward**: Can be very high if you pick winners\n**Best for**: People who research and believe in specific companies',
      },
      {
        type: 'text',
        title: '📊 ETFs (Exchange-Traded Funds)',
        content: '**What**: A basket of stocks bundled together\n**Example**: SPY holds 500 different companies\n**Risk**: Lower - diversification spreads risk\n**Reward**: Generally follows market averages\n**Best for**: Beginners and people who want simplicity',
      },
      {
        type: 'text',
        title: '📉 Index',
        content: '**What**: A measurement tool that tracks a group of stocks\n**Example**: S&P 500, Dow Jones, NASDAQ\n**Note**: You can\'t buy an index directly - but you can buy ETFs that track them!\n**Purpose**: Shows how a market segment is performing',
      },
      {
        type: 'example',
        title: 'Pizza Analogy',
        content: '🍕 **Stock** = Buying one slice of pepperoni pizza\n🍕 **ETF** = Buying a variety pack with slices from many different pizzas\n🍕 **Index** = A list ranking the best pizzas in town (you can\'t eat the list!)',
      },
      {
        type: 'tip',
        title: 'Beginner Tip',
        content: 'Many financial experts recommend beginners start with broad market ETFs like VTI or SPY. You get instant diversification and don\'t need to research individual companies!',
      },
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'Which investment type gives you instant diversification?',
          options: [
            'Individual stock',
            'ETF',
            'Index',
            'None of the above',
          ],
          correctIndex: 1,
          explanation: 'ETFs hold many stocks in one investment, automatically spreading your risk across multiple companies.',
        },
        {
          id: 'q2',
          question: 'Can you directly buy an index?',
          options: [
            'Yes, through any broker',
            'No, but you can buy ETFs that track indexes',
            'Only during market hours',
            'Only if you have $10,000 minimum',
          ],
          correctIndex: 1,
          explanation: 'Indexes are measurements, not actual investments. ETFs that track indexes let you essentially "buy" index performance.',
        },
      ],
      passingScore: 50,
    },
  },

  // READING STOCKS CATEGORY
  {
    id: 'reading-stock-price',
    title: 'Understanding Stock Prices',
    description: 'Learn how to read and interpret stock prices',
    category: 'reading-stocks',
    difficulty: 'easy',
    duration: 6,
    content: [
      {
        type: 'text',
        content: 'When you look at a stock, you\'ll see lots of numbers. Let\'s decode the most important ones!',
      },
      {
        type: 'text',
        title: '💰 Current Price',
        content: 'This is what the stock costs RIGHT NOW. It changes constantly during market hours as people buy and sell.',
      },
      {
        type: 'text',
        title: '📊 Daily Change',
        content: 'Shows how much the price moved today:\n- **Green/+** means the stock went UP\n- **Red/-** means the stock went DOWN\n\nYou\'ll see both dollar amount (+$2.50) and percentage (+1.5%).',
      },
      {
        type: 'text',
        title: '📈 Previous Close',
        content: 'The price when the market closed yesterday. This is what today\'s change is measured against.',
      },
      {
        type: 'example',
        title: 'Reading Example',
        content: '**AAPL: $175.00** (+$3.00, +1.74%)\n\nThis tells us:\n- Apple stock costs $175.00 per share\n- It\'s up $3.00 from yesterday\n- That\'s a 1.74% increase\n- Yesterday it closed at $172.00',
      },
      {
        type: 'tip',
        title: 'Don\'t Panic!',
        content: 'Daily changes can feel dramatic, but they\'re normal. A 2% move might seem big, but over a year, markets typically fluctuate much more. Focus on long-term trends, not daily noise.',
      },
    ],
  },
  {
    id: 'market-cap-volume',
    title: 'Market Cap & Volume',
    description: 'Understand company size and trading activity',
    category: 'reading-stocks',
    difficulty: 'medium',
    duration: 8,
    content: [
      {
        type: 'text',
        title: '🏢 Market Capitalization (Market Cap)',
        content: 'Market cap tells you how much the entire company is worth on the stock market.\n\n**Formula**: Stock Price × Total Shares = Market Cap\n\nThis is the primary way to measure company size.',
      },
      {
        type: 'example',
        title: 'Market Cap Categories',
        content: '**Mega Cap**: $200B+ (Apple, Microsoft, Google)\n- Very stable, slower growth, lower risk\n\n**Large Cap**: $10B-$200B (Most well-known companies)\n- Established, generally stable\n\n**Mid Cap**: $2B-$10B\n- Growing companies, moderate risk\n\n**Small Cap**: Under $2B\n- Higher growth potential, higher risk',
      },
      {
        type: 'text',
        title: '📊 Volume',
        content: '**Volume** = How many shares were traded today\n\nThink of it as the stock\'s "activity level."\n\n**High volume**: Lots of interest, easy to buy/sell\n**Low volume**: Less interest, might be harder to trade',
      },
      {
        type: 'tip',
        title: 'Why Volume Matters',
        content: 'Volume with price movement tells a story:\n\n- Price UP + High Volume = Strong buying interest (bullish)\n- Price DOWN + High Volume = Strong selling pressure (bearish)\n- Price UP + Low Volume = Move might not last',
      },
      {
        type: 'warning',
        title: 'Watch Out',
        content: 'Very low volume stocks can be risky - you might have trouble selling when you want to, or the price might swing wildly on small trades.',
      },
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'A company has a stock price of $50 and 1 billion shares. What\'s its market cap?',
          options: [
            '$50 million',
            '$500 million',
            '$50 billion',
            '$5 billion',
          ],
          correctIndex: 2,
          explanation: '$50 × 1,000,000,000 = $50,000,000,000 = $50 billion',
        },
      ],
      passingScore: 100,
    },
  },
  {
    id: 'understanding-charts',
    title: 'Reading Stock Charts',
    description: 'Learn to interpret price charts and trends',
    category: 'reading-stocks',
    difficulty: 'medium',
    duration: 10,
    content: [
      {
        type: 'text',
        content: 'Stock charts show price history over time. They\'re like a story of what happened to a stock\'s price. Let\'s learn to read them!',
      },
      {
        type: 'text',
        title: '📈 Line Charts',
        content: 'The simplest type - just a line connecting closing prices over time. Great for seeing the overall trend at a glance.',
      },
      {
        type: 'text',
        title: '🕯️ Candlestick Charts',
        content: 'More detailed view showing:\n- **Open**: Price at start of period\n- **Close**: Price at end of period\n- **High**: Highest price during period\n- **Low**: Lowest price during period\n\n**Green candle**: Price went UP (closed higher than opened)\n**Red candle**: Price went DOWN (closed lower than opened)',
      },
      {
        type: 'text',
        title: '📊 Time Frames',
        content: '**1D (1 Day)**: See today\'s price movement minute by minute\n**1W (1 Week)**: Short-term trends\n**1M (1 Month)**: Recent performance\n**1Y (1 Year)**: Medium-term picture\n**5Y (5 Years)**: Long-term trend\n**Max**: Full history',
      },
      {
        type: 'tip',
        title: 'Trend Reading',
        content: '**Uptrend**: Higher highs and higher lows (stairs going up)\n**Downtrend**: Lower highs and lower lows (stairs going down)\n**Sideways**: Price bouncing in a range (flat stairs)',
      },
      {
        type: 'warning',
        title: 'Remember',
        content: 'Charts show the past, not the future. A stock going up doesn\'t guarantee it will keep going up. Use charts as one tool, not the only tool.',
      },
    ],
  },

  // RISK & SAFETY CATEGORY
  {
    id: 'understanding-risk',
    title: 'What is Investment Risk?',
    description: 'Learn what risk means and why it matters',
    category: 'risk-safety',
    difficulty: 'easy',
    duration: 7,
    content: [
      {
        type: 'text',
        content: 'In investing, **risk** means the chance that your investment could lose value. It\'s not about danger - it\'s about uncertainty.',
      },
      {
        type: 'example',
        title: 'The Road Analogy',
        content: 'Think of volatility like a road:\n\n🛣️ **Low Risk Stock**: A smooth highway - steady, predictable, fewer surprises\n\n🎢 **High Risk Stock**: A roller coaster - exciting ups and downs, sometimes scary drops\n\nBoth can get you to your destination, but the ride feels very different!',
      },
      {
        type: 'text',
        title: 'Types of Risk',
        content: '**Market Risk**: The whole market goes down (like in a recession)\n\n**Company Risk**: One specific company has problems\n\n**Volatility Risk**: Big price swings can force you to sell at bad times\n\n**Inflation Risk**: Your returns don\'t beat inflation',
      },
      {
        type: 'text',
        title: 'Risk vs Reward',
        content: 'Here\'s the key rule:\n\n**Higher risk = Potential for higher returns (and bigger losses)**\n**Lower risk = More stable, but usually smaller returns**\n\nThere\'s no free lunch - you can\'t get high returns without accepting some risk.',
      },
      {
        type: 'tip',
        title: 'Know Yourself',
        content: 'Your risk tolerance depends on:\n- How long until you need the money\n- How you\'d feel if your portfolio dropped 20%\n- Your financial situation\n- Your investing experience',
      },
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'Generally, higher potential returns come with:',
          options: [
            'Lower risk',
            'Higher risk',
            'No risk',
            'Risk doesn\'t affect returns',
          ],
          correctIndex: 1,
          explanation: 'The risk-reward relationship is fundamental: higher potential returns usually mean accepting more risk.',
        },
      ],
      passingScore: 100,
    },
  },
  {
    id: 'volatility-explained',
    title: 'Understanding Volatility',
    description: 'Learn what makes stocks move up and down',
    category: 'risk-safety',
    difficulty: 'medium',
    duration: 8,
    content: [
      {
        type: 'text',
        content: '**Volatility** measures how much a stock\'s price jumps around. A stock that swings from $100 to $120 to $95 in a week is highly volatile.',
      },
      {
        type: 'text',
        title: '📊 Beta: The Volatility Measure',
        content: '**Beta** compares a stock\'s volatility to the overall market:\n\n- **Beta = 1.0**: Moves with the market\n- **Beta > 1.0**: More volatile than market (NVDA: ~1.7)\n- **Beta < 1.0**: Less volatile than market (JNJ: ~0.5)\n- **Beta = 0**: No correlation to market',
      },
      {
        type: 'example',
        title: 'What This Means',
        content: 'If the market goes up 10%:\n\n- Stock with beta 1.5 might go up ~15%\n- Stock with beta 0.5 might go up ~5%\n\nBut in a 10% downturn:\n- That beta 1.5 stock might fall ~15%\n- The beta 0.5 stock might only fall ~5%',
      },
      {
        type: 'text',
        title: 'Why Stocks Are Volatile',
        content: '- **Earnings reports** - Did the company beat or miss expectations?\n- **News** - Product launches, lawsuits, management changes\n- **Economic data** - Interest rates, inflation, employment\n- **Investor sentiment** - Fear and greed move markets\n- **Supply and demand** - More buyers or sellers?',
      },
      {
        type: 'tip',
        title: 'Using Volatility',
        content: 'Low volatility isn\'t always better! It depends on your goals:\n\n- **Long-term investors**: Can tolerate higher volatility\n- **Near retirement**: Usually prefer lower volatility\n- **Day traders**: Often seek high volatility for quick profits',
      },
    ],
  },
  {
    id: 'diversification',
    title: 'The Power of Diversification',
    description: 'Don\'t put all your eggs in one basket',
    category: 'risk-safety',
    difficulty: 'easy',
    duration: 8,
    content: [
      {
        type: 'text',
        content: '**Diversification** means spreading your investments across different assets. It\'s one of the most important risk management tools!',
      },
      {
        type: 'example',
        title: 'The Egg Basket',
        content: '🥚 Imagine you have 10 eggs and 1 basket. If you drop the basket, you lose all 10 eggs.\n\n🥚🥚🥚 But if you use 10 baskets with 1 egg each, dropping one basket only loses 1 egg!\n\nThis is diversification. Don\'t put all your money in one stock!',
      },
      {
        type: 'text',
        title: 'How to Diversify',
        content: '**Across Stocks**: Own 15-30 different companies minimum\n\n**Across Sectors**: Tech, Healthcare, Finance, Consumer, etc.\n\n**Across Sizes**: Large-cap, mid-cap, small-cap\n\n**Across Geography**: US, International, Emerging markets\n\n**Across Asset Types**: Stocks, bonds, real estate',
      },
      {
        type: 'tip',
        title: 'Easy Diversification',
        content: 'Don\'t want to research 30 stocks? One ETF like VTI instantly gives you exposure to the entire US stock market - thousands of companies in one investment!',
      },
      {
        type: 'warning',
        title: 'Common Mistake',
        content: 'Owning 5 tech stocks isn\'t diversified! If the tech sector drops, all 5 might fall together. True diversification means owning assets that don\'t all move the same way.',
      },
      {
        type: 'text',
        title: 'The Math of Diversification',
        content: 'If you own 1 stock and it drops 50%, you lose 50%.\n\nIf you own 10 stocks equally and one drops 50%, you only lose 5% overall (assuming others stay flat).\n\nDiversification doesn\'t prevent losses, but it limits the damage any single investment can do.',
      },
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'Which portfolio is better diversified?',
          options: [
            '5 tech stocks',
            '20 stocks across different sectors',
            '1 ETF that tracks S&P 500',
            'Both B and C are well diversified',
          ],
          correctIndex: 3,
          explanation: 'Both 20 stocks across sectors and a broad market ETF provide good diversification. The 5 tech stocks are concentrated in one sector.',
        },
      ],
      passingScore: 100,
    },
    badge: {
      id: 'risk-aware',
      name: 'Risk Aware',
      description: 'Completed risk & safety fundamentals',
      icon: '🛡️',
      category: 'learning',
    },
  },

  // STRATEGIES CATEGORY
  {
    id: 'investment-styles',
    title: 'Investment Styles Explained',
    description: 'Learn about different approaches to investing',
    category: 'strategies',
    difficulty: 'medium',
    duration: 10,
    content: [
      {
        type: 'text',
        content: 'There\'s no one "right" way to invest. Different styles work for different people. Let\'s explore the main approaches:',
      },
      {
        type: 'text',
        title: '🏃 Day Trading',
        content: '**What**: Buying and selling within the same day\n**Timeframe**: Minutes to hours\n**Goal**: Profit from small price movements\n**Risk**: Very high - most day traders lose money\n**Best for**: Full-time traders with experience',
      },
      {
        type: 'text',
        title: '🏄 Swing Trading',
        content: '**What**: Holding for days to weeks\n**Timeframe**: Days to a few weeks\n**Goal**: Capture medium-term price swings\n**Risk**: High - requires timing skills\n**Best for**: Active investors who can monitor positions',
      },
      {
        type: 'text',
        title: '🏠 Long-Term Investing',
        content: '**What**: Buy and hold for years\n**Timeframe**: Years to decades\n**Goal**: Benefit from long-term growth\n**Risk**: Lower - time smooths out volatility\n**Best for**: Most people, especially beginners',
      },
      {
        type: 'tip',
        title: 'Beginner Recommendation',
        content: 'For most beginners, **long-term investing** is the way to go:\n\n✅ Less stressful\n✅ Lower trading costs\n✅ Better tax treatment\n✅ Historically proven to work\n✅ Doesn\'t require daily attention',
      },
      {
        type: 'warning',
        title: 'Day Trading Reality',
        content: 'Studies show 70-90% of day traders lose money. It requires significant time, knowledge, and emotional control. If you\'re starting out, focus on long-term investing first.',
      },
    ],
  },
];

// Predefined badges
export const allBadges: Badge[] = [
  {
    id: 'first-lesson',
    name: 'First Steps',
    description: 'Completed your first investing lesson',
    icon: '🎓',
    category: 'learning',
  },
  {
    id: 'basics-complete',
    name: 'Basics Master',
    description: 'Completed all basic lessons',
    icon: '📚',
    category: 'learning',
  },
  {
    id: 'risk-aware',
    name: 'Risk Aware',
    description: 'Completed risk & safety fundamentals',
    icon: '🛡️',
    category: 'learning',
  },
  {
    id: 'first-stock',
    name: 'First Look',
    description: 'Viewed your first stock details',
    icon: '👀',
    category: 'activity',
  },
  {
    id: 'ten-stocks',
    name: 'Explorer',
    description: 'Viewed 10 different stocks',
    icon: '🔍',
    category: 'activity',
  },
  {
    id: 'advisor-chat',
    name: 'Advice Seeker',
    description: 'Had your first conversation with AI Advisor',
    icon: '💬',
    category: 'activity',
  },
  {
    id: 'streak-3',
    name: 'Consistent',
    description: 'Used the app 3 days in a row',
    icon: '🔥',
    category: 'achievement',
  },
  {
    id: 'streak-7',
    name: 'Dedicated',
    description: 'Used the app 7 days in a row',
    icon: '⭐',
    category: 'achievement',
  },
  {
    id: 'quiz-ace',
    name: 'Quiz Ace',
    description: 'Got 100% on a quiz',
    icon: '🏆',
    category: 'achievement',
  },
  {
    id: 'all-lessons',
    name: 'Scholar',
    description: 'Completed all available lessons',
    icon: '🎖️',
    category: 'achievement',
  },
];

// Market mood calculation
export const calculateMarketMood = (): MarketMood => {
  // Simulated market indicators (in a real app, these would come from market data)
  const sp500Change = Math.random() * 4 - 1.5; // -1.5 to +2.5%
  const vix = 15 + Math.random() * 20; // 15-35
  const advanceDecline = Math.random() * 2 - 0.3; // -0.3 to +1.7
  const newHighsLows = Math.random() * 200 - 50; // -50 to +150

  // Calculate overall score (-100 to +100)
  let score = 0;
  score += sp500Change * 15; // Weight: 15 per percentage point
  score += (25 - vix) * 2; // VIX below 25 is good
  score += advanceDecline * 20;
  score += newHighsLows * 0.1;

  score = Math.max(-100, Math.min(100, score));

  const overall = score > 30 ? 'bullish' : score < -30 ? 'bearish' : 'neutral';

  const summaries = {
    bullish: 'Markets are showing positive momentum with strong buying interest. Investor confidence is high.',
    neutral: 'Markets are trading mixed with no clear direction. Investors are cautious but not fearful.',
    bearish: 'Markets are under pressure with selling outpacing buying. Caution is advisable.',
  };

  return {
    overall,
    score: Math.round(score),
    indicators: {
      sp500Change: Number(sp500Change.toFixed(2)),
      vix: Number(vix.toFixed(1)),
      advanceDecline: Number(advanceDecline.toFixed(2)),
      newHighsLows: Math.round(newHighsLows),
    },
    summary: summaries[overall],
  };
};

// Learning service
export const learningService = {
  getAllLessons: () => lessons,

  getLessonById: (id: string) => lessons.find(l => l.id === id),

  getLessonsByCategory: (category: string) =>
    lessons.filter(l => l.category === category),

  getNextLesson: (completedIds: string[]) =>
    lessons.find(l => !completedIds.includes(l.id)),

  calculateProgress: (completedIds: string[]) => ({
    completed: completedIds.length,
    total: lessons.length,
    percentage: Math.round((completedIds.length / lessons.length) * 100),
  }),

  getAllBadges: () => allBadges,

  getEarnedBadges: (badgeIds: string[]) =>
    allBadges.filter(b => badgeIds.includes(b.id)),

  checkBadgeEligibility: (
    completedLessons: string[],
    viewedStocks: string[],
    streak: number,
    quizScores: Record<string, number>
  ) => {
    const eligible: string[] = [];

    if (completedLessons.length >= 1 && !completedLessons.includes('first-lesson-badge')) {
      eligible.push('first-lesson');
    }

    const basicLessons = lessons.filter(l => l.category === 'basics');
    if (basicLessons.every(l => completedLessons.includes(l.id))) {
      eligible.push('basics-complete');
    }

    if (viewedStocks.length >= 1) eligible.push('first-stock');
    if (viewedStocks.length >= 10) eligible.push('ten-stocks');

    if (streak >= 3) eligible.push('streak-3');
    if (streak >= 7) eligible.push('streak-7');

    if (Object.values(quizScores).some(score => score === 100)) {
      eligible.push('quiz-ace');
    }

    if (completedLessons.length === lessons.length) {
      eligible.push('all-lessons');
    }

    return eligible;
  },
};
