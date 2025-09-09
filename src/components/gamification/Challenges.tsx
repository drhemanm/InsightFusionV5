import React from 'react';
import { Target, Clock, Trophy, ArrowRight } from 'lucide-react';
import { useGamificationStore } from '../../store/gamificationStore';
import { useThemeStore } from '../../store/themeStore';
import { format } from 'date-fns';

export const Challenges: React.FC = () => {
  const { challenges, userProgress, joinChallenge } = useGamificationStore();
  const { currentTheme, themes } = useThemeStore();
  const theme = themes[currentTheme];
  
  // Mock challenges if none available
  const mockChallenges = challenges.length > 0 ? challenges : [
    {
      id: 'monthly_sales',
      title: 'Monthly Sales Sprint',
      description: 'Close 10 deals this month to win amazing rewards',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      criteria: { target: 10, type: 'deals_closed' },
      reward: { points: 1000, badges: ['sales_champion'] },
      participants: ['user1', 'user2', 'user3'],
      progress: { 'current-user': 6 }
    },
    {
      id: 'lead_generation',
      title: 'Lead Generation Master',
      description: 'Add 25 new qualified leads this week',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      criteria: { target: 25, type: 'leads_added' },
      reward: { points: 500, badges: ['lead_master'] },
      participants: ['user1', 'user4', 'user5'],
      progress: { 'current-user': 18 }
    }
  ];

  const handleJoinChallenge = async (challengeId: string) => {
    // Mock join challenge
    alert(`Joined ${theme.terminology.challenge.toLowerCase()}: ${challengeId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="h-8 w-8" style={{ color: theme.colors.primary }} />
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.colors.primary }}>
              Active {theme.terminology.challenge}s
            </h2>
            <p className="text-sm text-gray-600">
              Complete {theme.terminology.challenge.toLowerCase()}s to earn {theme.terminology.reward.toLowerCase()}s
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockChallenges.map((challenge) => {
          const isParticipating = challenge.participants.includes('current-user');
          const progress = isParticipating
            ? challenge.progress['current-user'] || 0
            : 0;
          const progressPercentage = (progress / challenge.criteria.target) * 100;

          return (
            <div
              key={challenge.id}
              className="border-2 rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{ borderColor: theme.colors.primary + '30' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy size={24} style={{ color: theme.colors.accent }} />
                  <h3 className="font-semibold">{challenge.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>
                    {format(new Date(challenge.endDate), 'MMM d')}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{challenge.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <Trophy size={20} style={{ color: theme.colors.accent }} />
                <div>
                  <span className="font-medium text-lg">
                    {challenge.reward.points}
                  </span>
                  <span className="text-gray-600 text-sm ml-1">{theme.terminology.points}</span>
                </div>
              </div>

              {isParticipating ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: theme.colors.primary,
                        width: `${progressPercentage}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {progress} / {challenge.criteria.target} {challenge.criteria.type.replace('_', ' ')}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className="w-full flex items-center justify-center gap-2 text-white rounded-lg py-2 px-4 transition-colors"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    ':hover': { backgroundColor: theme.colors.secondary }
                  }}
                >
                  <span>Accept {theme.terminology.challenge}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          );
        })}
        
        {mockChallenges.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">No Active {theme.terminology.challenge}s</p>
            <p className="text-sm">Check back later for new {theme.terminology.challenge.toLowerCase()}s!</p>
          </div>
        )}
      </div>
    </div>
  );
};