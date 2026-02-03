'use client';

import { useRouter } from 'next/navigation';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, TrendingUp, FileText, CheckCircle2 } from 'lucide-react';
import { ReportObjective } from '@/lib/types';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';

const objectives = [
  {
    id: 'analysis' as ReportObjective,
    title: 'Análisis de Resultados',
    description: 'Analiza el rendimiento de tus campañas y contenido',
    icon: BarChart3,
    bgColor: 'bg-[#019B77]/20',
    iconColor: 'text-[#019B77]',
  },
  {
    id: 'improvements' as ReportObjective,
    title: 'Evidenciar Mejoras Realizadas',
    description: 'Muestra el impacto de las optimizaciones implementadas',
    icon: TrendingUp,
    bgColor: 'bg-[#02c494]/20',
    iconColor: 'text-[#02c494]',
  },
  {
    id: 'monthly_report' as ReportObjective,
    title: 'Crear Reporte del Mes',
    description: 'Genera un reporte completo del período',
    icon: FileText,
    bgColor: 'bg-[#017a5e]/20',
    iconColor: 'text-[#019B77]',
  },
];

export default function Step1Page() {
  const router = useRouter();
  const { objective, setObjective } = useNewReportStore();

  const handleSelect = (selectedObjective: ReportObjective) => {
    setObjective(selectedObjective);
  };

  const handleNext = () => {
    if (objective) {
      router.push('/new-report/step-2');
    }
  };

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#B6B6B6]">Paso 1 de 5</span>
            <span className="text-sm text-[#B6B6B6]">Objetivo del reporte</span>
          </div>
          <div className="w-full h-2 bg-[#2a2b25] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '20%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-[#019B77]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#FBFEF2]">
            ¿Qué quieres lograr con DataPal?
          </h1>
          <p className="text-[#B6B6B6]">
            Selecciona el objetivo principal de tu reporte
          </p>
        </div>

        {/* Options */}
        <div className="grid gap-4 mb-8">
          {objectives.map((obj, index) => {
            const Icon = obj.icon;
            const isSelected = objective === obj.id;

            return (
              <motion.div
                key={obj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlowCard
                  onClick={() => handleSelect(obj.id)}
                  className={`transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-offset-[#11120D] ring-[#019B77]'
                      : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`${obj.bgColor} p-3 rounded-xl border border-[#019B77]/30`}>
                        <Icon className={`h-6 w-6 ${obj.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-[#FBFEF2]">
                          {obj.title}
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-[#019B77]" />
                          )}
                        </h3>
                        <p className="mt-1 text-[#B6B6B6]">
                          {obj.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#2a2b25]"
          >
            Cancelar
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!objective}
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