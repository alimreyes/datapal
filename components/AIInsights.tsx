'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { Report } from '@/lib/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface AIInsightsProps {
  report: Report;
  reportId: string;
  onInsightsGenerated?: () => void;
}

export default function AIInsights({ report, reportId, onInsightsGenerated }: AIInsightsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Step 1: Generate insights using Claude API (server-side)
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportData: report,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar insights');
      }

      // Step 2: Save insights to Firestore (client-side with auth)
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        aiInsights: data.insight,
        aiInsightsGeneratedAt: new Date().toISOString(),
      });

      // Step 3: Refresh report data
      if (onInsightsGenerated) {
        onInsightsGenerated();
      }
    } catch (err: any) {
      console.error('Error generating insights:', err);
      setError(err.message || 'Error al generar insights con IA');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-lg">
      <CardHeader className="border-b border-indigo-200 bg-white/50">
        <CardTitle className="flex items-center gap-3 text-indigo-900">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          Insights con IA
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* AI Insights Content */}
        {report.aiInsights ? (
          <div className="space-y-4">
            <div className="p-5 bg-white rounded-xl border-2 border-indigo-200 shadow-sm">
              <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                {typeof report.aiInsights === 'string'
                  ? report.aiInsights
                  : report.aiInsights?.metrics?.[0]?.content || 'Insights generados'}
              </p>
            </div>

            {/* Success indicator */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700 font-medium">
                Análisis generado con éxito
              </span>
            </div>

            {/* Powered by section - Professional branding */}
            <div className="pt-3 border-t border-indigo-200">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span className="text-gray-600">Powered by</span>
                <span className="font-semibold text-indigo-700">Claude Sonnet 4.5</span>
                <span className="text-gray-600">by Anthropic</span>
              </div>
              <p className="text-xs text-center text-gray-500 mt-1">
                Ranked #1 AI for professional analysis by Forbes & The Economist
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Análisis Profesional con IA
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Genera insights accionables analizando tus métricas con inteligencia artificial de última generación.
              </p>
            </div>
            
            <Button
              onClick={handleGenerateInsights}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generando insights...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generar Insights con IA
                </>
              )}
            </Button>

            {/* Powered by section - Pre-generation */}
            <div className="pt-2">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span className="text-gray-600">Powered by</span>
                <span className="font-semibold text-indigo-700">Claude Sonnet 4.5</span>
                <span className="text-gray-600">by Anthropic</span>
              </div>
              <p className="text-xs text-center text-gray-500 mt-1">
                Ranked #1 AI for professional analysis by Forbes & The Economist
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              {error.includes('API key') && (
                <p className="text-xs text-red-700 mt-2">
                  Verifica que ANTHROPIC_API_KEY esté configurada en .env.local
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}