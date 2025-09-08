import React from 'react';
import { DollarSign, Calendar, User, FileText } from 'lucide-react';
import { FormContainer } from '../ui/FormContainer';
import { FormSection } from '../ui/FormSection';
import { FormRow } from '../ui/FormRow';
import { FormInput } from '../ui/FormInput';

export const AddDealForm: React.FC = () => {
  return (
    <FormContainer
      title="Add New Deal"
      subtitle="Create a new sales opportunity"
    >
      <form className="space-y-8">
        <FormSection title="Deal Information">
          <FormRow cols={2}>
            <FormInput
              label="Deal Title"
              required
              icon={<FileText size={18} />}
              placeholder="Enter deal title"
            />
            <FormInput
              label="Deal Value"
              type="number"
              required
              icon={<DollarSign size={18} />}
              placeholder="Enter value in MUR"
            />
          </FormRow>
          
          <FormRow cols={2}>
            <FormInput
              label="Expected Close Date"
              type="date"
              required
              icon={<Calendar size={18} />}
            />
            <FormInput
              label="Assigned To"
              required
              icon={<User size={18} />}
              placeholder="Select team member"
            />
          </FormRow>
        </FormSection>

        <div className="flex justify-end gap-4">
          <button type="button" className="form-button-secondary">
            Cancel
          </button>
          <button type="submit" className="form-button">
            Create Deal
          </button>
        </div>
      </form>
    </FormContainer>
  );
};