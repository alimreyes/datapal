'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { FileUpload } from '@/components/upload/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { CSVCategory } from '@/lib/types';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import { extractDateRangeFromCSV, validateDateRangeConsistency } from '@/lib/validators/csvCategoryValidator';

const csvCategories: { id: CSVCategory; label: string; description: string }[] = [
  {
    id: 'reach',
    label: 'Alcance',
    description: 'Número de cuentas únicas que vieron tu contenido',
  },
  {
    id: 'impressions',
    label: 'Visualizaciones',
    description: 'Total de veces que se mostró tu contenido',
  },
  {
    id: 'interactions',
    label: 'Interacciones',
    description: 'Me gusta, comentarios, guardados y compartidos',
  },
  {
    id: 'followers',
    label: 'Seguidores',
    description: 'Crecimiento y demografía de tus seguidores',
  },
  {
    id: 'content',
    label: 'Contenido',
    description: 'Rendimiento individual de cada publicación',
  },
  {
    id: 'visits',
    label: 'Visitas',
    description: 'Visitas al perfil y engagement',
  },
];

export default function Step3Page() {
  const router = useRouter();
  const { instagramFiles, setInstagramFile, platforms, isStep3Valid, getNextStep, getPreviousStep } = useNewReportStore();
  const [dateRangeWarning, setDateRangeWarning] = useState<string | null>(null);

  const handleNext = async () => {
    if (!isStep3Valid()) return;

    // Validar consistencia de fechas entre archivos subidos
    const uploadedEntries = Object.entries(instagramFiles).filter(([, f]) => f !== null) as [CSVCategory, File][];
    if (uploadedEntries.length >= 2) {
      const dateRanges = await Promise.all(
        uploadedEntries.map(([cat, file]) => extractDateRangeFromCSV(file, cat))
      );
      const warning = validateDateRangeConsistency(dateRanges);
      setDateRangeWarning(warning);
      if (warning) return; // Mostrar warning, el usuario debe confirmar antes de continuar
    } else {
      setDateRangeWarning(null);
    }

    const nextStep = getNextStep('instagram');
    router.push(nextStep);
  };

  const handleBack = () => {
    const previousStep = getPreviousStep('instagram');
    router.push(previousStep);
  };

  const uploadedCount = Object.values(instagramFiles).filter((file) => file !== null).length;

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#B6B6B6]">Paso 3 de 5</span>
            <span className="text-sm text-[#B6B6B6]">Carga de datos - Instagram</span>
          </div>
          <div className="w-full h-2 bg-[#2a2b25] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '40%' }}
              animate={{ width: '60%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-[#019B77]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="text-4xl">📸</div>
            <h1 className="text-3xl font-bold text-[#FBFEF2]">Instagram</h1>
          </div>
          <p className="text-[#B6B6B6] mb-2">
            Carga tus archivos .CSV de Instagram
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#019B77]/20 text-[#019B77] rounded-full text-sm border border-[#019B77]/30">
            <span className="font-medium">{uploadedCount} de 7 archivos</span>
          </div>
        </div>

        {/* Info Card */}
        <GlowCard className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-[#FBFEF2]">
              💡 ¿Dónde obtengo estos archivos?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#B6B6B6] space-y-2">
            <p>1. Ve a <strong className="text-[#FBFEF2]">Meta Business Suite</strong></p>
            <p>2. Selecciona tu cuenta de Instagram</p>
            <p>3. Ve a <strong className="text-[#FBFEF2]">Estadísticas</strong> → Exportar datos</p>
            <p>4. Descarga los CSV por categoría y súbelos aquí</p>
          </CardContent>
        </GlowCard>

        {/* Upload Areas */}
        <div className="space-y-4 mb-8">
          {csvCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlowCard>
                <CardContent className="p-4">
                  <FileUpload
                    label={category.label}
                    description={category.description}
                    file={instagramFiles[category.id]}
                    onFileChange={(file) => {
                      setInstagramFile(category.id, file);
                      // Limpiar warning de fechas al cambiar archivos
                      if (!file) setDateRangeWarning(null);
                    }}
                    accept=".csv"
                    maxSize={5}
                    csvCategory={category.id}
                  />
                </CardContent>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Helper Text */}
        <div className="bg-[#1a1b16] border border-yellow-500/30 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-400">
            <strong>Importante:</strong> No es necesario subir todos los archivos. Puedes continuar con al menos uno para generar tu reporte.
          </p>
        </div>

        {/* Advertencia de rango de fechas inconsistente */}
        {dateRangeWarning && (
          <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-400 mb-1">Los archivos tienen rangos de fechas distintos</p>
                <p className="text-xs text-[#B6B6B6] whitespace-pre-line">{dateRangeWarning}</p>
                <p className="text-xs text-[#B6B6B6] mt-2">Puedes continuar igual, pero el reporte podría tener datos incompletos.</p>
                <button
                  onClick={() => {
                    setDateRangeWarning(null);
                    const nextStep = getNextStep('instagram');
                    router.push(nextStep);
                  }}
                  className="mt-3 text-xs px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                >
                  Continuar de todas formas →
                </button>
              </div>
            </div>
          </div>
        )}

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
            disabled={!isStep3Valid()}
            className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] border-0"
          >
            {platforms.includes('facebook') ? 'Siguiente' : 'Avanzar'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}