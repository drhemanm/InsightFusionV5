import React, { useState } from 'react';
import { DollarSign, FileText, Calendar, TrendingUp, User } from 'lucide-react';
import { Modal, Input, Button, Dropdown } from '../ui';
import { useDealStore } from '../../store/dealStore';

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDealModal: React.FC<CreateDealModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addDeal } = useDealStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'lead',
    contactId: '',
    expectedCloseDate: '',
    probability: '50',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stageOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required';
    }
    if (!formData.value || Number(formData.value) <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addDeal({
        title: formData.title,
        value: Number(formData.value),
        stage: formData.stage as any,
        contactId: formData.contactId || undefined,
        expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate) : undefined,
        probability: Number(formData.probability),
        description: formData.description || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Reset form
      setFormData({
        title: '',
        value: '',
        stage: 'lead',
        contactId: '',
        expectedCloseDate: '',
        probability: '50',
        description: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to create deal:', error);
      setErrors({ submit: 'Failed to create deal. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      value: '',
      stage: 'lead',
      contactId: '',
      expectedCloseDate: '',
      probability: '50',
      description: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Deal"
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Create Deal
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Deal Title */}
        <Input
          label="Deal Title"
          type="text"
          placeholder="Enterprise Software Deal"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          leftIcon={<FileText size={18} />}
          fullWidth
        />

        {/* Value & Probability */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Deal Value ($)"
            type="number"
            placeholder="50000"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            error={errors.value}
            leftIcon={<DollarSign size={18} />}
            fullWidth
          />
          <Input
            label="Win Probability (%)"
            type="number"
            min="0"
            max="100"
            placeholder="50"
            value={formData.probability}
            onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
            leftIcon={<TrendingUp size={18} />}
            fullWidth
          />
        </div>

        {/* Stage & Contact */}
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            label="Stage"
            options={stageOptions}
            value={formData.stage}
            onChange={(value) => setFormData({ ...formData, stage: value })}
            fullWidth
          />
          <Input
            label="Contact"
            type="text"
            placeholder="John Smith"
            value={formData.contactId}
            onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
            leftIcon={<User size={18} />}
            helperText="Optional"
            fullWidth
          />
        </div>

        {/* Expected Close Date */}
        <Input
          label="Expected Close Date"
          type="date"
          value={formData.expectedCloseDate}
          onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
          leftIcon={<Calendar size={18} />}
          helperText="Optional"
          fullWidth
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add notes about this deal..."
            rows={4}
            className="block w-full bg-dark-300 border border-primary-500/20 rounded-lg text-gray-200 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 px-4 py-2"
          />
        </div>

        {errors.submit && (
          <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
            <p className="text-sm text-error">{errors.submit}</p>
          </div>
        )}
      </form>
    </Modal>
  );
};
