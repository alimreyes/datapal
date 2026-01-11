'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Report } from '@/lib/types';
import { updateDocument } from '@/lib/firebase/firestore';

interface AIInsightsProps {
  report: Report;
  reportId: string;
  onInsightsGenerated?: () => void;
}

export function AIInsights({ report, reportId, onInsightsGenerated }: AIInsightsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string | null>(report.aiInsights || null);

  const generateInsights = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportData: report.data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar insights');
      }

      const data = await response.json();
      
      // Save insights to Firestore
      await updateDocument('reports', reportId, {
        aiInsights: data.insights,
      });

      setInsights(data.insights);
      
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

  // Parse insights into sections
  const parseInsights = (text: string) => {
    const sections = text.split(/\d+\.\s+/).filter(Boolean);
    return sections;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Insights con IA
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Análisis automático generado por Gemini
          </p>
        </div>
        <Button
          onClick={generateInsights}
          disabled={isGenerating}
          variant={insights ? "outline" : "default"}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : insights ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerar
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generar Insights
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {insights ? (
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Análisis IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {insights}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Genera insights con IA
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Obtén un análisis profesional de tus datos con recomendaciones 
              personalizadas generadas por inteligencia artificial
            </p>
            <Button onClick={generateInsights} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar Insights
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}