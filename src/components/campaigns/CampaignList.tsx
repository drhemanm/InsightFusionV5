import React from 'react';
import { Calendar, DollarSign, Users, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { Campaign } from '../../types/campaigns';

interface CampaignListProps {
  campaigns: Campaign[];
}

export const CampaignList: React.FC<CampaignListProps> = ({ campaigns }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="min-w-full divide-y divide-gray-200">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {campaign.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {campaign.type.replace('_', ' ')}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  campaign.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : campaign.status === 'draft'
                    ? 'bg-gray-100 text-gray-800'
                    : campaign.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : campaign.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {campaign.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={16} />
                <span className="text-sm">
                  {format(campaign.startDate, 'MMM d')} -{' '}
                  {format(campaign.endDate, 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <DollarSign size={16} />
                <span className="text-sm">
                  Budget: MUR {campaign.budget.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Users size={16} />
                <span className="text-sm">
                  {campaign.metrics?.targets?.count || 0} Targets
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div>
                  <div className="text-sm text-gray-500">Deals Generated</div>
                  <div className="text-lg font-medium">
                    {campaign.metrics?.deals?.count || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Revenue Generated</div>
                  <div className="text-lg font-medium">
                    MUR {(campaign.metrics?.deals?.value || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Conversion Rate</div>
                  <div className="text-lg font-medium">
                    {((campaign.metrics?.deals?.count || 0) /
                      (campaign.metrics?.targets?.count || 1) *
                      100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                View Details
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}

        {campaigns.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No campaigns found. Create your first campaign to get started!
          </div>
        )}
      </div>
    </div>
  );
};