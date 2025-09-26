import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../config/firebase';
import { logger } from '../../utils/monitoring/logger';
import type { User } from '../../types/auth';

export class FirebaseAuthService {
  static async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('🔐 Starting Google OAuth...');
      
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      if (firebaseUser) {
        console.log('✅ Google OAuth successful for:', firebaseUser.email);
        
        // Create or update user document in Firestore
        const user = await this.createOrUpdateUserDocument(firebaseUser);
        return { success: true, user };
      }

      return { success: false, error: 'No user data received' };
    } catch (error: any) {
      console.error('❌ Google sign in exception:', error);
      logger.error('Google sign in failed', { error });
      return { 
        success: false, 
        error: error.message || 'Google sign in failed'
      };
    }
  }

  static async signInWithEmail(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('🔐 Starting email login for:', email);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      if (firebaseUser) {
        console.log('✅ Email login successful for:', firebaseUser.email);
        const user = await this.getUserFromFirestore(firebaseUser.uid);
        return { success: true, user };
      }

      return { success: false, error: 'No user data received' };
    } catch (error: any) {
      console.error('❌ Email login exception:', error);
      logger.error('Email sign in failed', { error });
      
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  static async signUp(email: string, password: string, metadata: any): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('🔐 Starting user registration for:', email);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      if (firebaseUser) {
        // Update the user's display name
        await updateProfile(firebaseUser, {
          displayName: `${metadata.firstName} ${metadata.lastName}`
        });

        // Create user document in Firestore
        const user = await this.createOrUpdateUserDocument(firebaseUser, metadata);
        
        console.log('✅ Registration successful for:', firebaseUser.email);
        return { success: true, user };
      }

      return { success: false, error: 'No user data received' };
    } catch (error: any) {
      console.error('❌ Registration exception:', error);
      logger.error('Sign up failed', { error });
      
      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
      logger.info('User signed out successfully');
    } catch (error) {
      logger.error('Sign out failed', { error });
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;
      
      return await this.getUserFromFirestore(firebaseUser.uid);
    } catch (error) {
      logger.error('Get current user failed', { error });
      return null;
    }
  }

  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getUserFromFirestore(firebaseUser.uid);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  private static async createOrUpdateUserDocument(firebaseUser: FirebaseUser, metadata?: any): Promise<User> {
    const userRef = doc(db, 'users', firebaseUser.uid);
    
    const userData: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName: metadata?.firstName || 
                firebaseUser.displayName?.split(' ')[0] || 
                firebaseUser.email?.split('@')[0] || 'User',
      lastName: metadata?.lastName || 
               firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
      role: metadata?.role || 'user',
      organizationId: metadata?.organizationId || 'default',
      isEmailVerified: firebaseUser.emailVerified,
      twoFactorEnabled: false
    };

    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });

    return userData;
  }

  private static async getUserFromFirestore(uid: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          id: uid,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role || 'user',
          organizationId: data.organizationId || 'default',
          isEmailVerified: data.isEmailVerified || false,
          twoFactorEnabled: data.twoFactorEnabled || false
        };
      }
      
      return null;
    } catch (error) {
      logger.error('Failed to get user from Firestore', { error });
      return null;
    }
  }
}

export const authService = FirebaseAuthService;