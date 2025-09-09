import React from 'react';
import { useGamificationStore } from '../../store/gamificationStore';
import { useThemeStore } from '../../store/themeStore';
import { Medal, Trophy, Award, Crown } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { leaderboard } = useGamificationStore();
  const { currentTheme, themes } = useThemeStore();
  const theme = themes[currentTheme];
  
  // Mock leaderboard data if none available
  const mockLeaderboard = leaderboard.length > 0 ? leaderboard : [
    { userId: 'user1', points: 2450, level: 8, stats: { dealsClosedCount: 15, leadsAddedCount: 67, tasksCompletedCount: 123, revenueGenerated: 185000 } },
    { userId: 'user2', points: 2100, level: 7, stats: { dealsClosedCount: 12, leadsAddedCount: 54, tasksCompletedCount: 98, revenueGenerated: 156000 } },
    { userId: 'user3', points: 1890, level: 6, stats: { dealsClosedCount: 10, leadsAddedCount: 43, tasksCompletedCount: 87, revenueGenerated: 134000 } },
    { userId: 'user4', points: 1650, level: 6, stats: { dealsClosedCount: 8, leadsAddedCount: 38, tasksCompletedCount: 76, revenueGenerated: 112000 } },
    { userId: 'user5', points: 1420, level: 5, stats: { dealsClosedCount: 7, leadsAddedCount: 32, tasksCompletedCount: 65, revenueGenerated: 98000 } }
  ];

  const getPositionStyle = (position: number) => {
    switch (position) {
      case 0:
        return {
          icon: <Trophy className="text-yellow-400 animate-bounce" size={32} />,
          bg: theme.colors.accent + '20',
          border: 'border-yellow-300',
          scale: 'scale-105'
        };
      case 1:
        return {
          icon: <Medal className="text-gray-400" size={28} />,
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          scale: 'scale-100'
        };
      case 2:
        return {
          icon: <Award className="text-amber-600" size={28} />,
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          scale: 'scale-100'
        };
      default:
        return {
          icon: null,
          bg: 'bg-white',
          border: 'border-gray-100',
          scale: 'scale-100'
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: theme.colors.primary }}>
          Top Performers
        </h2>
        <Crown className="text-yellow-400" size={24} style={{ color: theme.colors.accent }} />
      </div>

      <div className="space-y-4">
        {mockLeaderboard.map((user, index) => {
          const style = getPositionStyle(index);
          
          return (
            <div
              key={user.userId}
              className={`
                flex items-center justify-between p-4 rounded-lg border
                transition-all duration-300 transform ${style.border} ${style.scale}
                hover:shadow-md
              `}
              style={{ backgroundColor: style.bg }}
            >
              <div className="flex items-center gap-4">
                {style.icon}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                     style={{ backgroundColor: theme.colors.primary }}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold">
                    {user.userId === 'user1' ? 'Sarah Johnson' :
                     user.userId === 'user2' ? 'Michael Chen' :
                     user.userId === 'user3' ? 'Emily Rodriguez' :
                     user.userId === 'user4' ? 'David Kim' : 'Alex Thompson'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {theme.terminology.level} {user.level}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                  {user.points}
                </div>
                <div className="text-sm text-gray-500">{theme.terminology.points}</div>
              </div>
            </div>
          );
        })}
        
        {mockLeaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">No Leaderboard Data</p>
            <p className="text-sm">Start completing tasks to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};