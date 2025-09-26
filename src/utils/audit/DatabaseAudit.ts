import { db } from '../../config/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { logger } from '../monitoring/logger';

interface FirebaseAuditResult {
  connection: {
    status: 'connected' | 'failed';
    latency?: number;
    error?: string;
  };
  collections: {
    existing: string[];
    missing: string[];
  };
  data: {
    userCount: number;
    contactCount: number;
    dealCount: number;
    ticketCount: number;
    campaignCount: number;
  };
  permissions: {
    canRead: boolean;
    canWrite: boolean;
  };
  issues: string[];
  recommendations: string[];
}

export class DatabaseAudit {
  static async performFullAudit(): Promise<FirebaseAuditResult> {
    console.log('🔍 Starting comprehensive Firebase audit...');
    
    const result: FirebaseAuditResult = {
      connection: { status: 'failed' },
      collections: { existing: [], missing: [] },
      data: { userCount: 0, contactCount: 0, dealCount: 0, ticketCount: 0, campaignCount: 0 },
      permissions: { canRead: false, canWrite: false },
      issues: [],
      recommendations: []
    };

    // 1. Test Basic Connection
    await this.testConnection(result);
    
    // 2. Check Collections
    if (result.connection.status === 'connected') {
      await this.checkCollections(result);
      await this.checkData(result);
      await this.checkPermissions(result);
    }

    // 3. Generate Recommendations
    this.generateRecommendations(result);

    return result;
  }

  private static async testConnection(result: FirebaseAuditResult): Promise<void> {
    try {
      console.log('🔌 Testing Firebase connection...');
      const startTime = performance.now();
      
      const testQuery = query(collection(db, 'contacts'), limit(1));
      await getDocs(testQuery);

      const latency = performance.now() - startTime;

      console.log('✅ Connection test successful');
      result.connection = {
        status: 'connected',
        latency
      };
    } catch (error: any) {
      console.error('❌ Connection test failed:', error);
      result.connection = {
        status: 'failed',
        error: error.message
      };
      result.issues.push(`Firebase connection failed: ${error.message}`);
    }
  }

  private static async checkCollections(result: FirebaseAuditResult): Promise<void> {
    try {
      console.log('📋 Checking Firebase collections...');
      
      const expectedCollections = [
        'users', 'contacts', 'deals', 'tasks', 
        'activities', 'campaigns', 'tickets'
      ];

      const existingCollections = [];

      for (const collectionName of expectedCollections) {
        try {
          const testQuery = query(collection(db, collectionName), limit(1));
          await getDocs(testQuery);
          existingCollections.push(collectionName);
        } catch (error) {
          console.warn(`Collection ${collectionName} not accessible:`, error);
        }
      }

      result.collections.existing = existingCollections;
      result.collections.missing = expectedCollections.filter(
        col => !existingCollections.includes(col)
      );

      if (result.collections.missing.length > 0) {
        result.issues.push(`Missing collections: ${result.collections.missing.join(', ')}`);
      }

      console.log('📊 Collections check results:');
      console.log('  - Existing collections:', existingCollections.length);
      console.log('  - Missing collections:', result.collections.missing.length);

    } catch (error: any) {
      console.error('❌ Collections check failed:', error);
      result.issues.push(`Collections check exception: ${error.message}`);
    }
  }

  private static async checkData(result: FirebaseAuditResult): Promise<void> {
    try {
      console.log('📊 Checking data counts...');

      const collections = ['users', 'contacts', 'deals', 'tickets', 'campaigns'];
      
      for (const collectionName of collections) {
        try {
          const snapshot = await getDocs(collection(db, collectionName));
          const count = snapshot.size;
          
          switch (collectionName) {
            case 'users':
              result.data.userCount = count;
              break;
            case 'contacts':
              result.data.contactCount = count;
              break;
            case 'deals':
              result.data.dealCount = count;
              break;
            case 'tickets':
              result.data.ticketCount = count;
              break;
            case 'campaigns':
              result.data.campaignCount = count;
              break;
          }
        } catch (error) {
          console.warn(`Could not count ${collectionName}:`, error);
        }
      }

      console.log('📈 Data counts:');
      console.log('  - Users:', result.data.userCount);
      console.log('  - Contacts:', result.data.contactCount);
      console.log('  - Deals:', result.data.dealCount);
      console.log('  - Tickets:', result.data.ticketCount);
      console.log('  - Campaigns:', result.data.campaignCount);

    } catch (error: any) {
      console.error('❌ Data check failed:', error);
      result.issues.push(`Data check failed: ${error.message}`);
    }
  }

  private static async checkPermissions(result: FirebaseAuditResult): Promise<void> {
    try {
      console.log('🔐 Checking permissions...');

      // Test read permissions
      try {
        await getDocs(query(collection(db, 'contacts'), limit(1)));
        result.permissions.canRead = true;
        console.log('✅ Read permissions: OK');
      } catch (error: any) {
        result.permissions.canRead = false;
        result.issues.push(`Read permission denied: ${error.message}`);
        console.log('❌ Read permissions: DENIED');
      }

      // Test write permissions
      try {
        const testDoc = {
          firstName: 'Test',
          lastName: 'User',
          email: `test-${Date.now()}@example.com`,
          createdAt: new Date().toISOString()
        };
        
        await addDoc(collection(db, 'contacts'), testDoc);
        result.permissions.canWrite = true;
        console.log('✅ Write permissions: OK');
      } catch (error: any) {
        result.permissions.canWrite = false;
        result.issues.push(`Write permission denied: ${error.message}`);
        console.log('❌ Write permissions: DENIED');
      }

    } catch (error: any) {
      console.error('❌ Permission check failed:', error);
      result.issues.push(`Permission check failed: ${error.message}`);
    }
  }

  private static generateRecommendations(result: FirebaseAuditResult): void {
    console.log('💡 Generating recommendations...');

    if (result.connection.status === 'failed') {
      result.recommendations.push('Fix Firebase connection issues before proceeding');
      result.recommendations.push('Check Firebase project configuration and API keys');
    }

    if (result.collections.missing.length > 0) {
      result.recommendations.push('Create missing collections by adding data');
      result.recommendations.push('Collections are created automatically when you add documents');
    }

    if (!result.permissions.canRead) {
      result.recommendations.push('Check Firestore security rules for read access');
      result.recommendations.push('Verify user authentication and permissions');
    }

    if (!result.permissions.canWrite) {
      result.recommendations.push('Review Firestore security rules for write access');
      result.recommendations.push('Ensure proper user permissions are configured');
    }

    if (result.connection.latency && result.connection.latency > 1000) {
      result.recommendations.push('Firebase latency is high - check network connection');
    }

    if (result.data.userCount === 0) {
      result.recommendations.push('No users found - create initial admin user');
    }

    console.log('📝 Recommendations generated:', result.recommendations.length);
  }

  static async quickHealthCheck(): Promise<boolean> {
    try {
      const testQuery = query(collection(db, 'contacts'), limit(1));
      await getDocs(testQuery);
      return true;
    } catch {
      return false;
    }
  }
}