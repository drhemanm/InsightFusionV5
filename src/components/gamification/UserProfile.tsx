import React from 'react';
import { Trophy, Award, Star, Target } from 'lucide-react';
import { useGamificationStore } from '../../store/gamificationStore';
import { useThemeStore } from '../../store/themeStore';

export const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { userProgress, isLoading, error } = useGamificationStore();
  const { currentTheme, themes } = useThemeStore();
  const theme = themes[currentTheme];

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  
  // Mock data if no progress available
  const progress = userProgress || {
    userId: 'current-user',
    points: 1250,
    level: 5,
    badges: ['first_contact', 'deal_closer'],
    achievements: ['welcome', 'first_deal'],
    currentChallenges: ['monthly_sales'],
    stats: {
      dealsClosedCount: 12,
      leadsAddedCount: 45,
      tasksCompletedCount: 89,
      revenueGenerated: 125000
    }
  };

  const { points, level, badges, achievements, stats } = progress;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Progress</h2>
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" size={24} style={{ color: theme.colors.accent }} />
          <span className="text-xl font-semibold" style={{ color: theme.colors.primary }}>
            {points} {theme.terminology.points}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.primary + '20' }}>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} style={{ color: theme.colors.primary }} />
            <h3 className="font-semibold" style={{ color: theme.colors.primary }}>
              {theme.terminology.level} {level}
            </h3>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className="rounded-full h-2"
              style={{ 
                backgroundColor: theme.colors.primary,
                width: '75%' 
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            750 / 1000 {theme.terminology.points} to next {theme.terminology.level}
          </div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.secondary + '20' }}>
          <div className="flex items-center gap-2 mb-2">
            <Award size={20} style={{ color: theme.colors.secondary }} />
            <h3 className="font-semibold" style={{ color: theme.colors.secondary }}>
              {badges.length} Badges
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {achievements.length} {theme.terminology.achievement}s Unlocked
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Target size={20} />
          Active {theme.terminology.challenge}s
        </h3>
        <div className="space-y-3">
          {progress.currentChallenges.map((challenge) => (
            <div
              key={challenge}
              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
            >
              <span className="font-medium">Monthly Sales {theme.terminology.challenge}</span>
              <div className="text-sm text-gray-600">
                Progress: 75%
              </div>
            </div>
          ))}
          
          {progress.currentChallenges.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Target className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p>No active {theme.terminology.challenge.toLowerCase()}s</p>
              <p className="text-sm">Join a {theme.terminology.challenge.toLowerCase()} to start earning more {theme.terminology.points.toLowerCase()}!</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-4">Performance Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.dealsClosedCount}</div>
            <div className="text-sm text-gray-600">Deals Closed</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.leadsAddedCount}</div>
            <div className="text-sm text-gray-600">Leads Added</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.tasksCompletedCount}</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              MUR {stats.revenueGenerated.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Revenue Generated</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};