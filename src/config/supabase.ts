import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/monitoring/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced Supabase configuration validation with fallbacks
console.log('🔧 Supabase Configuration Check:');
console.log('URL:', supabaseUrl || 'MISSING');
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'MISSING');
console.log('Environment:', import.meta.env.MODE);
console.log('All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

// Check if environment variables are properly loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  console.error('Available env vars:', Object.keys(import.meta.env));
  
  // Don't throw error in production, use fallback
  if (import.meta.env.PROD) {
    console.error('🚨 Production deployment missing Supabase config!');
    console.error('Please check Vercel environment variables');
  } else {
    throw new Error('Missing required Supabase environment variables. Please check your .env file.');
  }
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
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (response.ok) {
      console.log('✅ Supabase connection test successful');
    } else {
      console.warn('⚠️ Supabase connection test returned:', response.status, response.statusText);
    }
  } catch (error) {
    console.warn('⚠️ Supabase connection test failed (this is normal if project is paused):', error.message);
    console.log('💡 This usually means:');
    console.log('   1. Supabase project is paused (free tier)');
    console.log('   2. Project was deleted');
    console.log('   3. Network/firewall blocking connection');
    console.log('   4. Invalid project URL');
    console.log('   5. Local development network issues');
    console.log('🔧 The app will still work once you interact with it and wake up the project');
  }
};

// Run connection test in development
if (import.meta.env.DEV) {
  // Don't block app startup with connection test
  setTimeout(testConnection, 1000);
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
// Test basic connection without relying on specific tables
const testBasicConnection = async () => {
  try {
    console.log('🔍 Testing Supabase auth connection...');
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('⚠️ Supabase auth session error:', error.message);
      console.log('💡 This is normal if you haven\'t logged in yet');
    } else {
      console.log('✅ Supabase auth connection successful');
      if (data.session) {
        console.log('👤 Found existing session for:', data.session.user.email);
      }
    }
  } catch (error: any) {
    console.warn('⚠️ Supabase connection test failed:', error.message);
    console.log('💡 Possible causes:');
    console.log('   1. Supabase project is paused (free tier auto-pauses)');
    console.log('   2. Network connectivity issues');
    console.log('   3. Invalid project URL or credentials');
    console.log('🔧 The app will still work - try logging in to wake up the project');
  }
};

// Run connection test with delay to not block app startup
setTimeout(testBasicConnection, 2000);

console.log('🚀 Supabase client initialized');
logger.info('Supabase client initialized');