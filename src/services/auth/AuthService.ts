import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { logger } from '../../utils/monitoring/logger';
import type { LoginCredentials, AuthResponse } from '../../types/auth';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // In development, use mock credentials
      if (import.meta.env.DEV) {
        return this.mockLogin(credentials);
      }

      const { email, password } = credentials;
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (!result.user) {
        throw new Error('No user data received');
      }

      return {
        token: await result.user.getIdToken(),
        user: {
          id: result.user.uid,
          email: result.user.email!,
          firstName: result.user.displayName?.split(' ')[0] || 'User',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'user',
          organizationId: 'default',
          isEmailVerified: result.user.emailVerified,
          twoFactorEnabled: false
        }
      };
    } catch (error: any) {
      logger.error('Login failed', { error });
      
      // Provide user-friendly error messages
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled');
        case 'auth/user-not-found':
          throw new Error('No account found with this email');
        case 'auth/wrong-password':
          throw new Error('Incorrect password');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later');
        default:
          throw new Error('Login failed. Please check your credentials and try again');
      }
    }
  }

  private static async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock successful login for development
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      return {
        token: 'mock_token',
        user: {
          id: 'mock_user_id',
          email: credentials.email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'user',
          organizationId: 'default',
          isEmailVerified: true,
          twoFactorEnabled: false
        }
      };
    }
    throw new Error('Invalid credentials');
  }
}