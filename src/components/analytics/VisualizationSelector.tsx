import React from 'react';
import { BarChart3, LineChart, PieChart, AreaChart, ScatterChart as Scatter, Activity } from 'lucide-react';
import type { VisualizationConfig } from '../../types/analytics';

interface VisualizationSelectorProps {
  config: VisualizationConfig;
  onChange: (config: VisualizationConfig) => void;
}

export const VisualizationSelector: React.FC<VisualizationSelectorProps> = ({ config, onChange }) => {
  const chartTypes = [
    { type: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
    { type: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
    { type: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
    { type: 'area', label: 'Area Chart', icon: AreaChart, description: 'Show cumulative values over time' },
    { type: 'scatter', label: 'Scatter Plot', icon: Scatter, description: 'Show correlation between variables' },
    { type: 'heatmap', label: 'Heatmap', icon: Activity, description: 'Show data density or intensity' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium mb-4">Visualization</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Chart Type</label>
          <div className="grid grid-cols-2 gap-3">
            {chartTypes.map((chart) => {
              const Icon = chart.icon;
              return (
                <button
                  key={chart.type}
                  onClick={() => onChange({ ...config, type: chart.type as any })}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    config.type === chart.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={20} className={config.type === chart.type ? 'text-blue-500' : 'text-gray-400'} />
                    <span className="font-medium">{chart.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{chart.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Chart Title</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => onChange({ ...config, title: e.target.value })}
              placeholder="Enter chart title"
              className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <input
              type="text"
              value={config.subtitle || ''}
              onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
              placeholder="Enter subtitle"
              className="mt-1 block w-full text-sm rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.showLegend}
              onChange={(e) => onChange({ ...config, showLegend: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show Legend</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.showGrid}
              onChange={(e) => onChange({ ...config, showGrid: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show Grid Lines</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
          <div className="flex gap-2">
            {[
              ['#3B82F6', '#10B981', '#F59E0B'],
              ['#EF4444', '#8B5CF6', '#06B6D4'],
              ['#84CC16', '#F97316', '#EC4899']
            ].map((colors, index) => (
              <button
                key={index}
                onClick={() => onChange({ ...config, colors })}
                className={`flex gap-1 p-2 border rounded ${
                  JSON.stringify(config.colors) === JSON.stringify(colors)
                    ? 'border-blue-500'
                    : 'border-gray-200'
                }`}
              >
                {colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};