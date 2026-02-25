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

// Datos demo: cuenta de Instagram activa - Enero 2026
const DEMO_CHART_DATA = [
  { date: '1 Ene', reach: 1250, interactions: 85, visualizations: 2100, followers: 8420 },
  { date: '2 Ene', reach: 980, interactions: 62, visualizations: 1650, followers: 8425 },
  { date: '3 Ene', reach: 3200, interactions: 245, visualizations: 5400, followers: 8438 },
  { date: '4 Ene', reach: 2100, interactions: 156, visualizations: 3500, followers: 8445 },
  { date: '5 Ene', reach: 1450, interactions: 98, visualizations: 2300, followers: 8450 },
  { date: '6 Ene', reach: 1100, interactions: 72, visualizations: 1800, followers: 8452 },
  { date: '7 Ene', reach: 2800, interactions: 210, visualizations: 4700, followers: 8462 },
  { date: '8 Ene', reach: 1900, interactions: 134, visualizations: 3100, followers: 8468 },
  { date: '9 Ene', reach: 1350, interactions: 89, visualizations: 2200, followers: 8472 },
  { date: '10 Ene', reach: 4500, interactions: 380, visualizations: 7800, followers: 8490 },
  { date: '11 Ene', reach: 3200, interactions: 265, visualizations: 5500, followers: 8502 },
  { date: '12 Ene', reach: 1800, interactions: 120, visualizations: 2900, followers: 8508 },
  { date: '13 Ene', reach: 1600, interactions: 105, visualizations: 2600, followers: 8512 },
  { date: '14 Ene', reach: 2400, interactions: 178, visualizations: 4000, followers: 8520 },
  { date: '15 Ene', reach: 1700, interactions: 115, visualizations: 2800, followers: 8525 },
  { date: '16 Ene', reach: 1200, interactions: 78, visualizations: 1950, followers: 8528 },
  { date: '17 Ene', reach: 5200, interactions: 420, visualizations: 9100, followers: 8550 },
  { date: '18 Ene', reach: 3800, interactions: 310, visualizations: 6400, followers: 8565 },
  { date: '19 Ene', reach: 2200, interactions: 165, visualizations: 3600, followers: 8572 },
  { date: '20 Ene', reach: 1500, interactions: 95, visualizations: 2400, followers: 8578 },
  { date: '21 Ene', reach: 2600, interactions: 195, visualizations: 4300, followers: 8588 },
  { date: '22 Ene', reach: 1800, interactions: 128, visualizations: 2950, followers: 8594 },
  { date: '23 Ene', reach: 1400, interactions: 92, visualizations: 2250, followers: 8598 },
  { date: '24 Ene', reach: 3600, interactions: 290, visualizations: 6100, followers: 8612 },
  { date: '25 Ene', reach: 2500, interactions: 185, visualizations: 4200, followers: 8622 },
  { date: '26 Ene', reach: 1600, interactions: 108, visualizations: 2650, followers: 8628 },
  { date: '27 Ene', reach: 1300, interactions: 82, visualizations: 2100, followers: 8632 },
  { date: '28 Ene', reach: 2900, interactions: 225, visualizations: 4800, followers: 8645 },
  { date: '29 Ene', reach: 2100, interactions: 155, visualizations: 3400, followers: 8652 },
  { date: '30 Ene', reach: 1500, interactions: 96, visualizations: 2450, followers: 8658 },
  { date: '31 Ene', reach: 3400, interactions: 275, visualizations: 5700, followers: 8675 },
];

// Métricas totales calculadas
const TOTAL_REACH = 69930;
const TOTAL_INTERACTIONS = 5259;
const TOTAL_VISUALIZATIONS = 116950;
const FOLLOWERS_START = 8420;
const FOLLOWERS_END = 8675;
const FOLLOWERS_GROWTH = 255;

