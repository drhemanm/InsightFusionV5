import React from 'react';
import { Plus, X, Calculator } from 'lucide-react';
import { reportBuilderService } from '../../services/analytics/ReportBuilderService';
import type { ReportMetric } from '../../types/analytics';

interface MetricBuilderProps {
  metrics: ReportMetric[];
  dataSource: string;
  onChange: (metrics: ReportMetric[]) => void;
}

export const MetricBuilder: React.FC<MetricBuilderProps> = ({ metrics, dataSource, onChange }) => {
  const dataSources = reportBuilderService.getAvailableDataSources();
  const currentDataSource = dataSources.find(ds => ds.id === dataSource);

  const addMetric = () => {
    const newMetric: ReportMetric = {
      field: '',
      aggregation: 'count',
      label: '',
      format: 'number'
    };
    onChange([...metrics, newMetric]);
  };

  const updateMetric = (index: number, updates: Partial<ReportMetric>) => {
    const updatedMetrics = metrics.map((metric, i) => 
      i === index ? { ...metric, ...updates } : metric
    );
    onChange(updatedMetrics);
  };

  const removeMetric = (index: number) => {
    onChange(metrics.filter((_, i) => i !== index));
  };

  const aggregations = [
    { value: 'count', label: 'Count' },
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' },
    { value: 'distinct_count', label: 'Distinct Count' }
  ];

  const formats = [
    { value: 'number', label: 'Number' },
    { value: 'currency', label: 'Currency' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'date', label: 'Date' }
  ];

  if (!currentDataSource) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="text-green-500" size={20} />
          <h3 className="text-lg font-medium">Metrics</h3>
        </div>
        <button
          onClick={addMetric}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
        >
          <Plus size={16} />
          Add Metric
        </button>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-700">Field</label>
              <select
                value={metric.field}
                onChange={(e) => updateMetric(index, { field: e.target.value })}
                className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select field</option>
                {currentDataSource.fields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700">Aggregation</label>
              <select
                value={metric.aggregation}
                onChange={(e) => updateMetric(index, { aggregation: e.target.value as any })}
                className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                {aggregations.map(agg => (
                  <option key={agg.value} value={agg.value}>{agg.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-700">Label</label>
              <input
                type="text"
                value={metric.label}
                onChange={(e) => updateMetric(index, { label: e.target.value })}
                placeholder="Metric label"
                className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700">Format</label>
              <select
                value={metric.format}
                onChange={(e) => updateMetric(index, { format: e.target.value as any })}
                className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                {formats.map(format => (
                  <option key={format.value} value={format.value}>{format.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <button
                onClick={() => removeMetric(index)}
                className="w-full p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}

        {metrics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calculator size={32} className="mx-auto mb-2 text-gray-400" />
            <p>No metrics added yet</p>
            <p className="text-sm">Click "Add Metric" to define what to measure</p>
          </div>
        )}
      </div>
    </div>
  );
};