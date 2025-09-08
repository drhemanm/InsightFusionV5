import { supabase } from '../../config/supabase';
import { logger } from '../../utils/monitoring/logger';
import type { User } from '../../types/auth';

export class SupabaseAuthService {
  static async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        logger.error('Google sign in failed', { error });
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      logger.error('Google sign in error', { error });
      return { success: false, error: error.message };
    }
  }

  static async signInWithEmail(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error('Email sign in failed', { error });
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user = this.transformSupabaseUser(data.user);
        return { success: true, user };
      }

      return { success: false, error: 'No user data received' };
    } catch (error: any) {
      logger.error('Email sign in error', { error });
      return { success: false, error: error.message };
    }
  }

  static async signUp(email: string, password: string, metadata: any): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        logger.error('Sign up failed', { error });
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user = this.transformSupabaseUser(data.user);
        return { success: true, user };
      }

      return { success: false, error: 'No user data received' };
    } catch (error: any) {
      logger.error('Sign up error', { error });
      return { success: false, error: error.message };
    }
  }

  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Sign out failed', { error });
        throw error;
      }
      logger.info('User signed out successfully');
    } catch (error) {
      logger.error('Sign out error', { error });
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user ? this.transformSupabaseUser(user) : null;
    } catch (error) {
      logger.error('Get current user failed', { error });
      return null;
    }
  }

  private static transformSupabaseUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      firstName: supabaseUser.user_metadata?.firstName || supabaseUser.user_metadata?.first_name || 'User',
      lastName: supabaseUser.user_metadata?.lastName || supabaseUser.user_metadata?.last_name || '',
      role: supabaseUser.user_metadata?.role || 'user',
      organizationId: supabaseUser.user_metadata?.organizationId || 'default',
      isEmailVerified: supabaseUser.email_confirmed_at !== null,
      twoFactorEnabled: false
    };
  }
}