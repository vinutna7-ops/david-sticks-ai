import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  AgeRange,
  ExperienceLevel,
  RiskTolerance,
  InvestmentGoal,
  TimeHorizon,
  Badge,
} from '../types';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  updateUser: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'badges' | 'completedLessons' | 'viewedStocks' | 'streak' | 'lastActive' | 'onboardingComplete'>) => void;
  resetUser: () => void;
  addBadge: (badge: Badge) => void;
  completeLesson: (lessonId: string) => void;
  viewStock: (ticker: string) => void;
  updateStreak: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'stock-advisor-user';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.lastActive = new Date(parsed.lastActive);
        parsed.badges = parsed.badges.map((b: any) => ({
          ...b,
          earnedAt: b.earnedAt ? new Date(b.earnedAt) : undefined,
        }));
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  };

  const completeOnboarding = (profile: Omit<UserProfile, 'id' | 'createdAt' | 'badges' | 'completedLessons' | 'viewedStocks' | 'streak' | 'lastActive' | 'onboardingComplete'>) => {
    const newUser: UserProfile = {
      ...profile,
      id: generateId(),
      createdAt: new Date(),
      lastActive: new Date(),
      badges: [],
      completedLessons: [],
      viewedStocks: [],
      streak: 1,
      onboardingComplete: true,
    };
    setUser(newUser);
  };

  const resetUser = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const addBadge = (badge: Badge) => {
    setUser(prev => {
      if (!prev) return prev;
      if (prev.badges.find(b => b.id === badge.id)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, { ...badge, earnedAt: new Date() }],
      };
    });
  };

  const completeLesson = (lessonId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  };

  const viewStock = (ticker: string) => {
    setUser(prev => {
      if (!prev) return prev;
      if (prev.viewedStocks.includes(ticker)) return prev;
      return {
        ...prev,
        viewedStocks: [...prev.viewedStocks, ticker],
      };
    });
  };

  const updateStreak = () => {
    setUser(prev => {
      if (!prev) return prev;

      const now = new Date();
      const lastActive = new Date(prev.lastActive);
      const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

      let newStreak = prev.streak;
      if (daysDiff === 1) {
        newStreak = prev.streak + 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      }

      return {
        ...prev,
        streak: newStreak,
        lastActive: now,
      };
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        updateUser,
        completeOnboarding,
        resetUser,
        addBadge,
        completeLesson,
        viewStock,
        updateStreak,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
