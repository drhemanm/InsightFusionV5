import React, { useState } from 'react';
import { Gift, Plus, Edit2, Trash2, Star, Package, Compass, CreditCard, Save, Upload, DollarSign } from 'lucide-react';

interface Reward {
  id: string;
  title: string;
  description: string;
  category: 'gift_cards' | 'perks' | 'swag' | 'experiences' | 'digital';
  pointsCost: number;
  realCost?: number;
  imageUrl: string;
  provider?: string;
  availability: number;
  maxRedemptions?: number;
  expiresAt?: Date;
  redemptionInstructions?: string;
  tags: string[];
  featured: boolean;
  active: boolean;
}

export const RewardMarketplaceAdmin: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'Amazon Gift Card - MUR 500',
      description: 'Redeem for anything on Amazon',
      category: 'gift_cards',
      pointsCost: 2500,
      realCost: 500,
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200',
      provider: 'Amazon',
      availability: 100,
      tags: ['popular', 'digital'],
      featured: true,
      active: true
    },
    {
      id: '2',
      title: 'Company Branded Hoodie',
      description: 'Premium quality hoodie with company logo',
      category: 'swag',
      pointsCost: 1500,
      realCost: 300,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200',
      availability: 50,
      tags: ['apparel', 'branded'],
      featured: false,
      active: true
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const categoryIcons = {
    gift_cards: CreditCard,
    perks: Star,
    swag: Package,
    experiences: Compass,
    digital: Gift
  };

  const categoryColors = {
    gift_cards: 'text-green-500',
    perks: 'text-yellow-500',
    swag: 'text-blue-500',
    experiences: 'text-purple-500',
    digital: 'text-pink-500'
  };

  const handleCreateReward = () => {
    setEditingReward(null);
    setShowCreateForm(true);
  };

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward);
    setShowCreateForm(true);
  };

  const handleDeleteReward = (id: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      setRewards(rewards.filter(r => r.id !== id));
    }
  };

  const handleSaveReward = (rewardData: Partial<Reward>) => {
    if (editingReward) {
      setRewards(rewards.map(r => 
        r.id === editingReward.id ? { ...r, ...rewardData } : r
      ));
    } else {
      const newReward: Reward = {
        id: crypto.randomUUID(),
        ...rewardData as Reward
      };
      setRewards([...rewards, newReward]);
    }
    setShowCreateForm(false);
    setEditingReward(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reward Marketplace Management</h2>
        <button
          onClick={handleCreateReward}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={20} />
          Add New Reward
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Rewards</h3>
            <Gift className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-blue-600">{rewards.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Active Rewards</h3>
            <Star className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {rewards.filter(r => r.active).length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
            <DollarSign className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-purple-600">
            MUR {rewards.reduce((sum, r) => sum + (r.realCost || 0), 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Avg. Points Cost</h3>
            <Trophy className="text-yellow-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-yellow-600">
            {Math.round(rewards.reduce((sum, r) => sum + r.pointsCost, 0) / rewards.length)}
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const CategoryIcon = categoryIcons[reward.category];
          return (
            <div key={reward.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={reward.imageUrl}
                  alt={reward.title}
                  className="w-full h-48 object-cover"
                />
                {reward.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEditReward(reward)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                  >
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteReward(reward.id)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryIcon className={categoryColors[reward.category]} size={20} />
                  <h3 className="font-semibold">{reward.title}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400" size={16} />
                    <span className="font-semibold">{reward.pointsCost} points</span>
                  </div>
                  {reward.realCost && (
                    <span className="text-sm text-gray-500">
                      Cost: MUR {reward.realCost}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Available: {reward.availability}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reward.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {reward.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      {showCreateForm && (
        <RewardForm
          reward={editingReward}
          onSave={handleSaveReward}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingReward(null);
          }}
        />
      )}
    </div>
  );
};

// Reward Form Component
const RewardForm: React.FC<{
  reward?: Reward | null;
  onSave: (data: Partial<Reward>) => void;
  onCancel: () => void;
}> = ({ reward, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Reward>>(
    reward || {
      title: '',
      description: '',
      category: 'gift_cards',
      pointsCost: 1000,
      imageUrl: '',
      availability: 100,
      featured: false,
      active: true,
      tags: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold">
            {reward ? 'Edit Reward' : 'Create New Reward'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points Cost *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.pointsCost}
                onChange={(e) => setFormData({ ...formData, pointsCost: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="gift_cards">Gift Cards</option>
                <option value="perks">Company Perks</option>
                <option value="swag">Company Swag</option>
                <option value="experiences">Experiences</option>
                <option value="digital">Digital Rewards</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <input
                type="number"
                min="0"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2 rounded"
              />
              <span className="text-sm font-medium">Featured Reward</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="mr-2 rounded"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save size={16} />
              Save Reward
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};