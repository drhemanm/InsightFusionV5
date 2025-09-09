import { supabase } from '../../config/supabase';
import { logger } from '../monitoring/logger';

interface DatabaseAuditResult {
  connection: {
    status: 'connected' | 'failed';
    latency?: number;
    error?: string;
  };
  schema: {
    tables: string[];
    missingTables: string[];
    policies: Array<{
      table: string;
      policies: string[];
    }>;
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
    userRole?: string;
  };
  issues: string[];
  recommendations: string[];
}

export class DatabaseAudit {
  static async performFullAudit(): Promise<DatabaseAuditResult> {
    console.log('🔍 Starting comprehensive database audit...');
    
    const result: DatabaseAuditResult = {
      connection: { status: 'failed' },
      schema: { tables: [], missingTables: [], policies: [] },
      data: { userCount: 0, contactCount: 0, dealCount: 0, ticketCount: 0, campaignCount: 0 },
      permissions: { canRead: false, canWrite: false },
      issues: [],
      recommendations: []
    };

    // 1. Test Basic Connection
    await this.testConnection(result);
    
    // 2. Check Schema
    if (result.connection.status === 'connected') {
      await this.checkSchema(result);
      await this.checkData(result);
      await this.checkPermissions(result);
    }

    // 3. Generate Recommendations
    this.generateRecommendations(result);

    return result;
  }

  private static async testConnection(result: DatabaseAuditResult): Promise<void> {
    try {
      console.log('🔌 Testing Supabase connection...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });

      const latency = performance.now() - startTime;

      if (error) {
        console.error('❌ Connection test failed:', error);
        result.connection = {
          status: 'failed',
          error: error.message,
          latency
        };
        result.issues.push(`Database connection failed: ${error.message}`);
      } else {
        console.log('✅ Connection test successful');
        result.connection = {
          status: 'connected',
          latency
        };
      }
    } catch (error: any) {
      console.error('❌ Connection exception:', error);
      result.connection = {
        status: 'failed',
        error: error.message
      };
      result.issues.push(`Connection exception: ${error.message}`);
    }
  }

  private static async checkSchema(result: DatabaseAuditResult): Promise<void> {
    try {
      console.log('📋 Checking database schema...');
      
      // Expected tables based on migrations
      const expectedTables = [
        'users', 'organizations', 'contacts', 'deals', 'tasks', 
        'activities', 'campaigns', 'campaign_targets', 'tickets', 
        'ticket_comments', 'ticket_history', 'tenants', 'tenant_users'
      ];

      // Check which tables exist
      const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE');

      if (error) {
        result.issues.push(`Schema check failed: ${error.message}`);
        return;
      }

      const existingTables = tables?.map(t => t.table_name) || [];
      result.schema.tables = existingTables;
      
      // Find missing tables
      result.schema.missingTables = expectedTables.filter(
        table => !existingTables.includes(table)
      );

      if (result.schema.missingTables.length > 0) {
        result.issues.push(`Missing tables: ${result.schema.missingTables.join(', ')}`);
      }

      console.log('📊 Schema check results:');
      console.log('  - Existing tables:', existingTables.length);
      console.log('  - Missing tables:', result.schema.missingTables.length);

    } catch (error: any) {
      console.error('❌ Schema check failed:', error);
      result.issues.push(`Schema check exception: ${error.message}`);
    }
  }

  private static async checkData(result: DatabaseAuditResult): Promise<void> {
    try {
      console.log('📊 Checking data counts...');

      // Check data in each table
      const tableCounts = await Promise.allSettled([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('deals').select('*', { count: 'exact', head: true }),
        supabase.from('tickets').select('*', { count: 'exact', head: true }),
        supabase.from('campaigns').select('*', { count: 'exact', head: true })
      ]);

      // Process results
      if (tableCounts[0].status === 'fulfilled') {
        result.data.userCount = tableCounts[0].value.count || 0;
      }
      if (tableCounts[1].status === 'fulfilled') {
        result.data.contactCount = tableCounts[1].value.count || 0;
      }
      if (tableCounts[2].status === 'fulfilled') {
        result.data.dealCount = tableCounts[2].value.count || 0;
      }
      if (tableCounts[3].status === 'fulfilled') {
        result.data.ticketCount = tableCounts[3].value.count || 0;
      }
      if (tableCounts[4].status === 'fulfilled') {
        result.data.campaignCount = tableCounts[4].value.count || 0;
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

  private static async checkPermissions(result: DatabaseAuditResult): Promise<void> {
    try {
      console.log('🔐 Checking permissions...');

      // Test read permissions
      try {
        await supabase.from('users').select('id').limit(1);
        result.permissions.canRead = true;
        console.log('✅ Read permissions: OK');
      } catch (error: any) {
        result.permissions.canRead = false;
        result.issues.push(`Read permission denied: ${error.message}`);
        console.log('❌ Read permissions: DENIED');
      }

      // Test write permissions
      try {
        // Try to insert a test record (this will likely fail due to RLS, but we can check the error type)
        const { error } = await supabase
          .from('users')
          .insert({ 
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User'
          });

        if (error) {
          if (error.message.includes('RLS') || error.message.includes('policy')) {
            result.permissions.canWrite = true; // RLS is working, which is good
            console.log('✅ Write permissions: OK (RLS active)');
          } else {
            result.permissions.canWrite = false;
            result.issues.push(`Write permission issue: ${error.message}`);
            console.log('❌ Write permissions: ISSUE');
          }
        } else {
          result.permissions.canWrite = true;
          console.log('✅ Write permissions: OK');
        }
      } catch (error: any) {
        result.permissions.canWrite = false;
        result.issues.push(`Write permission check failed: ${error.message}`);
        console.log('❌ Write permissions: FAILED');
      }

      // Check current user
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          result.permissions.userRole = user.user_metadata?.role || 'user';
          console.log('👤 Current user role:', result.permissions.userRole);
        }
      } catch (error: any) {
        console.log('❌ Could not get current user:', error.message);
      }

    } catch (error: any) {
      console.error('❌ Permission check failed:', error);
      result.issues.push(`Permission check failed: ${error.message}`);
    }
  }

  private static generateRecommendations(result: DatabaseAuditResult): void {
    console.log('💡 Generating recommendations...');

    if (result.connection.status === 'failed') {
      result.recommendations.push('Fix database connection issues before proceeding');
      result.recommendations.push('Check Supabase project status and credentials');
    }

    if (result.schema.missingTables.length > 0) {
      result.recommendations.push('Run database migrations to create missing tables');
      result.recommendations.push('Verify migration files are properly configured');
    }

    if (!result.permissions.canRead) {
      result.recommendations.push('Check RLS policies for read access');
      result.recommendations.push('Verify user authentication and role assignments');
    }

    if (!result.permissions.canWrite) {
      result.recommendations.push('Review RLS policies for write access');
      result.recommendations.push('Ensure proper user permissions are configured');
    }

    if (result.connection.latency && result.connection.latency > 1000) {
      result.recommendations.push('Database latency is high - consider optimizing queries');
    }

    if (result.data.userCount === 0) {
      result.recommendations.push('No users found - consider creating initial admin user');
    }

    console.log('📝 Recommendations generated:', result.recommendations.length);
  }

  static async quickHealthCheck(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      return !error;
    } catch {
      return false;
    }
  }
}