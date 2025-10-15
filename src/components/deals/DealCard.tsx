import React from 'react';
import { DollarSign, User, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardBody, Badge, Avatar } from '../ui';
import type { Deal } from '../../types';

interface DealCardProps {
  deal: Deal;
  onDragStart: (deal: Deal) => void;
  onClick: () => void;
  isDragging: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onDragStart,
  onClick,
  isDragging
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Calculate days until expected close
  const getDaysUntilClose = () => {
    if (!deal.expectedCloseDate) return null;
    const today = new Date();
    const closeDate = new Date(deal.expectedCloseDate);
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilClose = getDaysUntilClose();

  return (
    <Card
      variant="glass"
      hover
      className={`cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'opacity-50 rotate-2 scale-95' : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <CardBody padding="sm">
        {/* Title */}
        <h4 className="text-sm font-semibold text-gray-200 mb-3 line-clamp-2">
          {deal.title}
        </h4>

        {/* Value */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-accent-500/10 rounded-lg">
            <DollarSign className="w-4 h-4 text-accent-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-accent-400">
              ${(deal.value / 1000).toFixed(1)}K
            </p>
            {deal.probability && (
              <p className="text-xs text-gray-400">
                {deal.probability}% probability
              </p>
            )}
          </div>
        </div>

        {/* Contact */}
        {deal.contactId && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-primary-500/10">
            <User className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-400 truncate">
              {deal.contactId}
            </p>
          </div>
        )}

        {/* Expected Close Date */}
        {deal.expectedCloseDate && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-400">
                {new Date(deal.expectedCloseDate).toLocaleDateString()}
              </p>
            </div>
            {daysUntilClose !== null && (
              <Badge
                variant={
                  daysUntilClose < 0 ? 'error' :
                  daysUntilClose < 7 ? 'warning' :
                  'default'
                }
                size="sm"
              >
                {daysUntilClose < 0 ? 'Overdue' :
                 daysUntilClose === 0 ? 'Today' :
                 daysUntilClose === 1 ? 'Tomorrow' :
                 `${daysUntilClose}d`}
              </Badge>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
