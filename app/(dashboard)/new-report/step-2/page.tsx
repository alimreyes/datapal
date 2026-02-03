'use client';

import { useRouter } from 'next/navigation';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, CheckCircle2, Instagram } from 'lucide-react';
import { Platform } from '@/lib/types';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';

// Logo de Facebook SVG
const FacebookLogo = () => (
  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const platforms = [
  {
    id: 'instagram' as Platform,
    name: 'Instagram',
    description: 'Alcance, interacciones, seguidores y más',
    icon: <Instagram className="w-16 h-16 text-purple-400" />,
    bgColor: 'bg-purple-500/10 border border-purple-500/30',
    glowColor: '168, 85, 247', // purple-500
  },
  {
    id: 'facebook' as Platform,
    name: 'Facebook',
    description: 'Engagement, espectadores y análisis de página',
    icon: <div className="text-blue-400"><FacebookLogo /></div>,
    bgColor: 'bg-blue-500/10 border border-blue-500/30',
    glowColor: '59, 130, 246', // blue-500
  },
];

export default function Step2Page() {
  const router = useRouter();
  const { platforms: selectedPlatforms, setPlatforms } = useNewReportStore();

  const handleToggle = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleNext = () => {
    if (selectedPlatforms.length > 0) {
      // Si Instagram está seleccionado, ir a step-3, sino ir a step-4
      if (selectedPlatforms.includes('instagram')) {
        router.push('/new-report/step-3');
      } else {
        router.push('/new-report/step-4');
      }
    }
  };

  const handleBack = () => {
    router.push('/new-report/step-1');
  };

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#B6B6B6]">Paso 2 de 5</span>
            <span className="text-sm text-[#B6B6B6]">Selección de plataformas</span>
          </div>
          <div className="w-full h-2 bg-[#2a2b25] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '20%' }}
              animate={{ width: '40%' }}
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
            Selecciona las redes sociales que quieres analizar
          </p>
          <p className="text-sm text-[#B6B6B6] mt-2">
            Puedes seleccionar múltiples plataformas
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                  className={`transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-offset-[#11120D] ring-[#019B77]'
                      : ''
                  }`}
                >
                  <div className="p-6">
                    <div className={`${platform.bgColor} rounded-2xl p-8 mb-4`}>
                      <div className="text-center">
                        <div className="flex justify-center mb-4">{platform.icon}</div>
                        <h3 className="text-2xl font-bold mb-2 text-[#FBFEF2]">{platform.name}</h3>
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

        {/* Coming Soon Notice */}
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-lg p-4 mb-8">
          <p className="text-sm text-[#B6B6B6] text-center">
            <strong className="text-[#019B77]">Próximamente:</strong> Google Analytics, TikTok, LinkedIn, Google Ads y más
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