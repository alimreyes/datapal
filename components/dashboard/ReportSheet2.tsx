'use client';

import { useState } from 'react';
import { Sparkles, FileText, MessageCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  const [visibleMetrics, setVisibleMetrics] = useState({
    posts: true,
    interactions: true,
  });

  const toggleMetric = (metric: keyof typeof visibleMetrics) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  // Custom tooltip for dark theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.2)] rounded-lg p-3 shadow-xl">
          <p className="text-[#FBFEF2] text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 3 Cards Horizontales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6 text-center relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#019B77]/10 to-transparent" />
          <div className="relative">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-[#019B77]/20 rounded-full border border-[#019B77]/30">
                <FileText className="w-6 h-6 text-[#019B77]" />
              </div>
            </div>
            <h3 className="text-xs font-semibold text-[#B6B6B6] uppercase tracking-wider mb-2">
              Publicaciones Totales
            </h3>
            <div className="text-4xl font-bold text-[#019B77]">
              {formatNumber(totalPosts)}
            </div>
          </div>
        </div>

        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6 text-center relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#02c494]/10 to-transparent" />
          <div className="relative">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-[#02c494]/20 rounded-full border border-[#02c494]/30">
                <MessageCircle className="w-6 h-6 text-[#02c494]" />
              </div>
            </div>
            <h3 className="text-xs font-semibold text-[#B6B6B6] uppercase tracking-wider mb-2">
              Interacciones Totales
            </h3>
            <div className="text-4xl font-bold text-[#02c494]">
              {formatNumber(totalInteractions)}
            </div>
          </div>
        </div>

        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6 text-center relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#017a5e]/10 to-transparent" />
          <div className="relative">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-[#017a5e]/20 rounded-full border border-[#017a5e]/30">
                <BarChart3 className="w-6 h-6 text-[#017a5e]" />
              </div>
            </div>
            <h3 className="text-xs font-semibold text-[#B6B6B6] uppercase tracking-wider mb-2">
              Frecuencia
            </h3>
            <div className="text-4xl font-bold text-[#017a5e]">{frequency}</div>
          </div>
        </div>
      </div>

      {/* Gráfico Combinado: Barras + Líneas */}
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#FBFEF2]">
            Publicaciones vs Interacciones en el Tiempo
          </h3>

          {/* Botones de toggle para métricas */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-[#B6B6B6] font-medium mr-1">Mostrar:</span>
            <button
              onClick={() => toggleMetric('posts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                visibleMetrics.posts
                  ? 'bg-[#019B77] text-[#FBFEF2]'
                  : 'bg-[#2a2b25] text-[#B6B6B6] border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1" />
              Publicaciones
            </button>
            <button
              onClick={() => toggleMetric('interactions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                visibleMetrics.interactions
                  ? 'bg-[#02c494] text-[#FBFEF2]'
                  : 'bg-[#2a2b25] text-[#B6B6B6] border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 inline mr-1" />
              Interacciones
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,254,242,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#B6B6B6' }}
              angle={-45}
              textAnchor="end"
              height={80}
              axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
              tickLine={{ stroke: 'rgba(251,254,242,0.1)' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#B6B6B6' }}
              label={{ value: 'Publicaciones', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#B6B6B6' } }}
              domain={[0, 'auto']}
              axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
              tickLine={{ stroke: 'rgba(251,254,242,0.1)' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#B6B6B6' }}
              label={{ value: 'Interacciones', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#B6B6B6' } }}
              axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
              tickLine={{ stroke: 'rgba(251,254,242,0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {visibleMetrics.posts && (
              <Bar
                yAxisId="left"
                dataKey="posts"
                fill="#019B77"
                name="Publicaciones"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            )}
            {visibleMetrics.interactions && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="interactions"
                stroke="#02c494"
                strokeWidth={3}
                name="Interacciones"
                dot={{ fill: '#02c494', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#02c494' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Sección de IA - Enfocada en Contenido */}
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#FBFEF2] mb-2">
          SECCIÓN DE IA:{' '}
          <span className="font-normal text-[#B6B6B6]">
            Enfocado en analizar y dar resultados enfocados en el Contenido.
          </span>
        </h2>
        <p className="text-sm text-[#B6B6B6] mb-4">
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
                  className="w-full bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? 'Generando...' : 'Regenerar Insights (1 token)'}
                </Button>
                <p className="text-xs text-[#B6B6B6] text-center mt-2">
                  Tokens restantes: {tokensRemaining}
                </p>
              </div>
            )}

            {/* Insights Generados */}
            <div className="space-y-3">
              {contentInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-[#2a2b25] rounded-lg p-4 border border-[rgba(251,254,242,0.1)]"
                >
                  <h4 className="font-bold text-[#FBFEF2] mb-1">{insight.title}</h4>
                  <p className="text-sm text-[#B6B6B6]">{insight.content}</p>
                </div>
              ))}

              {/* Sugerencias de Preguntas */}
              <div className="bg-[#019B77]/10 border border-[#019B77]/30 rounded-lg p-4 mt-4">
                <h4 className="font-bold text-[#019B77] mb-2">
                  💡 Preguntas sugeridas:
                </h4>
                <ul className="space-y-2 text-sm text-[#B6B6B6]">
                  <li>• ¿Qué tipo de contenido genera más interacciones?</li>
                  <li>• ¿Cuál es el mejor horario para publicar?</li>
                  <li>• ¿Qué temas debo explorar más?</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#B6B6B6] mb-4">
              Genera insights con IA para obtener análisis detallado de tu
              contenido
            </p>
            {onGenerateInsights && (
              <Button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 mx-auto"
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
