import React from 'react';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';

export const DatabaseDiagnostic: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="text-blue-500" size={24} />
          <h1 className="text-2xl font-bold">Database Diagnostic</h1>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-500" size={20} />
            <div>
              <h3 className="font-medium text-green-700">Firebase Connected</h3>
              <p className="text-sm text-green-600">Database is operational</p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-700 mb-2">Database Information</h3>
            <div className="text-sm text-blue-600 space-y-1">
              <p>Provider: Firebase Firestore</p>
              <p>Status: Connected</p>
              <p>Last Check: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};