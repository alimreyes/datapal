'use client';

import { Sparkles, Lightbulb, TrendingUp, MessageSquare, Coins, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
}

export default function AIInsightsPanel({
  insights = [],
  allowComments = true,
  onGenerateInsights,
  onRegenerateInsights,
  isGenerating = false,
  tokensRemaining = 0,
  onPurchaseTokens,
}: AIInsightsPanelProps) {

  const getInsightConfig = (type: string) => {
    const configs = {
      positive: {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-900',
        icon: TrendingUp,
        iconColor: 'text-green-600',
      },
      warning: {
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        textColor: 'text-orange-900',
        icon: Lightbulb,
        iconColor: 'text-orange-600',
      },
      info: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-900',
        icon: Sparkles,
        iconColor: 'text-blue-600',
      },
      suggestion: {
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-300',
        textColor: 'text-purple-900',
        icon: Lightbulb,
        iconColor: 'text-purple-600',
      },
    };
    return configs[type as keyof typeof configs] || configs.info;
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Insights con IA</h3>
            <p className="text-sm text-gray-600">Powered by Claude Sonnet 4.5</p>
          </div>
        </div>

        {/* Token Counter (si está habilitado) */}
        {tokensRemaining !== undefined && tokensRemaining > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-300 rounded-lg">
            <Coins className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              {tokensRemaining} {tokensRemaining === 1 ? 'token' : 'tokens'}
            </span>
          </div>
        )}
      </div>

      {/* Si NO hay insights, mostrar botón de generar */}
      {insights.length === 0 && !isGenerating && (
        <div className="text-center py-8">
          <div className="mb-4">
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              ¿Listo para descubrir insights poderosos?
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Claude analizará tus datos y te dará recomendaciones accionables
            </p>
          </div>

          <Button
            onClick={onGenerateInsights}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generar Insights con IA
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="text-center py-8">
          <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-3 animate-spin" />
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            Analizando tus datos...
          </h4>
          <p className="text-sm text-gray-600">
            Claude está generando insights personalizados. Esto tomará unos segundos.
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
                  className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-4`}
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
                      <p className={`text-sm ${config.textColor}`}>{insight.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón Regenerar Insights - Consume 1 token */}
          {onRegenerateInsights && (
            <div className="mb-6">
              <Button
                onClick={async () => {
                  if (tokensRemaining <= 0) {
                    alert('No tienes tokens disponibles. Compra más tokens para regenerar insights.');
                    if (onPurchaseTokens) onPurchaseTokens();
                    return;
                  }
                  if (confirm('Regenerar insights consumirá 1 token. ¿Deseas continuar?')) {
                    await onRegenerateInsights();
                  }
                }}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Regenerar Insights (1 token)
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Tokens restantes: {tokensRemaining}
              </p>
            </div>
          )}

        </>
      )}

    </div>
  );
}