'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Eye,
  Users,
  Heart,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Instagram,
  Facebook,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Target,
  Zap,
  Award,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlowCard from '@/components/ui/GlowCard';

// Datos reales extraídos del CSV de Instagram Noviembre 2025
const REAL_CHART_DATA = [
  { date: '1 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 156 },
  { date: '2 Nov', reach: 1, interactions: 0, visualizations: 1, followers: 156 },
  { date: '3 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 156 },
  { date: '4 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 156 },
  { date: '5 Nov', reach: 0, interactions: 0, visualizations: 34, followers: 156 },
  { date: '6 Nov', reach: 1, interactions: 0, visualizations: 60, followers: 156 },
  { date: '7 Nov', reach: 50, interactions: 2, visualizations: 78, followers: 157 },
  { date: '8 Nov', reach: 25, interactions: 0, visualizations: 28, followers: 157 },
  { date: '9 Nov', reach: 35, interactions: 1, visualizations: 45, followers: 157 },
  { date: '10 Nov', reach: 65, interactions: 1, visualizations: 78, followers: 158 },
  { date: '11 Nov', reach: 27, interactions: 0, visualizations: 34, followers: 158 },
  { date: '12 Nov', reach: 9, interactions: 1, visualizations: 73, followers: 158 },
  { date: '13 Nov', reach: 24, interactions: 1, visualizations: 31, followers: 158 },
  { date: '14 Nov', reach: 69, interactions: 0, visualizations: 78, followers: 159 },
  { date: '15 Nov', reach: 31, interactions: 2, visualizations: 36, followers: 159 },
  { date: '16 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '17 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '18 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '19 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '20 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '21 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '22 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '23 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '24 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '25 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '26 Nov', reach: 1, interactions: 0, visualizations: 1, followers: 159 },
  { date: '27 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '28 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '29 Nov', reach: 0, interactions: 0, visualizations: 0, followers: 159 },
  { date: '30 Nov', reach: 67, interactions: 4, visualizations: 136, followers: 160 },
];

// Calcular métricas totales
const TOTAL_REACH = REAL_CHART_DATA.reduce((sum, d) => sum + d.reach, 0);
const TOTAL_INTERACTIONS = REAL_CHART_DATA.reduce((sum, d) => sum + d.interactions, 0);
const TOTAL_VISUALIZATIONS = REAL_CHART_DATA.reduce((sum, d) => sum + d.visualizations, 0);
const FOLLOWERS_START = 156;
const FOLLOWERS_END = 160;
const FOLLOWERS_GROWTH = FOLLOWERS_END - FOLLOWERS_START;

// Datos específicos para cada tipo de reporte
const DEMO_REPORTS_DATA: Record<string, any> = {
  'analisis-resultados': {
    title: 'Análisis de Resultados',
    subtitle: 'Instagram - Noviembre 2025',
    dateRange: '1 Nov - 30 Nov 2025',
    platforms: ['instagram'],
    objective: 'analysis',
    metrics: {
      visualizations: TOTAL_VISUALIZATIONS,
      reach: TOTAL_REACH,
      interactions: TOTAL_INTERACTIONS,
      followers: FOLLOWERS_END,
    },
    trends: {
      visualizations: 45.2,
      reach: 38.5,
      interactions: 25.0,
      followers: ((FOLLOWERS_GROWTH / FOLLOWERS_START) * 100).toFixed(1),
    },
    chartData: REAL_CHART_DATA,
    // Métricas de análisis específicas
    engagementRate: ((TOTAL_INTERACTIONS / TOTAL_REACH) * 100).toFixed(2),
    vizToReach: ((TOTAL_REACH / TOTAL_VISUALIZATIONS) * 100).toFixed(1),
    reachToInteractions: ((TOTAL_INTERACTIONS / TOTAL_REACH) * 100).toFixed(1),
    topDays: ['14 Nov', '30 Nov', '10 Nov'],
    insights: `## Análisis de Rendimiento

El análisis del período muestra un patrón de engagement concentrado en días específicos, con picos notables el 14 y 30 de noviembre.

### Métricas Clave:
- **Tasa de Engagement**: ${((TOTAL_INTERACTIONS / TOTAL_REACH) * 100).toFixed(2)}%
- **Conversión Visualizaciones → Alcance**: ${((TOTAL_REACH / TOTAL_VISUALIZATIONS) * 100).toFixed(1)}%
- **Días con mayor actividad**: 14 Nov, 30 Nov, 10 Nov

### Oportunidades:
1. Aumentar frecuencia de publicación en días de semana
2. Replicar tipo de contenido de los días con mejores métricas
3. Optimizar horarios de publicación basado en el engagement`,
  },
  'mejoras-realizadas': {
    title: 'Evidenciar Mejoras',
    subtitle: 'Instagram + Facebook - Noviembre 2025',
    dateRange: '1 Nov - 30 Nov 2025',
    platforms: ['instagram', 'facebook'],
    objective: 'improvements',
    metrics: {
      visualizations: TOTAL_VISUALIZATIONS + 420, // Simulamos FB
      reach: TOTAL_REACH + 180,
      interactions: TOTAL_INTERACTIONS + 8,
      followers: FOLLOWERS_END + 85,
    },
    trends: {
      visualizations: 45.2,
      reach: 38.5,
      interactions: 25.0,
      followers: 2.5,
    },
    chartData: REAL_CHART_DATA,
    // Datos de comparación antes/después
    previousPeriod: {
      visualizations: Math.round((TOTAL_VISUALIZATIONS + 420) * 0.7),
      reach: Math.round((TOTAL_REACH + 180) * 0.75),
      interactions: Math.round((TOTAL_INTERACTIONS + 8) * 0.6),
      followers: FOLLOWERS_START + 85 - 12,
    },
    improvements: [
      { metric: 'Visualizaciones', before: Math.round((TOTAL_VISUALIZATIONS + 420) * 0.7), after: TOTAL_VISUALIZATIONS + 420, change: '+42.8%', positive: true },
      { metric: 'Alcance', before: Math.round((TOTAL_REACH + 180) * 0.75), after: TOTAL_REACH + 180, change: '+33.3%', positive: true },
      { metric: 'Interacciones', before: Math.round((TOTAL_INTERACTIONS + 8) * 0.6), after: TOTAL_INTERACTIONS + 8, change: '+66.7%', positive: true },
      { metric: 'Seguidores', before: FOLLOWERS_START + 85 - 12, after: FOLLOWERS_END + 85, change: '+5.2%', positive: true },
    ],
    insights: `## Evidencia de Mejoras

Comparando con el período anterior, se observa un crecimiento significativo en todas las métricas principales.

### Logros Destacados:
- **Visualizaciones**: +42.8% respecto al período anterior
- **Alcance**: Incremento del 33.3%
- **Interacciones**: Mejora del 66.7%

### Acciones que Generaron Resultados:
1. Implementación de calendario de contenido consistente
2. Optimización de hashtags basada en análisis de competencia
3. Aumento de contenido en formato video/Reels`,
  },
  'reporte-mensual': {
    title: 'Reporte del Mes',
    subtitle: 'Instagram - Noviembre 2025',
    dateRange: '1 Nov - 30 Nov 2025',
    platforms: ['instagram'],
    objective: 'monthly_report',
    metrics: {
      visualizations: TOTAL_VISUALIZATIONS,
      reach: TOTAL_REACH,
      interactions: TOTAL_INTERACTIONS,
      followers: FOLLOWERS_END,
    },
    trends: {
      visualizations: 45.2,
      reach: 38.5,
      interactions: 25.0,
      followers: ((FOLLOWERS_GROWTH / FOLLOWERS_START) * 100).toFixed(1),
    },
    chartData: REAL_CHART_DATA,
    // Datos de contenido para Hoja 2
    contentData: {
      totalPosts: 8,
      totalInteractions: TOTAL_INTERACTIONS,
      frequency: '0.27 posts/día',
      posts: [
        { id: '1', type: 'Reel', title: 'Contenido destacado #1', date: '30 Nov', impressions: 136, reach: 67, likes: 3, comments: 1, shares: 0, saves: 0, engagement: '2.9%' },
        { id: '2', type: 'Image', title: 'Publicación #2', date: '14 Nov', impressions: 78, reach: 69, likes: 0, comments: 0, shares: 0, saves: 0, engagement: '0%' },
        { id: '3', type: 'Reel', title: 'Contenido destacado #3', date: '10 Nov', impressions: 78, reach: 65, likes: 1, comments: 0, shares: 0, saves: 0, engagement: '1.5%' },
        { id: '4', type: 'Image', title: 'Publicación #4', date: '7 Nov', impressions: 78, reach: 50, likes: 2, comments: 0, shares: 0, saves: 0, engagement: '4.0%' },
        { id: '5', type: 'Carousel', title: 'Publicación #5', date: '9 Nov', impressions: 45, reach: 35, likes: 1, comments: 0, shares: 0, saves: 0, engagement: '2.9%' },
      ],
    },
    insights: `## Resumen Ejecutivo

Noviembre 2025 mostró actividad concentrada en la primera quincena, con oportunidades claras de mejora en frecuencia de publicación.

### Highlights del Mes:
- **Alcance total**: ${TOTAL_REACH} usuarios únicos
- **Interacciones totales**: ${TOTAL_INTERACTIONS}
- **Nuevos seguidores**: +${FOLLOWERS_GROWTH}

### Recomendaciones:
1. Aumentar frecuencia de publicación a mínimo 3 posts/semana
2. El contenido de los días 7, 10, 14 y 30 generó el mayor engagement
3. Explorar formatos de Reels para aumentar visualizaciones`,
    contentInsights: `## Análisis de Contenido

La frecuencia de publicación fue baja (8 posts en el mes), concentrada principalmente en la primera quincena.

### Formatos con Mejor Rendimiento:
- **Reels**: 2.9% engagement promedio
- **Images**: 2.0% engagement promedio

### Recomendaciones:
1. Aumentar frecuencia a 12-15 posts mensuales
2. Priorizar formato Reels
3. Mantener consistencia en horarios de publicación`,
  },
};

// Componente para formatear números
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default function DemoReportPage() {
  const params = useParams();
  const reportId = params?.id as string;
  const [currentSheet, setCurrentSheet] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState<'reach' | 'interactions' | 'visualizations' | 'followers'>('reach');

  const reportData = DEMO_REPORTS_DATA[reportId];

  if (!reportData) {
    notFound();
  }

  const isAnalysis = reportData.objective === 'analysis';
  const isImprovements = reportData.objective === 'improvements';
  const isMonthlyReport = reportData.objective === 'monthly_report';

  const metrics = [
    { key: 'visualizations', label: 'Visualizaciones', value: reportData.metrics.visualizations, trend: reportData.trends.visualizations, icon: Eye, color: 'purple' },
    { key: 'reach', label: 'Alcance', value: reportData.metrics.reach, trend: reportData.trends.reach, icon: Users, color: 'blue' },
    { key: 'interactions', label: 'Interacciones', value: reportData.metrics.interactions, trend: reportData.trends.interactions, icon: Heart, color: 'pink' },
    { key: 'followers', label: 'Seguidores', value: reportData.metrics.followers, trend: reportData.trends.followers, icon: UserPlus, color: 'green' },
  ];

  // Filtrar datos del gráfico para mostrar solo días con actividad
  const activeChartData = reportData.chartData.filter((d: any) => d.reach > 0 || d.visualizations > 0);
  const maxValue = Math.max(...activeChartData.map((d: any) => d[selectedMetric]), 1);

  const colorClasses: Record<string, { bg: string; text: string; border: string; bar: string }> = {
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', bar: 'bg-purple-500' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', bar: 'bg-blue-500' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', bar: 'bg-pink-500' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', bar: 'bg-green-500' },
  };

  const objectiveConfig: Record<string, { icon: any; color: string; label: string }> = {
    analysis: { icon: BarChart3, color: 'blue', label: 'Análisis de Resultados' },
    improvements: { icon: TrendingUp, color: 'green', label: 'Evidenciar Mejoras' },
    monthly_report: { icon: Target, color: 'purple', label: 'Reporte del Mes' },
  };

  const config = objectiveConfig[reportData.objective];
  const ObjectiveIcon = config.icon;

  return (
    <div className="min-h-screen bg-[#11120D]">
      {/* Banner Demo */}
      <div className="bg-gradient-to-r from-[#019B77] to-[#02c494] text-[#FBFEF2] py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Estás viendo un reporte de ejemplo</span>
          </div>
          <Link href="/register">
            <Button size="sm" className="bg-white text-[#019B77] hover:bg-white/90 font-medium">
              <UserPlus className="mr-2 h-4 w-4" />
              Crear mi cuenta gratis
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#11120D] border-b border-[rgba(251,254,242,0.1)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/demo" className="flex items-center gap-3 group">
                <Image src="/Logo_DataPal.png" alt="DataPal" width={40} height={40} className="object-contain invert" />
                <span className="text-xl font-bold text-[#FBFEF2] font-[var(--font-roboto-mono)] tracking-tight">DataPal</span>
              </Link>
              <span className="text-[#B6B6B6]">/</span>
              <Link href="/demo" className="text-[#B6B6B6] hover:text-[#FBFEF2] transition-colors">Demo</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-[#019B77] text-[#019B77] hover:bg-[#019B77]/10">Iniciar sesión</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del Reporte */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/demo" className="text-[#B6B6B6] hover:text-[#FBFEF2] transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${colorClasses[config.color].bg} border ${colorClasses[config.color].border}`}>
              <ObjectiveIcon className={`h-4 w-4 ${colorClasses[config.color].text}`} />
              <span className={`text-sm font-medium ${colorClasses[config.color].text}`}>{config.label}</span>
            </div>
            {reportData.platforms.map((platform: string) => (
              <div key={platform} className={`flex items-center gap-2 px-3 py-1 rounded-full ${platform === 'instagram' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-blue-500/20 border border-blue-500/30'}`}>
                {platform === 'instagram' ? <Instagram className="h-4 w-4 text-purple-400" /> : <Facebook className="h-4 w-4 text-blue-400" />}
                <span className={`text-sm ${platform === 'instagram' ? 'text-purple-400' : 'text-blue-400'}`}>{platform === 'instagram' ? 'Instagram' : 'Facebook'}</span>
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-[#FBFEF2] mb-2">{reportData.title}</h1>
          <p className="text-[#B6B6B6]">{reportData.subtitle}</p>
          <div className="flex items-center gap-2 text-[#B6B6B6] mt-2">
            <Calendar className="h-4 w-4" />
            <span>{reportData.dateRange}</span>
          </div>
        </div>

        {/* Sheet Navigation - Solo para Reporte Mensual */}
        {isMonthlyReport && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <button onClick={() => setCurrentSheet(0)} disabled={currentSheet === 0} className="p-2 rounded-lg bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] text-[#B6B6B6] hover:text-[#FBFEF2] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1b16] border border-[rgba(251,254,242,0.1)]">
              <span className="text-sm text-[#B6B6B6]">Hoja {currentSheet + 1} de 2</span>
            </div>
            <button onClick={() => setCurrentSheet(1)} disabled={currentSheet === 1} className="p-2 rounded-lg bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] text-[#B6B6B6] hover:text-[#FBFEF2] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* CONTENIDO SEGÚN TIPO DE REPORTE */}

        {/* === ANÁLISIS DE RESULTADOS === */}
        {isAnalysis && (
          <>
            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const colors = colorClasses[metric.color];
                return (
                  <GlowCard key={metric.key}>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                          <Icon className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <span className="text-sm text-[#B6B6B6]">{metric.label}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-[#FBFEF2]">{formatNumber(metric.value)}</span>
                        <div className="flex items-center gap-1 text-[#019B77] text-sm">
                          <TrendingUp className="h-4 w-4" />
                          <span>+{metric.trend}%</span>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                );
              })}
            </div>

            {/* Análisis de Funnel */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <GlowCard>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#019B77]" />
                    Análisis de Conversión
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#11120D] border border-[rgba(251,254,242,0.05)]">
                      <span className="text-[#B6B6B6]">Tasa de Engagement</span>
                      <span className="text-xl font-bold text-[#019B77]">{reportData.engagementRate}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#11120D] border border-[rgba(251,254,242,0.05)]">
                      <span className="text-[#B6B6B6]">Visualizaciones → Alcance</span>
                      <span className="text-xl font-bold text-blue-400">{reportData.vizToReach}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#11120D] border border-[rgba(251,254,242,0.05)]">
                      <span className="text-[#B6B6B6]">Alcance → Interacciones</span>
                      <span className="text-xl font-bold text-pink-400">{reportData.reachToInteractions}%</span>
                    </div>
                  </div>
                </div>
              </GlowCard>

              <GlowCard>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#019B77]" />
                    Días con Mayor Rendimiento
                  </h3>
                  <div className="space-y-3">
                    {reportData.topDays.map((day: string, index: number) => (
                      <div key={day} className="flex items-center gap-3 p-3 rounded-lg bg-[#11120D] border border-[rgba(251,254,242,0.05)]">
                        <div className="w-8 h-8 rounded-full bg-[#019B77]/20 border border-[#019B77]/30 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#019B77]">{index + 1}</span>
                        </div>
                        <span className="text-[#FBFEF2] font-medium">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </div>

            {/* Gráfico */}
            <GlowCard className="mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h3 className="text-lg font-semibold text-[#FBFEF2]">Evolución del Periodo</h3>
                  <div className="flex gap-2 flex-wrap">
                    {(['reach', 'visualizations', 'interactions'] as const).map((metric) => {
                      const conf: Record<string, { label: string; color: string }> = {
                        reach: { label: 'Alcance', color: 'blue' },
                        visualizations: { label: 'Visualizaciones', color: 'purple' },
                        interactions: { label: 'Interacciones', color: 'pink' },
                      };
                      const { label, color } = conf[metric];
                      const isSelected = selectedMetric === metric;
                      const colors = colorClasses[color];
                      return (
                        <button key={metric} onClick={() => setSelectedMetric(metric)} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${isSelected ? `${colors.bg} ${colors.text} border ${colors.border}` : 'text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16]'}`}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-1 px-2">
                  {activeChartData.map((day: any, index: number) => {
                    const value = day[selectedMetric];
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const colors = colorClasses[selectedMetric === 'reach' ? 'blue' : selectedMetric === 'visualizations' ? 'purple' : 'pink'];
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs text-[#B6B6B6] opacity-0 group-hover:opacity-100 transition-opacity">{value}</div>
                        <div className={`w-full rounded-t-lg transition-all duration-300 ${colors.bar} group-hover:opacity-80`} style={{ height: `${Math.max(height, 4)}%` }} />
                        <span className="text-[10px] text-[#B6B6B6] whitespace-nowrap rotate-45 origin-left mt-1">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlowCard>
          </>
        )}

        {/* === EVIDENCIAR MEJORAS === */}
        {isImprovements && (
          <>
            {/* Comparación Antes/Después */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {reportData.improvements.map((item: any) => (
                <GlowCard key={item.metric} glowColor={item.positive ? '1, 155, 119' : '239, 68, 68'}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-[#B6B6B6]">{item.metric}</span>
                      <div className={`flex items-center gap-1 text-sm font-medium ${item.positive ? 'text-[#019B77]' : 'text-red-400'}`}>
                        {item.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {item.change}
                      </div>
                    </div>
                    <div className="flex items-end gap-4">
                      <div>
                        <p className="text-xs text-[#B6B6B6] mb-1">Antes</p>
                        <p className="text-lg text-[#B6B6B6]">{formatNumber(item.before)}</p>
                      </div>
                      <div className="text-[#B6B6B6]">→</div>
                      <div>
                        <p className="text-xs text-[#B6B6B6] mb-1">Después</p>
                        <p className="text-2xl font-bold text-[#FBFEF2]">{formatNumber(item.after)}</p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>

            {/* Gráfico de Evolución */}
            <GlowCard className="mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h3 className="text-lg font-semibold text-[#FBFEF2]">Evolución Durante el Periodo</h3>
                  <div className="flex gap-2 flex-wrap">
                    {(['reach', 'visualizations', 'interactions'] as const).map((metric) => {
                      const conf: Record<string, { label: string; color: string }> = {
                        reach: { label: 'Alcance', color: 'blue' },
                        visualizations: { label: 'Visualizaciones', color: 'purple' },
                        interactions: { label: 'Interacciones', color: 'pink' },
                      };
                      const { label, color } = conf[metric];
                      const isSelected = selectedMetric === metric;
                      const colors = colorClasses[color];
                      return (
                        <button key={metric} onClick={() => setSelectedMetric(metric)} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${isSelected ? `${colors.bg} ${colors.text} border ${colors.border}` : 'text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16]'}`}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-1 px-2">
                  {activeChartData.map((day: any, index: number) => {
                    const value = day[selectedMetric];
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const colors = colorClasses[selectedMetric === 'reach' ? 'blue' : selectedMetric === 'visualizations' ? 'purple' : 'pink'];
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs text-[#B6B6B6] opacity-0 group-hover:opacity-100 transition-opacity">{value}</div>
                        <div className={`w-full rounded-t-lg transition-all duration-300 ${colors.bar} group-hover:opacity-80`} style={{ height: `${Math.max(height, 4)}%` }} />
                        <span className="text-[10px] text-[#B6B6B6] whitespace-nowrap rotate-45 origin-left mt-1">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlowCard>
          </>
        )}

        {/* === REPORTE MENSUAL === */}
        {isMonthlyReport && currentSheet === 0 && (
          <>
            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const colors = colorClasses[metric.color];
                return (
                  <GlowCard key={metric.key}>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                          <Icon className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <span className="text-sm text-[#B6B6B6]">{metric.label}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-[#FBFEF2]">{formatNumber(metric.value)}</span>
                        <div className="flex items-center gap-1 text-[#019B77] text-sm">
                          <TrendingUp className="h-4 w-4" />
                          <span>+{metric.trend}%</span>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                );
              })}
            </div>

            {/* Gráfico */}
            <GlowCard className="mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h3 className="text-lg font-semibold text-[#FBFEF2]">Evolución del Periodo</h3>
                  <div className="flex gap-2 flex-wrap">
                    {(['reach', 'visualizations', 'interactions', 'followers'] as const).map((metric) => {
                      const conf: Record<string, { label: string; color: string }> = {
                        reach: { label: 'Alcance', color: 'blue' },
                        visualizations: { label: 'Visualizaciones', color: 'purple' },
                        interactions: { label: 'Interacciones', color: 'pink' },
                        followers: { label: 'Seguidores', color: 'green' },
                      };
                      const { label, color } = conf[metric];
                      const isSelected = selectedMetric === metric;
                      const colors = colorClasses[color];
                      return (
                        <button key={metric} onClick={() => setSelectedMetric(metric)} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${isSelected ? `${colors.bg} ${colors.text} border ${colors.border}` : 'text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16]'}`}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-1 px-2">
                  {activeChartData.map((day: any, index: number) => {
                    const value = day[selectedMetric];
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const color = selectedMetric === 'reach' ? 'blue' : selectedMetric === 'visualizations' ? 'purple' : selectedMetric === 'interactions' ? 'pink' : 'green';
                    const colors = colorClasses[color];
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs text-[#B6B6B6] opacity-0 group-hover:opacity-100 transition-opacity">{value}</div>
                        <div className={`w-full rounded-t-lg transition-all duration-300 ${colors.bar} group-hover:opacity-80`} style={{ height: `${Math.max(height, 4)}%` }} />
                        <span className="text-[10px] text-[#B6B6B6] whitespace-nowrap rotate-45 origin-left mt-1">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlowCard>
          </>
        )}

        {/* Hoja 2 - Contenido (solo para Reporte Mensual) */}
        {isMonthlyReport && currentSheet === 1 && reportData.contentData && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <GlowCard>
                <div className="p-6 text-center">
                  <p className="text-sm text-[#B6B6B6] mb-2">Publicaciones</p>
                  <p className="text-4xl font-bold text-[#019B77]">{reportData.contentData.totalPosts}</p>
                </div>
              </GlowCard>
              <GlowCard>
                <div className="p-6 text-center">
                  <p className="text-sm text-[#B6B6B6] mb-2">Interacciones</p>
                  <p className="text-4xl font-bold text-[#019B77]">{reportData.contentData.totalInteractions}</p>
                </div>
              </GlowCard>
              <GlowCard>
                <div className="p-6 text-center">
                  <p className="text-sm text-[#B6B6B6] mb-2">Frecuencia</p>
                  <p className="text-4xl font-bold text-[#019B77]">{reportData.contentData.frequency}</p>
                </div>
              </GlowCard>
            </div>

            <GlowCard className="mb-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#FBFEF2] mb-6">Top Contenido</h3>
                <div className="space-y-4">
                  {reportData.contentData.posts.map((post: any, index: number) => (
                    <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#11120D] border border-[rgba(251,254,242,0.05)]">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-400">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30">{post.type}</span>
                          <span className="text-xs text-[#B6B6B6]">{post.date}</span>
                        </div>
                        <p className="text-sm text-[#FBFEF2]">{post.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#019B77]">{post.engagement}</p>
                        <p className="text-xs text-[#B6B6B6]">engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>
          </>
        )}

        {/* Insights de IA - Para todos los tipos */}
        <div className="relative rounded-2xl border-2 border-[#019B77] bg-[#1a1b16] overflow-hidden transition-all duration-300 hover:border-[#02c494] hover:shadow-[0_0_30px_rgba(1,155,119,0.3)] mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#019B77]/10 via-transparent to-[#019B77]/10 pointer-events-none" />
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-[#019B77] to-[#019B77]/60 p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-[#11120D]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#FBFEF2]">Insights de IA</h3>
                <p className="text-sm text-[#B6B6B6] mt-0.5">Powered by <span className="text-[#019B77] font-medium">Claude Sonnet 4</span> by Anthropic</p>
              </div>
            </div>
            <div className="text-[#FBFEF2]/90 whitespace-pre-wrap leading-relaxed">
              {(isMonthlyReport && currentSheet === 1 ? reportData.contentInsights : reportData.insights).split('\n').map((line: string, i: number) => {
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-[#FBFEF2] mt-4 mb-3">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-[#019B77] mt-4 mb-2">{line.replace('### ', '')}</h3>;
                if (line.startsWith('- **')) {
                  const parts = line.replace('- **', '').split('**:');
                  return <p key={i} className="ml-4 my-1.5 text-[#FBFEF2]/90">• <strong className="text-[#FBFEF2] font-semibold">{parts[0]}</strong>:{parts[1]}</p>;
                }
                if (line.match(/^\d\./)) return <p key={i} className="ml-4 my-1.5 text-[#FBFEF2]/90">{line}</p>;
                return line ? <p key={i} className="my-2 text-[#FBFEF2]/90">{line}</p> : null;
              })}
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <GlowCard glowColor="1, 155, 119">
          <div className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-[#019B77] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#FBFEF2] mb-2">¿Te gustó lo que viste?</h2>
            <p className="text-[#B6B6B6] mb-6 max-w-lg mx-auto">Crea tu cuenta gratuita y genera reportes profesionales con tus propios datos de Instagram y Facebook.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Crear mi cuenta gratis
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-[#019B77] text-[#019B77] hover:bg-[#019B77]/10">Ver planes y precios</Button>
              </Link>
            </div>
          </div>
        </GlowCard>
      </main>
    </div>
  );
}
