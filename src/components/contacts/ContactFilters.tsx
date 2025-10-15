import React from 'react';
import { Button, Dropdown, Badge } from '../ui';
import { X } from 'lucide-react';

interface ContactFiltersProps {
  filters: {
    status: string;
    tags: string[];
  };
  onChange: (filters: { status: string; tags: string[] }) => void;
}

export const ContactFilters: React.FC<ContactFiltersProps> = ({
  filters,
  onChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'lead', label: 'Lead' },
    { value: 'customer', label: 'Customer' }
  ];

  const clearFilters = () => {
    onChange({
      status: 'all',
      tags: []
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.tags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Status:</span>
          <Dropdown
            options={statusOptions}
            value={filters.status}
            onChange={(value) => onChange({ ...filters, status: value })}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<X size={16} />}
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400">Active filters:</span>
          {filters.status !== 'all' && (
            <Badge
              variant="primary"
              size="sm"
              removable
              onRemove={() => onChange({ ...filters, status: 'all' })}
            >
              Status: {filters.status}
            </Badge>
          )}
          {filters.tags.map((tag) => (
            <Badge
              key={tag}
              variant="primary"
              size="sm"
              removable
              onRemove={() =>
                onChange({
                  ...filters,
                  tags: filters.tags.filter((t) => t !== tag)
                })
              }
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
