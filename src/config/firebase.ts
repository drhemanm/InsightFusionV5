import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAeK6pc9-36F2ft_L0SS5qjbk9OF4FjgZQ",
  authDomain: "insightfusion-6285e.firebaseapp.com",
  databaseURL: "https://insightfusion-6285e-default-rtdb.firebaseio.com",
  projectId: "insightfusion-6285e",
  storageBucket: "insightfusion-6285e.firebasestorage.app",
  messagingSenderId: "1025865448931",
  appId: "1:1025865448931:web:b099c6c3fc716ea8abb4d6",
  measurementId: "G-HLYQHW00XD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;