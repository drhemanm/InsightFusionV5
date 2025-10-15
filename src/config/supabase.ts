import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Environment validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
    'Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// Create Supabase client with optimized configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'insightfusion-auth',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'insightfusion',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper: Get current company ID from session
export const getCurrentCompanyId = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  // Get user's company_id
  const { data: user } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', session.user.id)
    .single();

  return user?.company_id || null;
};

// Helper: Get current user
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return user;
};

// Helper: Check connection
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('companies').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};

// Auth helpers
export const authHelpers = {
  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange: (callback: (session: any) => void) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },
};

// Realtime subscription helper
export const subscribeToTable = <T = any>(
  table: string,
  callback: (payload: any) => void,
  filter?: { column: string; value: string | number }
) => {
  let channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
      },
      callback
    );

  channel.subscribe();

  return () => {
    channel.unsubscribe();
  };
};

// Export configured client as default
export default supabase;
