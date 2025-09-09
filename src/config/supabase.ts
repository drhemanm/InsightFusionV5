import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/monitoring/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced Supabase configuration validation
console.log('🔧 Supabase Configuration Check:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
console.log('Environment:', import.meta.env.MODE);

// Check if environment variables are properly loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  throw new Error('Missing required Supabase environment variables. Please check your .env file and Netlify environment variables.');
}

// Test URL format
try {
  new URL(supabaseUrl);
  console.log('✅ Supabase URL format is valid');
} catch (error) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format');
}

// Test Supabase connection
const testConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
    } else {
      console.log('✅ Supabase connection test successful');
    }
  } catch (error) {
    console.error('❌ Supabase connection refused:', error);
    console.log('💡 This usually means:');
    console.log('   1. Supabase project is paused (free tier)');
    console.log('   2. Project was deleted');
    console.log('   3. Network/firewall blocking connection');
    console.log('   4. Invalid project URL');
  }
};

// Run connection test in development
if (import.meta.env.DEV) {
  testConnection();
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: import.meta.env.DEV,
    // Add retry logic for connection issues
    retryAttempts: 3,
    retryDelay: 1000
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'insightfusion-crm'
    },
    // Add timeout for requests
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
    }
  }
});

// Enhanced auth state listener with connection error handling
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth state changed:', event);
  if (session?.user) {
    console.log('👤 User authenticated:', session.user.email);
  } else if (event === 'SIGNED_OUT') {
    console.log('🚪 User signed out');
  } else if (event === 'INITIAL_SESSION') {
    console.log('🔄 Initial session check completed');
  }
  logger.info('Auth state changed', { event, userId: session?.user?.id });
});

// Test connection on initialization
supabase.from('users').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('❌ Supabase database connection failed:', error.message);
      if (error.message.includes('refused') || error.message.includes('timeout')) {
        console.log('💡 Your Supabase project might be paused. Check your Supabase dashboard.');
      }
    } else {
      console.log('✅ Supabase database connection successful');
    }
  })
  .catch((error) => {
    console.error('❌ Supabase connection error:', error);
  });

console.log('🚀 Supabase client initialized');
logger.info('Supabase client initialized');