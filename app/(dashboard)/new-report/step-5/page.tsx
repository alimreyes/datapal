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
import { uploadReportCSVs } from '@/lib/firebase/storage';

const objectiveLabels = {
  analysis: 'Análisis de Resultados',
  improvements: 'Evidenciar Mejoras Realizadas',
  monthly_report: 'Crear Reporte del Mes',
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
  linkClicks: 'Clics en el enlace',
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

      // Crear documento del reporte en Firestore
      const reportData = {
        userId: user.uid,
        objective: objective,
        platforms: platforms,
        status: 'uploading' as const,
        customization: {
          creative: 3,
          analytical: 3,
          professional: 3,
          colorPalette: null,
          colorPaletteImageUrl: null,
        },
        data: {},
        aiInsights: null,
      };

      const { success, error: createError } = await createDocument('reports', reportId, reportData);

      if (!success) {
        throw new Error(createError || 'Error al crear el reporte');
      }

      // Subir archivos a Firebase Storage
      const uploadPromises: Promise<any>[] = [];

      // Instagram files
      if (platforms.includes('instagram')) {
        Object.entries(instagramFiles).forEach(([category, file]) => {
          if (file) {
            uploadPromises.push(
              uploadReportCSVs(reportId, 'instagram', category, file)
            );
          }
        });
      }

      // Facebook files
      if (platforms.includes('facebook')) {
        Object.entries(facebookFiles).forEach(([category, file]) => {
          if (file) {
            uploadPromises.push(
              uploadReportCSVs(reportId, 'facebook', category, file)
            );
          }
        });
      }

      // Esperar a que todos los archivos se suban
      await Promise.all(uploadPromises);

      // Limpiar el store
      reset();

      // Redirigir a la página de procesamiento
      router.push(`/new-report/processing?reportId=${reportId}`);
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
                {objective && objectiveLabels[objective]}
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