import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { enableIndexedDbPersistence } from 'firebase/firestore';
import { logger } from '../../utils/monitoring/logger';

const firebaseConfig = {
  apiKey: "AIzaSyAeK6pc9-36F2ft_L0SS5qjbk9OF4FjgZQ",
  authDomain: "insightfusion-6285e.firebaseapp.com",
  projectId: "insightfusion-6285e",
  storageBucket: "insightfusion-6285e.firebasestorage.app",
  messagingSenderId: "1025865448931",
  appId: "1:1025865448931:web:b099c6c3fc716ea8abb4d6",
  measurementId: "G-HLYQHW00XD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      logger.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      logger.warn('Browser doesn\'t support persistence');
    }
  });

logger.info('Firebase initialized');

export { app, db, auth };