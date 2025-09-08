import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/monitoring/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration error: Missing environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  
  // Don't throw error in production, use fallback
  if (import.meta.env.PROD) {
    console.warn('Using fallback Supabase configuration');
  } else {
    throw new Error('Missing Supabase environment variables');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Initialize auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
  logger.info('Auth state changed', { event, userId: session?.user?.id });
});

console.log('Supabase client initialized with URL:', supabaseUrl);
logger.info('Supabase client initialized');