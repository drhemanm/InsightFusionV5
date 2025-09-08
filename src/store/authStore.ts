import { create } from 'zustand';
import { SupabaseAuthService } from '../services/supabase/authService';
import { logger } from '../utils/monitoring/logger';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<{ success: boolean; redirected?: boolean }>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Starting Google OAuth...');
      const result = await SupabaseAuthService.signInWithGoogle();
      
      if (result.success) {
        if (result.user) {
          set({ 
            user: result.user,
            isAuthenticated: true,
            isLoading: false 
          });
        }
        console.log('Google OAuth initiated successfully');
        return { success: true };
      } else {
        console.error('Google OAuth failed:', result.error);
        set({ 
          error: result.error || 'Google sign in failed',
          isLoading: false 
        });
        return { success: false };
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      logger.error('Google sign in failed', { error });
      set({ 
        error: 'Failed to sign in with Google',
        isLoading: false 
      });
      return { success: false };
    }
  },

  loginWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Starting email login for:', email);
      const result = await SupabaseAuthService.signInWithEmail(email, password);
      
      if (result.success && result.user) {
        console.log('Email login successful:', result.user.email);
        set({ 
          user: result.user,
          isAuthenticated: true,
          isLoading: false 
        });
        return true;
      } else {
        console.error('Email login failed:', result.error);
        set({ 
          error: result.error || 'Login failed',
          isLoading: false 
        });
        return false;
      }
    } catch (error: any) {
      console.error('Email login error:', error);
      logger.error('Email login failed', { error });
      set({ 
        error: 'Login failed',
        isLoading: false 
      });
      return false;
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await SupabaseAuthService.signUp(email, password, {
        firstName,
        lastName,
        role: 'user'
      });
      
      if (result.success) {
        set({ isLoading: false });
        return true;
      } else {
        set({ 
          error: result.error || 'Registration failed',
          isLoading: false 
        });
        return false;
      }
    } catch (error: any) {
      logger.error('Registration failed', { error });
      set({ 
        error: 'Registration failed',
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await SupabaseAuthService.signOut();
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false,
        error: null 
      });
    } catch (error) {
      logger.error('Logout failed', { error });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false })
}));