import React, { useState } from 'react';
import { Shield, Key, Lock, Smartphone, AlertTriangle, CheckCircle, Clock, Globe } from 'lucide-react';

export const SecurityTab: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [ipRestrictions, setIpRestrictions] = useState('');
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [deviceManagement, setDeviceManagement] = useState(true);

  const handleChangePassword = () => {
    // In production, implement password change flow
    alert('Password change functionality would be implemented here');
  };

  const handleEnable2FA = () => {
    // In production, implement 2FA setup
    setTwoFactorEnabled(!twoFactorEnabled);
    alert(twoFactorEnabled ? '2FA disabled' : '2FA enabled');
  };

  const handleSaveSettings = () => {
    const securitySettings = {
      twoFactorEnabled,
      passwordExpiry,
      sessionTimeout,
      ipRestrictions,
      loginNotifications,
      deviceManagement
    };
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
    alert('Security settings saved successfully!');
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security</h2>
        <p className="text-gray-600">Manage your account security and privacy settings</p>
      </div>

      <div className="space-y-4">
        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-blue-500" size={24} />
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {twoFactorEnabled && (
                <CheckCircle className="text-green-500" size={20} />
              )}
              <button
                onClick={handleEnable2FA}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  twoFactorEnabled
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>

        {/* Password Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="text-blue-500" size={24} />
            <div>
              <h3 className="font-medium">Password Settings</h3>
              <p className="text-sm text-gray-600">Manage your password security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Password Change
                </label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                  {new Date().toLocaleDateString()} (Today)
                </div>
              </div>
            </div>

            <button 
              onClick={handleChangePassword}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-purple-500" size={24} />
            <div>
              <h3 className="font-medium">Session Management</h3>
              <p className="text-sm text-gray-600">Control your session security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Automatically log out after this period of inactivity
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Login Notifications</h4>
                <p className="text-sm text-gray-600">Get notified of new login attempts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={loginNotifications}
                  onChange={(e) => setLoginNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* IP Restrictions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-orange-500" size={24} />
            <div>
              <h3 className="font-medium">IP Restrictions</h3>
              <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed IP Addresses (comma-separated)
            </label>
            <textarea
              value={ipRestrictions}
              onChange={(e) => setIpRestrictions(e.target.value)}
              placeholder="192.168.1.1, 10.0.0.1, etc. (leave empty to allow all)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to allow access from any IP address
            </p>
          </div>
        </div>

        {/* Device Management */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="text-green-500" size={24} />
            <div>
              <h3 className="font-medium">Device Management</h3>
              <p className="text-sm text-gray-600">Manage trusted devices and sessions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Remember Trusted Devices</h4>
                <p className="text-sm text-gray-600">Skip 2FA on trusted devices for 30 days</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deviceManagement}
                  onChange={(e) => setDeviceManagement(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Active Sessions</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-sm">Current Session</div>
                      <div className="text-xs text-gray-500">Chrome on Windows • {new Date().toLocaleString()}</div>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-medium mb-4">Security Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <div className="font-medium text-green-700">Account Secure</div>
              <div className="text-xs text-green-600">All security features enabled</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <div className="font-medium text-blue-700">Strong Password</div>
              <div className="text-xs text-blue-600">Last changed today</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Smartphone className="mx-auto h-8 w-8 text-purple-500 mb-2" />
              <div className="font-medium text-purple-700">1 Trusted Device</div>
              <div className="text-xs text-purple-600">This browser</div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Security Settings
          </button>
        </div>
      </div>
    </div>
  );
};