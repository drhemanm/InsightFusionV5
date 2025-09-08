import React, { useState } from 'react';
import { X, Calendar, DollarSign, Users, Target } from 'lucide-react';
import { useCampaignStore } from '../../store/campaignStore';
import { useContactStore } from '../../store/contactStore';
import { useOrganizationStore } from '../../store/organizationStore';
import type { Campaign } from '../../types/campaigns';

interface CreateCampaignModalProps {
  onClose: () => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ onClose }) => {
  const { createCampaign } = useCampaignStore();
  const { contacts } = useContactStore();
  const { organization } = useOrganizationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'email' as Campaign['type'],
    description: '',
    budget: 0,
    startDate: '',
    endDate: '',
    status: 'draft' as Campaign['status']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const campaign = await createCampaign({
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        createdBy: 'current-user', // In production, get from auth
        kpis: {
          targetDeals: 10,
          targetRevenue: formData.budget * 3,
          targetConversionRate: 0.2
        },
        metrics: {
          deals: { count: 0, value: 0 },
          targets: { count: selectedContacts.length + selectedOrgs.length }
        }
      });

      // Add targets
      for (const contactId of selectedContacts) {
        await useCampaignStore.getState().addCampaignTarget(campaign.id, {
          targetType: 'contact',
          targetId: contactId,
          status: 'pending'
        });
      }

      for (const orgId of selectedOrgs) {
        await useCampaignStore.getState().addCampaignTarget(campaign.id, {
          targetType: 'organization',
          targetId: orgId,
          status: 'pending'
        });
      }

      onClose();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Campaign Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Campaign Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Campaign['type'] })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="email">Email Campaign</option>
                <option value="social_media">Social Media Campaign</option>
                <option value="event">Event</option>
                <option value="direct_mail">Direct Mail</option>
                <option value="phone">Phone Campaign</option>
                <option value="referral">Referral Program</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <div className="mt-1 relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date *
              </label>
              <div className="mt-1 relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Budget *
            </label>
            <div className="mt-1 relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Contacts
              </label>
              <div className="mt-1 relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  multiple
                  value={selectedContacts}
                  onChange={(e) => setSelectedContacts(
                    Array.from(e.target.selectedOptions, option => option.value)
                  )}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  size={4}
                >
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Organizations
              </label>
              <div className="mt-1 relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  multiple
                  value={selectedOrgs}
                  onChange={(e) => setSelectedOrgs(
                    Array.from(e.target.selectedOptions, option => option.value)
                  )}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  size={4}
                >
                  {/* In production, map over organizations */}
                  <option value="org1">Organization 1</option>
                  <option value="org2">Organization 2</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};