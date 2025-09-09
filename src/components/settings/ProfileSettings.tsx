import React from 'react';
import { User, Save } from 'lucide-react';
import { PersonalInfoForm } from './profile/PersonalInfoForm';
import { NotificationSettings } from './profile/NotificationSettings';
import { CommunicationPreferences } from './profile/CommunicationPreferences';
import { useAuthStore } from '../../store/authStore';

export const ProfileSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [hasChanges, setHasChanges] = React.useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSaveAll = () => {
    // In production, save all profile changes
    localStorage.setItem('profileSettings', JSON.stringify({
      lastUpdated: new Date().toISOString(),
      user: user
    }));
    setHasChanges(false);
    alert('Profile settings saved successfully!');
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            Save Changes
          </button>
        )}
      </div>

      <PersonalInfoForm user={user} />
      <NotificationSettings />
      <CommunicationPreferences />
    </div>
  );
};