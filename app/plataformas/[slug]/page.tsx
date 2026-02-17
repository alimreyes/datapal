import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Linkedin,
  BarChart3,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlowCard from '@/components/ui/GlowCard';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { generatePlatformMetadata } from '@/lib/metadata';

// --- Platform Data ---

interface PlatformMetric {
  name: string;
  description: string;
}

interface PlatformData {
  slug: string;
  name: string;
  icon: LucideIcon | null;
  iconLabel?: string;
  color: string;
  colorBg: string;
  colorBorder: string;
  glow: string;
  h1: string;
  description: string;
  longDescription: string;
  metrics: PlatformMetric[];
  useCases: string[];
}

const PLATFORMS: Record<string, PlatformData> = {
  instagram: {
    slug: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-purple-400',
    colorBg: 'bg-purple-500/10',
    colorBorder: 'border-purple-500/20',
    glow: '168, 85, 247',
    h1: '¿Cómo crear reportes automatizados de Instagram para tu agencia?',
    description: 'DataPal genera reportes profesionales de Instagram con métricas de engagement, alcance, Stories, Reels y crecimiento de seguidores. Ideal para agencias que gestionan múltiples cuentas.',
    longDescription: 'Instagram es la plataforma más importante para agencias de marketing en Latinoamérica. Con DataPal, puedes generar reportes automatizados que muestran el rendimiento real de tus estrategias de contenido, desde el alcance de publicaciones hasta el engagement en Reels y Stories.',
    metrics: [
      { name: 'Engagement Rate', description: 'Tasa de interacción por publicación, incluyendo likes, comentarios, guardados y compartidos.' },
      { name: 'Alcance e Impresiones', description: 'Personas únicas alcanzadas vs. número total de veces que se mostró el contenido.' },
      { name: 'Rendimiento de Reels', description: 'Reproducciones, alcance y engagement específico de tus Reels.' },
      { name: 'Stories Analytics', description: 'Vistas, respuestas, taps forward/back y tasa de retención de Stories.' },
      { name: 'Crecimiento de Seguidores', description: 'Evolución de seguidores con detección de picos y caídas.' },
      { name: 'Mejor Contenido', description: 'Ranking de publicaciones por engagement para identificar qué funciona.' },
    ],
    useCases: [
      'Reportes mensuales de Instagram para clientes de agencia',
      'Análisis comparativo antes/después de campañas',
      'Seguimiento de KPIs de engagement y crecimiento',
      'Presentaciones ejecutivas con gráficos profesionales',
    ],
  },
  facebook: {
    slug: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-400',
    colorBg: 'bg-blue-500/10',
    colorBorder: 'border-blue-500/20',
    glow: '59, 130, 246',
    h1: '¿Cómo crear reportes automatizados de Facebook para tu agencia?',
    description: 'DataPal genera reportes profesionales de Facebook con métricas de páginas, publicaciones, engagement y demografía de audiencia. Perfecto para agencias que manejan fan pages.',
    longDescription: 'Facebook sigue siendo una plataforma clave para negocios en Latinoamérica, especialmente para audiencias mayores de 30 años. Con DataPal, puedes crear reportes que demuestren el valor de tu gestión de páginas y campañas orgánicas a tus clientes.',
    metrics: [
      { name: 'Alcance de Página', description: 'Personas alcanzadas de forma orgánica y pagada en tu fan page.' },
      { name: 'Engagement de Publicaciones', description: 'Reacciones, comentarios, compartidos y clics por publicación.' },
      { name: 'Demografía de Audiencia', description: 'Edad, género y ubicación geográfica de tu audiencia activa.' },
      { name: 'Mejores Publicaciones', description: 'Contenido con mayor rendimiento ordenado por engagement.' },
      { name: 'Crecimiento de Seguidores', description: 'Evolución de likes y seguidores de la página en el periodo.' },
      { name: 'Videos y Reels', description: 'Reproducciones, retención y engagement de contenido en video.' },
    ],
    useCases: [
      'Reportes de gestión de fan pages para clientes',
      'Análisis de rendimiento de contenido orgánico',
      'Comparativas de crecimiento mensual',
      'Informes de audiencia y demografía',
    ],
  },
  linkedin: {
    slug: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-sky-400',
    colorBg: 'bg-sky-500/10',
    colorBorder: 'border-sky-500/20',
    glow: '56, 189, 248',
    h1: '¿Cómo crear reportes automatizados de LinkedIn para tu agencia?',
    description: 'DataPal genera reportes profesionales de LinkedIn con métricas de páginas de empresa, engagement de publicaciones y crecimiento de seguidores B2B.',
    longDescription: 'LinkedIn es la plataforma por excelencia para marketing B2B en Latinoamérica. Con DataPal, puedes generar reportes que demuestren el impacto de tu estrategia de contenido en LinkedIn, desde el alcance de publicaciones hasta el crecimiento de seguidores profesionales.',
    metrics: [
      { name: 'Impresiones y Alcance', description: 'Visibilidad de tus publicaciones entre profesionales y decisores.' },
      { name: 'Engagement Rate', description: 'Reacciones, comentarios y compartidos en publicaciones de empresa.' },
      { name: 'Crecimiento de Seguidores', description: 'Evolución de seguidores de la página de empresa.' },
      { name: 'Datos Demográficos', description: 'Industria, cargo y ubicación de tu audiencia en LinkedIn.' },
      { name: 'Rendimiento por Tipo', description: 'Comparativa de artículos, posts, videos y documentos.' },
      { name: 'Visitantes de Página', description: 'Tráfico a tu página de empresa y fuentes de visitas.' },
    ],
    useCases: [
      'Reportes de LinkedIn para clientes B2B',
      'Análisis de thought leadership y contenido profesional',
      'Seguimiento de presencia de marca corporativa',
      'Informes de audiencia B2B con datos demográficos',
    ],
  },
  tiktok: {
    slug: 'tiktok',
    name: 'TikTok',
    icon: null,
    iconLabel: 'T',
    color: 'text-pink-400',
    colorBg: 'bg-pink-500/10',
    colorBorder: 'border-pink-500/20',
    glow: '244, 114, 182',
    h1: '¿Cómo crear reportes automatizados de TikTok para tu agencia?',
    description: 'DataPal genera reportes profesionales de TikTok con métricas de videos, engagement, tendencias y crecimiento de seguidores. Ideal para agencias con clientes que apuestan por video corto.',
    longDescription: 'TikTok es la plataforma de mayor crecimiento en Latinoamérica, especialmente entre audiencias jóvenes. Con DataPal, puedes crear reportes que muestren el rendimiento de tus estrategias de video corto y demuestren resultados concretos a tus clientes.',
    metrics: [
      { name: 'Reproducciones de Video', description: 'Vistas totales y promedio por video en el periodo analizado.' },
      { name: 'Engagement Rate', description: 'Likes, comentarios, compartidos y guardados por video.' },
      { name: 'Crecimiento de Seguidores', description: 'Evolución de seguidores con detección de videos virales.' },
      { name: 'Tiempo de Visualización', description: 'Duración promedio y tasa de finalización de videos.' },
      { name: 'Mejores Videos', description: 'Ranking de contenido por reproducciones y engagement.' },
      { name: 'Fuentes de Tráfico', description: 'De dónde llegan tus vistas: For You, Following, hashtags, búsqueda.' },
    ],
    useCases: [
      'Reportes de rendimiento de TikTok para marcas',
      'Análisis de contenido viral y tendencias',
      'Seguimiento de campañas de video corto',
      'Comparativas de crecimiento vs. competencia',
    ],
  },
  'google-analytics': {
    slug: 'google-analytics',
    name: 'Google Analytics',
    icon: BarChart3,
    color: 'text-amber-400',
    colorBg: 'bg-amber-500/10',
    colorBorder: 'border-amber-500/20',
    glow: '251, 191, 36',
    h1: '¿Cómo crear reportes automatizados de Google Analytics para tu agencia?',
    description: 'DataPal genera reportes profesionales de Google Analytics con métricas de tráfico web, conversiones, fuentes de adquisición y comportamiento de usuarios.',
    longDescription: 'Google Analytics es fundamental para cualquier estrategia de marketing digital. Con DataPal, puedes transformar los datos complejos de GA4 en reportes visuales que tus clientes realmente entiendan, sin necesidad de que ellos accedan a la plataforma.',
    metrics: [
      { name: 'Sesiones y Usuarios', description: 'Tráfico total, usuarios únicos y sesiones en el periodo.' },
      { name: 'Fuentes de Tráfico', description: 'Orgánico, directo, social, referral y paid — de dónde viene tu audiencia.' },
      { name: 'Páginas Más Visitadas', description: 'Contenido con mayor tráfico y tiempo de permanencia.' },
      { name: 'Tasa de Rebote', description: 'Porcentaje de visitas que abandonan sin interactuar.' },
      { name: 'Conversiones', description: 'Eventos y objetivos completados por los usuarios.' },
      { name: 'Dispositivos y Geografía', description: 'Desde qué dispositivos y ubicaciones acceden tus visitantes.' },
    ],
    useCases: [
      'Reportes de tráfico web para clientes de agencia',
      'Análisis de rendimiento de campañas digitales',
      'Seguimiento de conversiones y objetivos',
      'Informes ejecutivos de marketing digital',
    ],
  },
};

