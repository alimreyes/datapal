'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, Upload, BarChart3, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDocument, updateDocument } from '@/lib/firebase/firestore';
import { storage } from '@/lib/firebase/config';
import { ref, getBlob } from 'firebase/storage';
import { parseMetaCSV, calculateStats } from '@/lib/parsers/metaParser';

const processingSteps = [
  { id: 1, label: 'Descargando archivos...', icon: Upload },
  { id: 2, label: 'Validando datos...', icon: CheckCircle2 },
  { id: 3, label: 'Procesando información...', icon: BarChart3 },
  { id: 4, label: 'Generando visualizaciones...', icon: Sparkles },
];

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      router.push('/dashboard');
      return;
    }

    processReport();
  }, [reportId, router]);

  const processReport = async () => {
    if (!reportId) return;

    try {
      setCurrentStep(0);
      setProgress(10);

      // 1. Obtener el documento del reporte
      const { data: reportData, error: fetchError } = await getDocument('reports', reportId);
      
      if (fetchError || !reportData) {
        throw new Error('No se pudo obtener el reporte');
      }

      // Cast to proper type
      const report = reportData as any;

      setProgress(20);
      setCurrentStep(1);

      // 2. Descargar y procesar archivos
      const processedData: any = {};

      // Procesar Instagram
      if (report.platforms?.includes('instagram')) {
        processedData.instagram = {};
        
        // Solo procesar "reach" por ahora (puedes extender a otras categorías)
        try {
          const reachPath = `reports/${reportId}/instagram/reach.csv`;
          const fileRef = ref(storage, reachPath);
          
          // Descargar como blob usando Firebase SDK (evita CORS)
          const blob = await getBlob(fileRef);
          const csvText = await blob.text();
          const parsedReach = parseMetaCSV(csvText);
          
          processedData.instagram.reach = parsedReach;
          processedData.instagram.reachStats = calculateStats(parsedReach);
        } catch (err) {
          console.log('No reach data for Instagram:', err);
        }
      }

      setProgress(50);
      setCurrentStep(2);

      // Procesar Facebook (similar)
      if (report.platforms?.includes('facebook')) {
        processedData.facebook = {};
        
        try {
          const reachPath = `reports/${reportId}/facebook/reach.csv`;
          const fileRef = ref(storage, reachPath);
          
          // Descargar como blob usando Firebase SDK (evita CORS)
          const blob = await getBlob(fileRef);
          const csvText = await blob.text();
          const parsedReach = parseMetaCSV(csvText);
          
          processedData.facebook.reach = parsedReach;
          processedData.facebook.reachStats = calculateStats(parsedReach);
        } catch (err) {
          console.log('No reach data for Facebook:', err);
        }
      }

      setProgress(75);
      setCurrentStep(3);

      // 3. Guardar data procesada en Firestore
      await updateDocument('reports', reportId, {
        data: processedData,
        status: 'ready',
      });

      setProgress(100);

      // 4. Redirigir al reporte
      setTimeout(() => {
        router.push(`/report/${reportId}`);
      }, 1500);

    } catch (err: any) {
      console.error('Error processing report:', err);
      setError(err.message || 'Error al procesar el reporte');
      
      // Actualizar status a error
      if (reportId) {
        await updateDocument('reports', reportId, { status: 'error' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: error ? 0 : 360 }}
              transition={{ duration: 2, repeat: error ? 0 : Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <div className={`p-4 rounded-full ${error ? 'bg-red-100' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}>
                {error ? (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                ) : (
                  <BarChart3 className="h-8 w-8 text-white" />
                )}
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">
              {error ? 'Error al procesar' : 'Procesando tu reporte'}
            </h1>
            <p className="text-gray-600">
              {error ? 'Hubo un problema al procesar tus datos' : 'Estamos analizando tus datos. Esto puede tomar unos momentos...'}
            </p>
          </div>

          {error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-gray-600 mt-2">
                  {progress}% completado
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {processingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 border-2 border-blue-200'
                            : isCompleted
                            ? 'bg-green-50 border-2 border-green-200'
                            : 'bg-gray-50 border-2 border-gray-200'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive
                              ? 'bg-blue-100'
                              : isCompleted
                              ? 'bg-green-100'
                              : 'bg-gray-100'
                          }`}
                        >
                          {isActive ? (
                            <Loader2
                              className={`h-5 w-5 animate-spin ${
                                isActive ? 'text-blue-600' : 'text-gray-400'
                              }`}
                            />
                          ) : (
                            <Icon
                              className={`h-5 w-5 ${
                                isCompleted ? 'text-green-600' : 'text-gray-400'
                              }`}
                            />
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            isActive
                              ? 'text-blue-900'
                              : isCompleted
                              ? 'text-green-900'
                              : 'text-gray-500'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer Message */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Por favor no cierres esta ventana. Serás redirigido automáticamente cuando esté listo.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}