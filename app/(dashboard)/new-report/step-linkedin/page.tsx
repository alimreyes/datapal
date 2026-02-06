'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { FileUpload } from '@/components/upload/FileUpload';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import { LinkedInIcon } from '@/components/icons/PlatformIcons';
import { validateLinkedInXLS } from '@/lib/parsers/linkedinXLSParser';

export default function StepLinkedInPage() {
  const router = useRouter();
  const { linkedinXLSFile, setLinkedInXLSFile, isLinkedInStepValid, getNextStep, getPreviousStep } = useNewReportStore();
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean | null;
    message: string;
  }>({ isValid: null, message: '' });
  const [isValidating, setIsValidating] = useState(false);

  const handleFileChange = useCallback(async (file: File | null) => {
    if (!file) {
      setLinkedInXLSFile(null);
      setValidationStatus({ isValid: null, message: '' });
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateLinkedInXLS(file);
      setValidationStatus({ isValid: result.valid, message: result.message });

      if (result.valid) {
        setLinkedInXLSFile(file);
      } else {
        setLinkedInXLSFile(null);
      }
    } catch (error) {
      setValidationStatus({
        isValid: false,
        message: 'Error al validar el archivo. Por favor intenta de nuevo.'
      });
      setLinkedInXLSFile(null);
    } finally {
      setIsValidating(false);
    }
  }, [setLinkedInXLSFile]);

  const handleNext = () => {
    if (isLinkedInStepValid()) {
      const nextStep = getNextStep('linkedin');
      router.push(nextStep);
    }
  };

  const handleBack = () => {
    const previousStep = getPreviousStep('linkedin');
    router.push(previousStep);
  };

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#B6B6B6]">Carga de datos</span>
            <span className="text-sm text-[#B6B6B6]">LinkedIn</span>
          </div>
          <div className="w-full h-2 bg-[#2a2b25] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: '65%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-[#0A66C2]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-[#0A66C2]">
              <LinkedInIcon className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-[#FBFEF2]">LinkedIn</h1>
          </div>
          <p className="text-[#B6B6B6] mb-2">
            Carga tu archivo de exportación de LinkedIn
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A66C2]/20 text-[#0A66C2] rounded-full text-sm border border-[#0A66C2]/30">
            <FileSpreadsheet className="w-4 h-4" />
            <span className="font-medium">Archivo XLS</span>
          </div>
        </div>

        {/* Info Card */}
        <GlowCard className="mb-6" glowColor="10, 102, 194">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-[#FBFEF2]">
              <span>📊</span> ¿Cómo obtener el archivo de LinkedIn?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#B6B6B6] space-y-2">
            <p>1. Ve a <strong className="text-[#FBFEF2]">LinkedIn</strong> → Tu página de empresa</p>
            <p>2. Selecciona <strong className="text-[#FBFEF2]">Analíticas</strong> en el menú superior</p>
            <p>3. Haz clic en <strong className="text-[#FBFEF2]">Exportar</strong> (icono de descarga)</p>
            <p>4. Descarga el archivo <strong className="text-[#FBFEF2]">.xls</strong> y súbelo aquí</p>
          </CardContent>
        </GlowCard>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlowCard glowColor="10, 102, 194">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-[#0A66C2]" />
                <h3 className="text-lg font-semibold text-[#FBFEF2] mb-1">
                  Archivo de Exportación de LinkedIn
                </h3>
                <p className="text-sm text-[#B6B6B6]">
                  El archivo contiene las hojas "Indicadores" y "Todas las publicaciones"
                </p>
              </div>

              <FileUpload
                label="Exportación de LinkedIn"
                description="Arrastra o selecciona tu archivo .xls o .xlsx"
                file={linkedinXLSFile}
                onFileChange={handleFileChange}
                accept=".xls,.xlsx"
                maxSize={10}
              />

              {/* Validation Status */}
              {isValidating && (
                <div className="mt-4 flex items-center justify-center gap-2 text-[#B6B6B6]">
                  <div className="animate-spin h-4 w-4 border-2 border-[#0A66C2] border-t-transparent rounded-full" />
                  <span className="text-sm">Validando archivo...</span>
                </div>
              )}

              {validationStatus.isValid === true && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Archivo válido</span>
                </div>
              )}

              {validationStatus.isValid === false && (
                <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{validationStatus.message}</span>
                </div>
              )}
            </CardContent>
          </GlowCard>
        </motion.div>

        {/* What's included */}
        <GlowCard className="mb-8" glowColor="10, 102, 194">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
              <span>📈</span> Métricas que analizaremos
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Impresiones totales',
                'Alcance único',
                'Reacciones',
                'Comentarios',
                'Compartidos',
                'Tasa de interacción',
              ].map((metric) => (
                <div
                  key={metric}
                  className="flex items-center gap-2 text-sm text-[#B6B6B6] bg-[#1a1b16] px-3 py-2 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0A66C2]" />
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </GlowCard>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            size="lg"
            className="border-[rgba(251,254,242,0.1)] text-[#FBFEF2] hover:bg-[#2a2b25] hover:text-[#FBFEF2]"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Atrás
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!isLinkedInStepValid() || isValidating}
            className="bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white border-0"
          >
            Siguiente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
