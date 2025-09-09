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

// Admin Panel Component
const GamificationAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'badges', label: 'Badges', icon: Star },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'themes', label: 'Themes', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="text-yellow-600" size={24} />
          <h2 className="text-2xl font-bold text-yellow-800">Gamification Admin Center</h2>
        </div>
        <p className="text-yellow-700">
          Configure achievements, badges, challenges, rewards, and themes for your organization.
        </p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {adminTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'achievements' && <AdminAchievements />}
        {activeTab === 'badges' && <AdminBadges />}
        {activeTab === 'challenges' && <AdminChallenges />}
        {activeTab === 'rewards' && <AdminRewards />}
        {activeTab === 'themes' && <AdminThemes />}
      </div>
    </div>
  );
};

// Admin Overview Component
const AdminOverview: React.FC = () => {
  const stats = {
    totalUsers: 1234,
    activeParticipants: 987,
    achievementsUnlocked: 2456,
    pointsAwarded: 125000,
    challengesActive: 5,
    rewardsAvailable: 23
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Gamification Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Participation Rate</h4>
            <Trophy className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round((stats.activeParticipants / stats.totalUsers) * 100)}%
          </div>
          <div className="text-sm text-gray-600">
            {stats.activeParticipants} of {stats.totalUsers} users
          </div>
        </div>

        <div className="p-6 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Points Awarded</h4>
            <Star className="text-green-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {stats.pointsAwarded.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">This month</div>
        </div>

        <div className="p-6 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Active Challenges</h4>
            <Target className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {stats.challengesActive}
          </div>
          <div className="text-sm text-gray-600">Running now</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">🎮 Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
            <Trophy className="text-yellow-500 mb-2" size={24} />
            <div className="font-medium">Create Achievement</div>
            <div className="text-sm text-gray-600">Add new achievement</div>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
            <Target className="text-green-500 mb-2" size={24} />
            <div className="font-medium">Launch Challenge</div>
            <div className="text-sm text-gray-600">Start new challenge</div>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
            <Gift className="text-purple-500 mb-2" size={24} />
            <div className="font-medium">Add Reward</div>
            <div className="text-sm text-gray-600">New marketplace item</div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Achievements Component
const AdminAchievements: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Achievement Management</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Achievement
        </button>
      </div>
      <div className="text-center py-12 text-gray-500">
        <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-lg font-medium">Achievement Builder</p>
        <p className="text-sm">Create and manage custom achievements for your team</p>
      </div>
    </div>
  );
};

// Admin Badges Component
const AdminBadges: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Badge Designer</h3>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Design Badge
        </button>
      </div>
      <div className="text-center py-12 text-gray-500">
        <Star className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-lg font-medium">Badge Design Studio</p>
        <p className="text-sm">Create beautiful custom badges with colors and icons</p>
      </div>
    </div>
  );
};

// Admin Challenges Component
const AdminChallenges: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Challenge Creator</h3>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Create Challenge
        </button>
      </div>
      <div className="text-center py-12 text-gray-500">
        <Target className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-lg font-medium">Challenge Management</p>
        <p className="text-sm">Design competitions and team challenges</p>
      </div>
    </div>
  );
};

// Admin Rewards Component
const AdminRewards: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Reward Marketplace</h3>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          Add Reward
        </button>
      </div>
      <div className="text-center py-12 text-gray-500">
        <Gift className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-lg font-medium">Reward Management</p>
        <p className="text-sm">Manage gift cards, perks, and company swag</p>
      </div>
    </div>
  );
};

// Admin Themes Component
const AdminThemes: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Theme Customization</h3>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Create Theme
        </button>
      </div>
      <div className="text-center py-12 text-gray-500">
        <Palette className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-lg font-medium">Theme Designer</p>
        <p className="text-sm">Create custom themes with colors and terminology</p>
      </div>
    </div>
  );
};