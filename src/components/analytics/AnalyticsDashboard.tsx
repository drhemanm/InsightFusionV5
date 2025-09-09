import React, { useState } from 'react';
import { Brain, BarChart3, TrendingUp, Settings } from 'lucide-react';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { ReportBuilder } from './ReportBuilder';
import { AdvancedVisualization } from './AdvancedVisualization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { FeatureGate } from '../common/FeatureGate';

export const AnalyticsDashboard: React.FC = () => {
  const { enabled: hasAdvancedAnalytics } = useFeatureFlag('analytics_dashboard');

  return (
    <FeatureGate feature="analytics_dashboard">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Advanced Analytics</h1>
            <p className="text-gray-600">Powerful insights and custom reporting tools</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            <Brain size={16} />
            Enhanced Analytics
          </div>
        </div>

        <Tabs defaultValue="predictive">
          <TabsList className="mb-8">
            <TabsTrigger value="predictive">
              <Brain className="mr-2" size={16} />
              Predictive Analytics
            </TabsTrigger>
            <TabsTrigger value="reports">
              <BarChart3 className="mr-2" size={16} />
              Report Builder
            </TabsTrigger>
            <TabsTrigger value="visualization">
              <TrendingUp className="mr-2" size={16} />
              Advanced Charts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictive">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="reports">
            <ReportBuilder />
          </TabsContent>

          <TabsContent value="visualization">
            <AdvancedVisualization />
          </TabsContent>
        </Tabs>
      </div>
    </FeatureGate>
  );
};