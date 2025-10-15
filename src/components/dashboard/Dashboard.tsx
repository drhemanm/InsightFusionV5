import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckSquare,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Mail,
  Phone,
  Target
} from 'lucide-react';
import { Card, CardHeader, CardBody, Button, Badge, Avatar, Skeleton } from '../ui';
import { useContactStore } from '../../store/contactStore';
import { useDealStore } from '../../store/dealStore';
import { useTicketStore } from '../../store/ticketStore';
import { StatsCard } from './StatsCard';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { UpcomingTasks } from './UpcomingTasks';
import { DealsPipelinePreview } from './DealsPipelinePreview';

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { contacts, fetchContacts } = useContactStore();
  const { deals, fetchDeals } = useDealStore();
  const { tickets, fetchTickets } = useTicketStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchContacts(),
          fetchDeals(),
          fetchTickets()
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchContacts, fetchDeals, fetchTickets]);

  // Calculate stats
  const totalContacts = contacts?.length || 0;
  const totalDeals = deals?.length || 0;
  const totalRevenue = deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
  const openTickets = tickets?.filter(t => t.status !== 'closed').length || 0;
  
  const closedDeals = deals?.filter(d => d.stage === 'closed-won').length || 0;
  const dealsGrowth = closedDeals > 0 ? ((closedDeals / totalDeals) * 100).toFixed(1) : '0';
  
  const newContactsThisMonth = contacts?.filter(c => {
    const date = new Date(c.createdAt || Date.now());
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length || 0;
  const contactsGrowth = ((newContactsThisMonth / Math.max(totalContacts, 1)) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Welcome Back! 👋
            </h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening with your business today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <Calendar size={18} />
              Today
            </Button>
            <Button variant="primary" size="sm">
              <Plus size={18} />
              New Deal
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} variant="glass">
                <Skeleton variant="rectangular" height={120} />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Revenue"
              value={`$${(totalRevenue / 1000).toFixed(1)}K`}
              change={+12.5}
              icon={<DollarSign size={24} />}
              iconBgColor="from-accent-500 to-accent-600"
            />
            <StatsCard
              title="Total Contacts"
              value={totalContacts.toString()}
              change={+Number(contactsGrowth)}
              icon={<Users size={24} />}
              iconBgColor="from-primary-500 to-primary-600"
            />
            <StatsCard
              title="Active Deals"
              value={totalDeals.toString()}
              change={+Number(dealsGrowth)}
              icon={<TrendingUp size={24} />}
              iconBgColor="from-blue-500 to-blue-600"
            />
            <StatsCard
              title="Open Tickets"
              value={openTickets.toString()}
              change={-8.2}
              icon={<CheckSquare size={24} />}
              iconBgColor="from-purple-500 to-purple-600"
            />
          </div>
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deals Pipeline Preview */}
            <DealsPipelinePreview deals={deals || []} isLoading={isLoading} />

            {/* Recent Activity */}
            <RecentActivity isLoading={isLoading} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <UpcomingTasks isLoading={isLoading} />

            {/* Top Contacts */}
            <Card variant="glass">
              <CardHeader 
                title="Top Contacts"
                subtitle="Most active this month"
              />
              <CardBody>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton variant="rectangular" height={60} count={3} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contacts?.slice(0, 5).map((contact, index) => (
                      <div 
                        key={contact.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-200/50 transition-colors cursor-pointer"
                      >
                        <Avatar 
                          name={`${contact.firstName} ${contact.lastName}`}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {contact.email}
                          </p>
                        </div>
                        <Badge variant="primary" size="sm">
                          #{index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
