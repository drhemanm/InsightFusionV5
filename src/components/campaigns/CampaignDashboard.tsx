import React, { useEffect } from 'react';
import { Plus, Filter, Calendar, DollarSign, Users, Target } from 'lucide-react';
import { useCampaignStore } from '../../store/campaignStore';
import { CampaignList } from './CampaignList';
import { CampaignMetrics } from './CampaignMetrics';
import { CreateCampaignModal } from './CreateCampaignModal';

export const CampaignDashboard: React.FC = () => {
  const { campaigns, fetchCampaigns, isLoading, error } = useCampaignStore();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (isLoading) return <div className="flex justify-center p-8">Loading campaigns...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalDeals = campaigns.reduce((sum, c) => sum + (c.metrics?.deals?.count || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          New Campaign
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm">Active Campaigns</h3>
            <Calendar className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold">{activeCampaigns.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm">Total Budget</h3>
            <DollarSign className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold">MUR {totalBudget.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm">Total Targets</h3>
            <Users className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold">{campaigns.length * 10}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm">Generated Deals</h3>
            <Target className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold">{totalDeals}</p>
        </div>
      </div>

      {/* Campaign Metrics */}
      <div className="mb-8">
        <CampaignMetrics campaigns={campaigns} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Campaigns</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Campaign List */}
      <CampaignList
        campaigns={
          filterStatus === 'all'
            ? campaigns
            : campaigns.filter(c => c.status === filterStatus)
        }
      />

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};