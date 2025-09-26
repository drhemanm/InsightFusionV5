import React from 'react';
import { Database, Activity, Users, DollarSign } from 'lucide-react';

export const DatabaseAuditPanel: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Database className="text-blue-500" size={32} />
        <div>
          <h1 className="text-3xl font-bold">Database Audit Panel</h1>
          <p className="text-gray-600">Monitor and analyze database performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Records</h3>
            <Activity className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-blue-600">1,234</div>
          <div className="text-sm text-gray-500">Across all collections</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Active Users</h3>
            <Users className="text-green-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-green-600">45</div>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Data Growth</h3>
            <DollarSign className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-purple-600">+12%</div>
          <div className="text-sm text-gray-500">This month</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Audit Results</h2>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-700">✅ Database Health: Excellent</h3>
            <p className="text-sm text-green-600">All systems operational</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-700">📊 Performance: Good</h3>
            <p className="text-sm text-blue-600">Average response time: 150ms</p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-700">⚠️ Recommendations</h3>
            <ul className="text-sm text-yellow-600 mt-2 space-y-1">
              <li>• Consider indexing frequently queried fields</li>
              <li>• Monitor storage usage growth</li>
              <li>• Review security rules periodically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};