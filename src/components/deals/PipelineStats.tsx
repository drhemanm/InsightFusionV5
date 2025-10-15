import React from 'react';
import { TrendingUp, DollarSign, Target, Award, Clock, AlertCircle } from 'lucide-react';
import { Card, CardBody, Badge } from '../ui';
import type { Deal } from '../../types';

interface PipelineStatsProps {
  deals: Deal[];
}

export const PipelineStats: React.FC<PipelineStatsProps> = ({ deals }) => {
  // Calculate stats
  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const avgDealValue = deals.length > 0 ? totalValue / deals.length : 0;
  
  const closedWonDeals = deals.filter(d => d.stage === 'closed-won');
  const closedLostDeals = deals.filter(d => d.stage === 'closed-lost');
  const activeDeals = deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage));
  
  const winRate = (closedWonDeals.length + closedLostDeals.length) > 0
    ? (closedWonDeals.length / (closedWonDeals.length + closedLostDeals.length) * 100)
    : 0;

  const weightedValue = activeDeals.reduce((sum, deal) => {
    return sum + (deal.value * (deal.probability || 50) / 100);
  }, 0);

  // Deals closing soon (within 7 days)
  const today = new Date();
  const dealsClosingSoon = activeDeals.filter(deal => {
    if (!deal.expectedCloseDate) return false;
    const closeDate = new Date(deal.expectedCloseDate);
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  // Overdue deals
  const overdueDeals = activeDeals.filter(deal => {
    if (!deal.expectedCloseDate) return false;
    const closeDate = new Date(deal.expectedCloseDate);
    return closeDate < today;
  });

  const stats = [
    {
      label: 'Total Pipeline Value',
      value: `$${(totalValue / 1000).toFixed(1)}K`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-accent-500 to-accent-600',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      label: 'Weighted Pipeline',
      value: `$${(weightedValue / 1000).toFixed(1)}K`,
      icon: <Target className="w-5 h-5" />,
      color: 'from-primary-500 to-primary-600',
      change: 'Based on probabilities',
      changeType: 'neutral'
    },
    {
      label: 'Average Deal Size',
      value: `$${(avgDealValue / 1000).toFixed(1)}K`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      change: `${deals.length} deals`,
      changeType: 'neutral'
    },
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: <Award className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      change: `${closedWonDeals.length} won / ${closedLostDeals.length} lost`,
      changeType: winRate >= 50 ? 'positive' : 'negative'
    },
    {
      label: 'Closing This Week',
      value: dealsClosingSoon.length.toString(),
      icon: <Clock className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600',
      change: `$${(dealsClosingSoon.reduce((sum, d) => sum + d.value, 0) / 1000).toFixed(1)}K value`,
      changeType: 'neutral'
    },
    {
      label: 'Overdue Deals',
      value: overdueDeals.length.toString(),
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'from-error to-red-600',
      change: overdueDeals.length > 0 ? 'Needs attention' : 'All on track',
      changeType: overdueDeals.length > 0 ? 'negative' : 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} variant="glass" hover>
          <CardBody padding="sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <div className="text-white">{stat.icon}</div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-100 mb-2">{stat.value}</p>
            
            <div className="flex items-center gap-1">
              <p className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-accent-400' :
                stat.changeType === 'negative' ? 'text-error' :
                'text-gray-400'
              }`}>
                {stat.change}
              </p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
