import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, CheckCircle, Zap, Calendar } from 'lucide-react';

interface AutomationMetricsProps {
  automations: Array<{
    id: string;
    name: string;
    runsCount: number;
    successRate: number;
    status: string;
    lastRun?: Date;
  }>;
}

export const AutomationMetrics: React.FC<AutomationMetricsProps> = ({ automations }) => {
  // Calculate metrics
  const totalRuns = automations.reduce((sum, a) => sum + a.runsCount, 0);
  const avgSuccessRate = automations.length > 0 
    ? automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length 
    : 0;
  const activeCount = automations.filter(a => a.status === 'active').length;

  // Prepare chart data
  const performanceData = automations.map(automation => ({
    name: automation.name.substring(0, 15) + (automation.name.length > 15 ? '...' : ''),
    runs: automation.runsCount,
    successRate: automation.successRate
  }));

  const statusData = [
    { name: 'Active', value: automations.filter(a => a.status === 'active').length, color: '#10B981' },
    { name: 'Paused', value: automations.filter(a => a.status === 'paused').length, color: '#F59E0B' },
    { name: 'Draft', value: automations.filter(a => a.status === 'draft').length, color: '#6B7280' }
  ];

  // Mock time series data for trends
  const trendData = [
    { date: 'Jan', runs: 245, success: 96.2 },
    { date: 'Feb', runs: 289, success: 97.1 },
    { date: 'Mar', runs: 312, success: 95.8 },
    { date: 'Apr', runs: 356, success: 98.3 },
    { date: 'May', runs: 398, success: 97.9 },
    { date: 'Jun', runs: 445, success: 98.7 }
  ];

  const timeSavedData = [
    { category: 'Email Automation', hours: 12.5 },
    { category: 'Task Creation', hours: 8.3 },
    { category: 'Lead Routing', hours: 6.7 },
    { category: 'Notifications', hours: 4.2 },
    { category: 'Data Updates', hours: 3.8 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Automation Analytics</h2>
        <p className="text-gray-600">Track the performance and impact of your automations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Executions</h3>
            <Zap className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-blue-600">{totalRuns.toLocaleString()}</div>
          <div className="text-sm text-green-600 mt-1">+23% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-green-600">{avgSuccessRate.toFixed(1)}%</div>
          <div className="text-sm text-green-600 mt-1">+2.1% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Active Automations</h3>
            <TrendingUp className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-purple-600">{activeCount}</div>
          <div className="text-sm text-gray-500 mt-1">of {automations.length} total</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Time Saved</h3>
            <Clock className="text-orange-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-orange-600">35.5h</div>
          <div className="text-sm text-green-600 mt-1">this month</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Automation Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="runs" name="Total Runs" fill="#3B82F6" />
                <Bar yAxisId="right" dataKey="successRate" name="Success Rate %" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Automation Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="runs" 
                  name="Total Runs"
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="success" 
                  name="Success Rate %"
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Saved Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Time Saved by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSavedData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value} hours`, 'Time Saved']} />
                <Bar dataKey="hours" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📊 Automation Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-500" size={20} />
              <h4 className="font-medium">Top Performer</h4>
            </div>
            <p className="text-sm text-gray-600">
              "Welcome New Leads" has the highest success rate at 98.7%
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-blue-500" size={20} />
              <h4 className="font-medium">Time Saver</h4>
            </div>
            <p className="text-sm text-gray-600">
              Automations save your team 35.5 hours per month on average
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-purple-500" size={20} />
              <h4 className="font-medium">Growth Trend</h4>
            </div>
            <p className="text-sm text-gray-600">
              Automation usage has increased 23% this month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};