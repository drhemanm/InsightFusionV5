import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export const DatabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Test Firebase connection by trying to read from a collection

    try {
      // In production, update user in Firebase
      const updatedUser = { ...user, ...updates };
      set({ user: updatedUser });
    } catch (error) {
      logger.error('Failed to update user', { error });
      throw error;
    }
  }
        await getDocs(testQuery);
        setIsConnected(true);
        setLastCheck(new Date());
      } catch (error) {
        console.error('Firebase connection test failed:', error);
        setIsConnected(false);
        setLastCheck(new Date());
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg ${
        isConnected === null ? 'bg-gray-100 text-gray-600' :
        isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        <Database size={16} />
        {isConnected === null ? (
          <Wifi className="animate-pulse" size={16} />
        ) : isConnected ? (
          <Wifi size={16} />
        ) : (
          <WifiOff size={16} />
        )}
        <span className="text-sm font-medium">
          {isConnected === null ? 'Checking...' :
           isConnected ? 'DB Connected' : 'DB Disconnected'}
        </span>
        {lastCheck && (
          <span className="text-xs opacity-75">
            {lastCheck.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};