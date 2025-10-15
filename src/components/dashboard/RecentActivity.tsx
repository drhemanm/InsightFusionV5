import React from 'react';
import { 
  UserPlus, 
  DollarSign, 
  Mail, 
  Phone, 
  CheckCircle,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, Avatar, Skeleton } from '../ui';

interface Activity {
  id: string;
  type: 'contact' | 'deal' | 'email' | 'call' | 'task' | 'message' | 'meeting';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityProps {
  isLoading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ isLoading }) => {
  // Mock data - replace with real data from your store
  const activities: Activity[] = [
    {
      id: '1',
      type: 'deal',
      title: 'New deal created',
      description: 'Enterprise Software Deal worth $50,000',
      timestamp: '5 minutes ago',
      user: { name: 'You' }
    },
    {
      id: '2',
      type: 'contact',
      title: 'Contact added',
      description: 'John Smith from Acme Corp',
      timestamp: '1 hour ago',
      user: { name: 'Sarah Johnson' }
    },
    {
      id: '3',
      type: 'email',
      title: 'Email sent',
      description: 'Proposal sent to Mike Davis',
      timestamp: '2 hours ago',
      user: { name: 'You' }
    },
    {
      id: '4',
      type: 'task',
      title: 'Task completed',
      description: 'Follow up call with Jane Doe',
      timestamp: '3 hours ago',
      user: { name: 'You' }
    },
    {
      id: '5',
      type: 'meeting',
      title: 'Meeting scheduled',
      description: 'Product demo with Tech Solutions Inc',
      timestamp: '5 hours ago',
      user: { name: 'Bob Wilson' }
    }
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'contact':
        return <UserPlus className="w-4 h-4" />;
      case 'deal':
        return <DollarSign className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'task':
        return <CheckCircle className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'contact':
        return 'text-primary-400 bg-primary-500/10';
      case 'deal':
        return 'text-accent-400 bg-accent-500/10';
      case 'email':
        return 'text-blue-400 bg-blue-500/10';
      case 'call':
        return 'text-purple-400 bg-purple-500/10';
      case 'task':
        return 'text-green-400 bg-green-500/10';
      case 'message':
        return 'text-pink-400 bg-pink-500/10';
      case 'meeting':
        return 'text-orange-400 bg-orange-500/10';
    }
  };

  return (
    <Card variant="glass">
      <CardHeader 
        title="Recent Activity"
        subtitle="Latest updates across your CRM"
      />
      <CardBody>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton variant="rectangular" height={80} count={4} />
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-dark-200/50 transition-colors cursor-pointer group"
              >
                <div className={`p-3 rounded-lg ${getActivityColor(activity.type)} group-hover:scale-110 transition-transform`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-200">
                      {activity.title}
                    </h4>
                    {activity.user && (
                      <Badge variant="default" size="sm">
                        {activity.user.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
