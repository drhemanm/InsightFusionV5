import React, { useState } from 'react';
import { Star, Palette, Save, X, Award, Shield, Crown, Zap } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: {
    type: string;
    threshold: number;
    timeframe?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  active: boolean;
}

interface BadgeDesignerProps {
  onSave: (badge: Badge) => void;
  onCancel: () => void;
  editingBadge?: Badge;
}

export const BadgeDesigner: React.FC<BadgeDesignerProps> = ({
  onSave,
  onCancel,
  editingBadge
}) => {
  const [formData, setFormData] = useState<Partial<Badge>>(
    editingBadge || {
      name: '',
      description: '',
      icon: '⭐',
      backgroundColor: '#3B82F6',
      borderColor: '#1E40AF',
      textColor: '#FFFFFF',
      tier: 'bronze',
      criteria: {
        type: 'deals_closed',
        threshold: 5
      },
      rarity: 'common',
      active: true
    }
  );

  const badgeIcons = [
    '⭐', '🏆', '🥇', '🎯', '💎', '🔥', '⚡', '🚀', '💪', '🎉',
    '👑', '🌟', '💰', '📈', '🎊', '🏅', '🎖️', '🥉', '🥈', '💯',
    '🛡️', '⚔️', '🗡️', '🏰', '🎭', '🎨', '🎪', '🎬', '🎵', '🎸'
  ];

  const colorPresets = [
    { name: 'Blue', bg: '#3B82F6', border: '#1E40AF', text: '#FFFFFF' },
    { name: 'Purple', bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF' },
    { name: 'Green', bg: '#10B981', border: '#059669', text: '#FFFFFF' },
    { name: 'Red', bg: '#EF4444', border: '#DC2626', text: '#FFFFFF' },
    { name: 'Yellow', bg: '#F59E0B', border: '#D97706', text: '#000000' },
    { name: 'Pink', bg: '#EC4899', border: '#DB2777', text: '#FFFFFF' },
    { name: 'Indigo', bg: '#6366F1', border: '#4F46E5', text: '#FFFFFF' },
    { name: 'Teal', bg: '#14B8A6', border: '#0D9488', text: '#FFFFFF' }
  ];

  const rarityLevels = [
    { id: 'common', label: 'Common', color: 'text-gray-600', glow: '' },
    { id: 'rare', label: 'Rare', color: 'text-blue-600', glow: 'shadow-blue-300' },
    { id: 'epic', label: 'Epic', color: 'text-purple-600', glow: 'shadow-purple-300' },
    { id: 'legendary', label: 'Legendary', color: 'text-yellow-600', glow: 'shadow-yellow-300' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description) {
      onSave({
        id: editingBadge?.id || crypto.randomUUID(),
        ...formData as Badge
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Star className="text-blue-500" size={24} />
            <h2 className="text-2xl font-semibold">
              {editingBadge ? 'Edit Badge' : 'Design New Badge'}
            </h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Sales Champion"
                />
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
                  placeholder="Describe how to earn this badge..."
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Icon
                </label>
                <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                  {badgeIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-2 text-xl rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Scheme
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        backgroundColor: preset.bg,
                        borderColor: preset.border,
                        textColor: preset.text
                      })}
                      className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2"
                        style={{
                          backgroundColor: preset.bg,
                          borderColor: preset.border
                        }}
                      />
                      <span className="text-xs font-medium">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rarity Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {rarityLevels.map((rarity) => (
                    <button
                      key={rarity.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, rarity: rarity.id as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.rarity === rarity.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className={`font-medium ${rarity.color}`}>{rarity.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save size={20} />
                  Save Badge
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <h3 className="font-medium">Live Preview</h3>
            
            {/* Badge Preview */}
            <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
              <div
                className={`relative w-32 h-32 rounded-full flex items-center justify-center border-4 ${
                  formData.rarity === 'legendary' ? 'animate-pulse shadow-lg shadow-yellow-300' :
                  formData.rarity === 'epic' ? 'shadow-lg shadow-purple-300' :
                  formData.rarity === 'rare' ? 'shadow-lg shadow-blue-300' : ''
                }`}
                style={{
                  backgroundColor: formData.backgroundColor,
                  borderColor: formData.borderColor,
                  color: formData.textColor
                }}
              >
                <span className="text-4xl">{formData.icon}</span>
                {formData.rarity === 'legendary' && (
                  <div className="absolute -top-2 -right-2">
                    <Crown className="text-yellow-400 animate-bounce" size={24} />
                  </div>
                )}
              </div>
            </div>

            {/* Badge Card Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6 border">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border-2"
                  style={{
                    backgroundColor: formData.backgroundColor,
                    borderColor: formData.borderColor,
                    color: formData.textColor
                  }}
                >
                  <span className="text-2xl">{formData.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{formData.name || 'Badge Name'}</h4>
                  <p className="text-sm text-gray-600">{formData.description || 'Badge description'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      formData.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                      formData.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      formData.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {formData.rarity?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formData.criteria?.threshold} {formData.criteria?.type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Design Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high contrast colors for better visibility</li>
                <li>• Choose icons that represent the achievement</li>
                <li>• Legendary badges should feel special and rare</li>
                <li>• Consider the badge size in different contexts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};