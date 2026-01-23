'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createDocument } from '@/lib/firebase/firestore';
import { parseMetaCSV, calculateStats, parseMetaContent, hasValidData } from '@/lib/parsers/metaParser';

const objectiveLabels: Record<string, string> = {
  analysis: 'Análisis',
  improvements: 'Mejoras',
  monthly_report: 'Reporte Mensual',
  'brand-awareness': 'Conocimiento de Marca',
  engagement: 'Engagement',
  conversions: 'Conversiones',
  reach: 'Alcance',
  'content-performance': 'Rendimiento de Contenido',
};

const platformLabels = {
  instagram: 'Instagram 📸',
  facebook: 'Facebook 👍',
};

const categoryLabels = {
  reach: 'Alcance',
  impressions: 'Visualizaciones',
  interactions: 'Interacciones',
  followers: 'Seguidores',
  content: 'Contenido',
  visits: 'Visitas',
};

export default function Step5Page() {
  const router = useRouter();
  const { user } = useAuth();
  const { objective, platforms, instagramFiles, facebookFiles, reset } = useNewReportStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const instagramFileCount = Object.values(instagramFiles).filter(f => f !== null).length;
  const facebookFileCount = Object.values(facebookFiles).filter(f => f !== null).length;
  const totalFiles = instagramFileCount + facebookFileCount;

  const handleBack = () => {
    // Volver al último step con archivos
    if (platforms.includes('facebook')) {
      router.push('/new-report/step-4');
    } else if (platforms.includes('instagram')) {
      router.push('/new-report/step-3');
    } else {
      router.push('/new-report/step-2');
    }
  };

  const handleGoBack = () => {
    handleBack();
  };

  const handleConfirm = async () => {
    if (!user) {
      setError('No estás autenticado');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Generar ID único para el reporte
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Procesar archivos directamente (sin Storage)
      const processedData: any = {};

      // Helper function to process temporal metrics
      const processTemporalFile = async (file: File | null) => {
        if (!file) return null;
        
        try {
          const text = await file.text();
          
          // Check if file has data
          if (!hasValidData(text)) {
            return null;
          }
          
          // Parse temporal metrics
          const parsedData = parseMetaCSV(text);
          if (parsedData.length > 0) {
            return {
              data: parsedData,
              stats: calculateStats(parsedData)
            };
          }
          return null;
        } catch (err) {
          console.error('Error processing temporal file:', file.name, err);
          return null;
        }
      };

      // Helper function to process content files
      const processContentFile = async (file: File | null) => {
        if (!file) return null;
        
        try {
          const text = await file.text();
          
          // Parse content/posts
          const parsedContent = parseMetaContent(text);
          return parsedContent.length > 0 ? parsedContent : null;
        } catch (err) {
          console.error('Error processing content file:', file.name, err);
          return null;
        }
      };

      // Procesar Instagram
      if (platforms.includes('instagram')) {
        processedData.instagram = {};
        
        // Temporal metrics
        const reach = await processTemporalFile(instagramFiles.reach);
        if (reach) {
          processedData.instagram.reach = reach.data;
          processedData.instagram.reachStats = reach.stats;
        }
        
        const impressions = await processTemporalFile(instagramFiles.impressions);
        if (impressions) {
          processedData.instagram.impressions = impressions.data;
          processedData.instagram.impressionsStats = impressions.stats;
        }
        
        const interactions = await processTemporalFile(instagramFiles.interactions);
        if (interactions) {
          processedData.instagram.interactions = interactions.data;
          processedData.instagram.interactionsStats = interactions.stats;
        }
        
        const followers = await processTemporalFile(instagramFiles.followers);
        if (followers) {
          processedData.instagram.followers = followers.data;
          processedData.instagram.followersStats = followers.stats;
        }

        const visits = await processTemporalFile(instagramFiles.visits);
        if (visits) {
          processedData.instagram.visits = visits.data;
          processedData.instagram.visitsStats = visits.stats;
        }
        
        // Content (posts)
        const content = await processContentFile(instagramFiles.content);
        if (content) {
          processedData.instagram.content = content;
        }
      }

      // Procesar Facebook
      if (platforms.includes('facebook')) {
        processedData.facebook = {};
        
        // Temporal metrics
        const reach = await processTemporalFile(facebookFiles.reach);
        if (reach) {
          processedData.facebook.reach = reach.data;
          processedData.facebook.reachStats = reach.stats;
        }
        
        const impressions = await processTemporalFile(facebookFiles.impressions);
        if (impressions) {
          processedData.facebook.impressions = impressions.data;
          processedData.facebook.impressionsStats = impressions.stats;
        }
        
        const interactions = await processTemporalFile(facebookFiles.interactions);
        if (interactions) {
          processedData.facebook.interactions = interactions.data;
          processedData.facebook.interactionsStats = interactions.stats;
        }
        
        const followers = await processTemporalFile(facebookFiles.followers);
        if (followers) {
          processedData.facebook.followers = followers.data;
          processedData.facebook.followersStats = followers.stats;
        }

        const visits = await processTemporalFile(facebookFiles.visits);
        if (visits) {
          processedData.facebook.visits = visits.data;
          processedData.facebook.visitsStats = visits.stats;
        }
        
        // Content (posts)
        const content = await processContentFile(facebookFiles.content);
        if (content) {
          processedData.facebook.content = content;
        }
      }

      // Generar título automático basado en fecha
      const now = new Date();
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const title = `Reporte ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

      // Crear documento del reporte en Firestore con data ya procesada
      const reportData = {
        userId: user.uid,
        title: title,
        objective: objective,
        platforms: platforms,
        status: 'ready' as const,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        customization: {
          creative: 3,
          analytical: 3,
          professional: 3,
          colorPalette: null,
          colorPaletteImageUrl: null,
        },
        data: processedData,
        aiInsights: null,
      };

      const { success, error: createError } = await createDocument('reports', reportId, reportData);

      if (!success) {
        throw new Error(createError || 'Error al crear el reporte');
      }

      // Limpiar el store
      reset();

      // Redirigir directamente al reporte (sin processing page)
      router.push(`/report/${reportId}`);
    } catch (err: any) {
      console.error('Error al confirmar:', err);
      setError(err.message || 'Error al procesar. Por favor intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Paso 5 de 5</span>
            <span className="text-sm text-gray-500">Confirmación</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '80%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            ¡Casi listo!
          </h1>
          <p className="text-gray-600">
            Revisa tu información antes de continuar
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resumen de tu reporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Objective */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Objetivo:</p>
              <Badge variant="secondary" className="text-sm">
                {objective && (objectiveLabels[objective] || objective)}
              </Badge>
            </div>

            {/* Platforms */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Plataformas:</p>
              <div className="flex gap-2">
                {platforms.map((platform) => (
                  <Badge key={platform} variant="secondary" className="text-sm">
                    {platformLabels[platform]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Files */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Archivos cargados:</p>
              <div className="space-y-3">
                {/* Instagram */}
                {platforms.includes('instagram') && (
                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-sm font-medium mb-2">📸 Instagram ({instagramFileCount} archivos)</p>
                    <div className="space-y-1">
                      {Object.entries(instagramFiles).map(([category, file]) => {
                        if (!file) return null;
                        return (
                          <div key={category} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span>{categoryLabels[category as keyof typeof categoryLabels]}</span>
                            <span className="text-gray-500">• {file.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Facebook */}
                {platforms.includes('facebook') && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm font-medium mb-2">👍 Facebook ({facebookFileCount} archivos)</p>
                    <div className="space-y-1">
                      {Object.entries(facebookFiles).map(([category, file]) => {
                        if (!file) return null;
                        return (
                          <div key={category} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span>{categoryLabels[category as keyof typeof categoryLabels]}</span>
                            <span className="text-gray-500">• {file.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900 font-medium">
            ¿Estás segura/o que subiste toda la información?
          </AlertDescription>
        </Alert>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleGoBack}
            size="lg"
            disabled={isProcessing}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            No, aún me falta
          </Button>

          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : (
              'Sí, avancemos'
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Total: {totalFiles} archivo{totalFiles !== 1 ? 's' : ''} • Los archivos se procesarán de forma segura
          </p>
        </div>
      </div>
    </div>
  );
}