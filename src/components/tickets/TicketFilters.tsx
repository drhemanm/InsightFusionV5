import React from 'react';
import { Filter } from 'lucide-react';

interface TicketFiltersProps {
  filters: {
    status: string;
    priority: string;
    category: string;
  };
  onChange: (filters: any) => void;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter size={20} className="text-gray-400" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option value="technical">Technical</option>
        <option value="billing">Billing</option>
        <option value="inquiry">General Inquiry</option>
        <option value="feature_request">Feature Request</option>
        <option value="bug_report">Bug Report</option>
      </select>
    </div>
  );
};