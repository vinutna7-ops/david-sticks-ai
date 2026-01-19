# StockAdvisor AI

A modern, mobile-first stock investment app with AI-powered ratings, predictions, and personalized financial guidance designed for young investors (ages 18-30).

## Live Demo

**Deployed on Fly.io:** https://david-sticks-ai-abzdzq.fly.dev

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
stock-advisor/
├── src/
│   ├── components/
│   │   ├── advisor/        # AI Advisor chat interface
│   │   ├── common/         # Navigation, StockCard, RatingCircle
│   │   ├── home/           # HomeTab, SearchTab, ProfileTab
│   │   ├── learn/          # LearnTab with lessons
│   │   ├── onboarding/     # User onboarding flow
│   │   └── stock/          # StockDetail view
│   ├── contexts/
│   │   ├── AppContext.tsx  # App state management
│   │   └── UserContext.tsx # User profile management
│   ├── services/
│   │   ├── stockData.ts    # 20 mock stocks with price history
│   │   ├── aiRating.ts     # Rating/prediction algorithms
│   │   └── learningContent.ts # 10+ lessons, badges
│   ├── types/
│   │   └── index.ts        # TypeScript definitions
│   ├── App.tsx             # Main application
│   └── index.css           # Tailwind styles
├── Dockerfile              # For Fly.io deployment
├── fly.toml                # Fly.io configuration
└── package.json
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

### Local Development

```bash
# Navigate to app directory
cd stock-advisor

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Deploy to Fly.io

```bash
cd stock-advisor

# Login to Fly.io
fly auth login

# Deploy
fly deploy

# Open in browser
fly open
```

## Deployment Files

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 8080

CMD ["serve", "-s", "build", "-l", "8080"]
```

### fly.toml
```toml
app = "david-sticks-ai-abzdzq"
primary_region = "iad"

[build]

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  memory = "512mb"
  cpu_kind = "shared"
  cpus = 1
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
