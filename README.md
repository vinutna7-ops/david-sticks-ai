# StockAdvisor AI

A modern, mobile-first stock investment app with AI-powered ratings, predictions, and personalized financial guidance designed for young investors (ages 18-30).

## Features

### User Onboarding
- Personalized profile setup collecting:
  - Age range
  - Investing experience (Beginner/Intermediate/Advanced)
  - Risk tolerance (Low/Medium/High)
  - Investment goal (Day trading/Swing trading/Long-term)
  - Time horizon

### Home / Discover Tab
- Market mood indicator with real-time sentiment
- Trending stocks with biggest movers
- Top AI-rated stocks
- High-risk/high-reward opportunities
- Quick access to AI Advisor and Learning

### Stock Detail Screen
Each stock displays:
- Company name, logo, ticker, and sector
- Real-time price with daily change
- Interactive price charts (1D, 1W, 1M, 3M, 1Y, ALL)
- Key statistics (Market Cap, Volume, P/E, Beta, 52-week range, etc.)

### AI Rating System (0-100 Score)
Calculated from:
- **Technical Trend (25%)** - Price momentum, moving averages, RSI
- **Financial Health (20%)** - P/E ratio, earnings, dividends
- **Volatility (20%)** - Beta and price stability
- **Market Sentiment (15%)** - Volume and recent performance
- **Growth Potential (20%)** - Sector outlook and historical growth

Rating Labels:
- 75-100: Strong Buy (Green)
- 60-74: Good Opportunity (Lime)
- 45-59: Neutral (Yellow)
- 30-44: Caution (Orange)
- 0-29: High Risk (Red)

### AI Predictions
- Short-term outlook (1-7 days)
- Medium-term outlook (1-3 months)
- Long-term outlook (1+ year)

Each includes:
- Direction (Bullish/Bearish/Neutral)
- Confidence percentage
- Price target range
- Risk level
- Plain-English explanation

### AI Financial Advisor
Personalized guidance including:
- Stock recommendations based on user profile
- Risk warnings for high-volatility stocks
- Diversification suggestions
- Alternative stock recommendations
- Educational explanations

### Beginner Guide (Learn Tab)

**Investing Basics:**
- What is a stock?
- How the stock market works
- Stocks vs ETFs vs Indexes

**Reading Stock Pages:**
- Understanding prices and charts
- Market cap and volume explained
- Reading stock charts

**Risk & Safety:**
- What risk means
- Understanding volatility
- The power of diversification

**Investment Strategies:**
- Day trading vs Swing trading vs Long-term
- Risk management

### Gamification
- Progress tracking
- Achievement badges
- Day streaks
- Lesson completion tracking

### Risk Disclosures
- Clear disclaimers on all AI-generated content
- Risk warnings for volatile stocks
- Educational purpose statements
- Transparency about rating methodology

## Technical Architecture

### Tech Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Lucide React** for icons
- **LocalStorage** for data persistence

### Project Structure
```
src/
├── components/
│   ├── advisor/     # AI Advisor chat interface
│   ├── common/      # Shared components (Navigation, Cards, etc.)
│   ├── home/        # Home, Search, Profile tabs
│   ├── learn/       # Beginner guide content
│   ├── onboarding/  # User onboarding flow
│   └── stock/       # Stock detail view
├── contexts/        # React Context providers
├── services/        # Business logic
│   ├── stockData.ts     # Mock stock data
│   ├── aiRating.ts      # Rating/prediction algorithms
│   └── learningContent.ts # Educational content
├── types/           # TypeScript definitions
└── App.tsx          # Main application
```

### AI Rating Formula

```typescript
Overall Score =
  (Technical Score × 0.25) +
  (Financial Score × 0.20) +
  (Volatility Score × 0.20) +
  (Sentiment Score × 0.15) +
  (Growth Score × 0.20)
```

### Key Services

**Stock Rating Service (`aiRating.ts`):**
- `calculateStockRating()` - Comprehensive stock analysis
- `generatePrediction()` - AI-powered price predictions
- `generateAdvisorRecommendation()` - Personalized advice

**Learning Service (`learningContent.ts`):**
- Lesson content management
- Quiz system
- Badge tracking
- Progress calculation

## Getting Started

```bash
# Install dependencies
cd stock-advisor
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Disclaimers

**IMPORTANT:** This application provides AI-generated insights for educational purposes only. It is not financial advice.

- Past performance does not guarantee future results
- Always conduct your own research before investing
- Consult a qualified financial advisor for personalized advice
- AI predictions are estimates based on historical data
- Market conditions can change rapidly

## License

MIT License - Built for educational purposes.
