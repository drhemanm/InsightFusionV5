import React, { useState } from 'react';
import { X, Plus, Target, Zap, Mail, Phone, Calendar, Users, Settings, AlertTriangle } from 'lucide-react';

interface CreateAutomationModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({
  onClose,
  onSubmit
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: {
      type: '',
      conditions: {}
    },
    actions: [] as Array<{ type: string; params: Record<string, any> }>
  });

  const triggerTypes = [
    { id: 'contact_created', name: 'New Contact Created', icon: Users, description: 'When a new contact is added to the system' },
    { id: 'deal_stage_changed', name: 'Deal Stage Changed', icon: Target, description: 'When a deal moves to a different stage' },
    { id: 'task_overdue', name: 'Task Overdue', icon: AlertTriangle, description: 'When a task becomes overdue' },
    { id: 'email_received', name: 'Email Received', icon: Mail, description: 'When an email is received from a contact' },
    { id: 'meeting_scheduled', name: 'Meeting Scheduled', icon: Calendar, description: 'When a meeting is scheduled with a contact' }
  ];

  const actionTypes = [
    { id: 'send_email', name: 'Send Email', icon: Mail, description: 'Send an automated email' },
    { id: 'create_task', name: 'Create Task', icon: Target, description: 'Create a new task' },
    { id: 'send_notification', name: 'Send Notification', icon: AlertTriangle, description: 'Send a notification to users' },
    { id: 'schedule_meeting', name: 'Schedule Meeting', icon: Calendar, description: 'Schedule a meeting' },
    { id: 'assign_user', name: 'Assign User', icon: Users, description: 'Assign to a team member' }
  ];

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      status: 'draft'
    });
  };

  const addAction = (actionType: string) => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { type: actionType, params: {} }]
    });
  };

  const removeAction = (index: number) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold">Create New Automation</h2>
            <p className="text-gray-600">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Automation Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Automation Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Welcome New Customers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe what this automation does..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Trigger */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Choose a Trigger</h3>
              <p className="text-gray-600">Select what event will start this automation</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triggerTypes.map((trigger) => {
                  const Icon = trigger.icon;
                  return (
                    <button
                      key={trigger.id}
                      onClick={() => setFormData({
                        ...formData,
                        trigger: { type: trigger.id, conditions: {} }
                      })}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.trigger.type === trigger.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="text-blue-500" size={24} />
                        <h4 className="font-medium">{trigger.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{trigger.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Actions */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Add Actions</h3>
                  <p className="text-gray-600">Choose what happens when the trigger fires</p>
                </div>
                <span className="text-sm text-gray-500">
                  {formData.actions.length} action{formData.actions.length !== 1 ? 's' : ''} added
                </span>
              </div>

              {/* Current Actions */}
              {formData.actions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Selected Actions:</h4>
                  {formData.actions.map((action, index) => {
                    const actionType = actionTypes.find(a => a.id === action.type);
                    if (!actionType) return null;
                    
                    const Icon = actionType.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="text-blue-500" size={20} />
                          <div>
                            <div className="font-medium">{actionType.name}</div>
                            <div className="text-sm text-gray-500">{actionType.description}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAction(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Available Actions */}
              <div>
                <h4 className="font-medium mb-3">Available Actions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {actionTypes.map((action) => {
                    const Icon = action.icon;
                    const isAdded = formData.actions.some(a => a.type === action.id);
                    
                    return (
                      <button
                        key={action.id}
                        onClick={() => addAction(action.id)}
                        disabled={isAdded}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          isAdded
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="text-blue-500" size={20} />
                          <div>
                            <div className="font-medium">{action.name}</div>
                            <div className="text-sm text-gray-500">{action.description}</div>
                          </div>
                          {!isAdded && <Plus className="text-gray-400" size={16} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Previous'}
            </button>

            <div className="flex gap-2">
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.name || !formData.description)) ||
                    (step === 2 && !formData.trigger.type)
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={formData.actions.length === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Automation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};