import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, DollarSign, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  path: string;
}

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: 'add-contact',
      label: 'Add Contact',
      icon: <UserPlus size={20} />,
      color: 'from-primary-500 to-primary-600',
      hoverColor: 'hover:shadow-glow-cyan',
      path: '/contacts'
    },
    {
      id: 'create-deal',
      label: 'Create Deal',
      icon: <DollarSign size={20} />,
      color: 'from-accent-500 to-accent-600',
      hoverColor: 'hover:shadow-glow-lime',
      path: '/deals'
    },
    {
      id: 'send-email',
      label: 'Send Email',
      icon: <Mail size={20} />,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:shadow-lg',
      path: '/messages'
    },
    {
      id: 'schedule-call',
      label: 'Schedule Call',
      icon: <Phone size={20} />,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:shadow-lg',
      path: '/tasks'
    },
    {
      id: 'book-meeting',
      label: 'Book Meeting',
      icon: <Calendar size={20} />,
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:shadow-lg',
      path: '/tasks'
    },
    {
      id: 'create-report',
      label: 'Create Report',
      icon: <FileText size={20} />,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:shadow-lg',
      path: '/reports'
    }
  ];

  return (
    <Card variant="glass">
      <CardHeader 
        title="Quick Actions"
        subtitle="Common tasks at your fingertips"
      />
      <CardBody>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${action.color} ${action.hoverColor} hover:scale-105 transition-all group`}
            >
              <div className="text-white">
                {action.icon}
              </div>
              <span className="text-sm font-medium text-white text-center">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
