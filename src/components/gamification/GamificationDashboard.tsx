import React from 'react';
import { Settings, Trophy, Star, Target, Gift, Palette, BarChart3 } from 'lucide-react';
import { UserProfile } from './UserProfile';
import { Leaderboard } from './Leaderboard';
import { Achievements } from './Achievements';
import { Challenges } from './Challenges';
import { ThemeSelector } from './ThemeSelector';
import { GamificationUserSettings } from './settings/GamificationUserSettings';
import { GamificationAdminPanel } from './admin/GamificationAdminPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

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
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <div className="space-y-6">
                <UserProfile userId="current-user" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Leaderboard />
                  <Achievements />
                </div>
              </div>
            </div>
            <div className="col-span-4">
              <Challenges />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="space-y-8">
            <RewardsMarketplace />
            <RedemptionHistory userId="current-user" />
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <Challenges />
        </TabsContent>

        <TabsContent value="settings">
          <GamificationUserSettings />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin">
            <GamificationAdminPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
