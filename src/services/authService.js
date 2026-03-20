import {
  createUserWithEmailAndPassword,
  getIdTokenResult,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { ROLES } from '../config/constants';
import { createUserProfile, getUserProfile, upsertUserProfile, updateUserProfile } from './userService';

const ADMIN_EMAIL = process.env.EXPO_PUBLIC_ADMIN_EMAIL || 'admin@canteen.com';
const NORMALIZED_ADMIN_EMAIL = ADMIN_EMAIL.trim().toLowerCase();
const STAFF_ROLES = [ROLES.ADMIN, ROLES.CANTEEN];

const ensureFirebaseConfigured = () => {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase config missing. Add EXPO_PUBLIC_FIREBASE_* values in your environment.'
    );
  }
};

const createAuthError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const normalizeRole = (value) => {
  const role = String(value || '').trim().toLowerCase();
  if (!role) return null;

  if ([ROLES.ADMIN, ROLES.CANTEEN, ROLES.STUDENT, ROLES.USER].includes(role)) {
    return role;
  }

  return null;
};

const isStaffRole = (role) => STAFF_ROLES.includes(role);

const resolveUserRole = async (firebaseUser) => {
  const email = (firebaseUser?.email || '').trim().toLowerCase();

  let roleFromClaims = null;
  let roleFromProfile = null;

  try {
    const tokenResult = await getIdTokenResult(firebaseUser);
    roleFromClaims = normalizeRole(tokenResult?.claims?.role);
  } catch (error) {
    console.warn('Unable to read auth token claims:', error?.message || error);
  }

  try {
    const profile = await getUserProfile(firebaseUser.uid);
    roleFromProfile = normalizeRole(profile?.role);
  } catch (error) {
    console.warn('Unable to read user profile role:', error?.message || error);
  }

  const fallbackRole = email === NORMALIZED_ADMIN_EMAIL ? ROLES.ADMIN : ROLES.USER;
  const resolvedRole = roleFromClaims || roleFromProfile || fallbackRole;

  try {
    await upsertUserProfile(firebaseUser.uid, {
      email: firebaseUser.email || undefined,
      name:
        firebaseUser.displayName || (resolvedRole === ROLES.ADMIN ? 'Admin' : 'Customer'),
      role: resolvedRole,
    });
  } catch (error) {
    console.warn('Unable to upsert user profile during role resolution:', error?.message || error);
  }

  return resolvedRole;
};

const mapFirebaseUser = (firebaseUser, role) => {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    role: role || ROLES.USER,
    email: firebaseUser.email || undefined,
    name: firebaseUser.displayName || (role === ROLES.ADMIN ? 'Admin' : 'Customer'),
  };
};

const buildSessionFromFirebaseUser = async (firebaseUser) => {
  const resolvedRole = await resolveUserRole(firebaseUser);
  return mapFirebaseUser(firebaseUser, resolvedRole);
};

export const loginUser = async ({ email, password }) => {
  ensureFirebaseConfigured();

  const normalizedEmail = (email || '').trim().toLowerCase();

  const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
  const sessionUser = await buildSessionFromFirebaseUser(result.user);

  if (isStaffRole(sessionUser.role)) {
    await signOut(auth);
    throw new Error('This account is admin. Please login from Admin section.');
  }

  if (!result.user.emailVerified) {
    await signOut(auth);
    throw createAuthError(
      'auth/unverified-email',
      'Please verify your email address before logging in. Check your inbox for the verification link.'
    );
  }

  const token = await result.user.getIdToken();

  return {
    token,
    user: sessionUser,
  };
};

export const signupUser = async ({ name, email, password }) => {
  ensureFirebaseConfigured();

  const normalizedEmail = (email || '').trim().toLowerCase();
  const trimmedName = (name || '').trim();

  if (normalizedEmail === NORMALIZED_ADMIN_EMAIL) {
    throw new Error('This email is reserved for admin. Please use a different email.');
  }

  let result;

  try {
    result = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
  } catch (error) {
    const code = error?.code || '';

    if (code.includes('email-already-in-use')) {
      try {
        const existingResult = await signInWithEmailAndPassword(auth, normalizedEmail, password);

        if (!existingResult.user.emailVerified) {
          try {
            await sendEmailVerification(existingResult.user);
          } catch (verificationError) {
            console.warn(
              'Failed to resend verification email for existing unverified account:',
              verificationError?.message || verificationError
            );
          }

          await signOut(auth);

          return {
            requiresEmailVerification: true,
            verificationAction: 'resent',
            email: normalizedEmail,
            user: await buildSessionFromFirebaseUser(existingResult.user),
          };
        }

        await signOut(auth);
        throw createAuthError(
          'auth/email-already-verified',
          'This email is already verified. Please login instead of signing up.'
        );
      } catch (signInError) {
        const signInCode = signInError?.code || '';

        if (signInCode.includes('invalid-credential') || signInCode.includes('wrong-password')) {
          throw createAuthError(
            'auth/unverified-account-password-required',
            'This email already has an account. To resend verification link, enter the same password used during signup.'
          );
        }

        throw error;
      }
    }

    throw error;
  }

  if (trimmedName) {
    await updateProfile(result.user, { displayName: trimmedName });
    await result.user.reload();
  }

  try {
    await createUserProfile(result.user.uid, {
      name: trimmedName,
      email: normalizedEmail,
      role: ROLES.USER,
    });
  } catch (dbError) {
    console.warn('Failed to create user profile in Firestore:', dbError);
  }

  try {
    await sendEmailVerification(result.user);
  } catch (verificationError) {
    console.warn('Failed to send verification email:', verificationError?.message || verificationError);
  }

  await signOut(auth);

  return {
    requiresEmailVerification: true,
    verificationAction: 'sent',
    email: normalizedEmail,
    user: await buildSessionFromFirebaseUser(result.user),
  };
};

export const loginAdmin = async ({ email, password }) => {
  ensureFirebaseConfigured();

  const normalizedEmail = (email || '').trim().toLowerCase();

  const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
  const sessionUser = await buildSessionFromFirebaseUser(result.user);

  if (!isStaffRole(sessionUser.role)) {
    await signOut(auth);
    throw new Error('Not authorized as admin account');
  }

  const token = await result.user.getIdToken();

  return {
    token,
    user: sessionUser,
  };
};

export const getCurrentAuthenticatedSession = async () => {
  ensureFirebaseConfigured();

  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const sessionUser = await buildSessionFromFirebaseUser(currentUser);

  if (
    !isStaffRole(sessionUser.role) &&
    !currentUser.emailVerified
  ) {
    await signOut(auth);
    return null;
  }

  const token = await currentUser.getIdToken();

  return {
    token,
    user: sessionUser,
  };
};

export const logoutFromAuth = async () => {
  ensureFirebaseConfigured();
  await signOut(auth);
};

export const updateAuthUserProfile = async ({ name }) => {
  ensureFirebaseConfigured();

  if (!auth.currentUser || !name) return;

  await updateProfile(auth.currentUser, { displayName: name });

  try {
    await updateUserProfile(auth.currentUser.uid, { name });
  } catch (error) {
    console.warn('Failed to sync profile name to Firestore:', error?.message || error);
  }
};

export const getAdminLoginInfo = () => ({
  email: ADMIN_EMAIL,
  passwordHint:
    'Use password set for this email in Firebase Authentication (Email/Password provider).',
});
