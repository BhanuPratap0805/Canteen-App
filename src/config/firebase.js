import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAFhzguJyby8SU8NoQFCk9bUcQuPmaPFOE',
  authDomain: 'campus-canteen-d5a01.firebaseapp.com',
  projectId: 'campus-canteen-d5a01',
  storageBucket: 'campus-canteen-d5a01.firebasestorage.app',
  messagingSenderId: '1069449434408',
  appId: '1:1069449434408:web:5db6443fbd1133a5b66c1d',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
export const db = getFirestore(app);
export default app;