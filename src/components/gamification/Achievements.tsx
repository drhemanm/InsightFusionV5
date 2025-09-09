import React from 'react';
import { useGamificationStore } from '../../store/gamificationStore';
import { useThemeStore } from '../../store/themeStore';
import { Lock, Unlock } from 'lucide-react';

export const Achievements: React.FC = () => {
  const { achievements } = useGamificationStore();
  const { currentTheme, themes } = useThemeStore();
  const theme = themes[currentTheme];
  
  // Mock achievements if none available
  const mockAchievements = achievements.length > 0 ? achievements : [
    {
      id: 'first_contact',
      title: 'First Contact',
      description: 'Add your first contact to the CRM',
      icon: '👤',
      points: 50,
      unlockedAt: new Date()
    },
    {
      id: 'deal_closer',
      title: 'Deal Closer',
      description: 'Close your first deal successfully',
      icon: '💰',
      points: 200,
      unlockedAt: new Date()
    },
    {
      id: 'task_master',
      title: 'Task Master',
      description: 'Complete 50 tasks',
      icon: '✅',
      points: 150,
      unlockedAt: undefined
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Connect 10 social media profiles',
      icon: '🦋',
      points: 100,
      unlockedAt: undefined
    }
  ];
  
  const unlockedAchievements = ['first_contact', 'deal_closer'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
          {theme.terminology.achievement}s
        </h2>
        <div className="text-sm text-gray-500">
          {unlockedAchievements.length} of {mockAchievements.length} unlocked
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {mockAchievements.map((achievement) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          
          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isUnlocked 
                  ? 'border-green-200 shadow-lg transform hover:scale-105' 
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
              style={{
                backgroundColor: isUnlocked ? theme.colors.primary + '10' : undefined
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <h3 className="font-semibold" style={{ 
                    color: isUnlocked ? theme.colors.primary : undefined 
                  }}>
                    {achievement.title}
                  </h3>
                </div>
                {isUnlocked ? (
                  <Unlock className="text-green-500 animate-pulse" size={20} />
                ) : (
                  <Lock className="text-gray-400" size={20} />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {achievement.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: theme.colors.accent }}>
                  +{achievement.points} {theme.terminology.points}
                </div>
                {isUnlocked && achievement.unlockedAt && (
                  <div className="text-xs text-green-600">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {mockAchievements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium">No {theme.terminology.achievement}s Available</p>
          <p className="text-sm">Contact your administrator to set up {theme.terminology.achievement.toLowerCase()}s</p>
        </div>
      )}
    </div>
  );
};