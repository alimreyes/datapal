'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout as firebaseLogout,
  resetPassword,
} from '@/lib/firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthState({
          user,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
        });
      }
    );

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, displayName: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    const { user, error } = await registerWithEmail(email, password, displayName);
    
    if (error) {
      setAuthState((prev) => ({ ...prev, loading: false, error }));
      return { success: false, error };
    }

    setAuthState({ user, loading: false, error: null });
    return { success: true, error: null };
  };

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    const { user, error } = await loginWithEmail(email, password);
    
    if (error) {
      setAuthState((prev) => ({ ...prev, loading: false, error }));
      return { success: false, error };
    }

    setAuthState({ user, loading: false, error: null });
    return { success: true, error: null };
  };

  const loginGoogle = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    const { user, error } = await loginWithGoogle();
    
    if (error) {
      setAuthState((prev) => ({ ...prev, loading: false, error }));
      return { success: false, error };
    }

    setAuthState({ user, loading: false, error: null });
    return { success: true, error: null };
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    const { error } = await firebaseLogout();
    
    if (error) {
      setAuthState((prev) => ({ ...prev, loading: false, error }));
      return { success: false, error };
    }

    setAuthState({ user: null, loading: false, error: null });
    return { success: true, error: null };
  };

  const sendPasswordReset = async (email: string) => {
    const { error } = await resetPassword(email);
    return { success: !error, error };
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    register,
    login,
    loginGoogle,
    logout,
    sendPasswordReset,
    isAuthenticated: !!authState.user,
  };
}