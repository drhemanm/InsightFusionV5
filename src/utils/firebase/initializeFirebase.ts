import { logger } from '../monitoring/logger';
import { auth, isFirebaseInitialized } from '../../config/firebase';

export const initializeFirebase = async () => {
  try {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase failed to initialize');
    }

    // Wait for Firebase Auth to initialize
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Firebase Auth initialization timeout'));
      }, 10000); // 10 second timeout

      const unsubscribe = auth.onAuthStateChanged((user) => {
        clearTimeout(timeout);
        unsubscribe();
        resolve();
      });
    });

    logger.info('Firebase Auth initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Firebase Auth', { error });
    return false;
  }
};