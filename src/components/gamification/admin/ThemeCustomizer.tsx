import React, { useState } from 'react';
import { Palette, Save, Plus, Eye, Download, Upload, Sparkles, Rocket, Sword, Trophy, Leaf } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import type { ThemeConfig } from '../../../types/themes';

export const ThemeCustomizer: React.FC = () => {
  const { themes, setTheme, currentTheme } = useThemeStore();
  const [editingTheme, setEditingTheme] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [customTheme, setCustomTheme] = useState<Partial<ThemeConfig>>({
    name: '',
    description: '',
    icon: Rocket,
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
      background: '#F8FAFC'
    },
    terminology: {
      points: 'Points',
      level: 'Level',
      achievement: 'Achievement',
      challenge: 'Challenge',
      reward: 'Reward'
    },
    achievements: {
      icons: {},
      titles: {},
      descriptions: {}
    }
  });

  const iconOptions = [
    { icon: Rocket, name: 'Rocket', id: 'rocket' },
    { icon: Sword, name: 'Sword', id: 'sword' },
    { icon: Trophy, name: 'Trophy', id: 'trophy' },
    { icon: Leaf, name: 'Leaf', id: 'leaf' },
    { icon: Sparkles, name: 'Sparkles', id: 'sparkles' },
    { icon: Palette, name: 'Palette', id: 'palette' }
  ];

  const colorPresets = [
    { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#0284C7', accent: '#38BDF8', bg: '#F0F9FF' },
    { name: 'Forest Green', primary: '#059669', secondary: '#047857', accent: '#34D399', bg: '#ECFDF5' },
    { name: 'Sunset Orange', primary: '#EA580C', secondary: '#C2410C', accent: '#FB923C', bg: '#FFF7ED' },
    { name: 'Royal Purple', primary: '#7C3AED', secondary: '#6D28D9', accent: '#A78BFA', bg: '#FAF5FF' },
    { name: 'Rose Pink', primary: '#E11D48', secondary: '#BE185D', accent: '#FB7185', bg: '#FFF1F2' },
    { name: 'Emerald', primary: '#10B981', secondary: '#059669', accent: '#6EE7B7', bg: '#ECFDF5' }
  ];

  const handleSaveTheme = () => {
    if (customTheme.name && customTheme.description) {
      const newThemeId = customTheme.name.toLowerCase().replace(/\s+/g, '_');
      
      // In production, this would save to the backend
      localStorage.setItem(`custom_theme_${newThemeId}`, JSON.stringify(customTheme));
      
      alert('Custom theme saved successfully!');
      setShowCreateForm(false);
    }
  };

  const handleExportTheme = (themeId: string) => {
    const theme = themes[themeId];
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${themeId}_theme.json`;
    link.click();
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          setCustomTheme(themeData);
          alert('Theme imported successfully!');
        } catch (error) {
          alert('Invalid theme file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Theme Customization</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
            <Upload size={16} />
            Import Theme
            <input
              type="file"
              accept=".json"
              onChange={handleImportTheme}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Create Custom Theme
          </button>
        </div>
      </div>

      {/* Existing Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(themes).map(([key, theme]) => {
          const Icon = theme.icon;
          return (
            <div key={key} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: theme.colors.primary, color: 'white' }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{theme.name}</h3>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportTheme(key)}
                    className="p-2 text-gray-400 hover:text-blue-500"
                    title="Export theme"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => setTheme(key as any)}
                    className="p-2 text-gray-400 hover:text-green-500"
                    title="Preview theme"
                  >
                    <Eye size={16} />
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

              <div className="text-sm text-gray-600">
                <div><strong>Points:</strong> {theme.terminology.points}</div>
                <div><strong>Level:</strong> {theme.terminology.level}</div>
                <div><strong>Achievement:</strong> {theme.terminology.achievement}</div>
              </div>

              {currentTheme === key && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <Eye size={16} />
                  Currently Active
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Custom Theme Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">Create Custom Theme</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customTheme.name}
                    onChange={(e) => setCustomTheme({ ...customTheme, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Cyberpunk Theme"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {iconOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setCustomTheme({ ...customTheme, icon: option.icon })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          customTheme.icon === option.icon
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <option.icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={customTheme.description}
                  onChange={(e) => setCustomTheme({ ...customTheme, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the theme's style and feel..."
                />
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Scheme
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setCustomTheme({
                        ...customTheme,
                        colors: {
                          primary: preset.primary,
                          secondary: preset.secondary,
                          accent: preset.accent,
                          background: preset.bg
                        }
                      })}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <span className="text-sm font-medium">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={customTheme.colors?.primary}
                    onChange={(e) => setCustomTheme({
                      ...customTheme,
                      colors: { ...customTheme.colors!, primary: e.target.value }
                    })}
                    className="w-full h-12 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={customTheme.colors?.secondary}
                    onChange={(e) => setCustomTheme({
                      ...customTheme,
                      colors: { ...customTheme.colors!, secondary: e.target.value }
                    })}
                    className="w-full h-12 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={customTheme.colors?.accent}
                    onChange={(e) => setCustomTheme({
                      ...customTheme,
                      colors: { ...customTheme.colors!, accent: e.target.value }
                    })}
                    className="w-full h-12 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={customTheme.colors?.background}
                    onChange={(e) => setCustomTheme({
                      ...customTheme,
                      colors: { ...customTheme.colors!, background: e.target.value }
                    })}
                    className="w-full h-12 border rounded-lg"
                  />
                </div>
              </div>

              {/* Terminology Customization */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium mb-4">Custom Terminology</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points Term
                    </label>
                    <input
                      type="text"
                      value={customTheme.terminology?.points}
                      onChange={(e) => setCustomTheme({
                        ...customTheme,
                        terminology: { ...customTheme.terminology!, points: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Stardust, Gold, Energy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level Term
                    </label>
                    <input
                      type="text"
                      value={customTheme.terminology?.level}
                      onChange={(e) => setCustomTheme({
                        ...customTheme,
                        terminology: { ...customTheme.terminology!, level: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Rank, Stage, Tier"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievement Term
                    </label>
                    <input
                      type="text"
                      value={customTheme.terminology?.achievement}
                      onChange={(e) => setCustomTheme({
                        ...customTheme,
                        terminology: { ...customTheme.terminology!, achievement: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Discovery, Quest, Milestone"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reward Term
                    </label>
                    <input
                      type="text"
                      value={customTheme.terminology?.reward}
                      onChange={(e) => setCustomTheme({
                        ...customTheme,
                        terminology: { ...customTheme.terminology!, reward: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Treasure, Prize, Loot"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Preview */}
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="font-medium mb-4">Theme Preview</h3>
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: customTheme.colors?.background }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {customTheme.icon && (
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: customTheme.colors?.primary }}
                      >
                        <customTheme.icon className="text-white" size={24} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-lg" style={{ color: customTheme.colors?.primary }}>
                        {customTheme.name || 'Custom Theme'}
                      </h4>
                      <p className="text-sm" style={{ color: customTheme.colors?.secondary }}>
                        {customTheme.description || 'Theme description'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: customTheme.colors?.primary, color: 'white' }}
                    >
                      <div className="font-semibold">1,250 {customTheme.terminology?.points}</div>
                      <div className="text-sm opacity-90">Your {customTheme.terminology?.points}</div>
                    </div>
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: customTheme.colors?.accent, color: 'white' }}
                    >
                      <div className="font-semibold">{customTheme.terminology?.level} 5</div>
                      <div className="text-sm opacity-90">Current {customTheme.terminology?.level}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTheme}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save size={20} />
                  Save Custom Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};