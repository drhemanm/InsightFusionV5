import { supabase } from '../../config/supabase';
import { logger } from '../../utils/monitoring/logger';
import type { LoginCredentials, AuthResponse } from '../../types/auth';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No user data received');
      }
      return {
        token: data.session?.access_token || '',
        user: {
          id: data.user.id,
          email: data.user.email!,
          firstName: data.user.user_metadata?.firstName || 'User',
          lastName: data.user.user_metadata?.lastName || '',
          role: 'user',
          organizationId: 'default',
          isEmailVerified: data.user.email_confirmed_at !== null,
          twoFactorEnabled: false
        }
      };
    } catch (error: any) {
      logger.error('Login failed', { error });
      
      throw new Error(error.message || 'Login failed. Please check your credentials and try again');
    }
  }

  static async refreshToken(): Promise<string> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw new Error('Token refresh failed');
      }
      return data.session?.access_token || '';
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }
}