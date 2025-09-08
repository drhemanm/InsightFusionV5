import React, { useState } from 'react';
import { FileText, Tag, Users, Building2, AlertCircle, Upload } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';
import { FormField } from '../ui/FormField';
import { ErrorMessage } from '../ui/ErrorMessage';

interface CreateTicketFormProps {
  onClose: () => void;
}

export const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onClose }) => {
  const { createTicket, isLoading } = useTicketStore();
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'technical',
    priority: 'medium',
    contactId: '',
    organizationId: '',
    resolutionNotes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createTicket({
        ...formData,
        status: 'open',
        attachments: []
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Subject"
        required
        error={error}
        icon={<FileText size={18} />}
      >
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="form-input"
          placeholder="Enter ticket subject"
        />
      </FormField>

      <FormField
        label="Description"
        required
        error={error}
        icon={<FileText size={18} />}
      >
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="form-input"
          rows={4}
          placeholder="Describe the issue in detail"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Category"
          required
          error={error}
          icon={<Tag size={18} />}
        >
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-input"
          >
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing</option>
            <option value="inquiry">General Inquiry</option>
            <option value="feature_request">Feature Request</option>
            <option value="bug_report">Bug Report</option>
          </select>
        </FormField>

        <FormField
          label="Priority"
          required
          error={error}
          icon={<AlertCircle size={18} />}
        >
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="form-input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
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
          <input
            type="text"
            value={formData.contactId}
            onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
            className="form-input"
            placeholder="Select contact"
          />
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

      <FormField
        label="Attachments"
        icon={<Upload size={18} />}
      >
        <input
          type="file"
          multiple
          onChange={(e) => setAttachments(Array.from(e.target.files || []))}
          className="form-input"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />
        <p className="mt-1 text-sm text-gray-500">
          Supported formats: PDF, DOC, DOCX, PNG, JPG
        </p>
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
          {isLoading ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
};