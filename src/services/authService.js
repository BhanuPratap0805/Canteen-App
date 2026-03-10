import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export function getErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export async function getUserProfile(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { uid, ...snap.data() };
}

export async function registerStudent(name, rollNumber, email, phone, password) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = cred.user;

  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    name: String(name || '').trim(),
    rollNumber: String(rollNumber || '').trim().toUpperCase(),
    email: String(email || '').trim().toLowerCase(),
    phone: String(phone || '').trim(),
    role: 'student',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
}

async function loginWithRole(email, password, requiredRole) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = cred.user;

  const profile = await getUserProfile(user.uid);
  if (!profile) {
    await signOut(auth);
    const err = new Error('Profile not found. Please contact support.');
    err.code = 'profile/not-found';
    throw err;
  }

  if (profile.role !== requiredRole) {
    await signOut(auth);
    const err = new Error(
      requiredRole === 'student'
        ? 'This account is not a student account.'
        : 'This account is not a staff account.'
    );
    err.code = 'auth/role-mismatch';
    throw err;
  }

  return { user, profile };
}

export function loginStudent(email, password) {
  return loginWithRole(email, password, 'student');
}

export function loginStaff(email, password) {
  return loginWithRole(email, password, 'staff');
}

export function logout() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

