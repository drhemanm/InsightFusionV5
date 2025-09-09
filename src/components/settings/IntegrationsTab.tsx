import React from 'react';
import { Mail, Calendar, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { IntegrationsManager } from '../integrations/IntegrationsManager';

export const IntegrationsTab: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState<Date | null>(null);

  const handleRefreshIntegrations = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSync(new Date());
      alert('Integrations refreshed successfully!');
    }, 2000);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h2>
          <p className="text-gray-600">Connect your favorite tools and services</p>
        </div>
        <button
          onClick={handleRefreshIntegrations}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh All'}
        </button>
      </div>

      {/* Integration Status Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-medium mb-4">Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-500" size={20} />
            <div>
              <div className="font-medium text-green-700">2 Connected</div>
              <div className="text-xs text-green-600">Working properly</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="text-yellow-500" size={20} />
            <div>
              <div className="font-medium text-yellow-700">1 Needs Attention</div>
              <div className="text-xs text-yellow-600">Requires reconnection</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-700">5 Available</div>
              <div className="text-xs text-gray-600">Ready to connect</div>
            </div>
          </div>
        </div>
        
        {lastSync && (
          <div className="mt-4 text-sm text-gray-500">
            Last synced: {lastSync.toLocaleString()}
          </div>
        )}
      </div>
      <IntegrationsManager />

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-2">Integration Tips</h3>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-2">
          <li>Connect Gmail to automatically sync your emails and import contacts</li>
          <li>Use Google Calendar integration for seamless meeting scheduling and reminders</li>
          <li>Enable WhatsApp Business for direct customer communication</li>
          <li>Connect your CRM with Slack for team notifications and updates</li>
          <li>Integrate with Zoom for automatic meeting link generation</li>
        </ul>
      </div>
    </div>
  );
};