import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { logger } from '../../utils/monitoring/logger';
import type { User } from '../../types/auth';

export class FirebaseAuthService {
  static async login(email: string, password: string): Promise<User> {
    try {
      // Check if running in development
      if (import.meta.env.DEV && !this.isLocalhost()) {
        throw new Error('Authentication is only available on authorized domains');
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      return this.transformUser(result.user);
    } catch (error: any) {
      logger.error('Login failed', { error });
      
      switch (error.code) {
        case 'auth/unauthorized-domain':
          throw new Error('Please access the application through the official URL');
        case 'auth/invalid-credential':
          throw new Error('Invalid email or password');
        case 'auth/user-not-found':
          throw new Error('No account found with this email');
        case 'auth/wrong-password':
          throw new Error('Incorrect password');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later');
        default:
          throw new Error('Login failed. Please try again');
      }
    }
  }

  private static isLocalhost(): boolean {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  }

  // ... rest of the class implementation stays the same ...
}