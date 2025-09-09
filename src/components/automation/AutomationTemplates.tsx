import React from 'react';
import { Mail, Users, Calendar, Target, DollarSign, Clock, Zap, Play } from 'lucide-react';

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'marketing' | 'support' | 'productivity';
  trigger: {
    type: string;
    conditions: Record<string, any>;
  };
  actions: Array<{
    type: string;
    params: Record<string, any>;
  }>;
  popularity: number;
  estimatedTimeSaved: string;
}

interface AutomationTemplatesProps {
  onUseTemplate: (template: Omit<AutomationTemplate, 'id' | 'popularity' | 'estimatedTimeSaved'>) => void;
}

export const AutomationTemplates: React.FC<AutomationTemplatesProps> = ({ onUseTemplate }) => {
  const templates: AutomationTemplate[] = [
    {
      id: 'lead-nurturing',
      name: 'Lead Nurturing Sequence',
      description: 'Automatically nurture new leads with a series of emails and follow-up tasks',
      category: 'marketing',
      trigger: { type: 'contact_created', conditions: { type: 'lead' } },
      actions: [
        { type: 'send_email', params: { template: 'welcome_sequence_1', delay: 0 } },
        { type: 'create_task', params: { title: 'Call new lead', dueInDays: 1 } },
        { type: 'send_email', params: { template: 'welcome_sequence_2', delay: 3 } }
      ],
      popularity: 95,
      estimatedTimeSaved: '2 hours/week'
    },
    {
      id: 'deal-progression',
      name: 'Deal Stage Automation',
      description: 'Create tasks and send notifications when deals progress through stages',
      category: 'sales',
      trigger: { type: 'deal_stage_changed', conditions: {} },
      actions: [
        { type: 'create_task', params: { title: 'Complete stage requirements' } },
        { type: 'send_notification', params: { message: 'Deal stage updated' } }
      ],
      popularity: 88,
      estimatedTimeSaved: '1.5 hours/week'
    },
    {
      id: 'meeting-follow-up',
      name: 'Meeting Follow-up',
      description: 'Automatically create follow-up tasks after meetings',
      category: 'productivity',
      trigger: { type: 'meeting_completed', conditions: {} },
      actions: [
        { type: 'create_task', params: { title: 'Send meeting summary', dueInDays: 1 } },
        { type: 'create_task', params: { title: 'Follow up on action items', dueInDays: 3 } }
      ],
      popularity: 82,
      estimatedTimeSaved: '3 hours/week'
    },
    {
      id: 'support-ticket-routing',
      name: 'Smart Ticket Routing',
      description: 'Automatically assign support tickets based on category and priority',
      category: 'support',
      trigger: { type: 'ticket_created', conditions: {} },
      actions: [
        { type: 'assign_user', params: { method: 'round_robin' } },
        { type: 'send_notification', params: { recipient: 'assigned_user' } }
      ],
      popularity: 76,
      estimatedTimeSaved: '4 hours/week'
    },
    {
      id: 'birthday-outreach',
      name: 'Birthday Outreach Campaign',
      description: 'Send personalized birthday messages with special offers',
      category: 'marketing',
      trigger: { type: 'contact_birthday', conditions: { daysBefore: 0 } },
      actions: [
        { type: 'send_email', params: { template: 'birthday_wishes' } },
        { type: 'create_task', params: { title: 'Follow up on birthday outreach' } }
      ],
      popularity: 71,
      estimatedTimeSaved: '1 hour/week'
    },
    {
      id: 'high-value-deal-alert',
      name: 'High-Value Deal Alerts',
      description: 'Notify managers when high-value deals are created or updated',
      category: 'sales',
      trigger: { type: 'deal_created', conditions: { valueGreaterThan: 50000 } },
      actions: [
        { type: 'send_notification', params: { recipient: 'manager', priority: 'high' } },
        { type: 'create_task', params: { title: 'Review high-value deal', assignTo: 'manager' } }
      ],
      popularity: 69,
      estimatedTimeSaved: '2 hours/week'
    },
    {
      id: 'inactive-lead-reactivation',
      name: 'Inactive Lead Reactivation',
      description: 'Re-engage leads that haven\'t been contacted in 30 days',
      category: 'sales',
      trigger: { type: 'contact_inactive', conditions: { daysInactive: 30 } },
      actions: [
        { type: 'send_email', params: { template: 'reactivation_email' } },
        { type: 'create_task', params: { title: 'Reconnect with inactive lead' } }
      ],
      popularity: 64,
      estimatedTimeSaved: '2.5 hours/week'
    },
    {
      id: 'task-deadline-reminder',
      name: 'Task Deadline Reminders',
      description: 'Send reminders before tasks are due and escalate overdue tasks',
      category: 'productivity',
      trigger: { type: 'task_due_soon', conditions: { hoursBefore: 24 } },
      actions: [
        { type: 'send_notification', params: { recipient: 'assigned_user' } },
        { type: 'send_email', params: { template: 'task_reminder' } }
      ],
      popularity: 91,
      estimatedTimeSaved: '1 hour/week'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales':
        return <DollarSign className="text-green-500" size={20} />;
      case 'marketing':
        return <Target className="text-blue-500" size={20} />;
      case 'support':
        return <Users className="text-purple-500" size={20} />;
      case 'productivity':
        return <Clock className="text-orange-500" size={20} />;
      default:
        return <Zap className="text-gray-500" size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales':
        return 'bg-green-100 text-green-800';
      case 'marketing':
        return 'bg-blue-100 text-blue-800';
      case 'support':
        return 'bg-purple-100 text-purple-800';
      case 'productivity':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Automation Templates</h2>
        <div className="text-sm text-gray-500">
          {templates.length} templates available
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getCategoryIcon(template.category)}
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(template.category)}`}>
                    {template.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">{template.popularity}% popular</div>
                <div className="text-xs text-gray-500">Saves {template.estimatedTimeSaved}</div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{template.description}</p>

            <div className="space-y-3 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Trigger</h4>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Target className="text-blue-500" size={14} />
                  <span className="text-sm">{getTriggerLabel(template.trigger.type)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Actions ({template.actions.length})</h4>
                <div className="space-y-1">
                  {template.actions.slice(0, 3).map((action, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      {getActionIcon(action.type)}
                      <span className="text-sm">{getActionLabel(action.type)}</span>
                    </div>
                  ))}
                  {template.actions.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{template.actions.length - 3} more actions
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onUseTemplate({
                name: template.name,
                description: template.description,
                trigger: template.trigger,
                actions: template.actions,
                status: 'draft'
              })}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play size={16} />
              Use This Template
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Need a Custom Automation?</h3>
        <p className="text-gray-600 mb-4">
          Can't find the perfect template? Create a custom automation tailored to your specific workflow needs.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Custom Automation
        </button>
      </div>
    </div>
  );
};