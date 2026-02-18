'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Linkedin,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Plug,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  Zap,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: 'connected' | 'csv_only' | 'coming_soon';
  method: 'oauth' | 'csv' | 'api';
  methodLabel: string;
  features: string[];
}

export default function IntegrationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [gaConnected, setGaConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkConnections() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Verificar conexión de Google Analytics
        const gaDoc = await getDoc(
          doc(db, 'users', user.uid, 'integrations', 'google_analytics')
        );
        if (gaDoc.exists() && gaDoc.data()?.connected) {
          setGaConnected(true);
        }
      } catch (error) {
        console.error('Error checking integrations:', error);
      }
      setLoading(false);
    }

    checkConnections();
  }, [user]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const integrations: Integration[] = [
    {
      id: 'google_analytics',
      name: 'Google Analytics',
      description: 'Conecta tu propiedad GA4 para importar métricas de tráfico web automáticamente.',
      icon: <BarChart3 className="w-6 h-6" />,
      color: '#F9AB00',
      status: gaConnected ? 'connected' : 'csv_only',
      method: 'oauth',
      methodLabel: 'Conexión directa (OAuth)',
      features: ['Datos en tiempo real', 'Sincronización automática', 'Múltiples propiedades'],
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Importa métricas de Instagram: alcance, impresiones, interacciones y contenido.',
      icon: <Instagram className="w-6 h-6" />,
      color: '#E1306C',
      status: 'csv_only',
      method: 'csv',
      methodLabel: 'Importación CSV (Meta Business Suite)',
      features: ['Alcance y visualizaciones', 'Engagement y seguidores', 'Rendimiento de contenido'],
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Importa métricas de Facebook Pages: espectadores, impresiones e interacciones.',
      icon: <Facebook className="w-6 h-6" />,
      color: '#1877F2',
      status: 'csv_only',
      method: 'csv',
      methodLabel: 'Importación CSV (Meta Business Suite)',
      features: ['Espectadores y alcance', 'Engagement de publicaciones', 'Crecimiento de seguidores'],
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Importa analíticas de LinkedIn Company Pages desde el archivo Excel exportado.',
      icon: <Linkedin className="w-6 h-6" />,
      color: '#0A66C2',
      status: 'csv_only',
      method: 'csv',
      methodLabel: 'Importación XLS (LinkedIn Analytics)',
      features: ['Impresiones y clics', 'Engagement rate', 'Datos de publicaciones'],
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Importa métricas de TikTok: vistas, interacciones y crecimiento de seguidores.',
      icon: <Sparkles className="w-6 h-6" />,
      color: '#ff0050',
      status: 'csv_only',
      method: 'csv',
      methodLabel: 'Importación CSV (TikTok Analytics)',
      features: ['Vistas de videos', 'Interacciones totales', 'Crecimiento de comunidad'],
    },
    {
      id: 'meta_api',
      name: 'Meta API (Instagram + Facebook)',
      description: 'Conecta directamente con la API de Meta para importar datos automáticamente sin CSVs.',
      icon: (
        <div className="flex -space-x-1">
          <Instagram className="w-5 h-5" />
          <Facebook className="w-5 h-5" />
        </div>
      ),
      color: '#0081FB',
      status: 'coming_soon',
      method: 'oauth',
      methodLabel: 'Conexión directa (OAuth) — Próximamente',
      features: ['Sin archivos manuales', 'Datos actualizados', 'Instagram + Facebook juntos'],
    },
    {
      id: 'linkedin_api',
      name: 'LinkedIn API',
      description: 'Conecta directamente con la API de LinkedIn para datos automáticos.',
      icon: <Linkedin className="w-6 h-6" />,
      color: '#0A66C2',
      status: 'coming_soon',
      method: 'oauth',
      methodLabel: 'Conexión directa (OAuth) — Próximamente',
      features: ['Sin exportar archivos XLS', 'Datos en tiempo real', 'Company Page analytics'],
    },
    {
      id: 'tiktok_api',
      name: 'TikTok API',
      description: 'Conecta directamente con la API de TikTok for Business.',
      icon: <Sparkles className="w-6 h-6" />,
      color: '#ff0050',
      status: 'coming_soon',
      method: 'oauth',
      methodLabel: 'Conexión directa (OAuth) — Próximamente',
      features: ['Sin archivos manuales', 'Métricas actualizadas', 'Datos de Business Account'],
    },
  ];

  const connectedIntegrations = integrations.filter((i) => i.status === 'connected');
  const csvIntegrations = integrations.filter((i) => i.status === 'csv_only');
  const comingSoonIntegrations = integrations.filter((i) => i.status === 'coming_soon');

  const getStatusBadge = (integration: Integration) => {
    switch (integration.status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30">
            <CheckCircle2 className="w-3 h-3" />
            Conectado
          </span>
        );
      case 'csv_only':
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#B6B6B6]/10 text-[#B6B6B6] border border-[#B6B6B6]/20">
            <FileSpreadsheet className="w-3 h-3" />
            CSV / Excel
          </span>
        );
      case 'coming_soon':
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock className="w-3 h-3" />
            Próximamente
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#019B77] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#FBFEF2] mb-2 flex items-center gap-3">
          <Plug className="w-7 h-7 text-[#019B77]" />
          Integraciones
        </h1>
        <p className="text-[#B6B6B6]">
          Conecta tus plataformas para importar datos automáticamente o sube archivos manualmente.
        </p>
      </div>

      {/* Connected Integrations */}
      {connectedIntegrations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#019B77]" />
            Conectadas ({connectedIntegrations.length})
          </h2>
          <div className="space-y-3">
            {connectedIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                badge={getStatusBadge(integration)}
              />
            ))}
          </div>
        </section>
      )}

      {/* CSV Integrations */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#B6B6B6]" />
          Importación de archivos ({csvIntegrations.length})
        </h2>
        <p className="text-sm text-[#B6B6B6] mb-4">
          Estas plataformas funcionan subiendo archivos CSV o Excel al crear un nuevo reporte.
        </p>
        <div className="space-y-3">
          {csvIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              badge={getStatusBadge(integration)}
            />
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Próximamente
        </h2>
        <p className="text-sm text-[#B6B6B6] mb-4">
          Estamos trabajando en conexiones directas (OAuth) para que no necesites exportar archivos manualmente.
        </p>
        <div className="space-y-3">
          {comingSoonIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              badge={getStatusBadge(integration)}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#019B77]/10 to-[#02c494]/5 border border-[#019B77]/20 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-[#FBFEF2] mb-2">
          ¿Listo para crear un reporte?
        </h3>
        <p className="text-sm text-[#B6B6B6] mb-4">
          Usa cualquiera de las integraciones disponibles para generar reportes profesionales.
        </p>
        <Link
          href="/new-report/step-1"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#019B77] hover:bg-[#02c494] text-[#11120D] font-medium rounded-lg transition-colors"
        >
          Crear nuevo reporte
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function IntegrationCard({
  integration,
  badge,
}: {
  integration: Integration;
  badge: React.ReactNode;
}) {
  return (
    <div
      className={`bg-[#1a1b16] border rounded-xl p-5 transition-colors ${
        integration.status === 'coming_soon'
          ? 'border-[#B6B6B6]/10 opacity-75'
          : 'border-[#B6B6B6]/20 hover:border-[#B6B6B6]/30'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: integration.color + '15', color: integration.color }}
        >
          {integration.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="text-base font-semibold text-[#FBFEF2]">{integration.name}</h3>
            {badge}
          </div>
          <p className="text-sm text-[#B6B6B6] mb-3">{integration.description}</p>
          <div className="flex flex-wrap gap-2">
            {integration.features.map((feature, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-full bg-[#11120D] text-[#B6B6B6] border border-[#B6B6B6]/10"
              >
                {feature}
              </span>
            ))}
          </div>
          <p className="text-xs text-[#B6B6B6]/60 mt-2 flex items-center gap-1">
            <Plug className="w-3 h-3" />
            {integration.methodLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
