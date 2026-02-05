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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlowCard from '@/components/ui/GlowCard';

// Reportes de ejemplo para el demo
const DEMO_REPORTS = [
  {
    id: 'enero-2025',
    title: 'Reporte Mensual - Enero 2025',
    dateRange: '1 Ene - 31 Ene 2025',
    platforms: ['instagram'],
    status: 'ready',
    createdAt: '2025-01-31',
  },
  {
    id: 'diciembre-2024',
    title: 'Reporte Mensual - Diciembre 2024',
    dateRange: '1 Dic - 31 Dic 2024',
    platforms: ['instagram', 'facebook'],
    status: 'ready',
    createdAt: '2024-12-31',
  },
  {
    id: 'noviembre-2024',
    title: 'Análisis Q4 - Noviembre',
    dateRange: '1 Nov - 30 Nov 2024',
    platforms: ['facebook'],
    status: 'ready',
    createdAt: '2024-11-30',
  },
  {
    id: 'campana-blackfriday',
    title: 'Campaña Black Friday 2024',
    dateRange: '20 Nov - 30 Nov 2024',
    platforms: ['instagram', 'facebook'],
    status: 'ready',
    createdAt: '2024-11-30',
  },
  {
    id: 'octubre-2024',
    title: 'Reporte Mensual - Octubre 2024',
    dateRange: '1 Oct - 31 Oct 2024',
    platforms: ['instagram'],
    status: 'ready',
    createdAt: '2024-10-31',
  },
];

export default function DemoPage() {
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FBFEF2] tracking-tight">
            ¡Bienvenido al Demo de DataPal!
          </h1>
          <p className="text-[#B6B6B6] mt-2 text-lg">
            Explora reportes de ejemplo y descubre el poder de DataPal para tu marketing.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Link href="/new-report/step-1">
            <GlowCard className="group">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#019B77]/20 p-4 rounded-lg border border-[#019B77]/30">
                    <PlusCircle className="h-6 w-6 text-[#019B77]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#FBFEF2]">Crear tu Reporte</h3>
                    <p className="text-[#B6B6B6] text-sm">Regístrate y crea tu primer reporte</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#B6B6B6] group-hover:text-[#019B77] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </GlowCard>
          </Link>

          <GlowCard>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#2a2b25] p-4 rounded-lg border border-[rgba(251,254,242,0.1)]">
                  <FileText className="h-6 w-6 text-[#B6B6B6]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#FBFEF2]">Reportes de Ejemplo</h3>
                  <p className="text-[#B6B6B6] text-sm">
                    {DEMO_REPORTS.length} reportes para explorar
                  </p>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Lista de Reportes Demo */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#FBFEF2]">Reportes de Ejemplo</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DEMO_REPORTS.map((report) => {
              // Determinar el color del glow según la plataforma principal
              const glowColor = report.platforms.includes('instagram')
                ? '168, 85, 247' // purple
                : '59, 130, 246'; // blue

              return (
                <Link key={report.id} href={`/demo/${report.id}`}>
                  <GlowCard glowColor={glowColor} className="h-full group">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-[#FBFEF2] line-clamp-1 group-hover:text-[#019B77] transition-colors">
                            {report.title}
                          </h4>
                          <p className="flex items-center gap-2 mt-2 text-sm text-[#B6B6B6]">
                            <Calendar className="w-3 h-3" />
                            {formatDate(report.createdAt)}
                          </p>
                        </div>
                        <div className="px-2 py-1 rounded text-xs font-medium bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30">
                          Listo
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {report.platforms.map((platform) => (
                          <div
                            key={platform}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
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
                    </div>
                  </GlowCard>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8">
          <GlowCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#FBFEF2] mb-4">Próximamente</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-3 text-sm text-[#B6B6B6]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#019B77]" />
                  Integración directa con Meta Business Suite
                </div>
                <div className="flex items-center gap-3 text-sm text-[#B6B6B6]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#019B77]" />
                  Comparación de múltiples periodos
                </div>
                <div className="flex items-center gap-3 text-sm text-[#B6B6B6]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#019B77]" />
                  Insights automáticos con IA
                </div>
                <div className="flex items-center gap-3 text-sm text-[#B6B6B6]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#019B77]" />
                  App móvil para iOS y Android
                </div>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* CTA Final */}
        <div className="mt-8">
          <GlowCard glowColor="1, 155, 119">
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center bg-[#019B77]/20 p-4 rounded-full mb-4 border border-[#019B77]/30">
                <Sparkles className="h-8 w-8 text-[#019B77]" />
              </div>
              <h3 className="text-2xl font-bold text-[#FBFEF2] mb-2">
                ¿Te gustó lo que viste?
              </h3>
              <p className="text-[#B6B6B6] mb-6 max-w-md mx-auto">
                Crea tu cuenta gratuita y comienza a generar reportes profesionales
                con tus propios datos de Instagram y Facebook.
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
        </div>
      </main>
    </div>
  );
}
