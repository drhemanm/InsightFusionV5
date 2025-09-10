import React from 'react';
import { Trophy, Star, Target, Users, TrendingUp, Award } from 'lucide-react';
import { UserProgress } from './UserProgress';
import { Achievements } from './Achievements';
import { Badges } from './BadgeGrid';
import { Challenges } from './Challenges';
import { Leaderboard } from './Leaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

export const GamificationDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gamification Hub</h1>
          <p className="text-gray-600">Track your progress, earn rewards, and compete with your team</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm">
          <Trophy size={16} />
          Level Up Your Performance
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">
            <TrendingUp className="mr-2" size={16} />
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
          <TabsTrigger value="leaderboard">
            <Users className="mr-2" size={16} />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <UserProgress />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="text-yellow-500" size={20} />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <p className="font-medium">Deal Closer</p>
                      <p className="text-sm text-gray-600">Closed your first deal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl">📞</div>
                    <div>
                      <p className="font-medium">Call Master</p>
                      <p className="text-sm text-gray-600">Made 50 calls this month</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="text-green-500" size={20} />
                  Active Challenges
                </h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Weekly Sales Sprint</p>
                      <span className="text-sm text-gray-500">3 days left</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">65% complete</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Contact Champion</p>
                      <span className="text-sm text-gray-500">1 week left</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">40% complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Achievements />
        </TabsContent>

        <TabsContent value="badges">
          <Badges />
        </TabsContent>

        <TabsContent value="challenges">
          <Challenges />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};