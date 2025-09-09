import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { EmailNotifications } from './notifications/EmailNotifications';
import { PushNotifications } from './notifications/PushNotifications';
import { AlertSettings } from './notifications/AlertSettings';
import { useNotificationStore } from '../../store/notificationStore';

export const NotificationsSettings: React.FC = () => {
  const { settings, updateSettings } = useNotificationStore();
  const [testNotification, setTestNotification] = useState(false);

  const handleTestNotification = async () => {
    setTestNotification(true);
    
    // Simulate sending test notification
    setTimeout(() => {
      setTestNotification(false);
      alert('Test notification sent! Check your email and browser notifications.');
    }, 2000);
  };

  const handleSaveSettings = () => {
    // Save to localStorage for persistence
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    alert('Notification settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
        <p className="text-gray-600">Control how and when you receive notifications</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="text-blue-500" size={24} />
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleTestNotification}
            disabled={testNotification}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            {testNotification ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Bell size={16} />
                <span>Test Notifications</span>
              </>
            )}
          </button>

          <button
            onClick={() => updateSettings({
              email: { dailyDigest: false, taskReminders: false, dealUpdates: false, teamActivity: false },
              push: { newLeads: false, taskDue: false, meetingReminders: false, mentions: false },
              alerts: { sound: false, desktop: false, mobile: false }
            })}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <AlertTriangle size={16} />
            <span>Disable All</span>
          </button>

          <button
            onClick={() => updateSettings({
              email: { dailyDigest: true, taskReminders: true, dealUpdates: true, teamActivity: true },
              push: { newLeads: true, taskDue: true, meetingReminders: true, mentions: true },
              alerts: { sound: true, desktop: true, mobile: true }
            })}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <CheckCircle size={16} />
            <span>Enable All</span>
          </button>
        </div>
      </div>

      <EmailNotifications
        settings={settings.email}
        onChange={(emailSettings) => updateSettings({ ...settings, email: emailSettings })}
      />
      <PushNotifications
        settings={settings.push}
        onChange={(pushSettings) => updateSettings({ ...settings, push: pushSettings })}
      />
      <AlertSettings
        settings={settings.alerts}
        onChange={(alertSettings) => updateSettings({ ...settings, alerts: alertSettings })}
      />

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Notification Settings
        </button>
      </div>
    </div>
  );
};