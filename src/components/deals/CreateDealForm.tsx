import React, { useState } from 'react';
import { DollarSign, Calendar, FileText, Users, Building2, Tag } from 'lucide-react';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import { useOrganizationStore } from '../../store/organizationStore';
import { DealSchema } from '../../types/deals';
import { FormField } from '../ui/FormField';
import { ErrorMessage } from '../ui/ErrorMessage';
import { AgentSelector } from './AgentSelector';

interface CreateDealFormProps {
  onClose: () => void;
}

export const CreateDealForm: React.FC<CreateDealFormProps> = ({ onClose }) => {
  const { addDeal, isLoading } = useDealStore();
  const { contacts } = useContactStore();
  const { teamMembers } = useOrganizationStore();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    value: '',
    stage: 'lead' as const,
    status: 'new_lead' as const,
    priority: 'medium' as const,
    probability: 50,
    assignedTo: '',
    contactId: '',
    organizationId: '',
    expectedCloseDate: '',
    notes: '',
    tags: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const dealData = {
        ...formData,
        value: Number(formData.value),
        probability: Number(formData.probability),
        expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate) : undefined
      };

      // Validate data
      await DealSchema.parseAsync(dealData);
      await addDeal(dealData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deal');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Deal Title"
          required
          error={error}
          icon={<FileText size={18} />}
        >
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
            placeholder="Enter deal title"
          />
        </FormField>

        <FormField
          label="Deal Value (MUR)"
          required
          error={error}
          icon={<DollarSign size={18} />}
        >
          <input
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="form-input"
            placeholder="Enter deal value"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Stage"
          required
          error={error}
        >
          <select
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
            className="form-input"
          >
            <option value="lead">Lead</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </select>
        </FormField>

        <FormField
          label="Status"
          required
          error={error}
        >
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="form-input"
          >
            <option value="new_lead">New Lead</option>
            <option value="initial_contact">Initial Contact</option>
            <option value="in_negotiation">In Negotiation</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="contract_pending">Contract Pending</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
            <option value="on_hold">On Hold</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Contact"
          required
          error={error}
          icon={<Users size={18} />}
        >
          <select
            value={formData.contactId}
            onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
            className="form-input"
          >
            <option value="">Select contact</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.firstName} {contact.lastName}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Organization"
          icon={<Building2 size={18} />}
        >
          <input
            type="text"
            value={formData.organizationId}
            onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
            className="form-input"
            placeholder="Select organization"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Expected Close Date"
          required
          error={error}
          icon={<Calendar size={18} />}
        >
          <input
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
            className="form-input"
          />
        </FormField>

        <FormField
          label="Priority"
          required
          error={error}
        >
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            className="form-input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </FormField>
      </div>

      <AgentSelector
        value={formData.assignedTo}
        onChange={(agentId) => setFormData({ ...formData, assignedTo: agentId })}
        error={error}
      />

      <FormField
        label="Description"
        icon={<FileText size={18} />}
      >
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="form-input"
          rows={3}
          placeholder="Enter deal description"
        />
      </FormField>

      <FormField
        label="Tags"
        icon={<Tag size={18} />}
      >
        <input
          type="text"
          placeholder="Enter tags separated by commas"
          onChange={(e) => setFormData({
            ...formData,
            tags: e.target.value.split(',').map(tag => tag.trim())
          })}
          className="form-input"
        />
      </FormField>

      {error && <ErrorMessage message={error} />}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Deal'}
        </button>
      </div>
    </form>
  );
};