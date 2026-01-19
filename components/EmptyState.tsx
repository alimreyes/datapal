'use client';

import { FileText, PlayCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  type: 'no-reports' | 'no-results';
  onClearFilters?: () => void;
}

export default function EmptyState({ type, onClearFilters }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-64 h-64 mb-6 relative">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Search illustration */}
            <circle cx="80" cy="80" r="40" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="4"/>
            <line x1="110" y1="110" x2="140" y2="140" stroke="#9CA3AF" strokeWidth="8" strokeLinecap="round"/>
            <text x="100" y="95" textAnchor="middle" fill="#6B7280" fontSize="40">?</text>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          No se encontraron reportes
        </h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Intenta ajustar los filtros de búsqueda o crear un nuevo reporte
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="border-2"
          >
            Limpiar Filtros
          </Button>
          <Link href="/new-report">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              Crear Nuevo Reporte
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // type === 'no-reports'
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration */}
      <div className="w-80 h-80 mb-8 relative">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Background circle */}
          <circle cx="150" cy="150" r="120" fill="#F3F4F6"/>

          {/* Document icon */}
          <g transform="translate(100, 80)">
            <rect x="0" y="0" width="100" height="130" rx="8" fill="white" stroke="#9CA3AF" strokeWidth="3"/>
            <rect x="15" y="20" width="70" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="15" y="40" width="55" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="15" y="60" width="70" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="15" y="80" width="45" height="8" rx="4" fill="#E5E7EB"/>

            {/* Chart lines */}
            <polyline
              points="15,100 35,95 55,105 75,92 85,98"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Sparkles */}
          <g className="animate-pulse">
            <circle cx="80" cy="100" r="4" fill="#F59E0B"/>
            <circle cx="220" cy="120" r="3" fill="#10B981"/>
            <circle cx="200" cy="200" r="3" fill="#3B82F6"/>
            <circle cx="90" cy="210" r="4" fill="#EC4899"/>
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a DataPal!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Crea tu primer reporte para desbloquear insights poderosos sobre el desempeño de tus redes sociales.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/new-report">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-base"
            >
              <FileText className="w-5 h-5 mr-2" />
              Crear Mi Primer Reporte
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Análisis Completo
            </h3>
            <p className="text-sm text-gray-600">
              Métricas detalladas de Instagram y Facebook en un solo lugar
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Insights con IA
            </h3>
            <p className="text-sm text-gray-600">
              Claude analiza tus datos y te da recomendaciones accionables
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PlayCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Exportación PDF
            </h3>
            <p className="text-sm text-gray-600">
              Genera reportes profesionales para compartir con tu equipo
            </p>
          </div>
        </div>

        {/* Help text */}
        <p className="text-sm text-gray-500 mt-8">
          ¿Necesitas ayuda? Revisa nuestra{' '}
          <a href="#" className="text-purple-600 hover:text-purple-700 font-medium underline">
            guía de inicio rápido
          </a>
        </p>
      </div>
    </div>
  );
}