const REPORT_TYPES = [
  {
    title: 'Análisis de Resultados',
    description: 'Métricas clave, funnels y recomendaciones basadas en datos.',
    icon: BarChart3,
    href: '/demo/analisis-resultados',
    glow: '59, 130, 246',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  {
    title: 'Evidenciar Mejoras',
    description: 'Compara periodos y destaca los logros alcanzados.',
    icon: TrendingUp,
    href: '/demo/mejoras-realizadas',
    glow: '1, 155, 119',
    border: 'border-[#019B77]/20',
    bg: 'bg-[#019B77]/10',
    text: 'text-[#019B77]',
  },
  {
    title: 'Reporte Mensual',
    description: 'Reporte ejecutivo con métricas, gráficos y análisis.',
    icon: Target,
    href: '/demo/reporte-mensual',
    glow: '168, 85, 247',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
  },
];

// --- SSG ---

export function generateStaticParams() {
  return Object.keys(PLATFORMS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const platform = PLATFORMS[slug];
  if (!platform) return {};
  return generatePlatformMetadata(platform.name, platform.slug, platform.description);
}

// --- Page Component ---

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const platform = PLATFORMS[slug];
  if (!platform) notFound();

  const PlatformIcon = platform.icon;

  return (
    <div className="min-h-screen bg-[#11120D]">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#019B77]/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 sm:pt-24 sm:pb-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Platform icon */}
            <div className={`inline-flex p-4 rounded-2xl ${platform.colorBg} border ${platform.colorBorder} mb-6`}>
              {PlatformIcon ? (
                <PlatformIcon className={`w-8 h-8 ${platform.color}`} />
              ) : (
                <span className={`text-2xl font-bold ${platform.color}`}>{platform.iconLabel}</span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FBFEF2] tracking-tight leading-tight mb-6">
              {platform.h1}
            </h1>

            <p className="text-lg text-[#B6B6B6] mb-8 max-w-2xl mx-auto leading-relaxed">
              {platform.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] text-base px-8 w-full sm:w-auto">
                  Crear mi cuenta gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="border-[#019B77]/50 text-[#019B77] hover:bg-[#019B77]/10 text-base px-8 w-full sm:w-auto">
                  Ver demo en vivo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Context */}
      <section className="py-16 sm:py-20 border-t border-[rgba(251,254,242,0.05)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#B6B6B6] text-lg leading-relaxed text-center">
            {platform.longDescription}
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-16 sm:py-24 bg-[#0d0e09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-4">
              ¿Qué métricas de {platform.name} analiza DataPal?
            </h2>
            <p className="text-[#B6B6B6] text-lg max-w-xl mx-auto">
              Las métricas que tus clientes necesitan ver en cada reporte.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platform.metrics.map((metric) => (
              <div
                key={metric.name}
                className={`p-5 rounded-xl bg-[#1a1b16] border ${platform.colorBorder} hover:border-[#019B77]/30 transition-colors`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className={`w-4 h-4 ${platform.color} flex-shrink-0`} />
                  <h3 className="text-sm font-semibold text-[#FBFEF2]">{metric.name}</h3>
                </div>
                <p className="text-sm text-[#B6B6B6] leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-4">
              ¿Para qué usar los reportes de {platform.name}?
            </h2>
          </div>
          <ul className="space-y-4">
            {platform.useCases.map((useCase) => (
              <li key={useCase} className="flex items-start gap-3 p-4 rounded-xl bg-[#1a1b16] border border-[rgba(251,254,242,0.1)]">
                <CheckCircle2 className="w-5 h-5 text-[#019B77] mt-0.5 flex-shrink-0" />
                <span className="text-[#B6B6B6] leading-relaxed">{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Report Types */}
      <section className="py-16 sm:py-24 bg-[#0d0e09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-4">
              ¿Qué tipos de reportes de {platform.name} puedes crear?
            </h2>
            <p className="text-[#B6B6B6] text-lg max-w-xl mx-auto">
              Tres formatos diseñados para presentar resultados a tus clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REPORT_TYPES.map((report) => (
              <Link key={report.title} href={report.href}>
                <GlowCard glowColor={report.glow} className="h-full group">
                  <div className="p-6 flex flex-col h-full">
                    <div className={`inline-flex p-3 rounded-xl ${report.bg} border ${report.border} mb-4 w-fit`}>
                      <report.icon className={`w-6 h-6 ${report.text}`} />
                    </div>
                    <h3 className="text-lg font-bold text-[#FBFEF2] group-hover:text-[#019B77] transition-colors mb-2">
                      {report.title}
                    </h3>
                    <p className="text-sm text-[#B6B6B6] leading-relaxed flex-1">
                      {report.description}
                    </p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${report.text} mt-4`}>
                      Ver ejemplo
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </GlowCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlowCard glowColor={platform.glow}>
            <div className="p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-4">
                Automatiza tus reportes de {platform.name} hoy
              </h2>
              <p className="text-[#B6B6B6] text-lg mb-8 max-w-lg mx-auto">
                Crea tu cuenta gratuita y genera tu primer reporte de {platform.name} en menos de 5 minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] text-base px-8 w-full sm:w-auto">
                    Crear mi cuenta gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="border-[#019B77]/50 text-[#019B77] hover:bg-[#019B77]/10 text-base px-8 w-full sm:w-auto">
                    Ver demo
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-[#B6B6B6]/60 mt-4">
                Sin tarjeta de crédito. Plan gratuito disponible.
              </p>
            </div>
          </GlowCard>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
