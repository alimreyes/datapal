'use client';

import { useState } from 'react';
import { Eye, Users, Heart, UserPlus, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  // Estado para controlar qué líneas del gráfico están visibles
  const [visibleMetrics, setVisibleMetrics] = useState({
    visualizations: true,
    reach: true,
    interactions: true,
    followers: false, // Oculta por defecto para simplificar
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
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Alcance',
      value: metrics.reach,
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Interacciones',
      value: metrics.interactions,
      icon: Heart,
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200',
    },
    {
      label: 'Seguidores',
      value: metrics.followers,
      icon: UserPlus,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
  ];

  const conversions = [vizToReach, reachToInteractions];

  const Icon = selectedMetric.icon;

  return (
    <div className="space-y-6">
      {/* Funnel de Métricas - HORIZONTAL */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-center flex-wrap gap-2">
          {metricsArray.map((metric, index) => {
            const MetricIcon = metric.icon;

            return (
              <div key={metric.label} className="flex items-center gap-2">
                {/* Metric Card */}
                <div
                  className={`${metric.bgColor} ${metric.borderColor} border-2 rounded-lg p-3 min-w-[140px]`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MetricIcon className={`w-4 h-4 ${metric.textColor}`} />
                    <span className="text-xs font-medium text-gray-600">
                      {metric.label}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${metric.textColor}`}>
                    {formatNumber(metric.value)}
                  </div>
                </div>

                {/* Conversion Arrow */}
                {index < conversions.length && (
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full">
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
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 h-full flex flex-col justify-center">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white rounded-full shadow-md">
                  <Icon className={`w-12 h-12 text-${selectedMetric.color}-600`} />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Tu métrica más relevante
              </h3>

              <div className={`text-5xl font-bold text-${selectedMetric.color}-600 mb-2`}>
                {formatNumber(selectedMetric.value)}
              </div>

              <p className="text-lg font-medium text-gray-700 mb-6">{selectedMetric.label}</p>

              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analizar con IA
              </button>
            </div>
          </div>
        </div>

        {/* Gráfico de Línea Temporal */}
        <div className="lg:col-span-2">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Gráfico de Línea Temporal
              </h3>

              {/* Botones de toggle para métricas */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => toggleMetric('visualizations')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    visibleMetrics.visualizations
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-purple-600 border border-purple-300'
                  }`}
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  Viz
                </button>
                <button
                  onClick={() => toggleMetric('reach')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    visibleMetrics.reach
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-blue-600 border border-blue-300'
                  }`}
                >
                  <Users className="w-3 h-3 inline mr-1" />
                  Alcance
                </button>
                <button
                  onClick={() => toggleMetric('interactions')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    visibleMetrics.interactions
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-white text-pink-600 border border-pink-300'
                  }`}
                >
                  <Heart className="w-3 h-3 inline mr-1" />
                  Int
                </button>
                <button
                  onClick={() => toggleMetric('followers')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    visibleMetrics.followers
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-green-600 border border-green-300'
                  }`}
                >
                  <UserPlus className="w-3 h-3 inline mr-1" />
                  Seg
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                {visibleMetrics.visualizations && (
                  <Line
                    type="monotone"
                    dataKey="visualizations"
                    stroke="#9333ea"
                    strokeWidth={2}
                    name="Visualizaciones"
                  />
                )}
                {visibleMetrics.reach && (
                  <Line
                    type="monotone"
                    dataKey="reach"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Alcance"
                  />
                )}
                {visibleMetrics.interactions && (
                  <Line
                    type="monotone"
                    dataKey="interactions"
                    stroke="#ec4899"
                    strokeWidth={2}
                    name="Interacciones"
                  />
                )}
                {visibleMetrics.followers && (
                  <Line
                    type="monotone"
                    dataKey="followers"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Seguidores"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sección de IA */}
      <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          SECCIÓN DE IA
        </h2>

        {insights.length > 0 ? (
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
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-white rounded-lg p-4 border border-pink-200"
                >
                  <h4 className="font-bold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-700">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Genera insights con IA para obtener análisis detallado de tus métricas
            </p>
            {onGenerateInsights && (
              <Button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
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
