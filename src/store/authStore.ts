import { create } from 'zustand';
import { FirebaseAuthService } from '../services/firebase/authService';
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
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Start with loading false to prevent infinite loading
  error: null,

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('🚀 Initiating Google OAuth flow...');
      
      const result = await FirebaseAuthService.signInWithGoogle();
      
      if (result.success) {
        console.log('✅ Google OAuth flow started successfully');
        if (result.user) {
          set({ 
            user: result.user,
            isAuthenticated: true,
            isLoading: false 
          });
        }
        return { success: true };
      } else {
        console.error('❌ Google OAuth failed:', result.error);
        set({ 
          error: result.error || 'Google sign in failed',
          isLoading: false 
        });
        return { success: false };
      }
    } catch (error: any) {
      console.error('❌ Google sign in exception:', error);
      logger.error('Google sign in failed', { error });
      set({ 
        error: 'Failed to sign in with Google. Please try again or use email login.',
        isLoading: false 
      });
      return { success: false };
    }
  },

  loginWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔐 Starting email authentication for:', email);
      
      const result = await FirebaseAuthService.signInWithEmail(email, password);
      
      if (result.success && result.user) {
        console.log('✅ Email authentication successful:', result.user.email);
        set({ 
          user: result.user,
          isAuthenticated: true,
          isLoading: false 
        });
        return true;
      } else {
        console.error('❌ Email authentication failed:', result.error);
        set({ 
          error: result.error || 'Login failed',
          isLoading: false 
        });
        return false;
      }
    } catch (error: any) {
      console.error('❌ Email authentication exception:', error);
      logger.error('Email login failed', { error });
      set({ 
        error: 'Login failed. Please check your credentials and try again.',
        isLoading: false 
      });
      return false;
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('📝 Starting user registration for:', email);
      
      const result = await FirebaseAuthService.signUp(email, password, {
        firstName,
        lastName,
        role: 'user'
      });
      
      if (result.success) {
        console.log('✅ Registration successful');
        // If user is returned, they're automatically signed in
        if (result.user) {
          set({ 
            user: result.user,
            isAuthenticated: true,
            isLoading: false 
          });
        } else {
          // Email verification required
          set({ isLoading: false });
        }
        return true;
      } else {
        console.error('❌ Registration failed:', result.error);
        set({ 
          error: result.error || 'Registration failed',
          isLoading: false 
        });
        return false;
      }
    } catch (error: any) {
      console.error('❌ Registration exception:', error);
      logger.error('Registration failed', { error });
      set({ 
        error: 'Registration failed',
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      console.log('🚪 Logging out user...');
      await FirebaseAuthService.signOut();
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false,
        error: null 
      });
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      logger.error('Logout failed', { error });
      set({ isLoading: false });
    }
  },

  setUser: (user) => {
    console.log('🔄 Setting user in auth store:', user);
    set({ 
      user, 
      isAuthenticated: true, 
      isLoading: false,
      error: null 
    });
  },
  clearUser: () => {
    console.log('🧹 Clearing user from auth store');
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false,
      error: null 
    });
  },
  setLoading: (loading) => {
    console.log('🔄 Setting loading state:', loading);
    set({ isLoading: loading });
  }
}));