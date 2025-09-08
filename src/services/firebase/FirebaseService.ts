import { auth } from '../../config/firebase';
import { logger } from '../../utils/monitoring/logger';

export class FirebaseService {
  private static instance: FirebaseService;
  private initialized = false;

  private constructor() {}

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      // Check if running in development
      if (import.meta.env.DEV && !this.isLocalhost()) {
        logger.warn('Authentication is only available on authorized domains');
        return false;
      }

      // Wait for Auth to initialize
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Firebase Auth initialization timeout'));
        }, 10000);

        const unsubscribe = auth.onAuthStateChanged((user) => {
          clearTimeout(timeout);
          unsubscribe();
          resolve();
        });
      });

      this.initialized = true;
      logger.info('Firebase initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Firebase', { error });
      return false;
    }
  }

  private isLocalhost(): boolean {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const firebaseService = FirebaseService.getInstance();