// Datos específicos para cada tipo de reporte
const DEMO_REPORTS_DATA: Record<string, any> = {
  'analisis-resultados': {
    title: 'Análisis de Resultados',
    subtitle: 'Instagram - Enero 2026',
    dateRange: '1 Ene - 31 Ene 2026',
    platforms: ['instagram'],
    objective: 'analysis',
    metrics: {
      visualizations: TOTAL_VISUALIZATIONS,
      reach: TOTAL_REACH,
      interactions: TOTAL_INTERACTIONS,
      followers: FOLLOWERS_END,
    },
    trends: {
      visualizations: 32.4,
      reach: 28.7,
      interactions: 41.3,
      followers: 3.0,
    },
    chartData: DEMO_CHART_DATA,
    engagementRate: '7.52',
    vizToReach: '59.8',
    reachToInteractions: '7.5',
    topDays: ['17 Ene', '10 Ene', '24 Ene'],
    insights: `## Análisis de Rendimiento

El análisis de enero muestra un engagement consistente con picos claros los viernes (días 10, 17 y 24), indicando un patrón de consumo semanal predecible.

### Métricas Clave:
- **Tasa de Engagement**: 7.52% — por encima del promedio de la industria (3-5%)
- **Conversión Visualizaciones → Alcance**: 59.8% — alto ratio de alcance único
- **Días con mayor actividad**: Viernes 10, 17 y 24 de enero

### Oportunidades:
1. Concentrar publicaciones clave los jueves y viernes para maximizar alcance
2. El contenido tipo Reel genera 3.2x más interacciones que imágenes estáticas
3. Las publicaciones entre 12:00-14:00 obtienen 45% más engagement`,
  },
  'mejoras-realizadas': {
    title: 'Evidenciar Mejoras',
    subtitle: 'Instagram + Facebook - Enero 2026',
    dateRange: '1 Ene - 31 Ene 2026',
    platforms: ['instagram', 'facebook'],
    objective: 'improvements',
    metrics: {
      visualizations: 161700,
      reach: 97930,
      interactions: 7013,
      followers: 11015,
    },
    trends: {
      visualizations: 38.9,
      reach: 28.2,
      interactions: 53.8,
      followers: 4.6,
    },
    chartData: DEMO_CHART_DATA,
    previousPeriod: {
      visualizations: 116400,
      reach: 76400,
      interactions: 4560,
      followers: 10530,
    },
    improvements: [
      { metric: 'Visualizaciones', before: 116400, after: 161700, change: '+38.9%', positive: true },
      { metric: 'Alcance', before: 76400, after: 97930, change: '+28.2%', positive: true },
      { metric: 'Interacciones', before: 4560, after: 7013, change: '+53.8%', positive: true },
      { metric: 'Seguidores', before: 10530, after: 11015, change: '+4.6%', positive: true },
    ],
    insights: `## Evidencia de Mejoras

Comparando enero con diciembre, se observa crecimiento en todas las métricas. El mayor avance fue en interacciones (+53.8%), directamente atribuible al cambio de estrategia de contenido.

### Logros Destacados:
- **Interacciones**: +53.8% — el mayor crecimiento del período
- **Visualizaciones**: +38.9% gracias al aumento de Reels
- **Alcance**: +28.2% con mejor distribución algorítmica

### Acciones que Generaron Resultados:
1. Migración de 60% del contenido a formato Reels (antes: 30%)
2. Implementación de calendario editorial con 4 publicaciones semanales
3. Uso estratégico de hashtags de nicho (10-15 por publicación)
4. Publicación en horarios optimizados según datos de audiencia`,
  },
  'reporte-mensual': {
    title: 'Reporte del Mes',
    subtitle: 'Instagram - Enero 2026',
    dateRange: '1 Ene - 31 Ene 2026',
    platforms: ['instagram'],
    objective: 'monthly_report',
    metrics: {
      visualizations: TOTAL_VISUALIZATIONS,
      reach: TOTAL_REACH,
      interactions: TOTAL_INTERACTIONS,
      followers: FOLLOWERS_END,
    },
    trends: {
      visualizations: 32.4,
      reach: 28.7,
      interactions: 41.3,
      followers: 3.0,
    },
    chartData: DEMO_CHART_DATA,
    contentData: {
      totalPosts: 18,
      totalInteractions: TOTAL_INTERACTIONS,
      frequency: '0.58 posts/día',
      posts: [
        { id: '1', type: 'Reel', title: '5 errores comunes en marketing digital', date: '17 Ene', impressions: 9100, reach: 5200, likes: 312, comments: 47, shares: 38, saves: 23, engagement: '8.1%' },
        { id: '2', type: 'Reel', title: 'Tendencias de redes sociales 2026', date: '10 Ene', impressions: 7800, reach: 4500, likes: 285, comments: 42, shares: 31, saves: 22, engagement: '8.4%' },
        { id: '3', type: 'Carousel', title: 'Guía: Métricas que importan en IG', date: '24 Ene', impressions: 6100, reach: 3600, likes: 198, comments: 35, shares: 42, saves: 15, engagement: '8.1%' },
        { id: '4', type: 'Reel', title: 'Antes vs después de usar DataPal', date: '28 Ene', impressions: 4800, reach: 2900, likes: 165, comments: 28, shares: 18, saves: 14, engagement: '7.8%' },
        { id: '5', type: 'Image', title: 'Infografía: ROI en redes sociales', date: '3 Ene', impressions: 5400, reach: 3200, likes: 180, comments: 32, shares: 21, saves: 12, engagement: '7.7%' },
      ],
    },
    insights: `## Resumen Ejecutivo

Enero 2026 fue un mes sólido con crecimiento consistente en todas las métricas. La estrategia de contenido basada en Reels educativos demostró ser la más efectiva.

### Highlights del Mes:
- **Alcance total**: 69,930 usuarios únicos alcanzados
- **Interacciones totales**: 5,259 (promedio 293/publicación)
- **Nuevos seguidores**: +255 (crecimiento del 3.0%)

### Recomendaciones:
1. Mantener frecuencia de 4+ publicaciones semanales
2. Priorizar Reels educativos — generan 3.2x más engagement que imágenes
3. Los viernes son el mejor día para contenido nuevo (picos en alcance)`,
    contentInsights: `## Análisis de Contenido

Se publicaron 18 piezas de contenido con un engagement promedio de 7.9%, significativamente por encima del benchmark de la industria (3-5%).

### Formatos con Mejor Rendimiento:
- **Reels**: 8.1% engagement promedio (10 publicaciones)
- **Carousels**: 7.8% engagement promedio (4 publicaciones)
- **Imágenes**: 6.5% engagement promedio (4 publicaciones)

### Top Contenido:
- **"Tendencias de redes sociales 2026"** obtuvo 8.4% engagement y fue el contenido con mayor alcance del mes (4,500 usuarios)
- Los Reels educativos superan consistentemente a los promocionales

### Recomendaciones:
1. Aumentar proporción de Reels a 65-70% del contenido total
2. Incorporar Carousels educativos como segundo formato prioritario
3. Publicar contenido clave entre 12:00-14:00 (hora de mayor engagement)`,
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
