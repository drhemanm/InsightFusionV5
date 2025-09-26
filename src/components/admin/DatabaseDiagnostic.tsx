import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { db, auth } from '../../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, limit } from 'firebase/firestore';

export const DatabaseDiagnostic: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults(null);

    const diagnosticResults = {
      timestamp: new Date().toISOString(),
      tests: [] as any[]
    };

    try {
      // Test 1: Check if we can connect to Firebase
      console.log('🔍 Testing Firebase connection...');
      try {
        const user = auth.currentUser;
        diagnosticResults.tests.push({
          name: 'Firebase Auth Connection',
          status: 'success',
          message: `Connected as: ${user?.email || 'Anonymous'}`,
          details: user
        });
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'Firebase Auth Connection',
          status: 'error',
          message: error.message,
          details: error
        });
      }

      // Test 2: Check if contacts table exists
      console.log('🔍 Checking contacts collection...');
      try {
        const snapshot = await getDocs(query(collection(db, 'contacts'), limit(1)));
        const fullSnapshot = await getDocs(collection(db, 'contacts'));

        diagnosticResults.tests.push({
          name: 'Contacts Collection Access',
          status: 'success',
          message: `Collection exists with ${fullSnapshot.size} records`,
          details: { count: fullSnapshot.size }
        });
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'Contacts Collection Access',
          status: 'error',
          message: error.message,
          details: error
        });
      }

      // Test 3: Check table schema
      console.log('🔍 Checking collection structure...');
      try {
        const snapshot = await getDocs(query(collection(db, 'contacts'), limit(1)));
        const sampleDoc = snapshot.docs[0];

        if (sampleDoc) {
          const fields = Object.keys(sampleDoc.data());
          diagnosticResults.tests.push({
            name: 'Collection Structure Check',
            status: 'success',
            message: `Found ${fields.length} fields`,
            details: { fields }
          });
        } else {
          diagnosticResults.tests.push({
            name: 'Collection Structure Check',
            status: 'success',
            message: 'Collection exists but is empty',
            details: { fields: [] }
          });
        }
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'Collection Structure Check',
          status: 'warning',
          message: 'Could not check collection structure',
          details: error
        });
      }

      // Test 4: Try to insert a test record
      console.log('🔍 Testing write permissions...');
      try {
        const testContact = {
          firstName: 'Test',
          lastName: 'User',
          email: `test-${Date.now()}@example.com`
        };

        const docRef = await addDoc(collection(db, 'contacts'), testContact);

        // Clean up test record
        await deleteDoc(doc(db, 'contacts', docRef.id));
        
        diagnosticResults.tests.push({
          name: 'Write Test',
          status: 'success',
          message: 'Can create and delete records successfully',
          details: { testRecordId: docRef.id }
        });
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'Write Test',
          status: 'error',
          message: error.message,
          details: error
        });
      }

      // Test 5: Check RLS policies
      console.log('🔍 Checking Firebase security rules...');
      try {
        const snapshot = await getDocs(query(collection(db, 'contacts'), limit(1)));

        diagnosticResults.tests.push({
          name: 'Security Rules Check',
          status: 'success',
          message: 'Firebase security rules allow read access',
          details: { recordsAccessible: snapshot.size }
        });
      } catch (error: any) {
        diagnosticResults.tests.push({
          name: 'Security Rules Check',
          status: 'error',
          message: error.message,
          details: error
        });
      }

      // Calculate overall status
      const hasErrors = diagnosticResults.tests.some((t: any) => t.status === 'error');
      const hasWarnings = diagnosticResults.tests.some((t: any) => t.status === 'warning');
      
      diagnosticResults.overallStatus = hasErrors ? 'error' : hasWarnings ? 'warning' : 'success';

    } catch (error: any) {
      console.error('Diagnostic failed:', error);
      diagnosticResults.tests.push({
        name: 'Overall Diagnostic',
        status: 'error',
        message: 'Diagnostic process failed',
        details: error
      });
      diagnosticResults.overallStatus = 'error';
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
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Database className="text-blue-500" size={24} />
            <div>
              <h1 className="text-2xl font-bold">Firebase Diagnostic</h1>
              <p className="text-gray-600">Check your Firebase connection and collections</p>
            </div>
          </div>
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                Running Diagnostic...
              </>
            ) : (
              <>
                <Play size={16} />
                Run Diagnostic
              </>
            )}
          </button>
        </div>

        {results && (
          <div className="p-6">
            <div className="mb-6">
              <div className={`p-4 rounded-lg border ${getStatusColor(results.overallStatus)}`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.overallStatus)}
                  <h2 className="text-lg font-semibold">
                    Overall Status: {results.overallStatus === 'success' ? 'All Good!' : 
                                   results.overallStatus === 'warning' ? 'Some Issues' : 'Problems Found'}
                  </h2>
                </div>
                <p className="mt-1 text-sm">
                  Diagnostic completed at {new Date(results.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              {results.tests.map((test: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <h4 className="font-medium">{test.name}</h4>
                      <p className="text-sm mt-1">{test.message}</p>
                      {test.details && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer hover:underline">
                            View Details
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Quick Fixes</h3>
              <div className="space-y-2 text-sm text-blue-800">
                {results.tests.some((t: any) => t.status === 'error' && t.name.includes('Collection')) && (
                  <p>• The contacts collection doesn't exist. Create some contacts to initialize it.</p>
                )}
                {results.tests.some((t: any) => t.status === 'error' && t.message.includes('permission')) && (
                  <p>• Firebase security rules are blocking access. Check your Firestore rules.</p>
                )}
                {results.tests.some((t: any) => t.status === 'error' && t.message.includes('field')) && (
                  <p>• Collection structure doesn't match. Update your document structure.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};