import React, { useState } from 'react';
import { Settings, Bell, Eye, Mail, Trophy, Target, Star } from 'lucide-react';
import { ToggleSwitch } from '../../settings/ui/ToggleSwitch';

export const GamificationUserSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    publicProfile: true,
    showInLeaderboard: true,
    emailDigest: 'weekly',
    achievementAlerts: true,
    challengeReminders: true,
    pointAnimations: true,
    soundEffects: false,
    weeklyReport: true,
    competitiveMode: true
  });

  const handleSave = () => {
    localStorage.setItem('gamificationUserSettings', JSON.stringify(settings));
    alert('Gamification settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gamification Preferences</h2>
        <p className="text-gray-600">Customize your gamification experience</p>
      </div>

      <div className="space-y-4">
        <ToggleSwitch
          icon={<Bell className="text-blue-500" size={20} />}
          title="Achievement Notifications"
          description="Get notified when you unlock achievements and earn badges"
          checked={settings.achievementAlerts}
          onChange={(checked) => setSettings({ ...settings, achievementAlerts: checked })}
        />

        <ToggleSwitch
          icon={<Eye className="text-purple-500" size={20} />}
          title="Show in Leaderboard"
          description="Display your progress on public leaderboards"
          checked={settings.showInLeaderboard}
          onChange={(checked) => setSettings({ ...settings, showInLeaderboard: checked })}
        />

        <ToggleSwitch
          icon={<Target className="text-green-500" size={20} />}
          title="Challenge Reminders"
          description="Get reminded about active challenges and deadlines"
          checked={settings.challengeReminders}
          onChange={(checked) => setSettings({ ...settings, challengeReminders: checked })}
        />

        <ToggleSwitch
          icon={<Star className="text-yellow-500" size={20} />}
          title="Point Animations"
          description="Show animated effects when earning points"
          checked={settings.pointAnimations}
          onChange={(checked) => setSettings({ ...settings, pointAnimations: checked })}
        />

        <ToggleSwitch
          icon={<Trophy className="text-orange-500" size={20} />}
          title="Competitive Mode"
          description="Enable competitive features and rankings"
          checked={settings.competitiveMode}
          onChange={(checked) => setSettings({ ...settings, competitiveMode: checked })}
        />

        <ToggleSwitch
          icon={<Mail className="text-indigo-500" size={20} />}
          title="Weekly Progress Report"
          description="Receive weekly gamification progress emails"
          checked={settings.weeklyReport}
          onChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-medium mb-4">Email Digest Frequency</h3>
        <select
          value={settings.emailDigest}
          onChange={(e) => setSettings({ ...settings, emailDigest: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily Summary</option>
          <option value="weekly">Weekly Report</option>
          <option value="monthly">Monthly Overview</option>
          <option value="never">No Email Digest</option>
        </select>
        <p className="mt-2 text-sm text-gray-500">
          Choose how often you want to receive gamification progress updates
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-2">🎮 Gamification Tips</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Complete daily tasks to maintain your streak and earn bonus points</li>
          <li>• Join team challenges to earn collaborative achievements</li>
          <li>• Check the leaderboard regularly to see your ranking</li>
          <li>• Redeem points in the rewards marketplace for exciting prizes</li>
          <li>• Unlock rare badges by completing special criteria</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Gamification Preferences
        </button>
      </div>
    </div>
  );
};