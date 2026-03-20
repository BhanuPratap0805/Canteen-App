import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const USERS_COLLECTION = 'users';

const ensureDbConfigured = () => {
  if (!db) {
    throw new Error('Firestore is not configured. Check Firebase environment variables.');
  }
};

export const createUserProfile = async (uid, data) => {
  if (!uid) throw new Error('User ID is required to create a profile.');
  ensureDbConfigured();

  const userRef = doc(db, USERS_COLLECTION, uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
};

export const getUserProfile = async (uid) => {
  ensureDbConfigured();
  if (!uid) return null;
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};

export const updateUserProfile = async (uid, updates) => {
  ensureDbConfigured();
  if (!uid) return;
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const upsertUserProfile = async (uid, data) => {
  if (!uid) throw new Error('User ID is required to upsert a profile.');
  ensureDbConfigured();

  const userRef = doc(db, USERS_COLLECTION, uid);
  await setDoc(
    userRef,
    {
      ...data,
      updatedAt: new Date().toISOString(),
      createdAt: data?.createdAt || new Date().toISOString(),
    },
    { merge: true }
  );
};
