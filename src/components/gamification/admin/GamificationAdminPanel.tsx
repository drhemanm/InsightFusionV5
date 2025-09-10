import React, { useState } from 'react';
import { Settings, Trophy, Star, Target, Gift, Palette, Users, BarChart3, Save, Plus, Edit2, Trash2 } from 'lucide-react';
import { useGamificationStore } from '../../../store/gamificationStore';
import { useThemeStore } from '../../../store/themeStore';

export const GamificationAdminPanel: React.FC = () => {
  const { achievements, badges, challenges, updateConfig } = useGamificationStore();
  const { themes, currentTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gamification Admin Center</h1>
          <p className="text-gray-600">Configure and customize the gamification experience</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-4 py-2 rounded-full text-sm">
          <Trophy size={16} />
          Admin Controls
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2" size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="mr-2" size={16} />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Star className="mr-2" size={16} />
            Badges
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Target className="mr-2" size={16} />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="mr-2" size={16} />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="themes">
            <Palette className="mr-2" size={16} />
            Themes
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2" size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <GamificationOverview />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementManager />
        </TabsContent>

        <TabsContent value="badges">
          <BadgeManager />
        </TabsContent>

        <TabsContent value="challenges">
          <ChallengeManager />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardManager />
        </TabsContent>

        <TabsContent value="themes">
          <ThemeManager />
        </TabsContent>

        <TabsContent value="settings">
          <GamificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Overview Component
const GamificationOverview: React.FC = () => {
  const stats = {
    totalUsers: 1234,
    activeParticipants: 987,
    achievementsUnlocked: 2456,
    pointsAwarded: 125000,
    challengesCompleted: 89,
    rewardsRedeemed: 156
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Participation Rate</h3>
            <Users className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round((stats.activeParticipants / stats.totalUsers) * 100)}%
          </div>
          <div className="text-sm text-gray-500">
            {stats.activeParticipants} of {stats.totalUsers} users
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Points Awarded</h3>
            <Star className="text-yellow-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-yellow-600">
            {stats.pointsAwarded.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">This month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Achievements Unlocked</h3>
            <Trophy className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {stats.achievementsUnlocked}
          </div>
          <div className="text-sm text-gray-500">All time</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🎮 Gamification Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-green-700 mb-2">📈 Productivity Boost</h4>
            <p className="text-sm text-gray-600">
              Teams using gamification show 23% higher task completion rates
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-blue-700 mb-2">🎯 Engagement Increase</h4>
            <p className="text-sm text-gray-600">
              Daily active users increased by 34% since gamification launch
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-700 mb-2">🏆 Goal Achievement</h4>
            <p className="text-sm text-gray-600">
              89% of users report feeling more motivated to reach their goals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Achievement Manager Component
const AchievementManager: React.FC = () => {
  const [achievements, setAchievements] = useState([
    {
      id: '1',
      title: 'First Contact',
      description: 'Add your first contact to the CRM',
      icon: '👤',
      points: 50,
      category: 'onboarding',
      criteria: { type: 'contact_count', threshold: 1 },
      active: true
    },
    {
      id: '2',
      title: 'Deal Closer',
      description: 'Close your first deal',
      icon: '💰',
      points: 200,
      category: 'sales',
      criteria: { type: 'deals_closed', threshold: 1 },
      active: true
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Achievement Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Achievement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingAchievement(achievement)}
                  className="p-2 text-gray-400 hover:text-blue-500"
                >
                  <Edit2 size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="font-semibold mb-2">{achievement.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600">
                {achievement.points} points
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                achievement.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {achievement.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Badge Manager Component
const BadgeManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Badge System</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus size={20} />
          Create Badge
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">Badge management interface coming soon...</p>
      </div>
    </div>
  );
};

// Challenge Manager Component
const ChallengeManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Challenge Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus size={20} />
          Create Challenge
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">Challenge management interface coming soon...</p>
      </div>
    </div>
  );
};

// Reward Manager Component
const RewardManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reward Marketplace</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          <Plus size={20} />
          Add Reward
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">Reward management interface coming soon...</p>
      </div>
    </div>
  );
};

// Theme Manager Component
const ThemeManager: React.FC = () => {
  const { themes, setTheme } = useThemeStore();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Theme Customization</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus size={20} />
          Create Theme
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(themes).map(([key, theme]) => {
          const Icon = theme.icon;
          return (
            <div key={key} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon size={24} style={{ color: theme.colors.primary }} />
                  <div>
                    <h3 className="font-semibold">{theme.name}</h3>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 mb-4">
                {Object.values(theme.colors).map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setTheme(key as any)}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Preview Theme
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Gamification Settings Component
const GamificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    pointsPerTask: 10,
    pointsPerDeal: 100,
    pointsPerLead: 50,
    levelThresholds: [0, 1000, 5000, 10000, 25000],
    achievementNotifications: true,
    leaderboardEnabled: true,
    rewardsEnabled: true,
    challengeFrequency: 'weekly'
  });

  const handleSave = () => {
    localStorage.setItem('gamificationSettings', JSON.stringify(settings));
    alert('Gamification settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Global Settings</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Enable Gamification</h3>
              <p className="text-sm text-gray-600">Turn gamification on/off for all users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points per Task Completion
              </label>
              <input
                type="number"
                value={settings.pointsPerTask}
                onChange={(e) => setSettings({ ...settings, pointsPerTask: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points per Deal Closed
              </label>
              <input
                type="number"
                value={settings.pointsPerDeal}
                onChange={(e) => setSettings({ ...settings, pointsPerDeal: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points per Lead Added
              </label>
              <input
                type="number"
                value={settings.pointsPerLead}
                onChange={(e) => setSettings({ ...settings, pointsPerLead: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level Thresholds (comma-separated points)
            </label>
            <input
              type="text"
              value={settings.levelThresholds.join(', ')}
              onChange={(e) => setSettings({
                ...settings,
                levelThresholds: e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v))
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0, 1000, 5000, 10000, 25000"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Achievement Notifications</h3>
                <p className="text-sm text-gray-600">Notify users when they unlock achievements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.achievementNotifications}
                  onChange={(e) => setSettings({ ...settings, achievementNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Leaderboard</h3>
                <p className="text-sm text-gray-600">Show public leaderboards</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.leaderboardEnabled}
                  onChange={(e) => setSettings({ ...settings, leaderboardEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save size={20} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};