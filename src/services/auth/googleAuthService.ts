import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, isAuthorizedDomain } from '../../config/firebase';
import { logger } from '../../utils/monitoring/logger';
import type { User } from '../../types/auth';

export class GoogleAuthService {
  private static provider = new GoogleAuthProvider();

  static async signIn(): Promise<User> {
    try {
      // Verify domain authorization
      if (!isAuthorizedDomain()) {
        throw new Error('Please access through the official URL');
      }

      // Configure provider
      this.provider.addScope('profile');
      this.provider.addScope('email');

      // Try popup first
      try {
        const result = await signInWithPopup(auth, this.provider);
        return this.transformGoogleUser(result.user);
      } catch (popupError: any) {
        // Fallback to redirect for specific errors
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user') {
          await signInWithRedirect(auth, this.provider);
          const result = await getRedirectResult(auth);
          if (!result) {
            throw new Error('Google sign in failed');
          }
          return this.transformGoogleUser(result.user);
        }
        throw popupError;
      }
    } catch (error: any) {
      logger.error('Google sign in failed', { error });
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  private static transformGoogleUser(firebaseUser: any): User {
    if (!firebaseUser.email) {
      throw new Error('Email is required');
    }

    const [firstName = '', ...lastNameParts] = (firebaseUser.displayName || '').split(' ');
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      firstName: firstName || 'User',
      lastName: lastNameParts.join(' ') || firebaseUser.uid.slice(0, 5),
      role: 'user',
      organizationId: 'default',
      isEmailVerified: firebaseUser.emailVerified,
      twoFactorEnabled: false
    };
  }
}