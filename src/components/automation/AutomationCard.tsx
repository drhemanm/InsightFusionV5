import React from 'react';
import { Play, Pause, Settings, Trash2, Clock, CheckCircle, AlertTriangle, Mail, Phone, Calendar, Users, Target } from 'lucide-react';
import { format } from 'date-fns';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: string;
    conditions: Record<string, any>;
  };
  actions: Array<{
    type: string;
    params: Record<string, any>;
  }>;
  status: 'active' | 'paused' | 'draft';
  runsCount: number;
  successRate: number;
  lastRun?: Date;
  createdAt: Date;
}

interface AutomationCardProps {
  automation: Automation;
  onToggle: () => void;
  onDelete: () => void;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({
  automation,
  onToggle,
  onDelete
}) => {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email':
        return <Mail className="text-blue-500" size={16} />;
      case 'create_task':
        return <Target className="text-green-500" size={16} />;
      case 'send_notification':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'schedule_meeting':
        return <Calendar className="text-purple-500" size={16} />;
      case 'assign_user':
        return <Users className="text-indigo-500" size={16} />;
      default:
        return <Settings className="text-gray-500" size={16} />;
    }
  };

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'contact_created':
        return 'New Contact';
      case 'deal_stage_changed':
        return 'Deal Stage Change';
      case 'task_overdue':
        return 'Task Overdue';
      case 'contact_birthday':
        return 'Contact Birthday';
      case 'deal_created':
        return 'New Deal';
      default:
        return type.replace('_', ' ').toUpperCase();
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'send_email':
        return 'Send Email';
      case 'create_task':
        return 'Create Task';
      case 'send_notification':
        return 'Send Notification';
      case 'schedule_meeting':
        return 'Schedule Meeting';
      case 'assign_user':
        return 'Assign User';
      case 'update_task':
        return 'Update Task';
      default:
        return type.replace('_', ' ').toUpperCase();
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${
      automation.status === 'active' ? 'border-green-500' :
      automation.status === 'paused' ? 'border-yellow-500' : 'border-gray-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            automation.status === 'active' ? 'bg-green-100' :
            automation.status === 'paused' ? 'bg-yellow-100' : 'bg-gray-100'
          }`}>
            {automation.status === 'active' ? (
              <Play className="text-green-600" size={20} />
            ) : automation.status === 'paused' ? (
              <Pause className="text-yellow-600" size={20} />
            ) : (
              <Settings className="text-gray-600" size={20} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{automation.name}</h3>
            <p className="text-sm text-gray-600">{automation.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              automation.status === 'active'
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
            title={automation.status === 'active' ? 'Pause automation' : 'Activate automation'}
          >
            {automation.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            title="Delete automation"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Trigger */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Trigger</h4>
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Target className="text-blue-500" size={16} />
          <span className="text-sm font-medium">{getTriggerLabel(automation.trigger.type)}</span>
          {Object.keys(automation.trigger.conditions).length > 0 && (
            <span className="text-xs text-gray-500">
              ({Object.entries(automation.trigger.conditions).map(([key, value]) => 
                `${key}: ${value}`
              ).join(', ')})
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Actions ({automation.actions.length})</h4>
        <div className="space-y-2">
          {automation.actions.map((action, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              {getActionIcon(action.type)}
              <span className="text-sm">{getActionLabel(action.type)}</span>
              {action.params.template && (
                <span className="text-xs text-gray-500">({action.params.template})</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{automation.runsCount}</div>
          <div className="text-xs text-gray-500">Total Runs</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${
            automation.successRate >= 95 ? 'text-green-600' :
            automation.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {automation.successRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {automation.lastRun ? format(automation.lastRun, 'MMM d') : 'Never'}
          </div>
          <div className="text-xs text-gray-500">Last Run</div>
        </div>
      </div>
    </div>
  );
};