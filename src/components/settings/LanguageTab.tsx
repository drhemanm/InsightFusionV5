import React, { useState } from 'react';
import { Globe, Clock, Calendar, DollarSign } from 'lucide-react';

export const LanguageTab: React.FC = () => {
  const [settings, setSettings] = useState({
    language: 'en',
    region: 'US',
    timezone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    currency: 'MUR',
    numberFormat: 'en-US'
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
    { value: 'Indian/Mauritius', label: 'Mauritius Time (MUT)' }
  ];

  const dateFormats = [
    { value: 'MM/dd/yyyy', label: '12/31/2024 (US)' },
    { value: 'dd/MM/yyyy', label: '31/12/2024 (EU)' },
    { value: 'yyyy-MM-dd', label: '2024-12-31 (ISO)' },
    { value: 'dd MMM yyyy', label: '31 Dec 2024' },
    { value: 'MMM dd, yyyy', label: 'Dec 31, 2024' }
  ];

  const currencies = [
    { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  const handleSave = () => {
    // In production, save to backend
    localStorage.setItem('userLanguageSettings', JSON.stringify(settings));
    console.log('Language settings saved:', settings);
    
    // Apply settings immediately
    document.documentElement.lang = settings.language;
    
    // Show success message
    alert('Language and region settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Language & Region</h2>
        <p className="text-gray-600">Customize your language, timezone, and regional preferences</p>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="text-blue-500" size={24} />
          <h3 className="text-lg font-semibold">Language</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSettings({ ...settings, language: lang.code })}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.language === lang.code
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{lang.flag}</div>
              <div className="font-medium text-sm">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Timezone & Date Format */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-purple-500" size={24} />
          <h3 className="text-lg font-semibold">Time & Date</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {dateFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="12h"
                  checked={settings.timeFormat === '12h'}
                  onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">12-hour (2:30 PM)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="24h"
                  checked={settings.timeFormat === '24h'}
                  onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">24-hour (14:30)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Time
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-mono">
                {new Date().toLocaleString(settings.language, {
                  timeZone: settings.timezone,
                  hour12: settings.timeFormat === '12h',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {settings.timezone}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Currency & Number Format */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="text-green-500" size={24} />
          <h3 className="text-lg font-semibold">Currency & Numbers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number Format
            </label>
            <select
              value={settings.numberFormat}
              onChange={(e) => setSettings({ ...settings, numberFormat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en-US">1,234.56 (US)</option>
              <option value="en-GB">1,234.56 (UK)</option>
              <option value="de-DE">1.234,56 (German)</option>
              <option value="fr-FR">1 234,56 (French)</option>
              <option value="es-ES">1.234,56 (Spanish)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Currency:</span>
                  <span className="ml-2 font-medium">
                    {new Intl.NumberFormat(settings.numberFormat, {
                      style: 'currency',
                      currency: settings.currency
                    }).format(1234.56)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Number:</span>
                  <span className="ml-2 font-medium">
                    {new Intl.NumberFormat(settings.numberFormat).format(1234.56)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Language & Region Settings
        </button>
      </div>
    </div>
  );
};