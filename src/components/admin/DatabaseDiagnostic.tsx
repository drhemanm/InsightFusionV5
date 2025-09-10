import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { supabase } from '../../config/supabase';

export const DatabaseDiagnostic: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostic = async () => {
    setIsRunning(true);
    const diagnosticResults: any = {
      timestamp: new Date(),
      tests: []
    };

    try {
      // Test 1: Check if we can connect to Supabase
      console.log('🔍 Testing Supabase connection...');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        diagnosticResults.tests.push({
          name: 'Supabase Auth Connection',
          status: 'success',
          message: `Connected as: ${user?.email || 'Anonymous'}`,
          details: user
        });
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'Supabase Auth Connection',
          status: 'error',
          message: error.message,
          details: error
        });
      }

      // Test 2: Check if contacts table exists
      console.log('🔍 Checking contacts table...');
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('count', { count: 'exact', head: true });

        if (error) {
          diagnosticResults.tests.push({
            name: 'Contacts Table Access',
            status: 'error',
            message: error.message,
            details: error
          });
        } else {
          diagnosticResults.tests.push({
            name: 'Contacts Table Access',
            status: 'success',
            message: `Table exists with ${data || 0} records`,
            details: { count: data }
          });
        }
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'Contacts Table Access',
          status: 'error',
          message: error.message,
          details: error
        });
      }

      // Test 3: Check table schema
      console.log('🔍 Checking table schema...');
      try {
        const { data, error } = await supabase
          .rpc('get_table_schema', { table_name: 'contacts' })
          .single();

        if (error) {
          // If RPC doesn't exist, try a simple query to see what columns exist
          const { data: sampleData, error: sampleError } = await supabase
            .from('contacts')
            .select('*')
            .limit(1);

          if (sampleError) {
            diagnosticResults.tests.push({
              name: 'Table Schema Check',
              status: 'error',
              message: sampleError.message,
              details: sampleError
            });
          } else {
            const columns = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : [];
            diagnosticResults.tests.push({
              name: 'Table Schema Check',
              status: 'success',
              message: `Found ${columns.length} columns`,
              details: { columns }
            });
          }
        } else {
          diagnosticResults.tests.push({
            name: 'Table Schema Check',
            status: 'success',
            message: 'Schema retrieved successfully',
            details: data
          });
        }
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'Table Schema Check',
          status: 'warning',
          message: 'Could not check schema',
          details: error
        });
      }

      // Test 4: Try to insert a test record
      console.log('🔍 Testing insert permissions...');
      try {
        const testContact = {
          first_name: 'Test',
          last_name: 'User',
          email: `test-${Date.now()}@example.com`
        };

        const { data, error } = await supabase
          .from('contacts')
          .insert([testContact])
          .select()
          .single();

        if (error) {
          diagnosticResults.tests.push({
            name: 'Insert Test',
            status: 'error',
            message: error.message,
            details: error
          });
        } else {
          // Clean up test record
          await supabase.from('contacts').delete().eq('id', data.id);
          
          diagnosticResults.tests.push({
            name: 'Insert Test',
            status: 'success',
            message: 'Can create and delete records successfully',
            details: { testRecordId: data.id }
          });
        }
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'Insert Test',
          status: 'error',
          message: error.message,
          details: error
        });
      }

      // Test 5: Check RLS policies
      console.log('🔍 Checking RLS policies...');
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('id')
          .limit(1);

        if (error) {
          diagnosticResults.tests.push({
            name: 'RLS Policy Check',
            status: 'error',
            message: `RLS blocking access: ${error.message}`,
            details: error
          });
        } else {
          diagnosticResults.tests.push({
            name: 'RLS Policy Check',
            status: 'success',
            message: 'RLS policies allow read access',
            details: { recordsAccessible: data?.length || 0 }
          });
        }
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'RLS Policy Check',
          status: 'error',
          message: error.message,
          details: error
        });
      }

    } catch (error) {
      console.error('❌ Diagnostic failed:', error);
    }

    setResults(diagnosticResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <Database className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Database className="text-blue-500" size={24} />
            <div>
              <h1 className="text-2xl font-bold">Database Diagnostic</h1>
              <p className="text-gray-600">Check your Supabase database connection and schema</p>
            </div>
          </div>
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Running...
              </>
            ) : (
              <>
                <Play size={20} />
                Run Diagnostic
              </>
            )}
          </button>
        </div>

        {results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Diagnostic Results</h2>
              <span className="text-sm text-gray-500">
                {results.timestamp.toLocaleString()}
              </span>
            </div>

            <div className="space-y-3">
              {results.tests.map((test: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    test.status === 'success' ? 'bg-green-50 border-green-200' :
                    test.status === 'error' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(test.status)}
                    <h3 className="font-medium">{test.name}</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{test.message}</p>
                  {test.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                        View Details
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Fixes */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Quick Fixes</h3>
              <div className="space-y-2 text-sm text-blue-800">
                {results.tests.some((t: any) => t.status === 'error' && t.name.includes('Table')) && (
                  <p>• The contacts table doesn't exist. Run the migration SQL in your Supabase SQL Editor.</p>
                )}
                {results.tests.some((t: any) => t.status === 'error' && t.message.includes('permission')) && (
                  <p>• RLS policies are blocking access. Check your Row Level Security settings.</p>
                )}
                {results.tests.some((t: any) => t.status === 'error' && t.message.includes('column')) && (
                  <p>• Table schema doesn't match. Update your table structure.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};