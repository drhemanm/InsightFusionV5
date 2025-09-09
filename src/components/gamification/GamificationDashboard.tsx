import React from 'react';
import { Settings } from 'lucide-react';
import { UserProfile } from './UserProfile';
import { Leaderboard } from './Leaderboard';
import { Achievements } from './Achievements';
import { Challenges } from './Challenges';
import { ThemeSelector } from './ThemeSelector';
import { RewardsMarketplace } from '../rewards/RewardsMarketplace';
import { RedemptionHistory } from '../rewards/RedemptionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { GamificationAdminPanel } from './admin/GamificationAdminPanel';

export const GamificationDashboard: React.FC = () => {
  const theme = useThemeStore(state => state.themes[state.currentTheme]);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.primary }}>
          {theme.name} Dashboard
        </h1>
        {isAdmin && (
          <a
            href="/gamification/admin"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg hover:from-yellow-500 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Settings size={20} />
            <span className="font-medium">Admin Panel</span>
          </a>
        )}
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <div className="space-y-6">
                <UserProfile userId="current-user" />
                <Challenges />
              </div>
            </div>
            <div className="col-span-4">
              <div className="space-y-6">
                <Leaderboard />
                <Achievements />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="space-y-8">
            <RewardsMarketplace />
            <RedemptionHistory userId="current-user" />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          {isAdmin ? (
            <GamificationAdminPanel />
          ) : (
            <div className="space-y-6">
              <ThemeSelector />
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-2">Need More Control?</h3>
                <p className="text-blue-800 text-sm">
                  Contact your administrator to customize achievements, badges, and rewards.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};