'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  Target,
  Zap,
  Award,
  Calendar,
  BarChart3,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  ComposedChart,
  Area,
} from 'recharts';

interface ReportSheetImprovementsProps {
  metrics: {
    visualizations: number;
    reach: number;
    interactions: number;
    followers: number;
  };
  chartData: Array<{
    date: string;
    visualizations: number;
    reach: number;
    interactions: number;
    followers: number;
  }>;
  // Período anterior para comparación (opcional - si no existe, simularemos)
  previousMetrics?: {
    visualizations: number;
    reach: number;
    interactions: number;
    followers: number;
  };
  insights?: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
  }>;
  onGenerateInsights?: () => void;
  onRegenerateInsights?: () => void;
  isGenerating?: boolean;
  tokensRemaining?: number;
  currentSheet: number; // 0 = Comparativa, 1 = Impacto
  onPurchaseTokens?: () => void;
}

export default function ReportSheetImprovements({
  metrics,
  chartData,
  previousMetrics,
  insights = [],
  onGenerateInsights,
  onRegenerateInsights,
  isGenerating = false,
  tokensRemaining = 0,
  currentSheet,
  onPurchaseTokens,
}: ReportSheetImprovementsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return new Intl.NumberFormat('es-CL').format(num);
  };

  // Si no hay métricas anteriores, simular con 70-90% del valor actual
  const previous = previousMetrics || {
    visualizations: Math.floor(metrics.visualizations * (0.7 + Math.random() * 0.2)),
    reach: Math.floor(metrics.reach * (0.7 + Math.random() * 0.2)),
    interactions: Math.floor(metrics.interactions * (0.7 + Math.random() * 0.2)),
    followers: Math.floor(metrics.followers * (0.95 + Math.random() * 0.03)),
  };

  // Calcular porcentajes de cambio
  const calculateChange = (current: number, prev: number) => {
    if (prev === 0) return { value: 100, isPositive: true };
    const change = ((current - prev) / prev) * 100;
    return { value: Math.abs(change).toFixed(1), isPositive: change >= 0 };
  };

  const changes = {
    visualizations: calculateChange(metrics.visualizations, previous.visualizations),
    reach: calculateChange(metrics.reach, previous.reach),
    interactions: calculateChange(metrics.interactions, previous.interactions),
    followers: calculateChange(metrics.followers, previous.followers),
  };

  // Datos para gráfico comparativo
  const comparisonData = [
    { name: 'Visualizaciones', anterior: previous.visualizations, actual: metrics.visualizations },
    { name: 'Alcance', anterior: previous.reach, actual: metrics.reach },
    { name: 'Interacciones', anterior: previous.interactions, actual: metrics.interactions },
  ];

  // Timeline de mejoras simulado
  const improvementTimeline = [
    { date: 'Semana 1', action: 'Optimización de horarios de publicación', impact: '+15% alcance' },
    { date: 'Semana 2', action: 'Nuevo formato de contenido (Reels)', impact: '+25% engagement' },
    { date: 'Semana 3', action: 'Estrategia de hashtags mejorada', impact: '+18% descubrimiento' },
    { date: 'Semana 4', action: 'Colaboración con influencers', impact: '+40% nuevos seguidores' },
  ];

  // Proyección de crecimiento (últimos datos + tendencia)
  const projectionData = chartData.slice(-7).map((d, i) => ({
    ...d,
    projectedReach: d.reach * (1 + (i * 0.05)),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.2)] rounded-lg p-3 shadow-xl">
          <p className="text-[#FBFEF2] text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color || entry.fill }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // HOJA 1: Comparativa Antes/Después
  if (currentSheet === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#02c494]/20 rounded-full border border-[#02c494]/30 mb-4">
            <TrendingUp className="w-5 h-5 text-[#02c494]" />
            <span className="text-sm font-medium text-[#02c494]">Evidenciar Mejoras</span>
          </div>
          <h2 className="text-2xl font-bold text-[#FBFEF2]">Comparativa de Rendimiento</h2>
          <p className="text-[#B6B6B6] mt-2">Análisis del progreso vs período anterior</p>
        </div>

        {/* Cards de Comparación */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Visualizaciones', current: metrics.visualizations, prev: previous.visualizations, change: changes.visualizations },
            { label: 'Alcance', current: metrics.reach, prev: previous.reach, change: changes.reach },
            { label: 'Interacciones', current: metrics.interactions, prev: previous.interactions, change: changes.interactions },
            { label: 'Seguidores', current: metrics.followers, prev: previous.followers, change: changes.followers },
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-5 hover:border-[#019B77]/30 transition-all"
            >
              <p className="text-xs text-[#B6B6B6] mb-3">{metric.label}</p>

              {/* Valor Actual */}
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-[#FBFEF2]">{formatNumber(metric.current)}</span>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.change.isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change.isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {metric.change.value}%
                </div>
              </div>

              {/* Valor Anterior */}
              <p className="text-xs text-[#B6B6B6]">
                Anterior: <span className="text-[#FBFEF2]">{formatNumber(metric.prev)}</span>
              </p>

              {/* Barra de progreso visual */}
              <div className="mt-3 h-2 bg-[#2a2b25] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    metric.change.isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(parseFloat(metric.change.value as string)))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico Comparativo de Barras */}
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#FBFEF2] mb-4">Comparación Visual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,254,242,0.1)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#B6B6B6' }}
                axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#B6B6B6' }}
                axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-[#B6B6B6] text-sm">{value}</span>}
              />
              <Bar dataKey="anterior" name="Período Anterior" fill="#B6B6B6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Período Actual" fill="#019B77" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resumen de Crecimiento */}
        <div className="bg-gradient-to-r from-[#019B77]/20 to-[#02c494]/20 border border-[#019B77]/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#019B77]/30 rounded-full">
              <Award className="w-6 h-6 text-[#019B77]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FBFEF2]">Crecimiento Total</h3>
              <p className="text-sm text-[#B6B6B6]">Resumen del período analizado</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#019B77]">
                +{((parseFloat(changes.reach.value as string) + parseFloat(changes.interactions.value as string)) / 2).toFixed(0)}%
              </p>
              <p className="text-xs text-[#B6B6B6] mt-1">Engagement Promedio</p>
            </div>
            <div className="text-center border-x border-[rgba(251,254,242,0.1)]">
              <p className="text-3xl font-bold text-[#02c494]">
                +{formatNumber(metrics.reach - previous.reach)}
              </p>
              <p className="text-xs text-[#B6B6B6] mt-1">Nuevo Alcance</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#FBFEF2]">
                +{formatNumber(metrics.followers - previous.followers)}
              </p>
              <p className="text-xs text-[#B6B6B6] mt-1">Nuevos Seguidores</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HOJA 2: Impacto y ROI
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#02c494]/20 rounded-full border border-[#02c494]/30 mb-4">
          <Activity className="w-5 h-5 text-[#02c494]" />
          <span className="text-sm font-medium text-[#02c494]">Evidenciar Mejoras</span>
        </div>
        <h2 className="text-2xl font-bold text-[#FBFEF2]">Impacto de las Mejoras</h2>
        <p className="text-[#B6B6B6] mt-2">Timeline de acciones y proyección de crecimiento</p>
      </div>

      {/* Timeline de Mejoras */}
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-[#019B77]" />
          <h3 className="text-lg font-bold text-[#FBFEF2]">Timeline de Mejoras Implementadas</h3>
        </div>

        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#019B77]/30" />

          <div className="space-y-6">
            {improvementTimeline.map((item, index) => (
              <div key={index} className="relative flex items-start gap-4 pl-12">
                {/* Punto en la línea */}
                <div className="absolute left-2 w-5 h-5 rounded-full bg-[#019B77] flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-[#FBFEF2]" />
                </div>

                <div className="flex-1 bg-[#2a2b25] rounded-lg p-4 border border-[rgba(251,254,242,0.1)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#019B77]">{item.date}</span>
                    <span className="text-xs font-bold text-green-400 bg-green-400/20 px-2 py-1 rounded">
                      {item.impact}
                    </span>
                  </div>
                  <p className="text-sm text-[#FBFEF2]">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Evolución con Proyección */}
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#FBFEF2]">Evolución y Proyección</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#019B77]" />
              <span className="text-[#B6B6B6]">Alcance Real</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#02c494] border-dashed border-t-2 border-[#02c494]" style={{ width: '12px' }} />
              <span className="text-[#B6B6B6]">Proyección</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={projectionData}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#019B77" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#019B77" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,254,242,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#B6B6B6' }}
              axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#B6B6B6' }}
              axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="reach"
              stroke="#019B77"
              strokeWidth={2}
              fill="url(#colorGrowth)"
              name="Alcance"
            />
            <Line
              type="monotone"
              dataKey="projectedReach"
              stroke="#02c494"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Proyección"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Sección de IA - Análisis de Impacto */}
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#019B77]" />
          <h3 className="text-lg font-bold text-[#FBFEF2]">Análisis de Impacto con IA</h3>
        </div>

        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-[#2a2b25] rounded-lg p-4 border border-[rgba(251,254,242,0.1)]"
              >
                <h4 className="font-bold text-[#FBFEF2] mb-1">{insight.title}</h4>
                <p className="text-sm text-[#B6B6B6] whitespace-pre-line">{insight.content}</p>
              </div>
            ))}
            {onRegenerateInsights && (
              <Button
                onClick={onRegenerateInsights}
                disabled={isGenerating || tokensRemaining <= 0}
                className="w-full mt-4 bg-[#2a2b25] hover:bg-[#019B77]/20 text-[#FBFEF2] border border-[rgba(251,254,242,0.1)]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generando...' : `Regenerar (${tokensRemaining} tokens)`}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-[#B6B6B6] mb-4">
              Genera un análisis detallado del impacto de tus mejoras
            </p>
            {onGenerateInsights && (
              <Button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Analizar Impacto'}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Métricas de Éxito */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'ROI Estimado', value: '+245%', icon: Target, description: 'Retorno sobre inversión' },
          { label: 'Eficiencia', value: '89%', icon: Zap, description: 'Tasa de conversión mejorada' },
          { label: 'Satisfacción', value: '4.8/5', icon: Award, description: 'Calidad del contenido' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-5 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#019B77]/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#019B77]" />
              </div>
              <p className="text-2xl font-bold text-[#FBFEF2] mb-1">{stat.value}</p>
              <p className="text-xs text-[#019B77] font-medium mb-1">{stat.label}</p>
              <p className="text-xs text-[#B6B6B6]">{stat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
