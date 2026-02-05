'use client';

import { useState, useEffect } from 'react';
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
  Calendar,
  Instagram,
  Facebook,
  Sparkles,
  Play,
  Image as ImageIcon,
  Video,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlowCard from '@/components/ui/GlowCard';

// Datos de ejemplo para cada reporte demo
const DEMO_REPORTS_DATA: Record<string, any> = {
  'enero-2025': {
    title: 'Reporte Mensual - Enero 2025',
    dateRange: '1 Ene - 31 Ene 2025',
    platforms: ['instagram'],
    metrics: {
      visualizations: 1571000,
      reach: 785500,
      interactions: 66350,
      followers: 17850,
    },
    trends: {
      visualizations: 229.6,
      reach: 229.6,
      interactions: 361.2,
      followers: 15.8,
    },
    chartData: [
      { date: '1 Ene', reach: 12500, interactions: 850, visualizations: 25000, followers: 520 },
      { date: '5 Ene', reach: 15800, interactions: 1180, visualizations: 31600, followers: 580 },
      { date: '10 Ene', reach: 18800, interactions: 1480, visualizations: 37600, followers: 620 },
      { date: '15 Ene', reach: 24200, interactions: 2020, visualizations: 48400, followers: 680 },
      { date: '20 Ene', reach: 28900, interactions: 2480, visualizations: 57800, followers: 740 },
      { date: '25 Ene', reach: 35200, interactions: 3120, visualizations: 70400, followers: 820 },
      { date: '31 Ene', reach: 41200, interactions: 3920, visualizations: 82400, followers: 890 },
    ],
    topContent: [
      { type: 'Reel', title: 'Detrás de cámaras: Un día en la agencia', impressions: 156000, engagement: '3.8%', icon: Video },
      { type: 'Reel', title: '5 tips para mejorar tu engagement', impressions: 125000, engagement: '4.2%', icon: Video },
      { type: 'Carousel', title: 'Resultados del mes: Caso de estudio', impressions: 89000, engagement: '3.6%', icon: LayoutGrid },
      { type: 'Image', title: 'Quote motivacional del lunes', impressions: 67000, engagement: '2.9%', icon: ImageIcon },
      { type: 'Reel', title: 'Tendencias de marketing 2025', impressions: 54000, engagement: '3.1%', icon: Video },
    ],
    insights: `## Resumen Ejecutivo

Enero 2025 fue un mes excepcional con un crecimiento sostenido en todas las métricas principales. El alcance aumentó un 229% desde el inicio del mes, impulsado principalmente por el contenido de video.

### Highlights del Mes:
- **Alcance total**: 785,500 usuarios únicos
- **Interacciones totales**: 66,350 (+361% de crecimiento)
- **Nuevos seguidores**: +2,430 (15.8% de crecimiento)

### Recomendaciones:
1. Continuar con la estrategia de Reels, que muestra 2x mejor rendimiento
2. Publicar más contenido tipo "behind the scenes"
3. Mantener frecuencia de 2-3 posts semanales`,
  },
  'diciembre-2024': {
    title: 'Reporte Mensual - Diciembre 2024',
    dateRange: '1 Dic - 31 Dic 2024',
    platforms: ['instagram', 'facebook'],
    metrics: {
      visualizations: 2340000,
      reach: 1170000,
      interactions: 98500,
      followers: 24300,
    },
    trends: {
      visualizations: 185.4,
      reach: 178.2,
      interactions: 245.8,
      followers: 22.4,
    },
    chartData: [
      { date: '1 Dic', reach: 28000, interactions: 2100, visualizations: 56000, followers: 720 },
      { date: '7 Dic', reach: 35000, interactions: 2800, visualizations: 70000, followers: 780 },
      { date: '14 Dic', reach: 42000, interactions: 3500, visualizations: 84000, followers: 850 },
      { date: '21 Dic', reach: 52000, interactions: 4200, visualizations: 104000, followers: 920 },
      { date: '25 Dic', reach: 48000, interactions: 3800, visualizations: 96000, followers: 880 },
      { date: '28 Dic', reach: 58000, interactions: 4800, visualizations: 116000, followers: 980 },
      { date: '31 Dic', reach: 62000, interactions: 5200, visualizations: 124000, followers: 1050 },
    ],
    topContent: [
      { type: 'Reel', title: 'Resumen del año 2024', impressions: 245000, engagement: '4.5%', icon: Video },
      { type: 'Carousel', title: 'Top 10 momentos del año', impressions: 189000, engagement: '3.9%', icon: LayoutGrid },
      { type: 'Reel', title: 'Mensaje de fin de año', impressions: 156000, engagement: '5.2%', icon: Video },
      { type: 'Image', title: 'Felices fiestas - Branding', impressions: 123000, engagement: '3.4%', icon: ImageIcon },
      { type: 'Reel', title: 'Predicciones 2025', impressions: 98000, engagement: '3.8%', icon: Video },
    ],
    insights: `## Resumen Ejecutivo

Diciembre 2024 cerró el año con números récord, impulsado por contenido festivo y el resumen anual que generó alto engagement.

### Highlights del Mes:
- **Alcance total**: 1,170,000 usuarios únicos (combinado IG + FB)
- **Interacciones totales**: 98,500 (+245% vs noviembre)
- **Nuevos seguidores**: +4,850 (22.4% de crecimiento)

### Recomendaciones:
1. Replicar estrategia de contenido "resumen" para fechas especiales
2. Mantener presencia en ambas plataformas, FB mostró buen rendimiento
3. Capitalizar el momentum de año nuevo con contenido de propósitos/metas`,
  },
  'noviembre-2024': {
    title: 'Análisis Q4 - Noviembre',
    dateRange: '1 Nov - 30 Nov 2024',
    platforms: ['facebook'],
    metrics: {
      visualizations: 890000,
      reach: 445000,
      interactions: 38200,
      followers: 12400,
    },
    trends: {
      visualizations: 125.3,
      reach: 118.7,
      interactions: 156.4,
      followers: 18.2,
    },
    chartData: [
      { date: '1 Nov', reach: 12000, interactions: 980, visualizations: 24000, followers: 380 },
      { date: '7 Nov', reach: 14500, interactions: 1150, visualizations: 29000, followers: 410 },
      { date: '14 Nov', reach: 16800, interactions: 1380, visualizations: 33600, followers: 440 },
      { date: '21 Nov', reach: 19200, interactions: 1620, visualizations: 38400, followers: 480 },
      { date: '25 Nov', reach: 22500, interactions: 1950, visualizations: 45000, followers: 520 },
      { date: '30 Nov', reach: 24800, interactions: 2180, visualizations: 49600, followers: 560 },
    ],
    topContent: [
      { type: 'Video', title: 'Tutorial: Configuración de campaña', impressions: 78000, engagement: '3.2%', icon: Video },
      { type: 'Carousel', title: 'Caso de éxito: Cliente retail', impressions: 65000, engagement: '2.8%', icon: LayoutGrid },
      { type: 'Image', title: 'Infografía: Tendencias Q4', impressions: 52000, engagement: '2.5%', icon: ImageIcon },
      { type: 'Video', title: 'Webinar: Estrategias de fin de año', impressions: 48000, engagement: '4.1%', icon: Video },
      { type: 'Image', title: 'Promoción Black Friday', impressions: 42000, engagement: '3.5%', icon: ImageIcon },
    ],
    insights: `## Resumen Ejecutivo

Noviembre mostró un crecimiento constante en Facebook, preparando el terreno para las campañas de fin de año.

### Highlights del Mes:
- **Alcance total**: 445,000 usuarios en Facebook
- **Interacciones totales**: 38,200 (+156% de crecimiento)
- **Nuevos seguidores**: +1,890 (18.2% de crecimiento)

### Recomendaciones:
1. El contenido educativo (tutoriales, webinars) genera mayor engagement
2. Preparar contenido para Black Friday con anticipación
3. Considerar expandir a Instagram para mayor alcance`,
  },
  'campana-blackfriday': {
    title: 'Campaña Black Friday 2024',
    dateRange: '20 Nov - 30 Nov 2024',
    platforms: ['instagram', 'facebook'],
    metrics: {
      visualizations: 1250000,
      reach: 625000,
      interactions: 82400,
      followers: 8900,
    },
    trends: {
      visualizations: 312.5,
      reach: 298.4,
      interactions: 425.6,
      followers: 45.2,
    },
    chartData: [
      { date: '20 Nov', reach: 35000, interactions: 3200, visualizations: 70000, followers: 680 },
      { date: '22 Nov', reach: 42000, interactions: 4100, visualizations: 84000, followers: 750 },
      { date: '24 Nov', reach: 58000, interactions: 5800, visualizations: 116000, followers: 890 },
      { date: '26 Nov', reach: 72000, interactions: 7200, visualizations: 144000, followers: 1020 },
      { date: '28 Nov', reach: 85000, interactions: 8900, visualizations: 170000, followers: 1180 },
      { date: '29 Nov', reach: 98000, interactions: 12500, visualizations: 196000, followers: 1450 },
      { date: '30 Nov', reach: 78000, interactions: 8400, visualizations: 156000, followers: 980 },
    ],
    topContent: [
      { type: 'Reel', title: 'Countdown Black Friday - 24hrs', impressions: 198000, engagement: '5.8%', icon: Video },
      { type: 'Carousel', title: 'Ofertas exclusivas - Descubre', impressions: 167000, engagement: '4.9%', icon: LayoutGrid },
      { type: 'Reel', title: 'Unboxing ofertas Black Friday', impressions: 145000, engagement: '5.2%', icon: Video },
      { type: 'Image', title: 'Flash Sale - Solo hoy', impressions: 132000, engagement: '6.1%', icon: ImageIcon },
      { type: 'Reel', title: 'Gracias por el éxito - Resumen', impressions: 98000, engagement: '4.5%', icon: Video },
    ],
    insights: `## Resumen Ejecutivo

La campaña de Black Friday 2024 superó todas las expectativas, con un ROI del 425% en engagement y un crecimiento explosivo en seguidores.

### Highlights de la Campaña:
- **Alcance total**: 625,000 usuarios únicos (IG + FB)
- **Interacciones totales**: 82,400 (+425% vs periodo anterior)
- **Nuevos seguidores**: +4,950 (45.2% de crecimiento en 10 días)

### Aprendizajes Clave:
1. Los Reels con countdown generaron 3x más engagement
2. El contenido de "Flash Sale" tuvo el mejor CTR (6.1%)
3. La combinación IG + FB amplificó el alcance significativamente
4. Preparar contenido con 2 semanas de anticipación fue clave`,
  },
  'octubre-2024': {
    title: 'Reporte Mensual - Octubre 2024',
    dateRange: '1 Oct - 31 Oct 2024',
    platforms: ['instagram'],
    metrics: {
      visualizations: 680000,
      reach: 340000,
      interactions: 28500,
      followers: 14200,
    },
    trends: {
      visualizations: 95.2,
      reach: 88.4,
      interactions: 112.8,
      followers: 12.5,
    },
    chartData: [
      { date: '1 Oct', reach: 9500, interactions: 720, visualizations: 19000, followers: 420 },
      { date: '7 Oct', reach: 10800, interactions: 850, visualizations: 21600, followers: 450 },
      { date: '14 Oct', reach: 11500, interactions: 920, visualizations: 23000, followers: 470 },
      { date: '21 Oct', reach: 12800, interactions: 1050, visualizations: 25600, followers: 500 },
      { date: '28 Oct', reach: 14200, interactions: 1180, visualizations: 28400, followers: 530 },
      { date: '31 Oct', reach: 15500, interactions: 1350, visualizations: 31000, followers: 560 },
    ],
    topContent: [
      { type: 'Reel', title: 'Halloween en la oficina', impressions: 72000, engagement: '3.4%', icon: Video },
      { type: 'Carousel', title: 'Tips de productividad otoño', impressions: 58000, engagement: '2.9%', icon: LayoutGrid },
      { type: 'Image', title: 'Nueva colección octubre', impressions: 45000, engagement: '2.6%', icon: ImageIcon },
      { type: 'Reel', title: 'Preparando Q4', impressions: 42000, engagement: '3.1%', icon: Video },
      { type: 'Image', title: 'Quote semanal', impressions: 38000, engagement: '2.4%', icon: ImageIcon },
    ],
    insights: `## Resumen Ejecutivo

Octubre fue un mes de crecimiento moderado pero constante, sentando las bases para las campañas de Q4.

### Highlights del Mes:
- **Alcance total**: 340,000 usuarios únicos
- **Interacciones totales**: 28,500 (+112% de crecimiento)
- **Nuevos seguidores**: +1,580 (12.5% de crecimiento)

### Recomendaciones:
1. Incrementar frecuencia de Reels para el próximo mes
2. Aprovechar fechas festivas (Halloween funcionó bien)
3. Preparar estrategia para Black Friday y Navidad`,
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
  const [selectedMetric, setSelectedMetric] = useState<'reach' | 'interactions' | 'visualizations' | 'followers'>('reach');

  const reportData = DEMO_REPORTS_DATA[reportId];

  if (!reportData) {
    notFound();
  }

  const metrics = [
    {
      key: 'visualizations',
      label: 'Visualizaciones',
      value: reportData.metrics.visualizations,
      trend: reportData.trends.visualizations,
      icon: Eye,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      key: 'reach',
      label: 'Alcance',
      value: reportData.metrics.reach,
      trend: reportData.trends.reach,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      key: 'interactions',
      label: 'Interacciones',
      value: reportData.metrics.interactions,
      trend: reportData.trends.interactions,
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30'
    },
    {
      key: 'followers',
      label: 'Seguidores',
      value: reportData.metrics.followers,
      trend: reportData.trends.followers,
      icon: UserPlus,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
  ];

  // Calcular el máximo para el gráfico
  const maxValue = Math.max(...reportData.chartData.map((d: any) => d[selectedMetric]));

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
                <Image
                  src="/Logo_DataPal.png"
                  alt="DataPal"
                  width={40}
                  height={40}
                  className="object-contain invert"
                />
                <span className="text-xl font-bold text-[#FBFEF2] font-[var(--font-roboto-mono)] tracking-tight">
                  DataPal
                </span>
              </Link>
              <span className="text-[#B6B6B6]">/</span>
              <Link href="/demo" className="text-[#B6B6B6] hover:text-[#FBFEF2] transition-colors">
                Demo
              </Link>
              <span className="text-[#B6B6B6]">/</span>
              <span className="text-[#FBFEF2] truncate max-w-[200px]">{reportData.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-[#019B77] text-[#019B77] hover:bg-[#019B77]/10">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]">
                  Registrarse
                </Button>
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
            {reportData.platforms.map((platform: string) => (
              <div
                key={platform}
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  platform === 'instagram'
                    ? 'bg-purple-500/20 border border-purple-500/30'
                    : 'bg-blue-500/20 border border-blue-500/30'
                }`}
              >
                {platform === 'instagram' ? (
                  <Instagram className="h-4 w-4 text-purple-400" />
                ) : (
                  <Facebook className="h-4 w-4 text-blue-400" />
                )}
                <span className={`text-sm ${platform === 'instagram' ? 'text-purple-400' : 'text-blue-400'}`}>
                  {platform === 'instagram' ? 'Instagram' : 'Facebook'}
                </span>
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-[#FBFEF2] mb-2">
            {reportData.title}
          </h1>
          <div className="flex items-center gap-2 text-[#B6B6B6]">
            <Calendar className="h-4 w-4" />
            <span>{reportData.dateRange}</span>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <GlowCard key={metric.key}>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${metric.bgColor} border ${metric.borderColor}`}>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <span className="text-sm text-[#B6B6B6]">{metric.label}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-[#FBFEF2]">
                      {formatNumber(metric.value)}
                    </span>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gráfico */}
          <div className="lg:col-span-2">
            <GlowCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[#FBFEF2]">Evolución del Periodo</h3>
                  <div className="flex gap-2 flex-wrap">
                    {(['reach', 'interactions', 'visualizations', 'followers'] as const).map((metric) => {
                      const config = {
                        reach: { label: 'Alcance', color: 'blue' },
                        interactions: { label: 'Interacciones', color: 'pink' },
                        visualizations: { label: 'Vistas', color: 'purple' },
                        followers: { label: 'Seguidores', color: 'green' },
                      };
                      const { label, color } = config[metric];
                      return (
                        <button
                          key={metric}
                          onClick={() => setSelectedMetric(metric)}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            selectedMetric === metric
                              ? `bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`
                              : 'text-[#B6B6B6] hover:text-[#FBFEF2]'
                          }`}
                          style={selectedMetric === metric ? {
                            backgroundColor: color === 'blue' ? 'rgba(59, 130, 246, 0.2)' :
                                           color === 'pink' ? 'rgba(236, 72, 153, 0.2)' :
                                           color === 'purple' ? 'rgba(168, 85, 247, 0.2)' :
                                           'rgba(34, 197, 94, 0.2)',
                            color: color === 'blue' ? '#60a5fa' :
                                   color === 'pink' ? '#f472b6' :
                                   color === 'purple' ? '#c084fc' :
                                   '#4ade80',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: color === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                                        color === 'pink' ? 'rgba(236, 72, 153, 0.3)' :
                                        color === 'purple' ? 'rgba(168, 85, 247, 0.3)' :
                                        'rgba(34, 197, 94, 0.3)',
                          } : {}}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Gráfico de barras simple */}
                <div className="h-64 flex items-end justify-between gap-2">
                  {reportData.chartData.map((day: any, index: number) => {
                    const height = (day[selectedMetric] / maxValue) * 100;
                    const barColor = selectedMetric === 'reach' ? 'bg-blue-500' :
                                    selectedMetric === 'interactions' ? 'bg-pink-500' :
                                    selectedMetric === 'visualizations' ? 'bg-purple-500' :
                                    'bg-green-500';
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 ${barColor}`}
                          style={{ height: `${height}%`, minHeight: '8px' }}
                        />
                        <span className="text-xs text-[#B6B6B6] whitespace-nowrap">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Top Content */}
          <div>
            <GlowCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#FBFEF2] mb-4">Top Contenido</h3>
                <div className="space-y-4">
                  {reportData.topContent.map((content: any, index: number) => {
                    const ContentIcon = content.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#1a1b16] border border-[rgba(251,254,242,0.05)]">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-400">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30 flex items-center gap-1">
                              <ContentIcon className="w-3 h-3" />
                              {content.type}
                            </span>
                          </div>
                          <p className="text-sm text-[#FBFEF2] truncate">{content.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#B6B6B6]">
                            <span>{formatNumber(content.impressions)} imp.</span>
                            <span>{content.engagement} eng.</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlowCard>
          </div>
        </div>

        {/* Insights de IA - DESTACADO CON MARCO VERDE Y LOGO DE CLAUDE */}
        <div className="mt-6">
          <div className="relative rounded-2xl border-2 border-[#019B77] bg-[#1a1b16] overflow-hidden transition-all duration-300 hover:border-[#02c494] hover:shadow-[0_0_30px_rgba(1,155,119,0.3)]">
            {/* Efecto de brillo en el borde */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#019B77]/10 via-transparent to-[#019B77]/10 pointer-events-none" />

            <div className="relative p-6">
              {/* Header con logo de Claude */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#019B77] to-[#019B77]/60 p-3 rounded-xl">
                    <Sparkles className="w-6 h-6 text-[#11120D]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#FBFEF2]">Insights de IA</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-[#B6B6B6]">Powered by</span>
                      <Image
                        src="/Claude - Logo.png"
                        alt="Claude"
                        width={70}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido del insight */}
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-[#FBFEF2]/90 whitespace-pre-wrap leading-relaxed">
                  {reportData.insights.split('\n').map((line: string, i: number) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold text-[#FBFEF2] mt-4 mb-3">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-lg font-semibold text-[#019B77] mt-4 mb-2">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('- **')) {
                      const parts = line.replace('- **', '').split('**:');
                      return (
                        <p key={i} className="ml-4 my-1.5 text-[#FBFEF2]/90">
                          • <strong className="text-[#FBFEF2] font-semibold">{parts[0]}</strong>:{parts[1]}
                        </p>
                      );
                    }
                    if (line.match(/^\d\./)) {
                      return <p key={i} className="ml-4 my-1.5 text-[#FBFEF2]/90">{line}</p>;
                    }
                    return line ? <p key={i} className="my-2 text-[#FBFEF2]/90">{line}</p> : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-8">
          <GlowCard glowColor="1, 155, 119">
            <div className="p-8 text-center">
              <Sparkles className="h-12 w-12 text-[#019B77] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#FBFEF2] mb-2">
                ¿Te gustó lo que viste?
              </h2>
              <p className="text-[#B6B6B6] mb-6 max-w-lg mx-auto">
                Crea tu cuenta gratuita y genera reportes profesionales con tus propios datos de Instagram y Facebook.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Crear mi cuenta gratis
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="border-[#019B77] text-[#019B77] hover:bg-[#019B77]/10">
                    Ver planes y precios
                  </Button>
                </Link>
              </div>
            </div>
          </GlowCard>
        </div>
      </main>
    </div>
  );
}
