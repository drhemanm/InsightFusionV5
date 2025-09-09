import React from 'react';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { CommunicationTools } from './CommunicationTools';
import { SalesManagement } from './SalesManagement';
import { DataAnalytics } from './DataAnalytics';
import { AutomationIntegration } from './AutomationIntegration';
import { MobileCapabilities } from './MobileCapabilities';

export const FeaturesOverview: React.FC = () => {
  const { enabled: hasAdvancedFeatures } = useFeatureFlag('custom_reports');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Platform Features</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our comprehensive suite of sales tools designed to streamline your workflow,
          boost productivity, and drive results.
        </p>
        {hasAdvancedFeatures && (
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            <span>✨ Advanced Features Enabled</span>
          </div>
        )}
      </div>

      <CommunicationTools />
      <SalesManagement />
      <DataAnalytics />
      <AutomationIntegration />
      <MobileCapabilities />
    </div>
  );
};