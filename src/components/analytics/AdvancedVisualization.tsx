import React, { useState } from 'react';
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, FunnelChart, Funnel, LabelList
} from 'recharts';
import { TrendingUp, BarChart3, Activity, Target } from 'lucide-react';

export const AdvancedVisualization: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState('composed');

  // Sample data for different chart types
  const salesData = [
    { month: 'Jan', revenue: 85000, deals: 45, target: 90000, growth: 12 },
    { month: 'Feb', revenue: 92000, deals: 52, target: 90000, growth: 8 },
    { month: 'Mar', revenue: 125000, deals: 68, target: 90000, growth: 36 },
    { month: 'Apr', revenue: 115000, deals: 62, target: 90000, growth: 28 },
    { month: 'May', revenue: 108000, deals: 55, target: 90000, growth: 20 },
    { month: 'Jun', revenue: 132000, deals: 71, target: 90000, growth: 47 }
  ];

  const scatterData = [
    { x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 }
  ];

  const radarData = [
    { subject: 'Lead Quality', A: 120, B: 110, fullMark: 150 },
    { subject: 'Conversion Rate', A: 98, B: 130, fullMark: 150 },
    { subject: 'Response Time', A: 86, B: 130, fullMark: 150 },
    { subject: 'Customer Satisfaction', A: 99, B: 100, fullMark: 150 },
    { subject: 'Revenue Growth', A: 85, B: 90, fullMark: 150 },
    { subject: 'Market Share', A: 65, B: 85, fullMark: 150 }
  ];

  const treemapData = [
    { name: 'Technology', size: 45000, fill: '#3B82F6' },
    { name: 'Healthcare', size: 32000, fill: '#10B981' },
    { name: 'Finance', size: 28000, fill: '#F59E0B' },
    { name: 'Retail', size: 22000, fill: '#EF4444' },
    { name: 'Manufacturing', size: 18000, fill: '#8B5CF6' },
    { name: 'Education', size: 15000, fill: '#06B6D4' }
  ];

  const funnelData = [
    { name: 'Leads', value: 1000, fill: '#3B82F6' },
    { name: 'Qualified', value: 750, fill: '#10B981' },
    { name: 'Proposals', value: 500, fill: '#F59E0B' },
    { name: 'Negotiations', value: 300, fill: '#EF4444' },
    { name: 'Closed Won', value: 200, fill: '#8B5CF6' }
  ];

  const chartTypes = [
    { id: 'composed', name: 'Composed Chart', icon: BarChart3 },
    { id: 'scatter', name: 'Scatter Plot', icon: Activity },
    { id: 'radar', name: 'Radar Chart', icon: Target },
    { id: 'treemap', name: 'Treemap', icon: BarChart3 },
    { id: 'funnel', name: 'Funnel Chart', icon: TrendingUp }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'composed':
        return (
          <ComposedChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#3B82F6" />
            <Line yAxisId="right" type="monotone" dataKey="deals" name="Deals" stroke="#10B981" strokeWidth={3} />
            <Line yAxisId="left" type="monotone" dataKey="target" name="Target" stroke="#EF4444" strokeDasharray="5 5" />
          </ComposedChart>
        );

      case 'scatter':
        return (
          <ScatterChart data={scatterData}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Deal Value" unit="k" />
            <YAxis type="number" dataKey="y" name="Probability" unit="%" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Deals" dataKey="z" fill="#8B5CF6" />
          </ScatterChart>
        );

      case 'radar':
        return (
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name="Current Quarter" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            <Radar name="Previous Quarter" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        );

      case 'treemap':
        return (
          <Treemap
            data={treemapData}
            dataKey="size"
            ratio={4/3}
            stroke="#fff"
            fill="#8884d8"
          />
        );

      case 'funnel':
        return (
          <FunnelChart>
            <Tooltip />
            <Funnel
              dataKey="value"
              data={funnelData}
              isAnimationActive
            >
              <LabelList position="center" fill="#fff" stroke="none" />
            </Funnel>
          </FunnelChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Advanced Data Visualization</h1>
        <p className="text-gray-600">Explore your data with sophisticated chart types</p>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {chartTypes.map((chart) => {
          const Icon = chart.icon;
          return (
            <button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedChart === chart.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={16} />
              {chart.name}
            </button>
          );
        })}
      </div>

      {/* Chart Display */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-medium mb-3">Key Insights</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Revenue growth trending upward with 47% increase in June</li>
            <li>• Deal volume correlates strongly with revenue performance</li>
            <li>• Consistently exceeding targets since March</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-medium mb-3">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Monthly Growth:</span>
              <span className="font-medium">25.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Target Achievement:</span>
              <span className="font-medium text-green-600">146%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Best Performing Month:</span>
              <span className="font-medium">June 2024</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-medium mb-3">Recommendations</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Maintain current sales velocity through Q3</li>
            <li>• Investigate factors behind June's exceptional performance</li>
            <li>• Consider raising Q4 targets based on current trajectory</li>
          </ul>
        </div>
      </div>
    </div>
  );
};