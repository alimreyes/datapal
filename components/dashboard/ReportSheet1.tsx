'use client';

import { useState } from 'react';
import { Eye, Users, Heart, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ReportSheet1Props {
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
  selectedMetric: {
    label: string;
    value: number;
    icon: any;
    color: string;
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
  onPurchaseTokens?: () => void;
}

export default function ReportSheet1({
  metrics,
  chartData,
  selectedMetric,
  insights = [],
  onGenerateInsights,
  onRegenerateInsights,
  isGenerating = false,
  tokensRemaining = 0,
  onPurchaseTokens,
}: ReportSheet1Props) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    visualizations: true,
    reach: true,
    interactions: true,
    followers: false,
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

  const calculateConversion = (from: number, to: number) => {
    if (from === 0) return '0.0';
    return ((to / from) * 100).toFixed(1);
  };

  const vizToReach = calculateConversion(metrics.visualizations, metrics.reach);
  const reachToInteractions = calculateConversion(metrics.reach, metrics.interactions);

  const metricsArray = [
    {
      label: 'Visualizaciones',
      value: metrics.visualizations,
      icon: Eye,
      color: '#019B77',
    },
    {
      label: 'Alcance',
      value: metrics.reach,
      icon: Users,
      color: '#02c494',
    },
    {
      label: 'Interacciones',
      value: metrics.interactions,
      icon: Heart,
      color: '#017a5e',
    },
    {
      label: 'Seguidores',
      value: metrics.followers,
      icon: UserPlus,
      color: '#B6B6B6',
    },
  ];

  const conversions = [vizToReach, reachToInteractions];
  const Icon = selectedMetric.icon;

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
      {/* Funnel de Métricas - HORIZONTAL */}
      <div className="bg-[#1a1b16] rounded-xl border border-[rgba(251,254,242,0.1)] p-4">
        <div className="flex items-center justify-center flex-wrap gap-2">
          {metricsArray.map((metric, index) => {
            const MetricIcon = metric.icon;

            return (
              <div key={metric.label} className="flex items-center gap-2">
                {/* Metric Card */}
                <div className="bg-[#2a2b25] border border-[rgba(251,254,242,0.1)] rounded-lg p-3 min-w-[140px]">
                  <div className="flex items-center gap-2 mb-1">
                    <MetricIcon className="w-4 h-4" style={{ color: metric.color }} />
                    <span className="text-xs font-medium text-[#B6B6B6]">
                      {metric.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#FBFEF2]">
                    {formatNumber(metric.value)}
                  </div>
                </div>

                {/* Conversion Arrow */}
                {index < conversions.length && (
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight className="w-5 h-5 text-[#B6B6B6]" />
                    <div className="bg-[#019B77] text-[#FBFEF2] px-2 py-1 rounded-full">
                      <span className="text-xs font-bold">{conversions[index]}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Métrica Grande + Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Métrica Grande Lateral */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6 h-full flex flex-col justify-center relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#019B77]/10 to-transparent" />

            <div className="text-center relative">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-[#019B77]/20 rounded-full border border-[#019B77]/30">
                  <Icon className="w-12 h-12 text-[#019B77]" />
                </div>
              </div>

              <h3 className="text-xs font-semibold text-[#B6B6B6] uppercase tracking-wider mb-3">
                Tu métrica más relevante
              </h3>

              <div className="text-5xl font-bold text-[#019B77] mb-3">
                {formatNumber(selectedMetric.value)}
              </div>

              <p className="text-lg font-medium text-[#FBFEF2]">{selectedMetric.label}</p>
            </div>
          </div>
        </div>

        {/* Gráfico de Línea Temporal */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#FBFEF2]">
                Evolución Temporal
              </h3>

              {/* Botones de toggle para métricas */}
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-xs text-[#B6B6B6] font-medium mr-1">Mostrar:</span>
                <button
                  onClick={() => toggleMetric('visualizations')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    visibleMetrics.visualizations
                      ? 'bg-[#019B77] text-[#FBFEF2]'
                      : 'bg-[#2a2b25] text-[#B6B6B6] border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  Visualizaciones
                </button>
                <button
                  onClick={() => toggleMetric('reach')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    visibleMetrics.reach
                      ? 'bg-[#02c494] text-[#FBFEF2]'
                      : 'bg-[#2a2b25] text-[#B6B6B6] border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  Alcance
                </button>
                <button
                  onClick={() => toggleMetric('interactions')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    visibleMetrics.interactions
                      ? 'bg-[#017a5e] text-[#FBFEF2]'
                      : 'bg-[#2a2b25] text-[#B6B6B6] border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 inline mr-1" />
                  Interacciones
                </button>
                <button
                  onClick={() => toggleMetric('followers')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    visibleMetrics.followers
                      ? 'bg-[#B6B6B6] text-[#11120D]'
                      : 'bg-[#2a2b25] text-[#B6B6B6] border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 inline mr-1" />
                  Seguidores
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,254,242,0.1)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#B6B6B6' }}
                  axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
                  tickLine={{ stroke: 'rgba(251,254,242,0.1)' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#B6B6B6' }}
                  axisLine={{ stroke: 'rgba(251,254,242,0.1)' }}
                  tickLine={{ stroke: 'rgba(251,254,242,0.1)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                {visibleMetrics.visualizations && (
                  <Line
                    type="monotone"
                    dataKey="visualizations"
                    stroke="#019B77"
                    strokeWidth={2}
                    name="Visualizaciones"
                    dot={{ fill: '#019B77', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: '#019B77' }}
                  />
                )}
                {visibleMetrics.reach && (
                  <Line
                    type="monotone"
                    dataKey="reach"
                    stroke="#02c494"
                    strokeWidth={2}
                    name="Alcance"
                    dot={{ fill: '#02c494', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: '#02c494' }}
                  />
                )}
                {visibleMetrics.interactions && (
                  <Line
                    type="monotone"
                    dataKey="interactions"
                    stroke="#017a5e"
                    strokeWidth={2}
                    name="Interacciones"
                    dot={{ fill: '#017a5e', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: '#017a5e' }}
                  />
                )}
                {visibleMetrics.followers && (
                  <Line
                    type="monotone"
                    dataKey="followers"
                    stroke="#B6B6B6"
                    strokeWidth={2}
                    name="Seguidores"
                    dot={{ fill: '#B6B6B6', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: '#B6B6B6' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sección de IA */}
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <h2 className="text-xl font-bold text-center text-[#FBFEF2] mb-4">
          Análisis con IA
        </h2>

        {insights.length > 0 ? (
          <div className="space-y-4">
            {onRegenerateInsights && (
              <div className="mb-4">
                <Button
                  onClick={async () => {
                    if (tokensRemaining <= 0) {
                      alert('No tienes tokens disponibles.');
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
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-[#B6B6B6] mb-4">
              Genera insights con IA para obtener análisis detallado de tus métricas
            </p>
            {onGenerateInsights && (
              <Button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                {isGenerating ? 'Generando...' : 'Generar Insights con IA'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
