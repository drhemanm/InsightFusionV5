import { supabase } from '../../config/supabase';
import { logger } from '../../utils/monitoring/logger';
import type { User } from '../../types/auth';

export class SupabaseAuthService {
  static async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('🔐 Starting Google OAuth...');
      
      // Use the current origin for redirect
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      console.log('🔗 Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        logger.error('Google sign in failed', { error });
        return { 
          success: false, 
          error: error.message
        };
      }

      console.log('✅ Google OAuth initiated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Google sign in exception:', error);
      logger.error('Google sign in error', { error });
      return { success: false, error: error.message };
    }
  }

  static async signInWithEmail(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('🔐 Starting email login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Email login error:', error);
        logger.error('Email sign in failed', { error });
        return { 
          success: false, 
          error: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message
        };
      }

      if (data.user) {
        console.log('✅ Email login successful for:', data.user.email);
        const user = this.transformSupabaseUser(data.user);
        return { success: true, user };
      }

      console.error('❌ No user data received');
      return { success: false, error: 'No user data received' };
    } catch (error: any) {
      console.error('❌ Email login exception:', error);
      logger.error('Email sign in error', { error });
      return { 
        success: false, 
        error: 'Login failed. Please check your internet connection and try again.'
      };
    }
  }

  static async signUp(email: string, password: string, metadata: any): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('🔐 Starting user registration for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          hd: undefined, // Allow any domain
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('❌ Registration error:', error);
        logger.error('Sign up failed', { error });
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        console.log('✅ Registration successful for:', data.user.email);
        const user = this.transformSupabaseUser(data.user);
        return { success: true, user };
      }

      return { success: false, error: 'No user data received' };
    } catch (error: any) {
      console.error('❌ Registration exception:', error);
      logger.error('Sign up error', { error });
      return { 
        success: false, 
        error: `Connection failed: ${error.message}. Your Supabase project may be paused or unreachable.`
      };
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
      firstName: supabaseUser.user_metadata?.firstName || 
                supabaseUser.user_metadata?.first_name || 
                supabaseUser.user_metadata?.given_name ||
                supabaseUser.user_metadata?.name?.split(' ')[0] ||
                supabaseUser.email?.split('@')[0] || 'User',
      lastName: supabaseUser.user_metadata?.lastName || 
               supabaseUser.user_metadata?.last_name || 
               supabaseUser.user_metadata?.family_name ||
               supabaseUser.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
      role: supabaseUser.user_metadata?.role || 'user',
      organizationId: supabaseUser.user_metadata?.organizationId || 'default',
      isEmailVerified: supabaseUser.email_confirmed_at !== null,
      twoFactorEnabled: false
    };
  }
}

export const authService = SupabaseAuthService;