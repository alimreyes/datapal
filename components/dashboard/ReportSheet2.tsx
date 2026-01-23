'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ReportSheet2Props {
  totalPosts: number;
  totalInteractions: number;
  frequency: string; // Ej: "3.5 posts/día"
  chartData: Array<{
    date: string;
    posts: number;
    interactions: number;
  }>;
  contentInsights?: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
  }>;
  onGenerateInsights?: () => void;
  onRegenerateInsights?: () => void;
  isGenerating?: boolean;
  tokensRemaining?: number;
  onPurchaseTokens?: () => void;
}

export default function ReportSheet2({
  totalPosts,
  totalInteractions,
  frequency,
  chartData,
  contentInsights = [],
  onGenerateInsights,
  onRegenerateInsights,
  isGenerating = false,
  tokensRemaining = 0,
  onPurchaseTokens,
}: ReportSheet2Props) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  return (
    <div className="space-y-6">
      {/* 3 Cards Horizontales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Publicaciones Totales
          </h3>
          <div className="text-4xl font-bold text-purple-600">
            {formatNumber(totalPosts)}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Interacciones Totales
          </h3>
          <div className="text-4xl font-bold text-pink-600">
            {formatNumber(totalInteractions)}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Frecuencia
          </h3>
          <div className="text-4xl font-bold text-blue-600">{frequency}</div>
        </div>
      </div>

      {/* Gráfico Combinado: Líneas + Barras */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
          Publicaciones vs Interacciones en el Tiempo
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              label={{ value: 'Publicaciones', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              domain={[0, 'auto']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              label={{ value: 'Interacciones', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar
              yAxisId="left"
              dataKey="posts"
              fill="#9333ea"
              name="Publicaciones"
              radius={[8, 8, 0, 0]}
              barSize={30}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="interactions"
              stroke="#ec4899"
              strokeWidth={3}
              name="Interacciones"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Sección de IA - Enfocada en Contenido */}
      <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          SECCIÓN DE IA:{' '}
          <span className="font-normal">
            Enfocado en analizar y dar resultados enfocados en el Contenido.
          </span>
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Podemos dar algunas sugerencias de preguntas para hacer, y preguntar si
          quiere sugerencias de contenido.
        </p>

        {contentInsights.length > 0 ? (
          <div className="space-y-4">
            {/* Botón Regenerar Insights */}
            {onRegenerateInsights && (
              <div className="mb-4">
                <Button
                  onClick={async () => {
                    if (tokensRemaining <= 0) {
                      alert('No tienes tokens disponibles. Compra más tokens para regenerar insights.');
                      if (onPurchaseTokens) onPurchaseTokens();
                      return;
                    }
                    if (confirm('Regenerar insights consumirá 1 token. ¿Deseas continuar?')) {
                      await onRegenerateInsights();
                    }
                  }}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? 'Generando...' : 'Regenerar Insights (1 token)'}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Tokens restantes: {tokensRemaining}
                </p>
              </div>
            )}

            {/* Insights Generados */}
            <div className="space-y-3">
              {contentInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-white rounded-lg p-4 border border-pink-200"
                >
                  <h4 className="font-bold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-700">{insight.content}</p>
                </div>
              ))}

              {/* Sugerencias de Preguntas */}
              <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 mt-4">
                <h4 className="font-bold text-purple-900 mb-2">
                  💡 Preguntas sugeridas:
                </h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>• ¿Qué tipo de contenido genera más interacciones?</li>
                  <li>• ¿Cuál es el mejor horario para publicar?</li>
                  <li>• ¿Qué temas debo explorar más?</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Genera insights con IA para obtener análisis detallado de tu
              contenido
            </p>
            {onGenerateInsights && (
              <Button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                {isGenerating ? 'Generando...' : 'Generar Análisis de Contenido'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
