import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, Button, Skeleton } from '../ui';
import type { Deal } from '../../types';

interface DealsPipelinePreviewProps {
  deals: Deal[];
  isLoading?: boolean;
}

export const DealsPipelinePreview: React.FC<DealsPipelinePreviewProps> = ({ 
  deals, 
  isLoading 
}) => {
  const navigate = useNavigate();

  // Group deals by stage
  const stages = [
    { id: 'lead', label: 'Lead', color: 'text-gray-400 bg-gray-500/10' },
    { id: 'qualified', label: 'Qualified', color: 'text-blue-400 bg-blue-500/10' },
    { id: 'proposal', label: 'Proposal', color: 'text-purple-400 bg-purple-500/10' },
    { id: 'negotiation', label: 'Negotiation', color: 'text-orange-400 bg-orange-500/10' },
    { id: 'closed-won', label: 'Closed Won', color: 'text-accent-400 bg-accent-500/10' }
  ];

  const dealsByStage = stages.map(stage => ({
    ...stage,
    deals: deals.filter(deal => deal.stage === stage.id),
    totalValue: deals
      .filter(deal => deal.stage === stage.id)
      .reduce((sum, deal) => sum + (deal.value || 0), 0)
  }));

  return (
    <Card variant="glass">
      <CardHeader 
        title="Deals Pipeline"
        subtitle={`${deals.length} active deals`}
        action={
          <Button 
            variant="ghost" 
            size="sm"
            rightIcon={<ArrowRight size={16} />}
            onClick={() => navigate('/deals')}
          >
            View Pipeline
          </Button>
        }
      />
      <CardBody>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton variant="rectangular" height={120} count={2} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pipeline Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {dealsByStage.map((stage) => (
                <div
                  key={stage.id}
                  className="p-4 rounded-lg border border-primary-500/10 hover:border-primary-500/30 transition-colors"
                >
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mb-2 ${stage.color}`}>
                    {stage.label}
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {stage.deals.length}
                  </div>
                  <div className="text-xs text-gray-400">
                    ${(stage.totalValue / 1000).toFixed(1)}K
                  </div>
                </div>
              ))}
            </div>

            {/* Top Deals */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                Top Deals
              </h4>
              <div className="space-y-2">
                {deals
                  .sort((a, b) => (b.value || 0) - (a.value || 0))
                  .slice(0, 5)
                  .map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-200/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/deals/${deal.id}`)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg group-hover:scale-110 transition-transform">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-200 truncate group-hover:text-primary-400 transition-colors">
                            {deal.title}
                          </h5>
                          <p className="text-xs text-gray-400">
                            {deal.contactId || 'No contact'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={
                            deal.stage === 'closed-won' ? 'success' : 
                            deal.stage === 'negotiation' ? 'warning' : 
                            'primary'
                          }
                          size="sm"
                        >
                          {stages.find(s => s.id === deal.stage)?.label}
                        </Badge>
                        <span className="text-sm font-bold text-accent-400">
                          ${(deal.value / 1000).toFixed(1)}K
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pipeline Progress */}
            <div className="p-4 bg-dark-200/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Pipeline Health</span>
                <span className="text-sm font-medium text-accent-400">85%</span>
              </div>
              <div className="w-full bg-dark-400 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                  style={{ width: '85%' }}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-accent-400" />
                <span className="text-xs text-gray-400">
                  12% increase from last month
                </span>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
