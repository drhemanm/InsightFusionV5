import React from 'react';
import {
  DollarSign,
  User,
  Calendar,
  TrendingUp,
  FileText,
  Edit,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Modal, Button, Badge, Card, CardBody } from '../ui';
import { useDealStore } from '../../store/dealStore';
import type { Deal } from '../../types';

interface DealDetailModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  isOpen,
  onClose
}) => {
  const { deleteDeal } = useDealStore();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDeal(deal.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete deal:', error);
      }
    }
  };

  const stageColors: Record<string, string> = {
    'lead': 'default',
    'qualified': 'info',
    'proposal': 'primary',
    'negotiation': 'warning',
    'closed-won': 'success',
    'closed-lost': 'error'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal.title}
      size="lg"
      footer={
        <div className="flex gap-3 justify-between w-full">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={16} />}
            onClick={handleDelete}
          >
            Delete Deal
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" leftIcon={<Edit size={16} />}>
              Edit Deal
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stage & Value */}
        <div className="flex items-center justify-between p-4 bg-dark-200/50 rounded-lg">
          <div>
            <p className="text-xs text-gray-400 mb-1">Deal Value</p>
            <p className="text-3xl font-bold text-accent-400">
              ${(deal.value / 1000).toFixed(1)}K
            </p>
            {deal.probability && (
              <p className="text-sm text-gray-400 mt-1">
                {deal.probability}% win probability
              </p>
            )}
          </div>
          <Badge
            variant={stageColors[deal.stage] as any}
            size="lg"
          >
            {deal.stage.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Key Information */}
        <Card variant="glass">
          <CardBody>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
              Deal Information
            </h3>
            <div className="space-y-4">
              {deal.contactId && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Contact</p>
                    <p className="text-sm text-gray-200">{deal.contactId}</p>
                  </div>
                </div>
              )}

              {deal.expectedCloseDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Expected Close Date</p>
                    <p className="text-sm text-gray-200">
                      {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Created</p>
                  <p className="text-sm text-gray-200">
                    {new Date(deal.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Updated</p>
                  <p className="text-sm text-gray-200">
                    {new Date(deal.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Description */}
        {deal.description && (
          <Card variant="glass">
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Description
              </h3>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {deal.description}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Notes */}
        {deal.notes && (
          <Card variant="glass">
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Notes
              </h3>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {deal.notes}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Quick Actions */}
        <Card variant="glass">
          <CardBody>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Quick Actions
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<Mail size={16} />}
              >
                Email
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<Phone size={16} />}
              >
                Call
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<MessageSquare size={16} />}
              >
                Note
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Modal>
  );
};
