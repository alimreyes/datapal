'use client';

import { Sparkles, Lightbulb, TrendingUp, Loader2, Lock, Zap } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';

interface Insight {
  id: string;
  title: string;
  content: string;
  type: 'positive' | 'warning' | 'info' | 'suggestion';
}

interface AIInsightsPanelProps {
  insights?: Insight[];
  allowComments?: boolean;
  onGenerateInsights?: () => Promise<void>;
  onRegenerateInsights?: () => Promise<void>;
  isGenerating?: boolean;
  tokensRemaining?: number;
  onPurchaseTokens?: () => void;
  requiresAuth?: boolean;
  limitReached?: boolean;
}

export default function AIInsightsPanel({
  insights = [],
  allowComments = true,
  onGenerateInsights,
  onRegenerateInsights,
  isGenerating = false,
  tokensRemaining = 0,
  onPurchaseTokens,
  requiresAuth = false,
  limitReached = false,
}: AIInsightsPanelProps) {
  const { user, canUseAI, aiUsageRemaining } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Use context values if not explicitly passed
  const effectiveTokensRemaining = tokensRemaining || aiUsageRemaining;
  const effectiveRequiresAuth = requiresAuth || !user;
  const effectiveLimitReached = limitReached || !canUseAI;

  const getInsightConfig = (type: string) => {
    const configs = {
      positive: {
        bgColor: 'bg-[#019B77]/10',
        borderColor: 'border-[#019B77]/30',
        textColor: 'text-[#FBFEF2]',
        icon: TrendingUp,
        iconColor: 'text-[#019B77]',
      },
      warning: {
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-[#FBFEF2]',
        icon: Lightbulb,
        iconColor: 'text-yellow-500',
      },
      info: {
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-[#FBFEF2]',
        icon: Sparkles,
        iconColor: 'text-blue-400',
      },
      suggestion: {
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        textColor: 'text-[#FBFEF2]',
        icon: Lightbulb,
        iconColor: 'text-purple-400',
      },
    };
    return configs[type as keyof typeof configs] || configs.info;
  };

  const handleGenerateClick = async () => {
    // Check authentication first
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Check limits
    if (!canUseAI) {
      // Show upgrade modal or message
      if (onPurchaseTokens) {
        onPurchaseTokens();
      }
      return;
    }

    // Call the generate function
    if (onGenerateInsights) {
      await onGenerateInsights();
    }
  };

  const handleRegenerateClick = async () => {
    // Check authentication first
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Check limits
    if (!canUseAI) {
      if (onPurchaseTokens) {
        onPurchaseTokens();
      }
      return;
    }

    // Confirm before regenerating
    if (confirm('Regenerar insights consumirá 1 consulta. ¿Deseas continuar?')) {
      if (onRegenerateInsights) {
        await onRegenerateInsights();
      }
    }
  };

  return (
    <>
      <div className="relative rounded-2xl border-2 border-[#019B77] bg-[#1a1b16] overflow-hidden transition-all duration-300 hover:border-[#02c494] hover:shadow-[0_0_30px_rgba(1,155,119,0.3)]">
        {/* Efecto de brillo en el borde */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#019B77]/10 via-transparent to-[#019B77]/10 pointer-events-none" />

        <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#019B77] to-[#019B77]/60 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-[#11120D]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FBFEF2]">Insights de IA</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-[#B6B6B6]">Powered by</span>
                <Image
                  src="/Claude - Logo.png"
                  alt="Claude"
                  width={70}
                  height={20}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Usage Counter */}
          {user && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              effectiveTokensRemaining > 3
                ? 'bg-[#019B77]/10 border-[#019B77]/30'
                : effectiveTokensRemaining > 0
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <Sparkles className={`w-4 h-4 ${
                effectiveTokensRemaining > 3 ? 'text-[#019B77]' : effectiveTokensRemaining > 0 ? 'text-yellow-500' : 'text-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                effectiveTokensRemaining > 3 ? 'text-[#019B77]' : effectiveTokensRemaining > 0 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {effectiveTokensRemaining === Infinity ? '∞' : effectiveTokensRemaining} {effectiveTokensRemaining === 1 ? 'consulta' : 'consultas'}
              </span>
            </div>
          )}
        </div>

        {/* Si NO hay insights, mostrar botón de generar */}
        {insights.length === 0 && !isGenerating && (
          <div className="text-center py-8">
            <div className="mb-4">
              <Sparkles className="w-12 h-12 text-[#019B77] mx-auto mb-3" />
              <h4 className="text-lg font-bold text-[#FBFEF2] mb-2">
                ¿Listo para descubrir insights poderosos?
              </h4>
              <p className="text-sm text-[#B6B6B6] mb-4">
                La IA analizará tus datos y te dará recomendaciones accionables
              </p>
            </div>

            {/* Show different states based on auth/limits */}
            {!user ? (
              <Button
                onClick={() => setShowLoginModal(true)}
                className="bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] px-6 py-3 rounded-lg font-medium transition-all"
              >
                <Lock className="w-5 h-5 mr-2" />
                Inicia sesión para usar IA
              </Button>
            ) : !canUseAI ? (
              <div className="space-y-3">
                <Button
                  onClick={onPurchaseTokens}
                  className="bg-gradient-to-r from-[#019B77] to-[#019B77]/70 text-[#11120D] px-6 py-3 rounded-lg font-medium transition-all"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Obtener más consultas
                </Button>
                <p className="text-sm text-red-400">
                  Has alcanzado el límite de consultas gratuitas este mes
                </p>
              </div>
            ) : (
              <Button
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] px-6 py-3 rounded-lg font-medium transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generar Insights con IA
              </Button>
            )}
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-[#019B77] mx-auto mb-3 animate-spin" />
            <h4 className="text-lg font-bold text-[#FBFEF2] mb-2">
              Analizando tus datos...
            </h4>
            <p className="text-sm text-[#B6B6B6]">
              La IA está generando insights personalizados. Esto tomará unos segundos.
            </p>
          </div>
        )}

        {/* Insights List */}
        {insights.length > 0 && !isGenerating && (
          <>
            <div className="space-y-4 mb-6">
              {insights.map((insight) => {
                const config = getInsightConfig(insight.type);
                const Icon = config.icon;

                return (
                  <div
                    key={insight.id}
                    className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <Icon className={`w-5 h-5 ${config.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        {insight.title && (
                          <h4 className={`font-bold ${config.textColor} mb-1`}>
                            {insight.title}
                          </h4>
                        )}
                        <p className={`text-sm ${config.textColor} opacity-90`}>{insight.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botón Regenerar Insights */}
            {onRegenerateInsights && user && (
              <div className="mb-6">
                {canUseAI ? (
                  <Button
                    onClick={handleRegenerateClick}
                    disabled={isGenerating}
                    className="w-full bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Regenerar Insights (1 consulta)
                  </Button>
                ) : (
                  <Button
                    onClick={onPurchaseTokens}
                    className="w-full bg-gradient-to-r from-[#019B77] to-[#019B77]/70 text-[#11120D] py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Obtener más consultas para regenerar
                  </Button>
                )}
                <p className="text-xs text-[#B6B6B6] text-center mt-2">
                  Consultas restantes: {effectiveTokensRemaining === Infinity ? 'Ilimitadas' : effectiveTokensRemaining}
                </p>
              </div>
            )}
          </>
        )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        reason={effectiveLimitReached ? 'ai_limit' : 'feature'}
      />
    </>
  );
}
