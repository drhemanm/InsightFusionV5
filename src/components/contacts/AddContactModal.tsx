import React, { useState } from 'react';
import { Mail, Phone, Building2, Briefcase, User } from 'lucide-react';
import { Modal, Input, Button, Dropdown } from '../ui';
import { useContactStore } from '../../store/contactStore';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addContact } = useContactStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'lead'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'active', label: 'Active' },
    { value: 'customer', label: 'Customer' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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
      await addContact({
        ...formData,
        tags: [],
        socialProfiles: {}
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        status: 'lead'
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to add contact:', error);
      setErrors({ submit: 'Failed to add contact. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      status: 'lead'
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Contact"
      size="md"
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
            Add Contact
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={errors.firstName}
            leftIcon={<User size={18} />}
            fullWidth
          />
          <Input
            label="Last Name"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={errors.lastName}
            leftIcon={<User size={18} />}
            fullWidth
          />
        </div>

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          leftIcon={<Mail size={18} />}
          fullWidth
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          leftIcon={<Phone size={18} />}
          helperText="Optional"
          fullWidth
        />

        {/* Company */}
        <Input
          label="Company"
          type="text"
          placeholder="Acme Corp"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          leftIcon={<Building2 size={18} />}
          helperText="Optional"
          fullWidth
        />

        {/* Position */}
        <Input
          label="Job Title"
          type="text"
          placeholder="Marketing Manager"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          leftIcon={<Briefcase size={18} />}
          helperText="Optional"
          fullWidth
        />

        {/* Status */}
        <Dropdown
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value })}
          fullWidth
        />

        {errors.submit && (
          <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
            <p className="text-sm text-error">{errors.submit}</p>
          </div>
        )}
      </form>
    </Modal>
  );
};
