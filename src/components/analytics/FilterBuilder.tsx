import React from 'react';
import { Plus, X, Filter } from 'lucide-react';
import { reportBuilderService } from '../../services/analytics/ReportBuilderService';
import type { ReportFilter } from '../../types/analytics';

interface FilterBuilderProps {
  filters: ReportFilter[];
  dataSource: string;
  onChange: (filters: ReportFilter[]) => void;
}

export const FilterBuilder: React.FC<FilterBuilderProps> = ({ filters, dataSource, onChange }) => {
  const dataSources = reportBuilderService.getAvailableDataSources();
  const currentDataSource = dataSources.find(ds => ds.id === dataSource);

  const addFilter = () => {
    const newFilter: ReportFilter = {
      field: '',
      operator: 'equals',
      value: '',
      label: ''
    };
    onChange([...filters, newFilter]);
  };

  const updateFilter = (index: number, updates: Partial<ReportFilter>) => {
    const updatedFilters = filters.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    );
    onChange(updatedFilters);
  };

  const removeFilter = (index: number) => {
    onChange(filters.filter((_, i) => i !== index));
  };

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'between', label: 'Between' },
    { value: 'in', label: 'In' }
  ];

  if (!currentDataSource) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="text-blue-500" size={20} />
          <h3 className="text-lg font-medium">Filters</h3>
        </div>
        <button
          onClick={addFilter}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          <Plus size={16} />
          Add Filter
        </button>
      </div>

      <div className="space-y-4">
        {filters.map((filter, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-700">Field</label>
              <select
                value={filter.field}
                onChange={(e) => updateFilter(index, { field: e.target.value })}
                className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select field</option>
                {currentDataSource.fields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-700">Operator</label>
              <select
                value={filter.operator}
                onChange={(e) => updateFilter(index, { operator: e.target.value as any })}
                className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                {operators.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-4">
              <label className="block text-xs font-medium text-gray-700">Value</label>
              {filter.operator === 'between' ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="From"
                    value={Array.isArray(filter.value) ? filter.value[0] : ''}
                    onChange={(e) => updateFilter(index, { 
                      value: [e.target.value, Array.isArray(filter.value) ? filter.value[1] : '']
                    })}
                    className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="To"
                    value={Array.isArray(filter.value) ? filter.value[1] : ''}
                    onChange={(e) => updateFilter(index, { 
                      value: [Array.isArray(filter.value) ? filter.value[0] : '', e.target.value]
                    })}
                    className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={Array.isArray(filter.value) ? filter.value.join(',') : filter.value}
                  onChange={(e) => updateFilter(index, { 
                    value: filter.operator === 'in' ? e.target.value.split(',') : e.target.value 
                  })}
                  placeholder={filter.operator === 'in' ? 'value1,value2,value3' : 'Enter value'}
                  className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>

            <div className="col-span-2">
              <button
                onClick={() => removeFilter(index)}
                className="w-full p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}

        {filters.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Filter size={32} className="mx-auto mb-2 text-gray-400" />
            <p>No filters added yet</p>
            <p className="text-sm">Click "Add Filter" to filter your data</p>
          </div>
        )}
      </div>
    </div>
  );
};