import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, AlertTriangle, TrendingUp, TrendingDown, Info, RefreshCw } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { stockService } from '../../services/stockData';
import { calculateStockRating, generatePrediction, generateAdvisorRecommendation } from '../../services/aiRating';
import { AdvisorMessage } from '../../types';

// AI Advisor response generator
const generateAIResponse = (
  message: string,
  userProfile: any,
  recentContext: string[]
): string => {
  const lowerMessage = message.toLowerCase();

  // Stock-specific queries
  const stockMentions = stockService.getAllStocks().filter(s =>
    lowerMessage.includes(s.ticker.toLowerCase()) ||
    lowerMessage.includes(s.name.toLowerCase())
  );

  if (stockMentions.length > 0) {
    const stock = stockMentions[0];
    const rating = calculateStockRating(stock);
    const prediction = generatePrediction(stock, rating);

    if (lowerMessage.includes('should i buy') || lowerMessage.includes('good investment') || lowerMessage.includes('worth buying')) {
      const rec = generateAdvisorRecommendation(stock, rating, prediction, userProfile);

      let response = `Based on my analysis of ${stock.name} (${stock.ticker}):\n\n`;
      response += `📊 **AI Rating: ${rating.overall}/100** (${rating.label})\n\n`;

      if (rec.action === 'buy') {
        response += `✅ **Recommendation: BUY** (${rec.confidence}% confidence)\n\n`;
      } else if (rec.action === 'hold') {
        response += `⏸️ **Recommendation: HOLD** (${rec.confidence}% confidence)\n\n`;
      } else if (rec.action === 'sell' || rec.action === 'avoid') {
        response += `⚠️ **Recommendation: ${rec.action.toUpperCase()}** (${rec.confidence}% confidence)\n\n`;
      }

      response += `**Why:** ${rec.reasoning.join(' ')}\n\n`;

      if (rec.riskWarnings.length > 0) {
        response += `⚠️ **Risk Warnings:**\n${rec.riskWarnings.map(w => `• ${w}`).join('\n')}\n\n`;
      }

      response += `**For your profile:**\n`;
      response += `• Risk tolerance: ${userProfile.riskTolerance}\n`;
      response += `• Investment style: ${userProfile.investmentGoal.replace('-', ' ')}\n`;
      response += `• Time horizon: ${userProfile.timeHorizon}\n\n`;

      response += `*Remember: This is AI-generated guidance for educational purposes, not financial advice.*`;

      return response;
    }

    if (lowerMessage.includes('predict') || lowerMessage.includes('forecast') || lowerMessage.includes('outlook')) {
      let response = `Here's my outlook for ${stock.name} (${stock.ticker}):\n\n`;

      response += `📈 **Short-term (${prediction.shortTerm.period}):**\n`;
      response += `• Direction: ${prediction.shortTerm.direction.replace('-', ' ')} (${prediction.shortTerm.confidence}% confidence)\n`;
      response += `• Target range: $${prediction.shortTerm.priceTarget.low} - $${prediction.shortTerm.priceTarget.high}\n\n`;

      response += `📊 **Medium-term (${prediction.mediumTerm.period}):**\n`;
      response += `• Direction: ${prediction.mediumTerm.direction.replace('-', ' ')} (${prediction.mediumTerm.confidence}% confidence)\n`;
      response += `• Target range: $${prediction.mediumTerm.priceTarget.low} - $${prediction.mediumTerm.priceTarget.high}\n\n`;

      response += `🎯 **Long-term (${prediction.longTerm.period}):**\n`;
      response += `• Direction: ${prediction.longTerm.direction.replace('-', ' ')} (${prediction.longTerm.confidence}% confidence)\n`;
      response += `• Target range: $${prediction.longTerm.priceTarget.low} - $${prediction.longTerm.priceTarget.high}\n\n`;

      response += `💡 ${prediction.aiInsight}\n\n`;
      response += `*${prediction.disclaimer}*`;

      return response;
    }

    // General info about stock
    let response = `Here's what I know about ${stock.name} (${stock.ticker}):\n\n`;
    response += `💰 **Current Price:** $${stock.price.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}% today)\n`;
    response += `📊 **AI Rating:** ${rating.overall}/100 (${rating.label})\n`;
    response += `🏢 **Sector:** ${stock.sector}\n`;
    response += `💵 **Market Cap:** ${stockService.formatMarketCap(stock.marketCap)}\n`;
    response += `📈 **Beta:** ${stock.beta.toFixed(2)} (${stock.beta > 1.5 ? 'High volatility' : stock.beta > 1 ? 'Moderate volatility' : 'Low volatility'})\n\n`;
    response += `${stock.description}\n\n`;
    response += `Would you like me to provide predictions or a buy/hold recommendation for this stock?`;

    return response;
  }

  // General investing questions
  if (lowerMessage.includes('diversif')) {
    return `Great question about diversification! 📊\n\nDiversification is one of the most important risk management strategies. Here's what I recommend based on your ${userProfile.riskTolerance} risk tolerance:\n\n**Key principles:**\n• Don't put more than 5-10% in any single stock\n• Spread across different sectors (tech, healthcare, finance, etc.)\n• Consider ETFs like SPY or VTI for instant diversification\n• Mix growth stocks with stable dividend payers\n\n**For your profile (${userProfile.investmentGoal.replace('-', ' ')}):**\n${userProfile.riskTolerance === 'low'
      ? '• Focus on 70% stable large-caps, 20% ETFs, 10% growth stocks'
      : userProfile.riskTolerance === 'medium'
      ? '• Balance with 50% stable stocks, 30% growth, 20% ETFs'
      : '• Can go 40% growth, 40% individual stocks, 20% speculative'}\n\nWould you like specific stock suggestions for diversification?`;
  }

  if (lowerMessage.includes('beginner') || lowerMessage.includes('start') || lowerMessage.includes('new to')) {
    return `Welcome to investing! 🎉 I'm excited to help you get started.\n\nHere are my top tips for beginners:\n\n**1. Start simple**\n• Consider broad market ETFs like SPY (S&P 500) or VTI (Total Stock Market)\n• These give you instant diversification with one purchase\n\n**2. Invest regularly**\n• Set up automatic investments (dollar-cost averaging)\n• This removes emotion from the equation\n\n**3. Think long-term**\n• Don't panic during market dips\n• Historically, markets recover and grow over time\n\n**4. Learn as you go**\n• Check out our Learn tab for investing basics\n• Start with small amounts while you're learning\n\n**Based on your profile:**\nSince you're a ${userProfile.experience} investor with ${userProfile.riskTolerance} risk tolerance, I'd suggest starting with blue-chip stocks like AAPL, MSFT, or broad ETFs.\n\nWhat would you like to learn more about?`;
  }

  if (lowerMessage.includes('risk') && (lowerMessage.includes('my') || lowerMessage.includes('profile'))) {
    return `Let me analyze your risk profile! 📋\n\n**Your Settings:**\n• Risk Tolerance: ${userProfile.riskTolerance.charAt(0).toUpperCase() + userProfile.riskTolerance.slice(1)}\n• Investment Style: ${userProfile.investmentGoal.replace('-', ' ')}\n• Time Horizon: ${userProfile.timeHorizon}\n• Experience: ${userProfile.experience}\n\n**What this means:**\n${userProfile.riskTolerance === 'low'
      ? '• You prefer stability over high returns\n• Stick to established companies and ETFs\n• Avoid highly volatile stocks (beta > 1.5)'
      : userProfile.riskTolerance === 'medium'
      ? '• You can handle some volatility\n• Mix stable and growth stocks\n• Consider some exposure to emerging sectors'
      : '• You\'re comfortable with volatility\n• Can pursue higher-risk opportunities\n• Still maintain some stable positions'}\n\n**My recommendation:**\nBased on your profile, I'd suggest looking at stocks with beta ${userProfile.riskTolerance === 'low' ? 'below 1.0' : userProfile.riskTolerance === 'medium' ? 'between 0.8 and 1.5' : 'up to 2.0 or higher for growth picks'}.\n\nWant me to suggest specific stocks that match your profile?`;
  }

  if (lowerMessage.includes('market') && (lowerMessage.includes('today') || lowerMessage.includes('now'))) {
    const topMovers = stockService.getTrendingStocks().slice(0, 3);
    return `Here's what's happening in the market today! 📈\n\n**Top Movers:**\n${topMovers.map(s => `• ${s.ticker}: $${s.price.toFixed(2)} (${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%)`).join('\n')}\n\n**Quick Analysis:**\nThe market is showing ${topMovers.filter(s => s.changePercent > 0).length > topMovers.length / 2 ? 'bullish' : topMovers.filter(s => s.changePercent < 0).length > topMovers.length / 2 ? 'bearish' : 'mixed'} sentiment today.\n\nWould you like me to analyze any specific stock or sector?`;
  }

  if (lowerMessage.includes('suggest') || lowerMessage.includes('recommend') || lowerMessage.includes('what should')) {
    const allStocks = stockService.getAllStocks();
    const ratings = allStocks.map(s => ({
      stock: s,
      rating: calculateStockRating(s)
    }));

    // Filter based on user profile
    let filtered = ratings;
    if (userProfile.riskTolerance === 'low') {
      filtered = ratings.filter(r => r.stock.beta < 1.2 && r.rating.overall >= 55);
    } else if (userProfile.riskTolerance === 'medium') {
      filtered = ratings.filter(r => r.stock.beta < 1.8 && r.rating.overall >= 50);
    }

    const topPicks = filtered.sort((a, b) => b.rating.overall - a.rating.overall).slice(0, 3);

    return `Based on your ${userProfile.riskTolerance} risk tolerance and ${userProfile.investmentGoal.replace('-', ' ')} style, here are my top suggestions:\n\n${topPicks.map((p, i) => `**${i + 1}. ${p.stock.name} (${p.stock.ticker})**\n   • Price: $${p.stock.price.toFixed(2)}\n   • AI Rating: ${p.rating.overall}/100 (${p.rating.label})\n   • Beta: ${p.stock.beta.toFixed(2)}\n   • Why: ${p.rating.explanation}`).join('\n\n')}\n\n📌 *These suggestions are tailored to your profile. Always do your own research before investing.*\n\nWould you like detailed analysis on any of these?`;
  }

  // Default helpful response
  const suggestions = [
    'ask about a specific stock (e.g., "Tell me about AAPL")',
    'get buy/sell recommendations (e.g., "Should I buy NVDA?")',
    'request predictions (e.g., "What\'s the outlook for MSFT?")',
    'ask about diversification strategies',
    'get personalized stock suggestions',
    'learn about risk management',
  ];

  return `I'm your AI Financial Advisor! 🤖\n\nI can help you with:\n${suggestions.map(s => `• ${s.charAt(0).toUpperCase() + s.slice(1)}`).join('\n')}\n\n**Quick tip for ${userProfile.name}:**\nBased on your ${userProfile.experience} experience level and ${userProfile.riskTolerance} risk tolerance, I'll tailor my advice to match your investing style.\n\nWhat would you like to know?`;
};

const AdvisorTab: React.FC = () => {
  const { user, addBadge } = useUser();
  const { openStockDetail } = useApp();
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message on first load
    if (messages.length === 0 && user) {
      const welcomeMessage: AdvisorMessage = {
        id: 'welcome',
        type: 'advisor',
        content: `Hey ${user.name}! 👋 I'm your AI Financial Advisor.\n\nI'm here to help you make informed investment decisions based on your profile:\n• Risk Tolerance: ${user.riskTolerance}\n• Investment Style: ${user.investmentGoal.replace('-', ' ')}\n• Time Horizon: ${user.timeHorizon}\n\nAsk me about any stock, get personalized recommendations, or learn about investing strategies. What would you like to explore today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);

      // Award badge for first advisor interaction
      addBadge({
        id: 'advisor-chat',
        name: 'Advice Seeker',
        description: 'Had your first conversation with AI Advisor',
        icon: '💬',
        category: 'activity',
      });
    }
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage: AdvisorMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const recentContext = messages.slice(-5).map(m => m.content);
    const aiResponse = generateAIResponse(input, user, recentContext);

    const advisorMessage: AdvisorMessage = {
      id: (Date.now() + 1).toString(),
      type: 'advisor',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, advisorMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What stocks match my profile?",
    "Should I buy NVDA?",
    "Explain diversification",
    "What's moving today?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/20 rounded-xl">
            <Bot className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg">AI Financial Advisor</h1>
            <p className="text-sm text-gray-400">Personalized guidance based on your profile</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-primary-500' : 'bg-gray-700'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-primary-500 text-white rounded-tr-none'
                  : 'bg-gray-800 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content.split('\n').map((line, i) => {
                    // Handle bold text
                    const parts = line.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {parts.map((part, j) => (
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        ))}
                      </p>
                    );
                  })}
                </div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-primary-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3">
              <div className="flex gap-1">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(q);
                  inputRef.current?.focus();
                }}
                className="flex-shrink-0 px-3 py-1.5 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about investing..."
            className="input flex-1"
            disabled={isTyping}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="btn-primary px-4"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <AlertTriangle className="w-3 h-3" />
          <span>AI-generated content for educational purposes only. Not financial advice.</span>
        </div>
      </div>
    </div>
  );
};

export default AdvisorTab;
