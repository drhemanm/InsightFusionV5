import React, { useState, useEffect } from 'react';
import { Zap, Plus, Play, Pause, Settings, BarChart3, Clock, Mail, Phone, Calendar, Users, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { AutomationCard } from './AutomationCard';
import { CreateAutomationModal } from './CreateAutomationModal';
import { AutomationMetrics } from './AutomationMetrics';
import { AutomationTemplates } from './AutomationTemplates';

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

export const AutomationDashboard: React.FC = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'active' | 'templates' | 'metrics'>('active');

  useEffect(() => {
    // Load sample automations
    const sampleAutomations: Automation[] = [
      {
        id: '1',
        name: 'Welcome New Leads',
        description: 'Automatically send welcome email and create follow-up task when a new lead is added',
        trigger: {
          type: 'contact_created',
          conditions: { type: 'lead' }
        },
        actions: [
          { type: 'send_email', params: { template: 'welcome_lead' } },
          { type: 'create_task', params: { title: 'Follow up with new lead', dueInDays: 1 } }
        ],
        status: 'active',
        runsCount: 156,
        successRate: 98.7,
        lastRun: new Date(),
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Deal Stage Progression',
        description: 'Create tasks and send notifications when deals move to proposal stage',
        trigger: {
          type: 'deal_stage_changed',
          conditions: { newStage: 'proposal' }
        },
        actions: [
          { type: 'create_task', params: { title: 'Prepare proposal document', dueInDays: 2 } },
          { type: 'send_notification', params: { message: 'Deal moved to proposal stage' } }
        ],
        status: 'active',
        runsCount: 89,
        successRate: 95.5,
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Overdue Task Escalation',
        description: 'Notify managers when tasks are overdue by more than 24 hours',
        trigger: {
          type: 'task_overdue',
          conditions: { hoursOverdue: 24 }
        },
        actions: [
          { type: 'send_notification', params: { recipient: 'manager', priority: 'high' } },
          { type: 'update_task', params: { priority: 'high' } }
        ],
        status: 'active',
        runsCount: 23,
        successRate: 100,
        lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      {
        id: '4',
        name: 'Birthday Outreach',
        description: 'Send birthday wishes and special offers to contacts on their birthday',
        trigger: {
          type: 'contact_birthday',
          conditions: { daysBefore: 0 }
        },
        actions: [
          { type: 'send_email', params: { template: 'birthday_wishes' } },
          { type: 'create_task', params: { title: 'Follow up on birthday outreach' } }
        ],
        status: 'paused',
        runsCount: 12,
        successRate: 91.7,
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      {
        id: '5',
        name: 'High-Value Deal Alert',
        description: 'Notify sales manager when deals over MUR 100,000 are created',
        trigger: {
          type: 'deal_created',
          conditions: { valueGreaterThan: 100000 }
        },
        actions: [
          { type: 'send_notification', params: { recipient: 'sales_manager', priority: 'high' } },
          { type: 'create_task', params: { title: 'Review high-value deal', assignTo: 'manager' } }
        ],
        status: 'active',
        runsCount: 8,
        successRate: 100,
        lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000),
        createdAt: new Date()
      }
    ];

    setAutomations(sampleAutomations);
  }, []);

  const activeAutomations = automations.filter(a => a.status === 'active');
  const totalRuns = automations.reduce((sum, a) => sum + a.runsCount, 0);
  const avgSuccessRate = automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length;

  const handleToggleAutomation = (id: string) => {
    setAutomations(automations.map(automation =>
      automation.id === id
        ? { ...automation, status: automation.status === 'active' ? 'paused' : 'active' }
        : automation
    ));
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations(automations.filter(a => a.id !== id));
  };

  const handleCreateAutomation = (data: Omit<Automation, 'id' | 'runsCount' | 'successRate' | 'createdAt'>) => {
    const newAutomation: Automation = {
      ...data,
      id: crypto.randomUUID(),
      runsCount: 0,
      successRate: 0,
      createdAt: new Date()
    };
    setAutomations([...automations, newAutomation]);
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Automation Center</h1>
          <p className="text-gray-600">Streamline your workflow with intelligent automation</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Automation
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Active Automations</h3>
            <Zap className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-blue-600">{activeAutomations.length}</div>
          <div className="text-sm text-gray-500">of {automations.length} total</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Runs</h3>
            <BarChart3 className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-green-600">{totalRuns.toLocaleString()}</div>
          <div className="text-sm text-gray-500">this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <CheckCircle className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-purple-600">{avgSuccessRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-500">average</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Time Saved</h3>
            <Clock className="text-orange-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-orange-600">24.5h</div>
          <div className="text-sm text-gray-500">this week</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: 'active', label: 'Active Automations', icon: Zap },
          { id: 'templates', label: 'Templates', icon: Target },
          { id: 'metrics', label: 'Analytics', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === 'active' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {automations.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onToggle={() => handleToggleAutomation(automation.id)}
                onDelete={() => handleDeleteAutomation(automation.id)}
              />
            ))}
          </div>

          {automations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <Zap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Automations Yet</h3>
              <p className="text-gray-600 mb-6">Create your first automation to streamline your workflow</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Automation
              </button>
            </div>
          )}
        </div>
      )}

      {selectedTab === 'templates' && <AutomationTemplates onUseTemplate={handleCreateAutomation} />}
      {selectedTab === 'metrics' && <AutomationMetrics automations={automations} />}

      {/* Create Automation Modal */}
      {showCreateModal && (
        <CreateAutomationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAutomation}
        />
      )}
    </div>
  );
};