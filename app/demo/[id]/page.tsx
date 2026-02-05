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
  Calendar,
  Instagram,
  Facebook,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText,
  BarChart3,
  Image as ImageIcon,
  Video,
  LayoutGrid,
  MessageCircle,
  Share2,
  Bookmark,
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
      { date: '1 Ene', reach: 12500, interactions: 850, visualizations: 25000, followers: 15420 },
      { date: '5 Ene', reach: 15800, interactions: 1180, visualizations: 31600, followers: 15580 },
      { date: '10 Ene', reach: 18800, interactions: 1480, visualizations: 37600, followers: 15820 },
      { date: '15 Ene', reach: 24200, interactions: 2020, visualizations: 48400, followers: 16120 },
      { date: '20 Ene', reach: 28900, interactions: 2480, visualizations: 57800, followers: 16550 },
      { date: '25 Ene', reach: 35200, interactions: 3120, visualizations: 70400, followers: 17180 },
      { date: '31 Ene', reach: 41200, interactions: 3920, visualizations: 82400, followers: 17850 },
    ],
    contentData: {
      totalPosts: 14,
      totalInteractions: 66350,
      frequency: '0.5 posts/día',
      posts: [
        {
          id: 'post_001',
          type: 'Reel',
          title: 'Detrás de cámaras: Un día en la agencia',
          date: '28 Ene',
          impressions: 156000,
          reach: 78000,
          likes: 5920,
          comments: 428,
          shares: 1850,
          saves: 2680,
          engagement: '3.8%',
        },
        {
          id: 'post_002',
          type: 'Reel',
          title: '5 tips para mejorar tu engagement',
          date: '15 Ene',
          impressions: 125000,
          reach: 62500,
          likes: 4850,
          comments: 342,
          shares: 1280,
          saves: 2150,
          engagement: '4.2%',
        },
        {
          id: 'post_003',
          type: 'Carousel',
          title: 'Resultados del mes: Caso de estudio',
          date: '22 Ene',
          impressions: 89000,
          reach: 44500,
          likes: 3200,
          comments: 185,
          shares: 520,
          saves: 1450,
          engagement: '3.6%',
        },
        {
          id: 'post_004',
          type: 'Image',
          title: 'Quote motivacional del lunes',
          date: '6 Ene',
          impressions: 67000,
          reach: 33500,
          likes: 1850,
          comments: 95,
          shares: 220,
          saves: 680,
          engagement: '2.9%',
        },
        {
          id: 'post_005',
          type: 'Reel',
          title: 'Tendencias de marketing 2025',
          date: '10 Ene',
          impressions: 54000,
          reach: 27000,
          likes: 1680,
          comments: 112,
          shares: 380,
          saves: 520,
          engagement: '3.1%',
        },
      ],
    },
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
    contentInsights: `## Análisis de Contenido

El contenido de video (Reels) domina el rendimiento del mes, representando el 75% del engagement total.

### Top Performers:
- **Reels**: 3.8% engagement promedio
- **Carousels**: 3.2% engagement promedio
- **Imágenes**: 2.5% engagement promedio

### Recomendaciones de Contenido:
1. Priorizar Reels de "behind the scenes"
2. Los posts de lunes tienen mejor rendimiento
3. Incluir CTAs claros en cada publicación`,
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
      { date: '1 Dic', reach: 28000, interactions: 2100, visualizations: 56000, followers: 19850 },
      { date: '7 Dic', reach: 35000, interactions: 2800, visualizations: 70000, followers: 20480 },
      { date: '14 Dic', reach: 42000, interactions: 3500, visualizations: 84000, followers: 21250 },
      { date: '21 Dic', reach: 52000, interactions: 4200, visualizations: 104000, followers: 22180 },
      { date: '25 Dic', reach: 48000, interactions: 3800, visualizations: 96000, followers: 22850 },
      { date: '28 Dic', reach: 58000, interactions: 4800, visualizations: 116000, followers: 23520 },
      { date: '31 Dic', reach: 62000, interactions: 5200, visualizations: 124000, followers: 24300 },
    ],
    contentData: {
      totalPosts: 18,
      totalInteractions: 98500,
      frequency: '0.6 posts/día',
      posts: [
        { id: 'post_d1', type: 'Reel', title: 'Resumen del año 2024', date: '30 Dic', impressions: 245000, reach: 122500, likes: 9200, comments: 680, shares: 2850, saves: 3200, engagement: '4.5%' },
        { id: 'post_d2', type: 'Carousel', title: 'Top 10 momentos del año', date: '28 Dic', impressions: 189000, reach: 94500, likes: 7100, comments: 420, shares: 1650, saves: 2100, engagement: '3.9%' },
        { id: 'post_d3', type: 'Reel', title: 'Mensaje de fin de año', date: '31 Dic', impressions: 156000, reach: 78000, likes: 8500, comments: 920, shares: 2100, saves: 1850, engagement: '5.2%' },
        { id: 'post_d4', type: 'Image', title: 'Felices fiestas - Branding', date: '24 Dic', impressions: 123000, reach: 61500, likes: 4200, comments: 280, shares: 850, saves: 980, engagement: '3.4%' },
        { id: 'post_d5', type: 'Reel', title: 'Predicciones 2025', date: '27 Dic', impressions: 98000, reach: 49000, likes: 3800, comments: 310, shares: 1200, saves: 1450, engagement: '3.8%' },
      ],
    },
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
    contentInsights: `## Análisis de Contenido - Diciembre

El contenido de fin de año generó el mayor engagement del trimestre.

### Mejores Formatos:
- **Reels de resumen**: 4.5% engagement
- **Contenido festivo**: 3.8% engagement

### Observaciones:
1. El contenido emotivo genera más shares
2. Los Carousels de "Top 10" tienen alta retención
3. Los mensajes personales aumentan comentarios`,
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
      { date: '1 Nov', reach: 12000, interactions: 980, visualizations: 24000, followers: 10500 },
      { date: '7 Nov', reach: 14500, interactions: 1150, visualizations: 29000, followers: 10850 },
      { date: '14 Nov', reach: 16800, interactions: 1380, visualizations: 33600, followers: 11200 },
      { date: '21 Nov', reach: 19200, interactions: 1620, visualizations: 38400, followers: 11650 },
      { date: '25 Nov', reach: 22500, interactions: 1950, visualizations: 45000, followers: 12050 },
      { date: '30 Nov', reach: 24800, interactions: 2180, visualizations: 49600, followers: 12400 },
    ],
    contentData: {
      totalPosts: 12,
      totalInteractions: 38200,
      frequency: '0.4 posts/día',
      posts: [
        { id: 'post_n1', type: 'Video', title: 'Tutorial: Configuración de campaña', date: '15 Nov', impressions: 78000, reach: 39000, likes: 2500, comments: 180, shares: 650, saves: 890, engagement: '3.2%' },
        { id: 'post_n2', type: 'Carousel', title: 'Caso de éxito: Cliente retail', date: '22 Nov', impressions: 65000, reach: 32500, likes: 1820, comments: 95, shares: 420, saves: 580, engagement: '2.8%' },
        { id: 'post_n3', type: 'Image', title: 'Infografía: Tendencias Q4', date: '8 Nov', impressions: 52000, reach: 26000, likes: 1300, comments: 65, shares: 280, saves: 450, engagement: '2.5%' },
        { id: 'post_n4', type: 'Video', title: 'Webinar: Estrategias de fin de año', date: '28 Nov', impressions: 48000, reach: 24000, likes: 1950, comments: 220, shares: 580, saves: 720, engagement: '4.1%' },
        { id: 'post_n5', type: 'Image', title: 'Promoción Black Friday', date: '24 Nov', impressions: 42000, reach: 21000, likes: 1480, comments: 95, shares: 380, saves: 520, engagement: '3.5%' },
      ],
    },
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
    contentInsights: `## Análisis de Contenido - Noviembre

Contenido educativo lidera el engagement en Facebook.

### Top Formatos:
- **Videos tutoriales**: 3.6% engagement
- **Webinars**: 4.1% engagement

### Insights:
1. Contenido educativo genera más saves
2. Black Friday content debe ser visual
3. Aumentar frecuencia para diciembre`,
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
      { date: '20 Nov', reach: 35000, interactions: 3200, visualizations: 70000, followers: 6130 },
      { date: '22 Nov', reach: 42000, interactions: 4100, visualizations: 84000, followers: 6580 },
      { date: '24 Nov', reach: 58000, interactions: 5800, visualizations: 116000, followers: 7150 },
      { date: '26 Nov', reach: 72000, interactions: 7200, visualizations: 144000, followers: 7820 },
      { date: '28 Nov', reach: 85000, interactions: 8900, visualizations: 170000, followers: 8350 },
      { date: '29 Nov', reach: 98000, interactions: 12500, visualizations: 196000, followers: 8680 },
      { date: '30 Nov', reach: 78000, interactions: 8400, visualizations: 156000, followers: 8900 },
    ],
    contentData: {
      totalPosts: 21,
      totalInteractions: 82400,
      frequency: '1.9 posts/día',
      posts: [
        { id: 'post_bf1', type: 'Reel', title: 'Countdown Black Friday - 24hrs', date: '28 Nov', impressions: 198000, reach: 99000, likes: 11500, comments: 1250, shares: 3800, saves: 4200, engagement: '5.8%' },
        { id: 'post_bf2', type: 'Carousel', title: 'Ofertas exclusivas - Descubre', date: '29 Nov', impressions: 167000, reach: 83500, likes: 8200, comments: 680, shares: 2100, saves: 2850, engagement: '4.9%' },
        { id: 'post_bf3', type: 'Reel', title: 'Unboxing ofertas Black Friday', date: '29 Nov', impressions: 145000, reach: 72500, likes: 7500, comments: 520, shares: 1950, saves: 2200, engagement: '5.2%' },
        { id: 'post_bf4', type: 'Image', title: 'Flash Sale - Solo hoy', date: '29 Nov', impressions: 132000, reach: 66000, likes: 8100, comments: 420, shares: 2850, saves: 1650, engagement: '6.1%' },
        { id: 'post_bf5', type: 'Reel', title: 'Gracias por el éxito - Resumen', date: '30 Nov', impressions: 98000, reach: 49000, likes: 4400, comments: 380, shares: 1200, saves: 1450, engagement: '4.5%' },
      ],
    },
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
    contentInsights: `## Análisis de Contenido - Black Friday

Campaña con el mejor rendimiento del año.

### Formatos Ganadores:
- **Flash Sales (Images)**: 6.1% engagement
- **Countdown Reels**: 5.8% engagement
- **Ofertas Carousel**: 4.9% engagement

### Aprendizajes:
1. Urgencia + ofertas = alto engagement
2. Multiple posts por día funcionó bien
3. Cross-posting IG/FB amplificó reach`,
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
      { date: '1 Oct', reach: 9500, interactions: 720, visualizations: 19000, followers: 12620 },
      { date: '7 Oct', reach: 10800, interactions: 850, visualizations: 21600, followers: 12890 },
      { date: '14 Oct', reach: 11500, interactions: 920, visualizations: 23000, followers: 13180 },
      { date: '21 Oct', reach: 12800, interactions: 1050, visualizations: 25600, followers: 13520 },
      { date: '28 Oct', reach: 14200, interactions: 1180, visualizations: 28400, followers: 13850 },
      { date: '31 Oct', reach: 15500, interactions: 1350, visualizations: 31000, followers: 14200 },
    ],
    contentData: {
      totalPosts: 10,
      totalInteractions: 28500,
      frequency: '0.3 posts/día',
      posts: [
        { id: 'post_o1', type: 'Reel', title: 'Halloween en la oficina', date: '31 Oct', impressions: 72000, reach: 36000, likes: 2450, comments: 185, shares: 680, saves: 520, engagement: '3.4%' },
        { id: 'post_o2', type: 'Carousel', title: 'Tips de productividad otoño', date: '18 Oct', impressions: 58000, reach: 29000, likes: 1680, comments: 92, shares: 320, saves: 480, engagement: '2.9%' },
        { id: 'post_o3', type: 'Image', title: 'Nueva colección octubre', date: '5 Oct', impressions: 45000, reach: 22500, likes: 1170, comments: 65, shares: 180, saves: 320, engagement: '2.6%' },
        { id: 'post_o4', type: 'Reel', title: 'Preparando Q4', date: '22 Oct', impressions: 42000, reach: 21000, likes: 1300, comments: 78, shares: 290, saves: 380, engagement: '3.1%' },
        { id: 'post_o5', type: 'Image', title: 'Quote semanal', date: '14 Oct', impressions: 38000, reach: 19000, likes: 912, comments: 45, shares: 120, saves: 250, engagement: '2.4%' },
      ],
    },
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
    contentInsights: `## Análisis de Contenido - Octubre

Mes de transición con buen rendimiento en contenido estacional.

### Mejores Formatos:
- **Reels temáticos**: 3.2% engagement
- **Carousels educativos**: 2.9% engagement

### Oportunidades:
1. Aumentar frecuencia de posts
2. Más contenido de tendencias Q4
3. Preparar calendario para festividades`,
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

