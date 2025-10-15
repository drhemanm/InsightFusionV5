import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, Button, Skeleton } from '../ui';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  relatedTo?: string;
}

interface UpcomingTasksProps {
  isLoading?: boolean;
}

export const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ isLoading }) => {
  // Mock data - replace with real data from your store
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Follow up with John Smith',
      dueDate: 'Today, 2:00 PM',
      priority: 'urgent',
      status: 'pending',
      relatedTo: 'Enterprise Deal'
    },
    {
      id: '2',
      title: 'Send proposal to Jane Doe',
      dueDate: 'Today, 4:30 PM',
      priority: 'high',
      status: 'in-progress',
      relatedTo: 'SaaS Deal'
    },
    {
      id: '3',
      title: 'Prepare demo for Tech Corp',
      dueDate: 'Tomorrow, 10:00 AM',
      priority: 'high',
      status: 'pending'
    },
    {
      id: '4',
      title: 'Review contract terms',
      dueDate: 'Tomorrow, 3:00 PM',
      priority: 'medium',
      status: 'pending',
      relatedTo: 'Consulting Deal'
    },
    {
      id: '5',
      title: 'Update CRM records',
      dueDate: 'This week',
      priority: 'low',
      status: 'pending'
    }
  ];

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="error" size="sm" dot>Urgent</Badge>;
      case 'high':
        return <Badge variant="warning" size="sm">High</Badge>;
      case 'medium':
        return <Badge variant="info" size="sm">Medium</Badge>;
      case 'low':
        return <Badge variant="default" size="sm">Low</Badge>;
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-accent-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-primary-400 animate-pulse" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card variant="glass">
      <CardHeader 
        title="Upcoming Tasks"
        subtitle={`${tasks.filter(t => t.status !== 'completed').length} pending`}
        action={
          <Button variant="ghost" size="sm">
            View All
          </Button>
        }
      />
      <CardBody>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton variant="rectangular" height={80} count={3} />
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg border border-primary-500/10 hover:border-primary-500/30 hover:bg-dark-200/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    {getStatusIcon(task.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-200 mb-1 group-hover:text-primary-400 transition-colors">
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {task.dueDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(task.priority)}
                      {task.relatedTo && (
                        <span className="text-xs text-gray-500">
                          {task.relatedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
