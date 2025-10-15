import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, DollarSign, Filter, BarChart3 } from 'lucide-react';
import { useDealStore } from '../../store/dealStore';
import { Button, Card, CardBody, Spinner, Badge } from '../ui';
import { DealCard } from './DealCard';
import { DealDetailModal } from './DealDetailModal';
import { CreateDealModal } from './CreateDealModal';
import { PipelineStats } from './PipelineStats';
import type { Deal } from '../../types';

type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';

interface StageColumn {
  id: DealStage;
  label: string;
  color: string;
  icon: React.ReactNode;
}

export const DealPipeline: React.FC = () => {
  const { deals, fetchDeals, updateDeal, isLoading, error } = useDealStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const stages: StageColumn[] = [
    {
      id: 'lead',
      label: 'Lead',
      color: 'from-gray-500 to-gray-600',
      icon: <TrendingUp size={16} />
    },
    {
      id: 'qualified',
      label: 'Qualified',
      color: 'from-blue-500 to-blue-600',
      icon: <TrendingUp size={16} />
    },
    {
      id: 'proposal',
      label: 'Proposal',
      color: 'from-purple-500 to-purple-600',
      icon: <TrendingUp size={16} />
    },
    {
      id: 'negotiation',
      label: 'Negotiation',
      color: 'from-orange-500 to-orange-600',
      icon: <TrendingUp size={16} />
    },
    {
      id: 'closed-won',
      label: 'Closed Won',
      color: 'from-accent-500 to-accent-600',
      icon: <TrendingUp size={16} />
    },
    {
      id: 'closed-lost',
      label: 'Closed Lost',
      color: 'from-error to-red-600',
      icon: <TrendingUp size={16} />
    }
  ];

  // Handle drag start
  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = async (stageId: DealStage) => {
    if (!draggedDeal || draggedDeal.stage === stageId) {
      setDraggedDeal(null);
      return;
    }

    try {
      await updateDeal(draggedDeal.id, { ...draggedDeal, stage: stageId });
      setDraggedDeal(null);
    } catch (error) {
      console.error('Failed to update deal stage:', error);
    }
  };

  // Calculate stage stats
  const getStageDeals = (stageId: DealStage) => {
    return deals?.filter(deal => deal.stage === stageId) || [];
  };

  const getStageTotal = (stageId: DealStage) => {
    return getStageDeals(stageId).reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 p-8">
        <Card variant="glass">
          <CardBody>
            <div className="text-center py-12">
              <p className="text-error">{error}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Deal Pipeline
            </h1>
            <p className="text-gray-400 mt-1">
              {deals?.length || 0} active deals • ${((deals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0) / 1000).toFixed(1)}K total value
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<BarChart3 size={18} />}
              onClick={() => setShowStats(!showStats)}
            >
              {showStats ? 'Hide' : 'Show'} Stats
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={18} />}
              onClick={() => setShowCreateModal(true)}
            >
              New Deal
            </Button>
          </div>
        </div>

        {/* Pipeline Stats */}
        {showStats && <PipelineStats deals={deals || []} />}

        {/* Pipeline Board */}
        {isLoading ? (
          <Card variant="glass">
            <CardBody>
              <div className="flex justify-center py-12">
                <Spinner size="lg" text="Loading pipeline..." />
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {stages.map((stage) => {
                const stageDeals = getStageDeals(stage.id);
                const stageTotal = getStageTotal(stage.id);

                return (
                  <div
                    key={stage.id}
                    className="flex-shrink-0 w-80"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(stage.id)}
                  >
                    {/* Stage Header */}
                    <Card variant="glass">
                      <CardBody padding="sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stage.color}`}>
                              <div className="text-white">
                                {stage.icon}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-gray-200">
                                {stage.label}
                              </h3>
                              <p className="text-xs text-gray-400">
                                {stageDeals.length} deal{stageDeals.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <Badge variant="primary" size="sm">
                            ${(stageTotal / 1000).toFixed(1)}K
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Deals List */}
                    <div className="mt-3 space-y-3 min-h-[200px]">
                      {stageDeals.length === 0 ? (
                        <div className="p-6 text-center">
                          <p className="text-sm text-gray-500">No deals in this stage</p>
                        </div>
                      ) : (
                        stageDeals.map((deal) => (
                          <DealCard
                            key={deal.id}
                            deal={deal}
                            onDragStart={handleDragStart}
                            onClick={() => setSelectedDeal(deal)}
                            isDragging={draggedDeal?.id === deal.id}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateDealModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          isOpen={!!selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </div>
  );
};
