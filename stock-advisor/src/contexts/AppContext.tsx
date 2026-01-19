import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppTab, MarketMood } from '../types';
import { calculateMarketMood } from '../services/learningContent';

interface AppContextType {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  selectedStock: string | null;
  setSelectedStock: (ticker: string | null) => void;
  marketMood: MarketMood;
  refreshMarketMood: () => void;
  showStockDetail: boolean;
  openStockDetail: (ticker: string) => void;
  closeStockDetail: () => void;
  showDisclaimer: boolean;
  setShowDisclaimer: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [marketMood, setMarketMood] = useState<MarketMood>(calculateMarketMood());
  const [showStockDetail, setShowStockDetail] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const refreshMarketMood = () => {
    setMarketMood(calculateMarketMood());
  };

  const openStockDetail = (ticker: string) => {
    setSelectedStock(ticker);
    setShowStockDetail(true);
  };

  const closeStockDetail = () => {
    setShowStockDetail(false);
    setTimeout(() => setSelectedStock(null), 300);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedStock,
        setSelectedStock,
        marketMood,
        refreshMarketMood,
        showStockDetail,
        openStockDetail,
        closeStockDetail,
        showDisclaimer,
        setShowDisclaimer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
