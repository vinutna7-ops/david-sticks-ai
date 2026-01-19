import React from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import { AppProvider, useApp } from './contexts/AppContext';
import Onboarding from './components/onboarding/Onboarding';
import Navigation from './components/common/Navigation';
import HomeTab from './components/home/HomeTab';
import SearchTab from './components/home/SearchTab';
import AdvisorTab from './components/advisor/AdvisorTab';
import LearnTab from './components/learn/LearnTab';
import ProfileTab from './components/home/ProfileTab';
import StockDetail from './components/stock/StockDetail';
import './index.css';

const AppContent: React.FC = () => {
  const { user, isLoading } = useUser();
  const { currentTab } = useApp();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📈</div>
          <div className="text-xl font-semibold text-primary-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Onboarding for new users
  if (!user || !user.onboardingComplete) {
    return <Onboarding />;
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Tab Content */}
      <main>
        {currentTab === 'home' && <HomeTab />}
        {currentTab === 'search' && <SearchTab />}
        {currentTab === 'advisor' && <AdvisorTab />}
        {currentTab === 'learn' && <LearnTab />}
        {currentTab === 'profile' && <ProfileTab />}
      </main>

      {/* Stock Detail Modal */}
      <StockDetail />

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </UserProvider>
  );
};

export default App;
