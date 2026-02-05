'use client';

import { useState } from 'react';
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
  Sparkles,
  FileText,
  Download,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlowCard from '@/components/ui/GlowCard';

// Datos de ejemplo para el demo
const DEMO_DATA = {
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
    { date: '1 Ene', reach: 12500, interactions: 850 },
    { date: '5 Ene', reach: 15800, interactions: 1180 },
    { date: '10 Ene', reach: 16800, interactions: 1280 },
    { date: '15 Ene', reach: 24200, interactions: 2020 },
    { date: '20 Ene', reach: 28900, interactions: 2480 },
    { date: '25 Ene', reach: 32200, interactions: 2920 },
    { date: '31 Ene', reach: 41200, interactions: 3920 },
  ],
  topContent: [
    {
      type: 'Reel',
      title: 'Detrás de cámaras: Un día en la agencia',
      impressions: 156000,
      engagement: '3.8%'
    },
    {
      type: 'Reel',
      title: '5 tips para mejorar tu engagement',
      impressions: 125000,
      engagement: '4.2%'
    },
    {
      type: 'Carousel',
      title: 'Resultados del mes: Caso de estudio',
      impressions: 89000,
      engagement: '3.6%'
    },
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

export default function DemoPage() {
  const [selectedMetric, setSelectedMetric] = useState<'reach' | 'interactions'>('reach');

  const metrics = [
    {
      key: 'visualizations',
      label: 'Visualizaciones',
      value: DEMO_DATA.metrics.visualizations,
      trend: DEMO_DATA.trends.visualizations,
      icon: Eye,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      key: 'reach',
      label: 'Alcance',
      value: DEMO_DATA.metrics.reach,
      trend: DEMO_DATA.trends.reach,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      key: 'interactions',
      label: 'Interacciones',
      value: DEMO_DATA.metrics.interactions,
      trend: DEMO_DATA.trends.interactions,
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30'
    },
    {
      key: 'followers',
      label: 'Seguidores',
      value: DEMO_DATA.metrics.followers,
      trend: DEMO_DATA.trends.followers,
      icon: UserPlus,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
  ];

  // Calcular el máximo para el gráfico
  const maxValue = Math.max(...DEMO_DATA.chartData.map(d => d[selectedMetric]));

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
              <UserCircle className="mr-2 h-4 w-4" />
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
              <Link href="/dashboard" className="flex items-center gap-3 group">
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
        {/* Header del Reporte */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="text-[#B6B6B6] hover:text-[#FBFEF2] transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Instagram className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-400">Instagram</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#FBFEF2] mb-2">
            {DEMO_DATA.title}
          </h1>
          <div className="flex items-center gap-2 text-[#B6B6B6]">
            <Calendar className="h-4 w-4" />
            <span>{DEMO_DATA.dateRange}</span>
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
                  <h3 className="text-lg font-semibold text-[#FBFEF2]">Evolución del Mes</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMetric('reach')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        selectedMetric === 'reach'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-[#B6B6B6] hover:text-[#FBFEF2]'
                      }`}
                    >
                      Alcance
                    </button>
                    <button
                      onClick={() => setSelectedMetric('interactions')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        selectedMetric === 'interactions'
                          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                          : 'text-[#B6B6B6] hover:text-[#FBFEF2]'
                      }`}
                    >
                      Interacciones
                    </button>
                  </div>
                </div>

                {/* Gráfico de barras simple */}
                <div className="h-64 flex items-end justify-between gap-2">
                  {DEMO_DATA.chartData.map((day, index) => {
                    const height = (day[selectedMetric] / maxValue) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            selectedMetric === 'reach' ? 'bg-blue-500' : 'bg-pink-500'
                          }`}
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
                  {DEMO_DATA.topContent.map((content, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#1a1b16] border border-[rgba(251,254,242,0.05)]">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-400">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30">
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
                  ))}
                </div>
              </div>
            </GlowCard>
          </div>
        </div>

        {/* Insights de IA */}
        <div className="mt-6">
          <GlowCard>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#019B77]/20 border border-[#019B77]/30">
                  <Sparkles className="h-5 w-5 text-[#019B77]" />
                </div>
                <h3 className="text-lg font-semibold text-[#FBFEF2]">Insights de IA</h3>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-[#B6B6B6] whitespace-pre-wrap leading-relaxed">
                  {DEMO_DATA.insights.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold text-[#FBFEF2] mt-4 mb-2">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-lg font-semibold text-[#FBFEF2] mt-3 mb-2">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('- **')) {
                      const parts = line.replace('- **', '').split('**:');
                      return (
                        <p key={i} className="ml-4 my-1">
                          • <strong className="text-[#FBFEF2]">{parts[0]}</strong>:{parts[1]}
                        </p>
                      );
                    }
                    if (line.match(/^\d\./)) {
                      return <p key={i} className="ml-4 my-1">{line}</p>;
                    }
                    return line ? <p key={i} className="my-2">{line}</p> : null;
                  })}
                </div>
              </div>
            </div>
          </GlowCard>
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
