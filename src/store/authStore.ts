import { create } from 'zustand';
import { supabase, authHelpers, getCurrentUser } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    try {
      console.log('🔄 Initializing auth...');
      
      // Get current session
      const session = await authHelpers.getSession();
      
      if (session?.user) {
        console.log('✅ User authenticated:', session.user.email);
        
        // Get user profile from database
        const profile = await getCurrentUser();
        
        set({
          user: session.user,
          profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('ℹ️ No active session');
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }

      // Listen for auth changes
      authHelpers.onAuthStateChange((session) => {
        console.log('🔄 Auth state changed:', session?.user?.email || 'signed out');
        
        if (session?.user) {
          getCurrentUser().then(profile => {
            set({
              user: session.user,
              profile,
              isAuthenticated: true,
            });
          });
        } else {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
          });
        }
      });
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize auth',
        isLoading: false,
      });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Signing in:', email);
      
      const { data, error } = await authHelpers.signIn(email, password);
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        const profile = await getCurrentUser();
        
        set({
          user: data.user,
          profile,
          isAuthenticated: true,
          isLoading: false,
        });
        
        console.log('✅ Sign in successful');
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Signing up:', email);
      
      const { data, error } = await authHelpers.signUp(email, password, fullName);
      
      if (error) {
        throw new Error(error.message);
      }

      console.log('✅ Sign up successful - check email for confirmation');
      
      set({
        isLoading: false,
        error: 'Please check your email to confirm your account',
      });
    } catch (error) {
      console.error('❌ Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Signing out...');
      
      const { error } = await authHelpers.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Requesting password reset for:', email);
      
      const { error } = await authHelpers.resetPassword(email);
      
      if (error) {
        throw new Error(error.message);
      }

      set({
        isLoading: false,
        error: 'Password reset email sent - check your inbox',
      });
      
      console.log('✅ Password reset email sent');
    } catch (error) {
      console.error('❌ Password reset error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  updatePassword: async (newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Updating password...');
      
      const { error } = await authHelpers.updatePassword(newPassword);
      
      if (error) {
        throw new Error(error.message);
      }

      set({
        isLoading: false,
      });
      
      console.log('✅ Password updated successfully');
    } catch (error) {
      console.error('❌ Password update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
