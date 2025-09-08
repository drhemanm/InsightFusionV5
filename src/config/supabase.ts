import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/monitoring/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('Supabase configuration error: Please update your .env file with actual Supabase credentials');
  console.error('Current values:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey ? '[REDACTED]' : 'undefined' });
  throw new Error('Missing or invalid Supabase environment variables. Please check your .env file and update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY with your actual Supabase project credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Initialize auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  logger.info('Auth state changed', { event, userId: session?.user?.id });
});

logger.info('Supabase client initialized');