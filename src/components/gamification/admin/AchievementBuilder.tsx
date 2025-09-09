import React, { useState } from 'react';
import { Trophy, Plus, Save, X, Star, Target, Users, DollarSign, Calendar, Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'sales' | 'productivity' | 'engagement' | 'milestone' | 'social';
  criteria: {
    type: 'contact_count' | 'deals_closed' | 'tasks_completed' | 'revenue_generated' | 'login_streak';
    threshold: number;
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  };
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  active: boolean;
  unlockMessage?: string;
  prerequisites?: string[];
}

interface AchievementBuilderProps {
  onSave: (achievement: Achievement) => void;
  onCancel: () => void;
  editingAchievement?: Achievement;
}

export const AchievementBuilder: React.FC<AchievementBuilderProps> = ({
  onSave,
  onCancel,
  editingAchievement
}) => {
  const [formData, setFormData] = useState<Partial<Achievement>>(
    editingAchievement || {
      title: '',
      description: '',
      icon: '🏆',
      points: 100,
      category: 'sales',
      criteria: {
        type: 'deals_closed',
        threshold: 1,
        timeframe: 'all_time'
      },
      tier: 'bronze',
      active: true
    }
  );

  const categories = [
    { id: 'sales', label: 'Sales', icon: DollarSign, color: 'text-green-500' },
    { id: 'productivity', label: 'Productivity', icon: Target, color: 'text-blue-500' },
    { id: 'engagement', label: 'Engagement', icon: Users, color: 'text-purple-500' },
    { id: 'milestone', label: 'Milestone', icon: Star, color: 'text-yellow-500' },
    { id: 'social', label: 'Social', icon: Award, color: 'text-pink-500' }
  ];

  const criteriaTypes = [
    { id: 'contact_count', label: 'Contacts Added', unit: 'contacts' },
    { id: 'deals_closed', label: 'Deals Closed', unit: 'deals' },
    { id: 'tasks_completed', label: 'Tasks Completed', unit: 'tasks' },
    { id: 'revenue_generated', label: 'Revenue Generated', unit: 'MUR' },
    { id: 'login_streak', label: 'Login Streak', unit: 'days' }
  ];

  const tiers = [
    { id: 'bronze', label: 'Bronze', color: 'bg-amber-600', points: '50-200' },
    { id: 'silver', label: 'Silver', color: 'bg-gray-400', points: '200-500' },
    { id: 'gold', label: 'Gold', color: 'bg-yellow-400', points: '500-1000' },
    { id: 'platinum', label: 'Platinum', color: 'bg-gradient-to-r from-purple-400 to-pink-400', points: '1000+' }
  ];

  const emojiOptions = [
    '🏆', '🥇', '🎯', '⭐', '💎', '🔥', '⚡', '🚀', '💪', '🎉',
    '👑', '🌟', '💰', '📈', '🎊', '🏅', '🎖️', '🥉', '🥈', '💯'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.criteria) {
      onSave({
        id: editingAchievement?.id || crypto.randomUUID(),
        ...formData as Achievement
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-semibold">
              {editingAchievement ? 'Edit Achievement' : 'Create New Achievement'}
            </h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achievement Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., First Deal Closer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points Reward *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what users need to do to earn this achievement..."
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievement Icon
            </label>
            <div className="grid grid-cols-10 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                    formData.icon === emoji
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.id as any })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.category === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Icon className={`mx-auto mb-2 ${category.color}`} size={24} />
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievement Tier
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, tier: tier.id as any })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.tier === tier.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${tier.color}`}></div>
                  <div className="text-sm font-medium">{tier.label}</div>
                  <div className="text-xs text-gray-500">{tier.points} pts</div>
                </button>
              ))}
            </div>
          </div>

          {/* Criteria Configuration */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium mb-4">Achievement Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Criteria Type
                </label>
                <select
                  value={formData.criteria?.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria!, type: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {criteriaTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.criteria?.threshold}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria!, threshold: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeframe
                </label>
                <select
                  value={formData.criteria?.timeframe}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria!, timeframe: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all_time">All Time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-medium mb-4">Achievement Preview</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  formData.tier === 'platinum' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                  formData.tier === 'gold' ? 'bg-yellow-400' :
                  formData.tier === 'silver' ? 'bg-gray-400' : 'bg-amber-600'
                }`}>
                  <span className="text-white text-2xl">{formData.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{formData.title || 'Achievement Title'}</h4>
                  <p className="text-gray-600">{formData.description || 'Achievement description'}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-medium text-blue-600">
                      +{formData.points} points
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      formData.category === 'sales' ? 'bg-green-100 text-green-800' :
                      formData.category === 'productivity' ? 'bg-blue-100 text-blue-800' :
                      formData.category === 'engagement' ? 'bg-purple-100 text-purple-800' :
                      formData.category === 'milestone' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-pink-100 text-pink-800'
                    }`}>
                      {formData.category?.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      formData.tier === 'platinum' ? 'bg-purple-100 text-purple-800' :
                      formData.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      formData.tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {formData.tier?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={20} />
              {editingAchievement ? 'Update Achievement' : 'Create Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};