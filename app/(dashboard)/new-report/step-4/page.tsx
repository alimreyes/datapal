'use client';

import { useRouter } from 'next/navigation';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { FileUpload } from '@/components/upload/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CSVCategory } from '@/lib/types';
import { motion } from 'framer-motion';

const csvCategories: { id: CSVCategory; label: string; description: string }[] = [
  {
    id: 'reach',
    label: 'Alcance',
    description: 'Número de personas que vieron tu contenido',
  },
  {
    id: 'impressions',
    label: 'Visualizaciones',
    description: 'Total de veces que se mostró tu contenido',
  },
  {
    id: 'interactions',
    label: 'Interacciones',
    description: 'Me gusta, comentarios, compartidos y clics',
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
    id: 'linkClicks',
    label: 'Clics en el enlace',
    description: 'Clicks en enlaces de tus publicaciones',
  },
  {
    id: 'visits',
    label: 'Visitas',
    description: 'Visitas a tu página y engagement',
  },
];

export default function Step4Page() {
  const router = useRouter();
  const { facebookFiles, setFacebookFile, platforms, isStep4Valid } = useNewReportStore();

  const handleNext = () => {
    if (isStep4Valid()) {
      router.push('/new-report/step-5');
    }
  };

  const handleBack = () => {
    // Si Instagram está en platforms, volver a step-3, sino a step-2
    if (platforms.includes('instagram')) {
      router.push('/new-report/step-3');
    } else {
      router.push('/new-report/step-2');
    }
  };

  const uploadedCount = Object.values(facebookFiles).filter((file) => file !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Paso 4 de 5</span>
            <span className="text-sm text-gray-500">Carga de datos - Facebook</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '60%' }}
              animate={{ width: '80%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="text-4xl">👍</div>
            <h1 className="text-3xl font-bold">Facebook</h1>
          </div>
          <p className="text-gray-600 mb-2">
            Carga tus archivos .CSV de Facebook
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            <span className="font-medium">{uploadedCount} de 7 archivos</span>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              💡 ¿Dónde obtengo estos archivos?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-2">
            <p>1. Ve a <strong>Meta Business Suite</strong></p>
            <p>2. Selecciona tu página de Facebook</p>
            <p>3. Ve a <strong>Estadísticas</strong> → Exportar datos</p>
            <p>4. Descarga los CSV por categoría y súbelos aquí</p>
          </CardContent>
        </Card>

        {/* Upload Areas */}
        <div className="space-y-4 mb-8">
          {csvCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <FileUpload
                    label={category.label}
                    description={category.description}
                    file={facebookFiles[category.id]}
                    onFileChange={(file) => setFacebookFile(category.id, file)}
                    accept=".csv"
                    maxSize={5}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Helper Text */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Importante:</strong> No es necesario subir todos los archivos. Puedes continuar con al menos uno para generar tu reporte.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            size="lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Atrás
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!isStep4Valid()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Avanzar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}