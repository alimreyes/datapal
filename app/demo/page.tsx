'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  FileText,
  Calendar,
  ArrowRight,
  Sparkles,
  UserPlus,
  Instagram,
  Facebook,
  BarChart3,
  TrendingUp,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlowCard from '@/components/ui/GlowCard';

// Solo 3 reportes de ejemplo - uno por cada tipo de objetivo
const DEMO_REPORTS = [
  {
    id: 'analisis-resultados',
    title: 'Análisis de Resultados',
    subtitle: 'Instagram - Noviembre 2025',
    description: 'Análisis profundo del rendimiento con métricas clave, tendencias y oportunidades de mejora.',
    dateRange: '1 Nov - 30 Nov 2025',
    platforms: ['instagram'],
    objective: 'analysis',
    status: 'ready',
    createdAt: '2025-11-30',
    icon: BarChart3,
    color: 'blue',
  },
  {
    id: 'mejoras-realizadas',
    title: 'Evidenciar Mejoras',
    subtitle: 'Instagram + Facebook - Noviembre 2025',
    description: 'Compara el rendimiento antes/después para demostrar el impacto de tu estrategia.',
    dateRange: '1 Nov - 30 Nov 2025',
    platforms: ['instagram', 'facebook'],
    objective: 'improvements',
    status: 'ready',
    createdAt: '2025-11-30',
    icon: TrendingUp,
    color: 'green',
  },
  {
    id: 'reporte-mensual',
    title: 'Reporte del Mes',
    subtitle: 'Instagram - Noviembre 2025',
    description: 'Reporte ejecutivo mensual con métricas, gráficos y análisis de contenido.',
    dateRange: '1 Nov - 30 Nov 2025',
    platforms: ['instagram'],
    objective: 'monthly_report',
    status: 'ready',
    createdAt: '2025-11-30',
    icon: Target,
    color: 'purple',
  },
];

export default function DemoPage() {
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const colorClasses: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', glow: '59, 130, 246' },
    green: { bg: 'bg-[#019B77]/20', text: 'text-[#019B77]', border: 'border-[#019B77]/30', glow: '1, 155, 119' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', glow: '168, 85, 247' },
  };

  return (
    <div className="min-h-screen bg-[#11120D]">
      {/* Banner Demo */}
      <div className="bg-gradient-to-r from-[#019B77] to-[#02c494] text-[#FBFEF2] py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Estás explorando el Demo de DataPal</span>
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
              <Link href="/" className="flex items-center gap-3 group">
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
              <span className="text-[#B6B6B6]">Demo</span>
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
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#FBFEF2] tracking-tight mb-4">
            ¿Qué tipos de reportes de redes sociales puedes crear con DataPal?
          </h1>
          <p className="text-[#B6B6B6] text-lg max-w-2xl mx-auto">
            DataPal genera 3 tipos de reportes automatizados para analizar y presentar tus métricas de Instagram, Facebook, LinkedIn, TikTok y Google Analytics.
          </p>
        </div>

        {/* Tipos de Reportes */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {DEMO_REPORTS.map((report) => {
            const colors = colorClasses[report.color];
            const Icon = report.icon;

            return (
              <Link key={report.id} href={`/demo/${report.id}`}>
                <GlowCard glowColor={colors.glow} className="h-full group">
                  <div className="p-6 flex flex-col h-full">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                        <Icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#FBFEF2] group-hover:text-[#019B77] transition-colors">
                          {report.title}
                        </h3>
                        <p className="text-sm text-[#B6B6B6]">{report.subtitle}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#B6B6B6] mb-4 flex-1">
                      {report.description}
                    </p>

                    {/* Platforms */}
                    <div className="flex items-center gap-2 mb-4">
                      {report.platforms.map((platform) => (
                        <div
                          key={platform}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                            platform === 'instagram'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {platform === 'instagram' ? (
                            <Instagram className="w-3 h-3" />
                          ) : (
                            <Facebook className="w-3 h-3" />
                          )}
                          {platform === 'instagram' ? 'Instagram' : 'Facebook'}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[rgba(251,254,242,0.05)]">
                      <div className="flex items-center gap-2 text-xs text-[#B6B6B6]">
                        <Calendar className="w-3 h-3" />
                        {report.dateRange}
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${colors.text}`}>
                        Ver reporte
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </Link>
            );
          })}
        </div>

        {/* Info sobre cada tipo */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#FBFEF2] mb-6 text-center">
            ¿Cuál es el mejor tipo de reporte de marketing para tu agencia o negocio?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-5 rounded-xl bg-[#1a1b16] border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-[#FBFEF2]">Análisis de Resultados</h3>
              </div>
              <p className="text-sm text-[#B6B6B6]">
                Ideal para <strong className="text-[#FBFEF2]">entender el rendimiento</strong> de tus redes.
                Incluye análisis de funnel, métricas clave y recomendaciones basadas en datos.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[#1a1b16] border border-[#019B77]/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-[#019B77]" />
                <h3 className="font-semibold text-[#FBFEF2]">Evidenciar Mejoras</h3>
              </div>
              <p className="text-sm text-[#B6B6B6]">
                Perfecto para <strong className="text-[#FBFEF2]">demostrar el impacto</strong> de tu trabajo.
                Compara periodos, muestra el crecimiento y destaca los logros alcanzados.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[#1a1b16] border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold text-[#FBFEF2]">Reporte del Mes</h3>
              </div>
              <p className="text-sm text-[#B6B6B6]">
                El clásico <strong className="text-[#FBFEF2]">reporte mensual</strong>.
                Resumen ejecutivo con métricas, gráficos de evolución y análisis de contenido.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <GlowCard glowColor="1, 155, 119">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center bg-[#019B77]/20 p-4 rounded-full mb-4 border border-[#019B77]/30">
              <Sparkles className="h-8 w-8 text-[#019B77]" />
            </div>
            <h3 className="text-2xl font-bold text-[#FBFEF2] mb-2">
              ¿Cómo empezar a automatizar los reportes de tu agencia?
            </h3>
            <p className="text-[#B6B6B6] mb-6 max-w-md mx-auto">
              Crea tu cuenta gratuita y genera reportes profesionales
              con tus datos de Instagram, Facebook, LinkedIn, TikTok y Google Analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] border-0"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Crear mi cuenta gratis
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#019B77] text-[#019B77] hover:bg-[#019B77]/10"
                >
                  Ver planes y precios
                </Button>
              </Link>
            </div>
          </div>
        </GlowCard>
      </main>
    </div>
  );
}
