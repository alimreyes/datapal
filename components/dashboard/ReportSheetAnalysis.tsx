'use client';

import { useState } from 'react';
import {
  Eye,
  Users,
  Heart,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Calendar,
  Award,
  BarChart3,
  Sparkles
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface ReportSheetAnalysisProps {
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
  currentSheet: number; // 0 = Resumen Ejecutivo, 1 = Análisis Profundo
  onPurchaseTokens?: () => void;
}

export default function ReportSheetAnalysis({
  metrics,
  chartData,
  insights = [],
  onGenerateInsights,
  onRegenerateInsights,
  isGenerating = false,
  tokensRemaining = 0,
  currentSheet,
  onPurchaseTokens,
}: ReportSheetAnalysisProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return new Intl.NumberFormat('es-CL').format(num);
  };

  // Calcular tasa de engagement
  const engagementRate = metrics.reach > 0
    ? ((metrics.interactions / metrics.reach) * 100).toFixed(2)
    : '0.00';

  // Calcular conversión del funnel
  const vizToReach = metrics.visualizations > 0
    ? ((metrics.reach / metrics.visualizations) * 100).toFixed(1)
    : '0.0';
  const reachToInteractions = metrics.reach > 0
    ? ((metrics.interactions / metrics.reach) * 100).toFixed(1)
    : '0.0';

  // Encontrar top 3 días
  const topDays = [...chartData]
    .sort((a, b) => b.reach - a.reach)
    .slice(0, 3);

  // Datos para gráfico de funnel
  const funnelData = [
    { name: 'Visualizaciones', value: metrics.visualizations, color: '#019B77' },
    { name: 'Alcance', value: metrics.reach, color: '#02c494' },
    { name: 'Interacciones', value: metrics.interactions, color: '#017a5e' },
  ];

  // Distribución simulada de engagement por hora
  const hourlyEngagement = [
    { hour: '6am', engagement: 12 },
    { hour: '9am', engagement: 45 },
    { hour: '12pm', engagement: 78 },
    { hour: '3pm', engagement: 65 },
    { hour: '6pm', engagement: 89 },
    { hour: '9pm', engagement: 92 },
    { hour: '12am', engagement: 34 },
  ];

  // Custom tooltip
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

  // HOJA 1: Resumen Ejecutivo
  if (currentSheet === 0) {
    return (
      <div className="space-y-6">
        {/* Header con título del análisis */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#019B77]/20 rounded-full border border-[#019B77]/30 mb-4">
            <BarChart3 className="w-5 h-5 text-[#019B77]" />
            <span className="text-sm font-medium text-[#019B77]">Análisis de Resultados</span>
          </div>
          <h2 className="text-2xl font-bold text-[#FBFEF2]">Resumen Ejecutivo</h2>
          <p className="text-[#B6B6B6] mt-2">Vista general del rendimiento de tus redes sociales</p>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Visualizaciones', value: metrics.visualizations, icon: Eye, color: '#019B77', change: '+12.5%' },
            { label: 'Alcance', value: metrics.reach, icon: Users, color: '#02c494', change: '+8.3%' },
            { label: 'Interacciones', value: metrics.interactions, icon: Heart, color: '#017a5e', change: '+15.2%' },
            { label: 'Tasa Engagement', value: engagementRate + '%', icon: Zap, color: '#B6B6B6', change: '+2.1%', isPercentage: true },
          ].map((kpi, index) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change.startsWith('+');
            return (
              <div
                key={index}
                className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-5 hover:border-[#019B77]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-xs text-[#B6B6B6] mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-[#FBFEF2]">
                  {kpi.isPercentage ? kpi.value : formatNumber(kpi.value as number)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Gráfico de Tendencia Principal */}
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#FBFEF2] mb-4">Tendencia General</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#colorReach)"
                name="Alcance"
              />
              <Line
                type="monotone"
                dataKey="interactions"
                stroke="#02c494"
                strokeWidth={2}
                dot={{ fill: '#02c494', r: 3 }}
                name="Interacciones"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top 3 Mejores Días */}
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#019B77]" />
            <h3 className="text-lg font-bold text-[#FBFEF2]">Top 3 Mejores Días</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topDays.map((day, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  index === 0
                    ? 'bg-[#019B77]/20 border-[#019B77]/50'
                    : 'bg-[#2a2b25] border-[rgba(251,254,242,0.1)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-[#019B77] text-[#FBFEF2]' : 'bg-[#2a2b25] text-[#B6B6B6] border border-[rgba(251,254,242,0.2)]'
                  }`}>
                    #{index + 1}
                  </div>
                  <span className="text-sm font-medium text-[#FBFEF2]">{day.date}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#B6B6B6]">Alcance: <span className="text-[#FBFEF2] font-medium">{formatNumber(day.reach)}</span></p>
                  <p className="text-xs text-[#B6B6B6]">Interacciones: <span className="text-[#FBFEF2] font-medium">{formatNumber(day.interactions)}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // HOJA 2: Análisis Profundo
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#019B77]/20 rounded-full border border-[#019B77]/30 mb-4">
          <Target className="w-5 h-5 text-[#019B77]" />
          <span className="text-sm font-medium text-[#019B77]">Análisis de Resultados</span>
        </div>
        <h2 className="text-2xl font-bold text-[#FBFEF2]">Análisis Profundo</h2>
        <p className="text-[#B6B6B6] mt-2">Desglose detallado y oportunidades de mejora</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel de Conversión */}
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#FBFEF2] mb-4">Funnel de Conversión</h3>
          <div className="space-y-4">
            {funnelData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#B6B6B6]">{item.name}</span>
                  <span className="text-sm font-bold text-[#FBFEF2]">{formatNumber(item.value)}</span>
                </div>
                <div className="h-3 bg-[#2a2b25] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / metrics.visualizations) * 100}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                {index < funnelData.length - 1 && (
                  <div className="text-center my-2">
                    <span className="text-xs text-[#019B77] font-medium">
                      ↓ {index === 0 ? vizToReach : reachToInteractions}% conversión
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mejores Horarios */}
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#019B77]" />
            <h3 className="text-lg font-bold text-[#FBFEF2]">Mejores Horarios para Publicar</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,254,242,0.1)" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: '#B6B6B6' }}
                axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#B6B6B6' }}
                axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="engagement" name="Engagement" radius={[4, 4, 0, 0]}>
                {hourlyEngagement.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.engagement > 70 ? '#019B77' : '#2a2b25'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#B6B6B6] mt-2 text-center">
            Los horarios en <span className="text-[#019B77]">verde</span> tienen mayor engagement
          </p>
        </div>
      </div>

      {/* Sección de IA - Recomendaciones */}
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#019B77]" />
          <h3 className="text-lg font-bold text-[#FBFEF2]">Recomendaciones con IA</h3>
        </div>

        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-[#2a2b25] rounded-lg p-4 border border-[rgba(251,254,242,0.1)]"
              >
                <h4 className="font-bold text-[#FBFEF2] mb-1">{insight.title}</h4>
                <p className="text-sm text-[#B6B6B6]">{insight.content}</p>
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
              Genera recomendaciones personalizadas basadas en tus datos
            </p>
            {onGenerateInsights && (
              <Button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Generar Recomendaciones'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
