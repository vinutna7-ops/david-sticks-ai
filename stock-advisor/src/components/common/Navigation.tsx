import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, MessageSquare, BookOpen, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppTab } from '../../types';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'advisor', label: 'Advisor', icon: MessageSquare },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: User },
];

const Navigation: React.FC = () => {
  const { currentTab, setCurrentTab, closeStockDetail } = useApp();

  const handleTabClick = (tab: AppTab) => {
    closeStockDetail();
    setCurrentTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 px-2 pb-safe z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTabClick(item.id)}
              className={`relative flex flex-col items-center py-2 px-4 ${
                isActive ? 'text-primary-400' : 'text-gray-500'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 w-12 h-1 bg-primary-500 rounded-full"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                />
              )}
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
