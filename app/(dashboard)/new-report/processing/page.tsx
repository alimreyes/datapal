'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, Upload, BarChart3, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDocument, updateDocument } from '@/lib/firebase/firestore';

const processingSteps = [
  { id: 1, label: 'Subiendo archivos...', icon: Upload },
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

  useEffect(() => {
    if (!reportId) {
      router.push('/dashboard');
      return;
    }

    // Simular progreso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [reportId, router]);

  useEffect(() => {
    // Cambiar el step basado en el progreso
    if (progress < 25) {
      setCurrentStep(0);
    } else if (progress < 50) {
      setCurrentStep(1);
    } else if (progress < 75) {
      setCurrentStep(2);
    } else if (progress < 100) {
      setCurrentStep(3);
    } else {
      // Cuando termine, actualizar status y redirigir
      setTimeout(async () => {
        if (reportId) {
          await updateDocument('reports', reportId, { status: 'ready' });
          router.push(`/report/${reportId}`);
        }
      }, 1000);
    }
  }, [progress, reportId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-full">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">
              Procesando tu reporte
            </h1>
            <p className="text-gray-600">
              Estamos analizando tus datos. Esto puede tomar unos momentos...
            </p>
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
}