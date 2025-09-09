import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { MetricsOverview } from './metrics/MetricsOverview';
import { PerformanceChart } from './charts/PerformanceChart';
import { ActivityStream } from '../analytics/ActivityStream';
import { GamificationDashboard } from '../gamification/GamificationDashboard';
import { useContactStore } from '../../store/contactStore';
import { useDealStore } from '../../store/dealStore';
import { useTicketStore } from '../../store/ticketStore';
import { useEffect } from 'react';
import type { TimeRange } from './filters/TimeRangeFilter';

export const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange['value']>('30d');
  const [showGamification, setShowGamification] = useState(false);
  const { fetchContacts } = useContactStore();
  const { fetchDeals } = useDealStore();
  const { fetchTickets } = useTicketStore();

  useEffect(() => {
    // Initialize data on dashboard load
    fetchContacts();
    fetchDeals();
    fetchTickets();
  }, [fetchContacts, fetchDeals, fetchTickets]);

  const handleTimeRangeChange = (value: TimeRange['value']) => {
    setTimeRange(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DashboardHeader 
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onGamificationToggle={() => setShowGamification(!showGamification)}
      />
      
      {showGamification ? (
        <GamificationDashboard />
      ) : (
        <div className="space-y-6">
          <MetricsOverview timeRange={timeRange} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart timeRange={timeRange} />
            <ActivityStream timeRange={timeRange} />
          </div>
        </div>
      )}
    </div>
  );
};