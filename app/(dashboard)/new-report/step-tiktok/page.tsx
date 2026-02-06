'use client';

import { useRouter } from 'next/navigation';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { FileUpload } from '@/components/upload/FileUpload';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CSVCategory } from '@/lib/types';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import { TikTokIcon } from '@/components/icons/PlatformIcons';

const csvCategories: { id: CSVCategory; label: string; description: string }[] = [
  {
    id: 'reach',
    label: 'Alcance',
    description: 'Espectadores únicos de tus videos',
  },
  {
    id: 'impressions',
    label: 'Visualizaciones',
    description: 'Total de reproducciones de videos',
  },
  {
    id: 'interactions',
    label: 'Interacciones',
    description: 'Likes, comentarios, guardados y compartidos',
  },
  {
    id: 'followers',
    label: 'Seguidores',
    description: 'Crecimiento y demografía de seguidores',
  },
  {
    id: 'content',
    label: 'Contenido',
    description: 'Rendimiento individual de cada video',
  },
  {
    id: 'visits',
    label: 'Visitas al perfil',
    description: 'Usuarios que visitaron tu perfil',
  },
];

export default function StepTikTokPage() {
  const router = useRouter();
  const { tiktokFiles, setTikTokFile, isTikTokStepValid, getNextStep, getPreviousStep } = useNewReportStore();

  const handleNext = () => {
    if (isTikTokStepValid()) {
      const nextStep = getNextStep('tiktok');
      router.push(nextStep);
    }
  };

  const handleBack = () => {
    const previousStep = getPreviousStep('tiktok');
    router.push(previousStep);
  };

  const uploadedCount = Object.values(tiktokFiles).filter((file) => file !== null).length;

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#B6B6B6]">Carga de datos</span>
            <span className="text-sm text-[#B6B6B6]">TikTok</span>
          </div>
          <div className="w-full h-2 bg-[#2a2b25] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: '70%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-[#00f2ea] to-[#ff0050]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <TikTokIcon className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-[#FBFEF2]">TikTok</h1>
          </div>
          <p className="text-[#B6B6B6] mb-2">
            Carga tus archivos .CSV de TikTok
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#00f2ea]/20 to-[#ff0050]/20 text-white rounded-full text-sm border border-white/20">
            <span className="font-medium">{uploadedCount} de 6 archivos</span>
          </div>
        </div>

        {/* Info Card */}
        <GlowCard className="mb-6" glowColor="255, 0, 80">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-[#FBFEF2]">
              💡 ¿Dónde obtengo estos archivos?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#B6B6B6] space-y-2">
            <p>1. Ve a <strong className="text-[#FBFEF2]">TikTok Business Center</strong> o <strong className="text-[#FBFEF2]">TikTok Analytics</strong></p>
            <p>2. Selecciona tu cuenta de creador o negocio</p>
            <p>3. Ve a <strong className="text-[#FBFEF2]">Analytics</strong> → <strong className="text-[#FBFEF2]">Exportar datos</strong></p>
            <p>4. Descarga los CSV y súbelos aquí</p>
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
              <GlowCard glowColor="255, 0, 80">
                <CardContent className="p-4">
                  <FileUpload
                    label={category.label}
                    description={category.description}
                    file={tiktokFiles[category.id]}
                    onFileChange={(file) => setTikTokFile(category.id, file)}
                    accept=".csv"
                    maxSize={5}
                  />
                </CardContent>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Helper Text */}
        <div className="bg-[#1a1b16] border border-yellow-500/30 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-400">
            <strong>Importante:</strong> No es necesario subir todos los archivos. Puedes continuar con al menos uno para generar tu reporte.
          </p>
        </div>

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
            disabled={!isTikTokStepValid()}
            className="bg-gradient-to-r from-[#00f2ea] to-[#ff0050] hover:opacity-90 text-white border-0"
          >
            Siguiente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
