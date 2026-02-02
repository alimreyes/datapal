'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface InsightResult {
  success: boolean;
  insight?: string;
  error?: string;
  requiresAuth?: boolean;
  limitReached?: boolean;
  remaining?: number;
}

export function useAIInsights() {
  const { user, canUseAI, aiUsageRemaining, refreshUserData } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInsight, setLastInsight] = useState<string | null>(null);

  const generateInsight = useCallback(async (reportData: any): Promise<InsightResult> => {
    // Check if user is authenticated
    if (!user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para usar la IA',
        requiresAuth: true,
      };
    }

    // Check if user can use AI (has remaining uses)
    if (!canUseAI) {
      return {
        success: false,
        error: 'Has alcanzado el límite de consultas de IA este mes',
        limitReached: true,
        remaining: 0,
      };
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.uid,
        },
        body: JSON.stringify({ reportData }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          return {
            success: false,
            error: data.error || 'Debes iniciar sesión para usar la IA',
            requiresAuth: true,
          };
        }

        if (response.status === 429) {
          // Refresh user data to update local state
          await refreshUserData();
          return {
            success: false,
            error: data.error || 'Has alcanzado el límite de consultas de IA',
            limitReached: true,
            remaining: data.remaining || 0,
          };
        }

        throw new Error(data.error || 'Error al generar insights');
      }

      // Success - refresh user data to update usage count
      await refreshUserData();

      setLastInsight(data.insight);

      return {
        success: true,
        insight: data.insight,
        remaining: data.remaining,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al generar insights';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsGenerating(false);
    }
  }, [user, canUseAI, refreshUserData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateInsight,
    isGenerating,
    error,
    clearError,
    lastInsight,
    canUseAI,
    aiUsageRemaining,
    isAuthenticated: !!user,
  };
}
