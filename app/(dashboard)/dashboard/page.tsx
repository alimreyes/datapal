'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Report } from '@/lib/types';
import GlowCard from '@/components/ui/GlowCard';

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const reportsRef = collection(db, 'reports');
        const q = query(
          reportsRef,
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        const snapshot = await getDocs(q);
        const reportsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Report[];

        setReports(reportsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading reports:', error);
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return 'Fecha desconocida';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#FBFEF2] tracking-tight">
          Bienvenido a DataPal
        </h1>
        <p className="text-[#B6B6B6] mt-2 text-lg">
          Crea y gestiona tus reportes de marketing en poco tiempo.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/new-report/step-1">
          <GlowCard className="group">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#019B77]/20 p-4 rounded-lg border border-[#019B77]/30">
                  <PlusCircle className="h-6 w-6 text-[#019B77]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#FBFEF2]">Nuevo Reporte</h3>
                  <p className="text-[#B6B6B6] text-sm">Crea un reporte desde cero</p>
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
                <h3 className="text-lg font-semibold text-[#FBFEF2]">Mis Reportes</h3>
                <p className="text-[#B6B6B6] text-sm">
                  {loading ? 'Cargando...' : `${reports.length} ${reports.length === 1 ? 'reporte creado' : 'reportes creados'}`}
                </p>
              </div>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Lista de Reportes o Empty State */}
      {loading ? (
        <GlowCard>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#019B77] border-t-transparent mb-4"></div>
            <p className="text-[#B6B6B6]">Cargando reportes...</p>
          </div>
        </GlowCard>
      ) : reports.length === 0 ? (
        <GlowCard>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-[#2a2b25] p-6 rounded-full mb-6 border border-[rgba(251,254,242,0.1)]">
              <FileText className="h-12 w-12 text-[#B6B6B6]" />
            </div>
            <h3 className="text-xl font-semibold text-[#FBFEF2] mb-2">No tienes reportes aún</h3>
            <p className="text-[#B6B6B6] mb-6 text-center max-w-md">
              Comienza creando tu primer reporte de Instagram o Facebook. Solo necesitas subir tus archivos CSV y nosotros hacemos el resto.
            </p>
            <Link href="/new-report/step-1">
              <Button
                size="lg"
                className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] border-0"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Crear mi primer reporte
              </Button>
            </Link>
          </div>
        </GlowCard>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#FBFEF2]">Mis Reportes</h2>
            <Link href="/new-report/step-1">
              <Button className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] border-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Reporte
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => {
              // Determinar el color del glow según la plataforma principal
              const glowColor = report.platforms.includes('instagram')
                ? '168, 85, 247' // purple
                : '59, 130, 246'; // blue

              return (
                <Link key={report.id} href={`/report/${report.id}`}>
                  <GlowCard glowColor={glowColor} className="h-full group">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-[#FBFEF2] line-clamp-1 group-hover:text-[#019B77] transition-colors">{report.title}</h4>
                          <p className="flex items-center gap-2 mt-2 text-sm text-[#B6B6B6]">
                            <Calendar className="w-3 h-3" />
                            {formatDate(report.createdAt)}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          report.status === 'ready'
                            ? 'bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30'
                            : report.status === 'processing'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {report.status === 'ready' ? 'Listo' :
                           report.status === 'processing' ? 'Procesando' : 'Error'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {report.platforms.map((platform) => (
                          <div
                            key={platform}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              platform === 'instagram'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
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
      )}

      {/* Coming Soon */}
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
  );
}
