import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAdminLoginInfo,
  getCurrentAuthenticatedSession,
  loginUser,
  signupUser,
  loginAdmin,
  logoutFromAuth,
  updateAuthUserProfile,
} from '../services/authService';
import { AUTH_RULES } from '../config/constants';

const AUTH_STORAGE_KEY = 'canteen_auth_session';
const IDLE_TIMEOUT_MS = AUTH_RULES.IDLE_TIMEOUT_MS;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const idleTimerRef = useRef(null);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutFromAuth();
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      clearIdleTimer();
      setUser(null);
      setToken(null);
    }
  }, [clearIdleTimer]);

  const markActivity = useCallback(() => {
    if (!user) return;

    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      logout();
    }, IDLE_TIMEOUT_MS);
  }, [clearIdleTimer, logout, user]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const firebaseSession = await getCurrentAuthenticatedSession();
        if (firebaseSession?.user && firebaseSession?.token) {
          await AsyncStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ user: firebaseSession.user, token: firebaseSession.token })
          );
          setUser(firebaseSession.user);
          setToken(firebaseSession.token);
          return;
        }

        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to restore auth session:', error?.message || error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const persistSession = async ({ user: nextUser, token: nextToken }) => {
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: nextUser, token: nextToken })
    );
    setUser(nextUser);
    setToken(nextToken);
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      logout();
    }, IDLE_TIMEOUT_MS);
  };

  const loginUserWithPassword = async ({ email, password }) => {
    const result = await loginUser({ email, password });
    await persistSession(result);
    return result.user;
  };

  const signupUserWithPassword = async ({ name, email, password }) => {
    const result = await signupUser({ name, email, password });

    if (result?.requiresEmailVerification) {
      return result;
    }

    await persistSession(result);
    return result.user;
  };

  const loginAdminWithPassword = async ({ email, password }) => {
    const result = await loginAdmin({ email, password });
    await persistSession(result);
    return result.user;
  };

  const updateProfile = async (updates) => {
    if (!user) return;

    if (updates?.name) {
      try {
        await updateAuthUserProfile({ name: updates.name });
      } catch (error) {
        console.warn('Failed to update auth profile:', error?.message || error);
      }
    }

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    if (token) {
      try {
        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ user: updatedUser, token })
        );
      } catch (error) {
        console.warn('Failed to persist updated profile:', error?.message || error);
      }
    }

    markActivity();
  };

  useEffect(() => {
    if (!user) {
      clearIdleTimer();
      return;
    }

    markActivity();

    return () => {
      clearIdleTimer();
    };
  }, [clearIdleTimer, markActivity, user]);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthLoading,
      loginUserWithPassword,
      signupUserWithPassword,
      loginAdminWithPassword,
      adminLoginInfo: getAdminLoginInfo(),
      updateProfile,
      markActivity,
      logout,
    }),
    [user, token, isAuthLoading, markActivity, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