// Obtener icono por tipo de contenido
function getContentIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'reel':
    case 'video':
      return Video;
    case 'carousel':
      return LayoutGrid;
    case 'image':
    default:
      return ImageIcon;
  }
}

export default function DemoReportPage() {
  const params = useParams();
  const reportId = params?.id as string;
  const [currentSheet, setCurrentSheet] = useState(0); // 0 = Métricas, 1 = Contenido
  const [selectedMetric, setSelectedMetric] = useState<'reach' | 'interactions' | 'visualizations' | 'followers'>('reach');

  const reportData = DEMO_REPORTS_DATA[reportId];

  if (!reportData) {
    notFound();
  }

  const metrics = [
    { key: 'visualizations', label: 'Visualizaciones', value: reportData.metrics.visualizations, trend: reportData.trends.visualizations, icon: Eye, color: 'purple' },
    { key: 'reach', label: 'Alcance', value: reportData.metrics.reach, trend: reportData.trends.reach, icon: Users, color: 'blue' },
    { key: 'interactions', label: 'Interacciones', value: reportData.metrics.interactions, trend: reportData.trends.interactions, icon: Heart, color: 'pink' },
    { key: 'followers', label: 'Seguidores', value: reportData.metrics.followers, trend: reportData.trends.followers, icon: UserPlus, color: 'green' },
  ];

  // Calcular el máximo para el gráfico
  const maxValue = Math.max(...reportData.chartData.map((d: any) => d[selectedMetric]));

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  };

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
              <span className="text-[#B6B6B6]">/</span>
              <span className="text-[#FBFEF2] truncate max-w-[200px]">{reportData.title}</span>
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
            {reportData.platforms.map((platform: string) => (
              <div key={platform} className={`flex items-center gap-2 px-3 py-1 rounded-full ${platform === 'instagram' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-blue-500/20 border border-blue-500/30'}`}>
                {platform === 'instagram' ? <Instagram className="h-4 w-4 text-purple-400" /> : <Facebook className="h-4 w-4 text-blue-400" />}
                <span className={`text-sm ${platform === 'instagram' ? 'text-purple-400' : 'text-blue-400'}`}>{platform === 'instagram' ? 'Instagram' : 'Facebook'}</span>
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-[#FBFEF2] mb-2">{reportData.title}</h1>
          <div className="flex items-center gap-2 text-[#B6B6B6]">
            <Calendar className="h-4 w-4" />
            <span>{reportData.dateRange}</span>
          </div>
        </div>

        {/* Sheet Navigation */}
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

        {/* HOJA 1: Métricas */}
        {currentSheet === 0 && (
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
                    {(['reach', 'interactions', 'visualizations', 'followers'] as const).map((metric) => {
                      const config: Record<string, { label: string; color: string }> = {
                        reach: { label: 'Alcance', color: 'blue' },
                        interactions: { label: 'Interacciones', color: 'pink' },
                        visualizations: { label: 'Vistas', color: 'purple' },
                        followers: { label: 'Seguidores', color: 'green' },
                      };
                      const { label, color } = config[metric];
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

                {/* Gráfico de barras */}
                <div className="h-72 flex items-end justify-between gap-3 px-2">
                  {reportData.chartData.map((day: any, index: number) => {
                    const value = day[selectedMetric];
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const barColorClass = selectedMetric === 'reach' ? 'bg-blue-500' :
                                          selectedMetric === 'interactions' ? 'bg-pink-500' :
                                          selectedMetric === 'visualizations' ? 'bg-purple-500' : 'bg-green-500';
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="text-xs text-[#B6B6B6] opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatNumber(value)}
                        </div>
                        <div className={`w-full rounded-t-lg transition-all duration-300 ${barColorClass} group-hover:opacity-80`} style={{ height: `${Math.max(height, 4)}%` }} />
                        <span className="text-xs text-[#B6B6B6] whitespace-nowrap">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlowCard>

            {/* Insights de IA */}
            <div className="relative rounded-2xl border-2 border-[#019B77] bg-[#1a1b16] overflow-hidden transition-all duration-300 hover:border-[#02c494] hover:shadow-[0_0_30px_rgba(1,155,119,0.3)]">
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
                  {reportData.insights.split('\n').map((line: string, i: number) => {
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
          </>
        )}

        {/* HOJA 2: Contenido */}
        {currentSheet === 1 && (
          <>
            {/* Métricas de Contenido */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <GlowCard>
                <div className="p-6 text-center">
                  <p className="text-sm text-[#B6B6B6] mb-2">Publicaciones Totales</p>
                  <p className="text-4xl font-bold text-[#019B77]">{reportData.contentData.totalPosts}</p>
                </div>
              </GlowCard>
              <GlowCard>
                <div className="p-6 text-center">
                  <p className="text-sm text-[#B6B6B6] mb-2">Interacciones Totales</p>
                  <p className="text-4xl font-bold text-[#019B77]">{formatNumber(reportData.contentData.totalInteractions)}</p>
                </div>
              </GlowCard>
              <GlowCard>
                <div className="p-6 text-center">
                  <p className="text-sm text-[#B6B6B6] mb-2">Frecuencia</p>
                  <p className="text-4xl font-bold text-[#019B77]">{reportData.contentData.frequency}</p>
                </div>
              </GlowCard>
            </div>

            {/* Lista de Posts */}
            <GlowCard className="mb-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#FBFEF2] mb-6">Top Contenido del Periodo</h3>
                <div className="space-y-4">
                  {reportData.contentData.posts.map((post: any, index: number) => {
                    const ContentIcon = getContentIcon(post.type);
                    return (
                      <div key={post.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#11120D] border border-[rgba(251,254,242,0.05)] hover:border-[#019B77]/30 transition-colors">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                          <span className="text-lg font-bold text-purple-400">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 rounded bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30 flex items-center gap-1">
                              <ContentIcon className="w-3 h-3" />
                              {post.type}
                            </span>
                            <span className="text-xs text-[#B6B6B6]">{post.date}</span>
                          </div>
                          <p className="text-[#FBFEF2] font-medium mb-3">{post.title}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-purple-400" />
                              <span className="text-[#B6B6B6]">{formatNumber(post.impressions)} imp.</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-pink-400" />
                              <span className="text-[#B6B6B6]">{formatNumber(post.likes)} likes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-blue-400" />
                              <span className="text-[#B6B6B6]">{post.comments} com.</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Share2 className="w-4 h-4 text-green-400" />
                              <span className="text-[#B6B6B6]">{formatNumber(post.shares)} shares</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-2xl font-bold text-[#019B77]">{post.engagement}</p>
                          <p className="text-xs text-[#B6B6B6]">engagement</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlowCard>

            {/* Insights de Contenido */}
            <div className="relative rounded-2xl border-2 border-[#019B77] bg-[#1a1b16] overflow-hidden transition-all duration-300 hover:border-[#02c494] hover:shadow-[0_0_30px_rgba(1,155,119,0.3)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#019B77]/10 via-transparent to-[#019B77]/10 pointer-events-none" />
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#019B77] to-[#019B77]/60 p-3 rounded-xl">
                    <Sparkles className="w-6 h-6 text-[#11120D]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#FBFEF2]">Análisis de Contenido</h3>
                    <p className="text-sm text-[#B6B6B6] mt-0.5">Powered by <span className="text-[#019B77] font-medium">Claude Sonnet 4</span> by Anthropic</p>
                  </div>
                </div>
                <div className="text-[#FBFEF2]/90 whitespace-pre-wrap leading-relaxed">
                  {reportData.contentInsights.split('\n').map((line: string, i: number) => {
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
          </>
        )}

        {/* CTA Final */}
        <div className="mt-8">
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
        </div>
      </main>
    </div>
  );
}
