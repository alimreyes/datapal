'use client';

import { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Award,
  Activity,
  AlertTriangle,
  MessageCircle,
  Send,
  Loader2,
  Eye,
  Users,
  Heart,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const SUGGESTED_QUESTIONS = [
  'Que metrica tuvo mayor crecimiento y por que?',
  'Que acciones concretas puedo tomar para seguir mejorando?',
  'Que contenido debo priorizar el proximo mes?',
];

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
  currentSheet: number;
  onPurchaseTokens?: () => void;
  onAskQuestion?: (question: string) => void;
  isAskingQuestion?: boolean;
  questionAnswer?: { question: string; answer: string } | null;
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
  onAskQuestion,
  isAskingQuestion = false,
  questionAnswer,
}: ReportSheetImprovementsProps) {
  const [customQuestion, setCustomQuestion] = useState('');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const hasPreviousData = !!previousMetrics;

  // Solo calcular cambios si hay datos reales del período anterior
  const calculateChange = (current: number, prev: number) => {
    if (prev === 0) return { value: '100', isPositive: true };
    const change = ((current - prev) / prev) * 100;
    return { value: Math.abs(change).toFixed(1), isPositive: change >= 0 };
  };

  const changes = hasPreviousData
    ? {
        visualizations: calculateChange(metrics.visualizations, previousMetrics!.visualizations),
        reach: calculateChange(metrics.reach, previousMetrics!.reach),
        interactions: calculateChange(metrics.interactions, previousMetrics!.interactions),
        followers: calculateChange(metrics.followers, previousMetrics!.followers),
      }
    : null;

  // Datos para gráfico comparativo — solo si hay data real
  const comparisonData = hasPreviousData
    ? [
        { name: 'Visualizaciones', anterior: previousMetrics!.visualizations, actual: metrics.visualizations },
        { name: 'Alcance', anterior: previousMetrics!.reach, actual: metrics.reach },
        { name: 'Interacciones', anterior: previousMetrics!.interactions, actual: metrics.interactions },
      ]
    : [];

  // Custom tooltip con fondo sólido correcto
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#1a1b16', border: '1px solid rgba(251,254,242,0.2)', borderRadius: '8px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <p style={{ color: '#FBFEF2', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color || entry.fill, fontSize: '12px', margin: '2px 0' }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleSubmitQuestion = () => {
    if (customQuestion.trim() && onAskQuestion) {
      onAskQuestion(customQuestion.trim());
      setCustomQuestion('');
    }
  };

  // ===============================================================
  // HOJA 1: Comparativa (con data real) o Métricas actuales (sin data anterior)
  // ===============================================================
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
          <p className="text-[#B6B6B6] mt-2">
            {hasPreviousData
              ? 'Analisis del progreso vs periodo anterior'
              : 'Metricas del periodo actual'}
          </p>
        </div>

        {/* Aviso cuando no hay datos de período anterior */}
        {!hasPreviousData && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 flex items-start gap-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-[#FBFEF2] font-semibold mb-1">
                Datos de comparacion insuficientes
              </h3>
              <p className="text-sm text-[#B6B6B6] leading-relaxed">
                Para mostrar una comparativa antes/despues, este reporte necesita datos de al menos 2 periodos.
                Carga los datos del periodo anterior para visualizar la evolucion y el impacto real de tus mejoras.
              </p>
            </div>
          </div>
        )}

        {/* Cards de métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Visualizaciones', key: 'visualizations', current: metrics.visualizations, icon: Eye },
            { label: 'Alcance', key: 'reach', current: metrics.reach, icon: Users },
            { label: 'Interacciones', key: 'interactions', current: metrics.interactions, icon: Heart },
            { label: 'Seguidores', key: 'followers', current: metrics.followers, icon: UserPlus },
          ].map((metric) => {
            const Icon = metric.icon;
            const change = changes ? changes[metric.key as keyof typeof changes] : null;
            const prev = hasPreviousData ? previousMetrics![metric.key as keyof typeof previousMetrics] : null;

            return (
              <div
                key={metric.key}
                className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-5 hover:border-[#019B77]/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-[#B6B6B6]" />
                  <p className="text-xs text-[#B6B6B6]">{metric.label}</p>
                </div>

                <div className="flex items-end gap-2 mb-2">
                  <span className="text-2xl font-bold text-[#FBFEF2]">{formatNumber(metric.current)}</span>
                  {change && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      change.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {change.isPositive ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {change.value}%
                    </div>
                  )}
                </div>

                {prev !== null && (
                  <p className="text-xs text-[#B6B6B6]">
                    Anterior: <span className="text-[#FBFEF2]">{formatNumber(prev)}</span>
                  </p>
                )}

                {change && (
                  <div className="mt-3 h-2 bg-[#2a2b25] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        change.isPositive ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.abs(parseFloat(change.value)))}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Gráfico Comparativo — solo con data real anterior */}
        {hasPreviousData && comparisonData.length > 0 && (
          <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#FBFEF2] mb-4">Comparacion Visual</h3>
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
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className="text-[#B6B6B6] text-sm">{value}</span>}
                />
                <Bar dataKey="anterior" name="Periodo Anterior" fill="#B6B6B6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Periodo Actual" fill="#019B77" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Resumen de Crecimiento — solo con data real */}
        {hasPreviousData && changes && (
          <div className="bg-gradient-to-r from-[#019B77]/20 to-[#02c494]/20 border border-[#019B77]/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#019B77]/30 rounded-full">
                <Award className="w-6 h-6 text-[#019B77]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#FBFEF2]">Crecimiento Total</h3>
                <p className="text-sm text-[#B6B6B6]">Resumen del periodo analizado</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#019B77]">
                  +{((parseFloat(changes.reach.value) + parseFloat(changes.interactions.value)) / 2).toFixed(0)}%
                </p>
                <p className="text-xs text-[#B6B6B6] mt-1">Engagement Promedio</p>
              </div>
              <div className="text-center border-x border-[rgba(251,254,242,0.1)]">
                <p className="text-3xl font-bold text-[#02c494]">
                  +{formatNumber(metrics.reach - previousMetrics!.reach)}
                </p>
                <p className="text-xs text-[#B6B6B6] mt-1">Nuevo Alcance</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#FBFEF2]">
                  +{formatNumber(metrics.followers - previousMetrics!.followers)}
                </p>
                <p className="text-xs text-[#B6B6B6] mt-1">Nuevos Seguidores</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===============================================================
  // HOJA 2: Evolución Real + AI Insights + Preguntas
  // ===============================================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#02c494]/20 rounded-full border border-[#02c494]/30 mb-4">
          <Activity className="w-5 h-5 text-[#02c494]" />
          <span className="text-sm font-medium text-[#02c494]">Evidenciar Mejoras</span>
        </div>
        <h2 className="text-2xl font-bold text-[#FBFEF2]">Evolucion del Periodo</h2>
        <p className="text-[#B6B6B6] mt-2">Tendencias reales e insights de IA</p>
      </div>

      {/* Gráfico de Evolución Real (datos reales, sin proyecciones fabricadas) */}
      {chartData.length > 0 && (
        <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#FBFEF2]">Tendencia de Alcance</h3>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-[#019B77]" />
              <span className="text-[#B6B6B6]">Alcance Real</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
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
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(251,254,242,0.1)' }} />
              <Line
                type="monotone"
                dataKey="reach"
                stroke="#019B77"
                strokeWidth={2}
                dot={{ r: 3, fill: '#019B77' }}
                activeDot={{ r: 5, fill: '#02c494' }}
                name="Alcance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sección de IA — Análisis de Impacto */}
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#019B77]" />
          <h3 className="text-lg font-bold text-[#FBFEF2]">Analisis de Impacto con IA</h3>
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
                {isGenerating ? 'Generando...' : `Regenerar (${tokensRemaining} consultas)`}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-[#B6B6B6] mb-4">
              Genera un analisis detallado del impacto de tus metricas
            </p>
            {onGenerateInsights && (
              <Button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Analizar Impacto (1 consulta)'}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Sección de Preguntas a la IA */}
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#019B77]/20 rounded-lg border border-[#019B77]/30">
            <MessageCircle className="w-5 h-5 text-[#019B77]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#FBFEF2]">Preguntale a la IA</h3>
            <p className="text-xs text-[#B6B6B6]">
              Cada pregunta consume 1 consulta
            </p>
          </div>
        </div>

        {/* Preguntas sugeridas */}
        <div className="space-y-2 mb-4">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => setCustomQuestion(q)}
              disabled={isAskingQuestion}
              className="block w-full text-left text-sm text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#019B77]/20 rounded-lg px-4 py-2.5 transition-colors cursor-pointer border border-transparent hover:border-[#019B77]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input de pregunta */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customQuestion.trim()) {
                handleSubmitQuestion();
              }
            }}
            placeholder="Escribe tu pregunta sobre las metricas..."
            disabled={isAskingQuestion}
            className="flex-1 bg-[#2a2b25] border border-[rgba(251,254,242,0.2)] rounded-lg px-4 py-2.5 text-sm text-[#FBFEF2] placeholder:text-[#666] focus:outline-none focus:border-[#019B77] transition-colors disabled:opacity-50"
          />
          <Button
            onClick={handleSubmitQuestion}
            disabled={isAskingQuestion || !customQuestion.trim() || tokensRemaining <= 0}
            className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            {isAskingQuestion ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isAskingQuestion ? 'Pensando...' : 'Preguntar'}
          </Button>
        </div>

        <p className="text-xs text-[#666] mt-2">
          Consultas restantes: {tokensRemaining === Infinity ? 'Ilimitadas' : tokensRemaining}
        </p>

        {/* Loading */}
        {isAskingQuestion && !questionAnswer && (
          <div className="mt-4 bg-[#2a2b25] rounded-lg p-4 border border-[rgba(251,254,242,0.1)] flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-[#019B77] animate-spin flex-shrink-0" />
            <p className="text-sm text-[#B6B6B6]">Analizando tus datos para responder...</p>
          </div>
        )}

        {/* Respuesta */}
        {questionAnswer && (
          <div className="mt-4 bg-[#2a2b25] rounded-lg p-4 border border-[#019B77]/30">
            <p className="text-xs text-[#019B77] font-semibold mb-2 uppercase tracking-wider">
              Pregunta: {questionAnswer.question}
            </p>
            <p className="text-sm text-[#FBFEF2] whitespace-pre-line leading-relaxed">
              {questionAnswer.answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
