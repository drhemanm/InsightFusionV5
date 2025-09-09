import React, { useState } from 'react';
import { Target, Calendar, Trophy, Users, Save, X, Plus, Minus } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'global';
  category: 'sales' | 'productivity' | 'engagement' | 'learning';
  startDate: Date;
  endDate: Date;
  criteria: {
    metric: string;
    target: number;
    timeframe: string;
  };
  rewards: {
    winner: { points: number; badges?: string[]; prizes?: string[] };
    participant: { points: number };
    milestones?: Array<{ threshold: number; reward: { points: number; description: string } }>;
  };
  maxParticipants?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tags: string[];
  active: boolean;
}

interface ChallengeCreatorProps {
  onSave: (challenge: Challenge) => void;
  onCancel: () => void;
  editingChallenge?: Challenge;
}

export const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({
  onSave,
  onCancel,
  editingChallenge
}) => {
  const [formData, setFormData] = useState<Partial<Challenge>>(
    editingChallenge || {
      title: '',
      description: '',
      type: 'individual',
      category: 'sales',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      criteria: {
        metric: 'deals_closed',
        target: 5,
        timeframe: 'challenge_duration'
      },
      rewards: {
        winner: { points: 500 },
        participant: { points: 50 },
        milestones: []
      },
      difficulty: 'medium',
      tags: [],
      active: true
    }
  );

  const challengeTypes = [
    { id: 'individual', label: 'Individual', icon: Users, description: 'Personal challenge for each user' },
    { id: 'team', label: 'Team', icon: Users, description: 'Team-based competition' },
    { id: 'global', label: 'Global', icon: Target, description: 'Company-wide challenge' }
  ];

  const metrics = [
    { id: 'deals_closed', label: 'Deals Closed', unit: 'deals' },
    { id: 'contacts_added', label: 'Contacts Added', unit: 'contacts' },
    { id: 'tasks_completed', label: 'Tasks Completed', unit: 'tasks' },
    { id: 'revenue_generated', label: 'Revenue Generated', unit: 'MUR' },
    { id: 'meetings_scheduled', label: 'Meetings Scheduled', unit: 'meetings' },
    { id: 'emails_sent', label: 'Emails Sent', unit: 'emails' }
  ];

  const difficulties = [
    { id: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800', multiplier: 1 },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', multiplier: 1.5 },
    { id: 'hard', label: 'Hard', color: 'bg-orange-100 text-orange-800', multiplier: 2 },
    { id: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800', multiplier: 3 }
  ];

  const addMilestone = () => {
    const milestones = formData.rewards?.milestones || [];
    setFormData({
      ...formData,
      rewards: {
        ...formData.rewards!,
        milestones: [...milestones, { threshold: 0, reward: { points: 0, description: '' } }]
      }
    });
  };

  const removeMilestone = (index: number) => {
    const milestones = formData.rewards?.milestones || [];
    setFormData({
      ...formData,
      rewards: {
        ...formData.rewards!,
        milestones: milestones.filter((_, i) => i !== index)
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.criteria) {
      onSave({
        id: editingChallenge?.id || crypto.randomUUID(),
        ...formData as Challenge
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Target className="text-green-500" size={24} />
            <h2 className="text-2xl font-semibold">
              {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
            </h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenge Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Monthly Sales Sprint"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenge Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {challengeTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.id as any })}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.type === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{type.label}</div>
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the challenge and what participants need to do..."
            />
          </div>

          {/* Challenge Criteria */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium mb-4">Challenge Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metric to Track
                </label>
                <select
                  value={formData.criteria?.metric}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria!, metric: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {metrics.map((metric) => (
                    <option key={metric.id} value={metric.id}>
                      {metric.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Goal
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.criteria?.target}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria!, target: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {difficulties.map((diff) => (
                    <option key={diff.id} value={diff.id}>
                      {diff.label} ({diff.multiplier}x points)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.startDate?.toISOString().slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.endDate?.toISOString().slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Rewards Configuration */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="font-medium mb-4">Reward Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Winner Reward (Points)
                </label>
                <input
                  type="number"
                  value={formData.rewards?.winner.points}
                  onChange={(e) => setFormData({
                    ...formData,
                    rewards: {
                      ...formData.rewards!,
                      winner: { ...formData.rewards!.winner, points: parseInt(e.target.value) }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participation Reward (Points)
                </label>
                <input
                  type="number"
                  value={formData.rewards?.participant.points}
                  onChange={(e) => setFormData({
                    ...formData,
                    rewards: {
                      ...formData.rewards!,
                      participant: { points: parseInt(e.target.value) }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Milestones */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Progress Milestones</h4>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                >
                  <Plus size={16} />
                  Add Milestone
                </button>
              </div>

              <div className="space-y-3">
                {formData.rewards?.milestones?.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        placeholder="Threshold"
                        value={milestone.threshold}
                        onChange={(e) => {
                          const milestones = [...(formData.rewards?.milestones || [])];
                          milestones[index].threshold = parseInt(e.target.value);
                          setFormData({
                            ...formData,
                            rewards: { ...formData.rewards!, milestones }
                          });
                        }}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Points"
                        value={milestone.reward.points}
                        onChange={(e) => {
                          const milestones = [...(formData.rewards?.milestones || [])];
                          milestones[index].reward.points = parseInt(e.target.value);
                          setFormData({
                            ...formData,
                            rewards: { ...formData.rewards!, milestones }
                          });
                        }}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={milestone.reward.description}
                        onChange={(e) => {
                          const milestones = [...(formData.rewards?.milestones || [])];
                          milestones[index].reward.description = e.target.value;
                          setFormData({
                            ...formData,
                            rewards: { ...formData.rewards!, milestones }
                          });
                        }}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-medium mb-4">Challenge Preview</h3>
            <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Trophy className="text-yellow-500" size={24} />
                  <div>
                    <h4 className="font-semibold text-lg">{formData.title || 'Challenge Title'}</h4>
                    <p className="text-sm text-gray-600">{formData.description || 'Challenge description'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-600">
                    {formData.rewards?.winner.points} pts
                  </div>
                  <div className="text-xs text-gray-500">Winner Reward</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{formData.criteria?.target}</div>
                  <div className="text-sm text-gray-600">Target Goal</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{formData.type?.toUpperCase()}</div>
                  <div className="text-sm text-gray-600">Challenge Type</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className={`font-medium px-2 py-1 rounded-full text-xs ${
                    difficulties.find(d => d.id === formData.difficulty)?.color
                  }`}>
                    {formData.difficulty?.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">Difficulty</div>
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
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};