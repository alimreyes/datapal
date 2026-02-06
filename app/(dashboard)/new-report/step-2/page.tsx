'use client';

import { useRouter } from 'next/navigation';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, CheckCircle2, Instagram } from 'lucide-react';
import { Platform } from '@/lib/types';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import { LinkedInIcon, TikTokIcon, GoogleAnalyticsIcon, FacebookIcon } from '@/components/icons/PlatformIcons';

// Plataformas disponibles en producción
// TikTok y Google Analytics están temporalmente ocultos
// Pueden probarse en /prueba-interna
const platforms: {
  id: Platform;
  name: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  glowColor: string;
  badge?: string;
}[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Alcance, interacciones, seguidores y más',
    icon: <Instagram className="w-16 h-16 text-purple-400" />,
    bgColor: 'bg-purple-500/10 border border-purple-500/30',
    glowColor: '168, 85, 247',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Engagement, espectadores y análisis de página',
    icon: <div className="text-blue-400"><FacebookIcon className="w-16 h-16" /></div>,
    bgColor: 'bg-blue-500/10 border border-blue-500/30',
    glowColor: '59, 130, 246',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Publicaciones, impresiones y engagement profesional',
    icon: <div className="text-[#0A66C2]"><LinkedInIcon className="w-16 h-16" /></div>,
    bgColor: 'bg-[#0A66C2]/10 border border-[#0A66C2]/30',
    glowColor: '10, 102, 194',
  },
  // TikTok - temporalmente oculto, probar en /prueba-interna
  // {
  //   id: 'tiktok',
  //   name: 'TikTok',
  //   description: 'Videos, vistas, likes y engagement',
  //   icon: <TikTokIcon className="w-16 h-16" />,
  //   bgColor: 'bg-gradient-to-br from-[#00f2ea]/10 to-[#ff0050]/10 border border-white/20',
  //   glowColor: '255, 0, 80',
  // },
  // Google Analytics - temporalmente oculto hasta aprobación de Google
  // {
  //   id: 'google_analytics',
  //   name: 'Google Analytics',
  //   description: 'Usuarios, sesiones, páginas vistas y comportamiento',
  //   icon: <GoogleAnalyticsIcon className="w-16 h-16" />,
  //   bgColor: 'bg-[#E37400]/10 border border-[#E37400]/30',
  //   glowColor: '227, 116, 0',
  //   badge: 'API',
  // },
];

export default function Step2Page() {
  const router = useRouter();
  const { platforms: selectedPlatforms, setPlatforms, getNextStep } = useNewReportStore();

  const handleToggle = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleNext = () => {
    if (selectedPlatforms.length > 0) {
      // Use the store's navigation helper to determine next step
      const nextStep = getNextStep(null);
      router.push(nextStep);
    }
  };

  const handleBack = () => {
    router.push('/new-report/step-1');
  };

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#B6B6B6]">Paso 2 de {2 + selectedPlatforms.length + 1}</span>
            <span className="text-sm text-[#B6B6B6]">Selección de plataformas</span>
          </div>
          <div className="w-full h-2 bg-[#2a2b25] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '20%' }}
              animate={{ width: '25%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-[#019B77]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#FBFEF2]">
            ¿Cuáles plataformas usas?
          </h1>
          <p className="text-[#B6B6B6]">
            Selecciona las redes sociales y fuentes de datos que quieres analizar
          </p>
          <p className="text-sm text-[#B6B6B6] mt-2">
            Puedes seleccionar múltiples plataformas
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {platforms.map((platform, index) => {
            const isSelected = selectedPlatforms.includes(platform.id);

            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlowCard
                  onClick={() => handleToggle(platform.id)}
                  glowColor={platform.glowColor}
                  className={`transition-all duration-200 h-full ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-offset-[#11120D] ring-[#019B77]'
                      : ''
                  }`}
                >
                  <div className="p-6">
                    <div className={`${platform.bgColor} rounded-2xl p-6 mb-4 relative`}>
                      {platform.badge && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold bg-[#019B77] text-white rounded-full">
                          {platform.badge}
                        </span>
                      )}
                      <div className="text-center">
                        <div className="flex justify-center mb-4">{platform.icon}</div>
                        <h3 className="text-xl font-bold mb-2 text-[#FBFEF2]">{platform.name}</h3>
                        <p className="text-sm text-[#B6B6B6]">{platform.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(platform.id)}
                        className="border-[#B6B6B6] data-[state=checked]:bg-[#019B77] data-[state=checked]:border-[#019B77]"
                      />
                      <span className="text-sm font-medium text-[#FBFEF2]">
                        {isSelected ? 'Seleccionado' : 'Seleccionar'}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-[#019B77]" />
                      )}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>

        {/* Info Notice */}
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-lg p-4 mb-8">
          <p className="text-sm text-[#B6B6B6] text-center">
            <strong className="text-[#019B77]">Tip:</strong> Para Instagram y Facebook necesitarás exportar tus datos en formato CSV desde Meta Business Suite. Para LinkedIn, exporta el archivo XLS desde la plataforma.
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
            disabled={selectedPlatforms.length === 0}
            className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] border-0"
          >
            Siguiente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
