import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Target,
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
  Zap,
  FileText,
  Palette,
  Clock,
  Users,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlowCard from '@/components/ui/GlowCard';
import LandingRedirect from '@/components/landing/LandingRedirect';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { landingMetadata } from '@/lib/metadata';

export const metadata = landingMetadata;

const PLATFORMS = [
  { name: 'Instagram', icon: Instagram, color: 'text-purple-400' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-400' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-sky-400' },
];

const STEPS = [
  {
    number: '01',
    title: 'Conecta tus cuentas',
    description: 'Vincula Instagram, Facebook, LinkedIn, TikTok o Google Analytics en segundos.',
    icon: Zap,
  },
  {
    number: '02',
    title: 'Elige tu tipo de reporte',
    description: 'Selecciona entre análisis de resultados, evidenciar mejoras o reporte mensual.',
    icon: FileText,
  },
  {
    number: '03',
    title: 'Genera y personaliza',
    description: 'DataPal crea tu reporte con gráficos, métricas y análisis listos para presentar.',
    icon: Palette,
  },
];

const REPORT_TYPES = [
  {
    title: 'Análisis de Resultados',
    description: 'Entiende el rendimiento de tus redes con métricas clave, funnels y recomendaciones basadas en datos.',
    icon: BarChart3,
    href: '/demo/analisis-resultados',
    glow: '59, 130, 246',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  {
    title: 'Evidenciar Mejoras',
    description: 'Demuestra el impacto de tu trabajo comparando periodos y destacando los logros alcanzados.',
    icon: TrendingUp,
    href: '/demo/mejoras-realizadas',
    glow: '1, 155, 119',
    border: 'border-[#019B77]/20',
    bg: 'bg-[#019B77]/10',
    text: 'text-[#019B77]',
  },
  {
    title: 'Reporte Mensual',
    description: 'El clásico reporte ejecutivo con métricas, gráficos de evolución y análisis de contenido.',
    icon: Target,
    href: '/demo/reporte-mensual',
    glow: '168, 85, 247',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
  },
];

const AUDIENCES = [
  {
    title: 'Agencias boutique',
    description: 'Presenta reportes profesionales a tus clientes sin pasar horas en Excel o Looker Studio. Dedica más tiempo a la estrategia.',
    icon: Briefcase,
    features: ['Reportes con tu branding', 'Exportación a PDF', 'Múltiples clientes'],
  },
  {
    title: 'Freelancers de marketing',
    description: 'Genera reportes que demuestren tu valor como profesional. Impresiona a tus clientes con datos claros y visuales.',
    icon: Users,
    features: ['Plan gratuito disponible', 'Fácil de usar', 'Resultados en minutos'],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#11120D]">
      <LandingRedirect />
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#019B77]/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#019B77]/10 border border-[#019B77]/20 text-sm text-[#019B77] mb-6">
              <Zap className="w-3.5 h-3.5" />
              Reportes automatizados en minutos
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FBFEF2] tracking-tight leading-tight mb-6">
              ¿Cómo automatizar los reportes de redes sociales para tu agencia?
            </h1>

            <p className="text-lg sm:text-xl text-[#B6B6B6] mb-8 max-w-2xl mx-auto leading-relaxed">
              DataPal genera reportes profesionales de Instagram, Facebook, LinkedIn, TikTok y Google Analytics. Diseñado para agencias boutique y freelancers de marketing en Latinoamérica.
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

            <p className="text-xs text-[#B6B6B6]/60 mt-4">
              Sin tarjeta de crédito. Plan gratuito disponible.
            </p>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-12 border-y border-[rgba(251,254,242,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[#B6B6B6] mb-6">
            Conecta las plataformas que ya usas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {PLATFORMS.map((platform) => (
              <div key={platform.name} className="flex items-center gap-2 text-[#B6B6B6]/60 hover:text-[#B6B6B6] transition-colors">
                <platform.icon className={`w-5 h-5 ${platform.color}`} />
                <span className="text-sm">{platform.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-[#B6B6B6]/60 hover:text-[#B6B6B6] transition-colors">
              <span className="text-sm font-bold text-pink-400">T</span>
              <span className="text-sm">TikTok</span>
            </div>
            <div className="flex items-center gap-2 text-[#B6B6B6]/60 hover:text-[#B6B6B6] transition-colors">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span className="text-sm">Google Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-4">
              ¿Cómo funciona DataPal?
            </h2>
            <p className="text-[#B6B6B6] text-lg max-w-xl mx-auto">
              Tres pasos para transformar tus datos en reportes profesionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="p-6 rounded-xl bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/30 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-[#019B77]/30 font-[var(--font-roboto-mono)]">
                    {step.number}
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#019B77]/10 border border-[#019B77]/20">
                    <step.icon className="w-5 h-5 text-[#019B77]" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#FBFEF2] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#B6B6B6] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Types */}
      <section className="py-20 sm:py-28 bg-[#0d0e09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-4">
              ¿Qué tipos de reportes puedes crear?
            </h2>
            <p className="text-[#B6B6B6] text-lg max-w-xl mx-auto">
              Tres formatos diseñados para los objetivos más comunes de agencias y freelancers.
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

      {/* Audience */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-4">
              ¿Para quién es DataPal?
            </h2>
            <p className="text-[#B6B6B6] text-lg max-w-xl mx-auto">
              Diseñado para profesionales de marketing que necesitan reportes sin complicaciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {AUDIENCES.map((audience) => (
              <div
                key={audience.title}
                className="p-6 rounded-xl bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-[#019B77]/10 border border-[#019B77]/20">
                    <audience.icon className="w-5 h-5 text-[#019B77]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#FBFEF2]">
                    {audience.title}
                  </h3>
                </div>
                <p className="text-sm text-[#B6B6B6] leading-relaxed mb-4">
                  {audience.description}
                </p>
                <ul className="space-y-2">
                  {audience.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[#B6B6B6]">
                      <CheckCircle2 className="w-4 h-4 text-[#019B77] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-28 bg-[#0d0e09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-4">
              ¿Por qué elegir DataPal sobre Looker Studio o Excel?
            </h2>
            <p className="text-[#B6B6B6] text-lg max-w-xl mx-auto">
              Porque tus clientes merecen reportes que se entiendan, no hojas de cálculo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="flex gap-4 p-4">
              <Clock className="w-5 h-5 text-[#019B77] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[#FBFEF2] mb-1">Ahorra tiempo</h3>
                <p className="text-sm text-[#B6B6B6] leading-relaxed">Genera reportes en minutos, no en horas. Automatiza lo repetitivo.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4">
              <Palette className="w-5 h-5 text-[#019B77] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[#FBFEF2] mb-1">Diseño profesional</h3>
                <p className="text-sm text-[#B6B6B6] leading-relaxed">Reportes visuales que impresionan. Gráficos claros y análisis listos.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4">
              <FileText className="w-5 h-5 text-[#019B77] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[#FBFEF2] mb-1">Exporta a PDF</h3>
                <p className="text-sm text-[#B6B6B6] leading-relaxed">Descarga reportes listos para enviar a tus clientes con un clic.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4">
              <Zap className="w-5 h-5 text-[#019B77] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[#FBFEF2] mb-1">Fácil de usar</h3>
                <p className="text-sm text-[#B6B6B6] leading-relaxed">Sin curva de aprendizaje. Conecta, selecciona y genera.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4">
              <BarChart3 className="w-5 h-5 text-[#019B77] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[#FBFEF2] mb-1">Métricas que importan</h3>
                <p className="text-sm text-[#B6B6B6] leading-relaxed">Engagement, alcance, crecimiento — las métricas que tus clientes quieren ver.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4">
              <Target className="w-5 h-5 text-[#019B77] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[#FBFEF2] mb-1">Hecho para LATAM</h3>
                <p className="text-sm text-[#B6B6B6] leading-relaxed">Interfaz en español, precios accesibles y soporte para el mercado latinoamericano.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlowCard glowColor="1, 155, 119">
            <div className="p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-4">
                Empieza a automatizar tus reportes hoy
              </h2>
              <p className="text-[#B6B6B6] text-lg mb-8 max-w-lg mx-auto">
                Crea tu cuenta gratuita y genera tu primer reporte profesional en menos de 5 minutos.
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
                Sin tarjeta de crédito. Cancela cuando quieras.
              </p>
            </div>
          </GlowCard>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
