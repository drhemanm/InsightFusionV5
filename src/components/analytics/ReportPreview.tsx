import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { ChartData, VisualizationConfig } from '../../types/analytics';

interface ReportPreviewProps {
  data: ChartData;
  config: VisualizationConfig;
  title: string;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ data, config, title }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const renderChart = () => {
    const chartData = data.labels.map((label, index) => {
      const point: any = { name: label };
      data.datasets.forEach(dataset => {
        point[dataset.label] = dataset.data[index];
      });
      return point;
    });

    switch (config.type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {config.showLegend && <Legend />}
            {data.datasets.map((dataset, index) => (
              <Bar
                key={dataset.label}
                dataKey={dataset.label}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={chartData}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {config.showLegend && <Legend />}
            {data.datasets.map((dataset, index) => (
              <Line
                key={dataset.label}
                type="monotone"
                dataKey={dataset.label}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={chartData}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {config.showLegend && <Legend />}
            {data.datasets.map((dataset, index) => (
              <Area
                key={dataset.label}
                type="monotone"
                dataKey={dataset.label}
                stackId="1"
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        const pieData = data.labels.map((label, index) => ({
          name: label,
          value: data.datasets[0]?.data[index] || 0
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            {config.showLegend && <Legend />}
          </PieChart>
        );

      default:
        return <div className="text-center text-gray-500">Unsupported chart type</div>;
    }
  };

  return (
    <div className="space-y-4">
      {(config.title || title) && (
        <div className="text-center">
          <h3 className="text-lg font-bold">{config.title || title}</h3>
          {config.subtitle && (
            <p className="text-sm text-gray-600">{config.subtitle}</p>
          )}
        </div>
      )}

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Data Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-2">Data Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Data Points:</span>
            <span className="ml-2 font-medium">{data.labels.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Metrics:</span>
            <span className="ml-2 font-medium">{data.datasets.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};