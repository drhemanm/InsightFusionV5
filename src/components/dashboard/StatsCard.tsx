import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardBody } from '../ui';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  iconBgColor = 'from-primary-500 to-accent-500'
}) => {
  const isPositive = change >= 0;

  return (
    <Card variant="glass" hover className="group">
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-gray-100 mb-3">
              {value}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-accent-400' : 'text-error'
              }`}>
                {isPositive ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                <span>{Math.abs(change)}%</span>
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>

          <div className={`relative p-3 rounded-xl bg-gradient-to-br ${iconBgColor} group-hover:scale-110 transition-transform`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
