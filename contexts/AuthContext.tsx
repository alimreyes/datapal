'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { loginWithGoogle, logout as firebaseLogout } from '@/lib/firebase/auth';
import type { BrandingConfig, MonitoringPreferences } from '@/lib/types';

// Límite de consultas gratuitas de IA
const FREE_AI_LIMIT = 10;

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscription: 'free' | 'pro' | 'enterprise';
  aiUsageCount: number;
  aiUsageResetDate: Date | null;
  createdAt: Date;
  // Subscription fields (optional, set after payment)
  subscriptionStartDate?: Date | null;
  subscriptionPaymentId?: string | null;
  subscriptionStatus?: 'active' | 'cancelled' | 'expired' | null;
  // Trial fields (optional, set after access code redemption)
  trialCode?: string | null;
  trialExpiresAt?: Date | null;
  // White-label branding (optional)
  branding?: BrandingConfig;
  // Monitoring preferences (optional)
  monitoring?: MonitoringPreferences;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  canUseAI: boolean;
  aiUsageRemaining: number;
  incrementAIUsage: () => Promise<boolean>;
  trialDaysRemaining: number | null;
  refreshUserData: () => Promise<void>;
  updateBranding: (branding: BrandingConfig) => Promise<boolean>;
  updateMonitoring: (monitoring: MonitoringPreferences) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del usuario desde Firestore
  const loadUserData = async (firebaseUser: User) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();

        // Verificar si necesitamos resetear el contador mensual
        const now = new Date();
        const resetDate = data.aiUsageResetDate?.toDate();
        let aiUsageCount = data.aiUsageCount || 0;

        // Si es un nuevo mes, resetear el contador
        if (resetDate && (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear())) {
          aiUsageCount = 0;
          await updateDoc(userDocRef, {
            aiUsageCount: 0,
            aiUsageResetDate: serverTimestamp(),
          });
        }

        // Verificar expiración de trial
        const trialExpiresAt = data.trialExpiresAt?.toDate() || null;
        let subscription = data.subscription || 'free';

        if (subscription === 'pro' && data.trialCode && trialExpiresAt && trialExpiresAt < new Date()) {
          // Trial expirado: revertir a free silenciosamente
          await updateDoc(userDocRef, {
            subscription: 'free',
            subscriptionStatus: 'expired',
          });
          subscription = 'free';
        }

        setUserData({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          subscription: subscription as 'free' | 'pro' | 'enterprise',
          aiUsageCount: aiUsageCount,
          aiUsageResetDate: resetDate || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          subscriptionStartDate: data.subscriptionStartDate?.toDate() || null,
          subscriptionPaymentId: data.subscriptionPaymentId || null,
          subscriptionStatus: subscription === 'free' && data.trialCode ? 'expired' : (data.subscriptionStatus || null),
          trialCode: data.trialCode || null,
          trialExpiresAt: trialExpiresAt,
          branding: data.branding || undefined,
          monitoring: data.monitoring || undefined,
        });
      } else {
        // Crear nuevo documento de usuario
        const newUserData = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          subscription: 'free',
          aiUsageCount: 0,
          aiUsageResetDate: serverTimestamp(),
          createdAt: serverTimestamp(),
        };

        await setDoc(userDocRef, newUserData);

        setUserData({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          subscription: 'free',
          aiUsageCount: 0,
          aiUsageResetDate: new Date(),
          createdAt: new Date(),
          subscriptionStartDate: null,
          subscriptionPaymentId: null,
          subscriptionStatus: null,
          trialCode: null,
          trialExpiresAt: null,
          branding: undefined,
          monitoring: undefined,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.error) {
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    await firebaseLogout();
    setUser(null);
    setUserData(null);
  };

  // Verificar si el usuario puede usar IA
  const canUseAI = (): boolean => {
    if (!userData) return false;
    if (userData.subscription !== 'free') return true; // Pro/Enterprise sin límite
    return userData.aiUsageCount < FREE_AI_LIMIT;
  };

  // Calcular usos restantes
  const aiUsageRemaining = (): number => {
    if (!userData) return 0;
    if (userData.subscription !== 'free') return Infinity;
    return Math.max(0, FREE_AI_LIMIT - userData.aiUsageCount);
  };

  // Incrementar contador de uso de IA
  const incrementAIUsage = async (): Promise<boolean> => {
    if (!user || !userData) return false;

    // Si es usuario de pago, permitir sin incrementar
    if (userData.subscription !== 'free') return true;

    // Verificar si ya alcanzó el límite
    if (userData.aiUsageCount >= FREE_AI_LIMIT) return false;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        aiUsageCount: increment(1),
        lastAIUsage: serverTimestamp(),
      });

      // Actualizar estado local
      setUserData(prev => prev ? {
        ...prev,
        aiUsageCount: prev.aiUsageCount + 1,
      } : null);

      return true;
    } catch (error) {
      console.error('Error incrementing AI usage:', error);
      return false;
    }
  };

  // Actualizar configuración de branding
  const updateBranding = async (branding: BrandingConfig): Promise<boolean> => {
    if (!user) return false;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { branding });
      setUserData(prev => prev ? { ...prev, branding } : null);
      return true;
    } catch (error) {
      console.error('Error updating branding:', error);
      return false;
    }
  };

  // Actualizar configuración de monitoreo
  const updateMonitoring = async (monitoring: MonitoringPreferences): Promise<boolean> => {
    if (!user) return false;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { monitoring });
      setUserData(prev => prev ? { ...prev, monitoring } : null);
      return true;
    } catch (error) {
      console.error('Error updating monitoring:', error);
      return false;
    }
  };

  // Calcular días restantes de trial
  const trialDaysRemaining = (): number | null => {
    if (!userData?.trialCode || !userData?.trialExpiresAt) return null;
    if (userData.subscription === 'free') return null; // ya expiró
    const now = new Date();
    const diff = userData.trialExpiresAt.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  // Refrescar datos del usuario
  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user);
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signInWithGoogle,
    signOut,
    canUseAI: canUseAI(),
    aiUsageRemaining: aiUsageRemaining(),
    incrementAIUsage,
    trialDaysRemaining: trialDaysRemaining(),
    refreshUserData,
    updateBranding,
    updateMonitoring,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook para verificar si el usuario está autenticado
export function useRequireAuth() {
  const { user, loading } = useAuth();
  return { isAuthenticated: !!user, loading };
}
