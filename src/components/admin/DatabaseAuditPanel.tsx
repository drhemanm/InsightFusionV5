import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw, Activity } from 'lucide-react';
import { DatabaseAudit } from '../../utils/audit/DatabaseAudit';

export const DatabaseAuditPanel: React.FC = () => {
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      console.log('🔍 Running database audit...');
      const result = await DatabaseAudit.performFullAudit();
      setAuditResult(result);
      setLastRun(new Date());
      console.log('✅ Database audit completed:', result);
    } catch (error) {
      console.error('❌ Audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertTriangle className="text-yellow-500" size={20} />;
    }
  };

  if (!auditResult) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Running database audit...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Database Audit Report</h1>
          <p className="text-gray-600">
            Last run: {lastRun?.toLocaleString() || 'Never'}
          </p>
        </div>
        <button
          onClick={runAudit}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : 'Run Audit'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Connection Status</h2>
            {getStatusIcon(auditResult.connection.status)}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                auditResult.connection.status === 'connected' ? 'text-green-600' : 'text-red-600'
              }`}>
                {auditResult.connection.status.toUpperCase()}
              </span>
            </div>
            
            {auditResult.connection.latency && (
              <div className="flex justify-between">
                <span className="text-gray-600">Latency:</span>
                <span className="font-medium">{Math.round(auditResult.connection.latency)}ms</span>
              </div>
            )}
            
            {auditResult.connection.error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">{auditResult.connection.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Data Overview</h2>
            <Activity className="text-blue-500" size={20} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{auditResult.data.userCount}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{auditResult.data.contactCount}</div>
              <div className="text-sm text-gray-600">Contacts</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{auditResult.data.dealCount}</div>
              <div className="text-sm text-gray-600">Deals</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{auditResult.data.ticketCount}</div>
              <div className="text-sm text-gray-600">Tickets</div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Schema Analysis</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Existing Tables ({auditResult.schema.tables.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {auditResult.schema.tables.map(table => (
                <div key={table} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm font-mono">{table}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Missing Tables ({auditResult.schema.missingTables.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {auditResult.schema.missingTables.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                  <p>All expected tables are present!</p>
                </div>
              ) : (
                auditResult.schema.missingTables.map(table => (
                  <div key={table} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <XCircle className="text-red-500" size={16} />
                    <span className="text-sm font-mono">{table}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Permissions & Security</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold ${auditResult.permissions.canRead ? 'text-green-600' : 'text-red-600'}`}>
              {auditResult.permissions.canRead ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Read Access</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold ${auditResult.permissions.canWrite ? 'text-green-600' : 'text-red-600'}`}>
              {auditResult.permissions.canWrite ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Write Access</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {auditResult.permissions.userRole?.toUpperCase() || 'UNKNOWN'}
            </div>
            <div className="text-sm text-gray-600">User Role</div>
          </div>
        </div>
      </div>

      {/* Issues & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Issues Found</h2>
          {auditResult.issues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">No issues found!</p>
              <p className="text-sm">Your database is properly configured.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditResult.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="text-red-500 mt-0.5" size={16} />
                  <span className="text-sm text-red-700">{issue}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Recommendations</h2>
          {auditResult.recommendations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">All good!</p>
              <p className="text-sm">No recommendations at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditResult.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <AlertTriangle className="text-blue-500 mt-0.5" size={16} />
                  <span className="text-sm text-blue-700">{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Raw Audit Data (for debugging) */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium mb-4">Raw Audit Data (for debugging)</h3>
        <pre className="text-xs bg-white p-4 rounded border overflow-auto max-h-64">
          {JSON.stringify(auditResult, null, 2)}
        </pre>
      </div>
    </div>
  );
};