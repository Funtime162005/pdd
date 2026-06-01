import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { getAuth, initializeAuth, getReactNativePersistence, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app;
let auth: any = null;

if (isFirebaseConfigured) {
  try {
    console.log("Initializing Firebase with config:", firebaseConfig);
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    if (Platform.OS === 'web') {
      auth = getAuth(app);
    } else {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
}

export { auth };

export const signInWithGoogleFirebase = async () => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your environment configuration.');
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

import { signOut } from 'firebase/auth';

export const signOutFirebase = async () => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error signing out:", e);
    }
  }
};

export const signInWithEmailFirebase = async (email: string, password?: string) => {
  if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment configuration.');
  if (!password) throw new Error('Password is required.');
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signUpWithEmailFirebase = async (email: string, password?: string) => {
  if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment configuration.');
  if (!password) throw new Error('Password is required.');
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};
