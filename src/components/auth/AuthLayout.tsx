import React from 'react';
import { Brain } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-75" />
          <div className="relative bg-black bg-opacity-50 backdrop-blur-xl rounded-lg p-8">
            <div className="text-center mb-8">
              <Brain className="mx-auto h-12 w-12 text-blue-400" />
              <h2 className="mt-6 text-3xl font-bold text-white">{title}</h2>
              {subtitle && (
                <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};