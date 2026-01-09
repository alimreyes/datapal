'use client';

import { useRouter } from 'next/navigation';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, TrendingUp, FileText, CheckCircle2 } from 'lucide-react';
import { ReportObjective } from '@/lib/types';
import { motion } from 'framer-motion';

const objectives = [
  {
    id: 'analysis' as ReportObjective,
    title: 'Análisis de Resultados',
    description: 'Analiza el rendimiento de tus campañas y contenido',
    icon: BarChart3,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'improvements' as ReportObjective,
    title: 'Evidenciar Mejoras Realizadas',
    description: 'Muestra el impacto de las optimizaciones implementadas',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 'monthly_report' as ReportObjective,
    title: 'Crear Reporte del Mes',
    description: 'Genera un reporte completo del período',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Paso 1 de 5</span>
            <span className="text-sm text-gray-500">Objetivo del reporte</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '20%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            ¿Qué quieres lograr con DataPal?
          </h1>
          <p className="text-gray-600">
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
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-blue-600 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleSelect(obj.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`${obj.bgColor} p-3 rounded-xl`}>
                        <Icon className={`h-6 w-6 ${obj.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          {obj.title}
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {obj.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
          >
            Cancelar
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!objective}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Siguiente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}