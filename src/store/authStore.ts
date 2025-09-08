import { create } from 'zustand';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '../services/firebase/firebaseConfig';
import { logger } from '../utils/monitoring/logger';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<{ success: boolean; redirected?: boolean }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      // Check if running in development
      if (import.meta.env.DEV && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        set({ 
          error: 'Please access the application through the official URL or localhost',
          isLoading: false 
        });
        return { success: false };
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Try popup first
      try {
        const result = await signInWithPopup(auth, provider);
        if (!result.user) {
          throw new Error('No user data received');
        }

        const user: User = {
          id: result.user.uid,
          email: result.user.email!,
          firstName: result.user.displayName?.split(' ')[0] || 'User',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'user',
          organizationId: 'default',
          isEmailVerified: result.user.emailVerified,
          twoFactorEnabled: false
        };

        set({ 
          user,
          isAuthenticated: true,
          isLoading: false 
        });

        return { success: true };
      } catch (error: any) {
        // If popup blocked, fallback to redirect
        if (error.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, provider);
          return { success: false, redirected: true };
        }
        throw error;
      }
    } catch (error: any) {
      logger.error('Google sign in failed', { error });
      let errorMessage = 'Failed to sign in with Google';
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'Please access the application through the official URL';
      }

      set({ 
        error: errorMessage,
        isLoading: false 
      });
      return { success: false };
    }
  },

  logout: () => {
    auth.signOut();
    set({ 
      user: null, 
      isAuthenticated: false,
      isLoading: false,
      error: null 
    });
  }
}));