import React, { useState } from 'react';
import { Mail, Phone, Building2, MapPin, Globe, Tag, Upload, Users, Calendar } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { ContactSchema } from '../../types/contacts';
import { FormField } from '../ui/FormField';
import { ErrorMessage } from '../ui/ErrorMessage';
import { kycService } from '../../services/contacts/KYCService';
import { duplicateDetectionService } from '../../services/contacts/DuplicateDetectionService';

export const CreateContactForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addContact, isLoading } = useContactStore();
  const [error, setError] = useState<string | null>(null);
  const [kycDocuments, setKycDocuments] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Professional Information
    jobTitle: '',
    department: '',
    organization: '',
    linkedAccounts: [] as string[],
    
    // Address
    businessAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    
    // Communication Preferences
    preferredContactMethod: 'email' as const,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    // Social Media
    socialProfiles: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    
    // Categorization
    type: 'lead' as const,
    source: '',
    tags: [] as string[],
    groups: [] as string[],
    
    // Additional Information
    notes: '',
    customFields: {} as Record<string, any>,
    
    // KYC Information
    kyc: {
      status: 'pending' as const,
      idNumber: '',
      documentUrls: [] as string[]
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Check for duplicates
      const duplicates = await duplicateDetectionService.findDuplicates(
        formData as any,
        [] // Existing contacts would be passed here
      );

      if (duplicates.length > 0) {
        setError(`Found ${duplicates.length} potential duplicate contacts. Please review before proceeding.`);
        return;
      }

      // Validate form data
      await ContactSchema.parseAsync(formData);

      // Upload KYC documents if any
      const documentUrls = await Promise.all(
        kycDocuments.map(file => 
          kycService.uploadDocument('temp-contact-id', {
            type: 'passport',
            file,
            metadata: {
              issuedDate: new Date(),
              expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
              issuingCountry: formData.businessAddress.country
            }
          })
        )
      );

      // Create contact with document URLs
      await addContact({
        ...formData,
        kyc: {
          ...formData.kyc,
          documentUrls
        }
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contact');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            required
            error={error}
            icon={<Users size={18} />}
          >
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="form-input"
              placeholder="John"
            />
          </FormField>

          <FormField
            label="Last Name"
            required
            error={error}
            icon={<Users size={18} />}
          >
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="form-input"
              placeholder="Doe"
            />
          </FormField>
        </div>

        <FormField
          label="Email"
          required
          error={error}
          icon={<Mail size={18} />}
        >
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
            placeholder="john.doe@example.com"
          />
        </FormField>

        <FormField
          label="Phone"
          icon={<Phone size={18} />}
        >
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="form-input"
            placeholder="+1234567890"
          />
        </FormField>
      </div>

      {/* Professional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Professional Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Job Title"
            icon={<Building2 size={18} />}
          >
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className="form-input"
              placeholder="Senior Manager"
            />
          </FormField>

          <FormField
            label="Department"
            icon={<Building2 size={18} />}
          >
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="form-input"
              placeholder="Sales"
            />
          </FormField>
        </div>

        <FormField
          label="Organization"
          icon={<Building2 size={18} />}
        >
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className="form-input"
            placeholder="Company Name"
          />
        </FormField>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Business Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Street"
            icon={<MapPin size={18} />}
          >
            <input
              type="text"
              value={formData.businessAddress.street}
              onChange={(e) => setFormData({
                ...formData,
                businessAddress: { ...formData.businessAddress, street: e.target.value }
              })}
              className="form-input"
              placeholder="123 Business Ave"
            />
          </FormField>

          <FormField label="City">
            <input
              type="text"
              value={formData.businessAddress.city}
              onChange={(e) => setFormData({
                ...formData,
                businessAddress: { ...formData.businessAddress, city: e.target.value }
              })}
              className="form-input"
              placeholder="City"
            />
          </FormField>

          <FormField label="State/Province">
            <input
              type="text"
              value={formData.businessAddress.state}
              onChange={(e) => setFormData({
                ...formData,
                businessAddress: { ...formData.businessAddress, state: e.target.value }
              })}
              className="form-input"
              placeholder="State"
            />
          </FormField>

          <FormField label="Postal Code">
            <input
              type="text"
              value={formData.businessAddress.postalCode}
              onChange={(e) => setFormData({
                ...formData,
                businessAddress: { ...formData.businessAddress, postalCode: e.target.value }
              })}
              className="form-input"
              placeholder="12345"
            />
          </FormField>

          <FormField label="Country">
            <input
              type="text"
              value={formData.businessAddress.country}
              onChange={(e) => setFormData({
                ...formData,
                businessAddress: { ...formData.businessAddress, country: e.target.value }
              })}
              className="form-input"
              placeholder="Country"
            />
          </FormField>
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Communication Preferences</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Preferred Contact Method">
            <select
              value={formData.preferredContactMethod}
              onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value as any })}
              className="form-input"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
            </select>
          </FormField>

          <FormField label="Timezone">
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="form-input"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Social Media Profiles</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="LinkedIn"
            icon={<Globe size={18} />}
          >
            <input
              type="url"
              value={formData.socialProfiles.linkedin}
              onChange={(e) => setFormData({
                ...formData,
                socialProfiles: { ...formData.socialProfiles, linkedin: e.target.value }
              })}
              className="form-input"
              placeholder="https://linkedin.com/in/username"
            />
          </FormField>

          <FormField
            label="Twitter"
            icon={<Globe size={18} />}
          >
            <input
              type="url"
              value={formData.socialProfiles.twitter}
              onChange={(e) => setFormData({
                ...formData,
                socialProfiles: { ...formData.socialProfiles, twitter: e.target.value }
              })}
              className="form-input"
              placeholder="https://twitter.com/username"
            />
          </FormField>
        </div>
      </div>

      {/* KYC Documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">KYC Documents</h3>
        <FormField
          label="Upload Documents"
          icon={<Upload size={18} />}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setKycDocuments(Array.from(e.target.files || []))}
            className="form-input"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload government ID, proof of address, or other verification documents
          </p>
        </FormField>
      </div>

      {/* Tags and Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Categorization</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Contact Type"
            required
          >
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="form-input"
            >
              <option value="lead">Lead</option>
              <option value="customer">Customer</option>
              <option value="partner">Partner</option>
              <option value="supplier">Supplier</option>
            </select>
          </FormField>

          <FormField
            label="Source"
            icon={<Tag size={18} />}
          >
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="form-input"
            >
              <option value="">Select source</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="event">Event</option>
              <option value="social">Social Media</option>
            </select>
          </FormField>
        </div>

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
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Information</h3>
        <FormField label="Notes">
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="form-input"
            rows={3}
            placeholder="Add any additional notes about this contact..."
          />
        </FormField>
      </div>

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
          {isLoading ? 'Creating...' : 'Create Contact'}
        </button>
      </div>
    </form>
  );
};