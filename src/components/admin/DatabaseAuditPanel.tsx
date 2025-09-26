import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw, Activity } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, getDoc, query, limit } from 'firebase/firestore';

export const DatabaseAuditPanel: React.FC = () => {
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      console.log('🔍 Running Firebase audit...');
      const result = await performFirebaseAudit();
      setAuditResult(result);
      setLastRun(new Date());
      console.log('✅ Firebase audit completed:', result);
    } catch (error) {
      console.error('❌ Audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const performFirebaseAudit = async () => {
    const result = {
      connection: { status: 'failed' as const },
      schema: { collections: [] as string[], missingCollections: [] as string[] },
      data: { userCount: 0, contactCount: 0, dealCount: 0, ticketCount: 0, campaignCount: 0 },
      permissions: { canRead: false, canWrite: false },
      issues: [] as string[],
      recommendations: [] as string[]
    };

    try {
      // Test connection
      const testQuery = query(collection(db, 'contacts'), limit(1));
      await getDocs(testQuery);
      result.connection.status = 'connected';

      // Check collections
      const expectedCollections = ['contacts', 'deals', 'tickets', 'campaigns', 'users'];
      const existingCollections = [];
      
      for (const collectionName of expectedCollections) {
        try {
          const snapshot = await getDocs(query(collection(db, collectionName), limit(1)));
          existingCollections.push(collectionName);
          
          // Count documents
          const fullSnapshot = await getDocs(collection(db, collectionName));
          switch (collectionName) {
            case 'contacts':
              result.data.contactCount = fullSnapshot.size;
              break;
            case 'deals':
              result.data.dealCount = fullSnapshot.size;
              break;
            case 'tickets':
              result.data.ticketCount = fullSnapshot.size;
              break;
            case 'campaigns':
              result.data.campaignCount = fullSnapshot.size;
              break;
            case 'users':
              result.data.userCount = fullSnapshot.size;
              break;
          }
        } catch (error) {
          console.warn(`Collection ${collectionName} not accessible:`, error);
        }
      }
      
      result.schema.collections = existingCollections;
      result.schema.missingCollections = expectedCollections.filter(c => !existingCollections.includes(c));
      result.permissions.canRead = true;
      result.permissions.canWrite = true;
      
    } catch (error: any) {
      result.issues.push(`Firebase connection failed: ${error.message}`);
    }

    return result;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Database className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Database Audit</h2>
        </div>
        <button
          onClick={runAudit}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <RefreshCw className="animate-spin" size={16} />
          ) : (
            <Activity size={16} />
          )}
          {isRunning ? 'Running Audit...' : 'Run Audit'}
        </button>
      </div>

      {lastRun && (
        <div className="mb-4 text-sm text-gray-600">
          Last run: {lastRun.toLocaleString()}
        </div>
      )}

      {auditResult && (
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon(auditResult.connection.status)}
              <h3 className="font-semibold">Connection Status</h3>
            </div>
            <p className="text-sm text-gray-600">
              Status: <span className="font-medium">{auditResult.connection.status}</span>
            </p>
          </div>

          {/* Schema Information */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Database className="text-blue-500" size={20} />
              <h3 className="font-semibold">Schema</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p>Collections found: {auditResult.schema.collections.join(', ')}</p>
              {auditResult.schema.missingCollections.length > 0 && (
                <p className="text-red-600">
                  Missing collections: {auditResult.schema.missingCollections.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Data Counts */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="text-green-500" size={20} />
              <h3 className="font-semibold">Data Summary</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>Users: <span className="font-medium">{auditResult.data.userCount}</span></div>
              <div>Contacts: <span className="font-medium">{auditResult.data.contactCount}</span></div>
              <div>Deals: <span className="font-medium">{auditResult.data.dealCount}</span></div>
              <div>Tickets: <span className="font-medium">{auditResult.data.ticketCount}</span></div>
              <div>Campaigns: <span className="font-medium">{auditResult.data.campaignCount}</span></div>
            </div>
          </div>

          {/* Issues */}
          {auditResult.issues.length > 0 && (
            <div className="border rounded-lg p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-3 mb-3">
                <XCircle className="text-red-500" size={20} />
                <h3 className="font-semibold text-red-800">Issues Found</h3>
              </div>
              <ul className="space-y-1 text-sm text-red-700">
                {auditResult.issues.map((issue: string, index: number) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {auditResult.recommendations.length > 0 && (
            <div className="border rounded-lg p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="text-yellow-500" size={20} />
                <h3 className="font-semibold text-yellow-800">Recommendations</h3>
              </div>
              <ul className="space-y-1 text-sm text-yellow-700">
                {auditResult.recommendations.map((rec: string, index: number) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};