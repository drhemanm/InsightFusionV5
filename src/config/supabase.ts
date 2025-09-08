import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/monitoring/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clgfmgyhrdomimirhkpxx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZ2ZtZ3locmRvbWltcmhrcHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjcyMzIsImV4cCI6MjA3Mjg0MzIzMn0.w2p0qaB11s9yPVWr7keyYDRvyAvT9OUESWkpSB6foEQ';

// Validate Supabase configuration
console.log('Supabase Configuration Check:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

// Test URL format
try {
  new URL(supabaseUrl);
  console.log('✅ Supabase URL format is valid');
} catch (error) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: import.meta.env.DEV
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'insightfusion-crm'
    }
  }
});

// Test Supabase connection
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
  }
};

// Test connection in development
if (import.meta.env.DEV) {
  testConnection();
}

// Auth state listener with better error handling
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth state changed:', event);
  if (session?.user) {
    console.log('👤 User authenticated:', session.user.email);
  }
  logger.info('Auth state changed', { event, userId: session?.user?.id });
});

console.log('🚀 Supabase client initialized');
logger.info('Supabase client initialized');