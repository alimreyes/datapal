'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Report } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      if (!user) return;

      try {
        setLoading(true);
        const reportsRef = collection(db, 'reports');
        const q = query(
          reportsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
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
  }, [user]);

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
        <h1 className="text-3xl font-bold">
          ¡Hola, {user?.displayName?.split(' ')[0] || 'Usuario'}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido a tu dashboard de DataPal. Aquí podrás crear y gestionar tus reportes de marketing.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/new-report/step-1">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <PlusCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Nuevo Reporte</CardTitle>
                  <CardDescription>Crea un reporte desde cero</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Mis Reportes</CardTitle>
                <CardDescription>
                  {loading ? 'Cargando...' : `${reports.length} ${reports.length === 1 ? 'reporte creado' : 'reportes creados'}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Lista de Reportes o Empty State */}
      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-muted-foreground">Cargando reportes...</p>
          </CardContent>
        </Card>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tienes reportes aún</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Comienza creando tu primer reporte de Instagram o Facebook. Solo necesitas subir tus archivos CSV y nosotros hacemos el resto.
            </p>
            <Link href="/new-report/step-1">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Crear mi primer reporte
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Mis Reportes</h2>
            <Link href="/new-report/step-1">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Reporte
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Link key={report.id} href={`/report/${report.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{report.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Calendar className="w-3 h-3" />
                          {formatDate(report.createdAt)}
                        </CardDescription>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        report.status === 'ready'
                          ? 'bg-green-100 text-green-700'
                          : report.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {report.status === 'ready' ? 'Listo' :
                         report.status === 'processing' ? 'Procesando' : 'Error'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 flex-wrap">
                      {report.platforms.map((platform) => (
                        <div
                          key={platform}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            platform === 'instagram'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {platform === 'instagram' ? 'Instagram' : 'Facebook'}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-semibold mb-2">🚀 Próximamente</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✨ Integración directa con Meta Business Suite</li>
          <li>📊 Comparación de múltiples periodos</li>
          <li>🤖 Insights automáticos con IA</li>
          <li>📱 App móvil para iOS y Android</li>
        </ul>
      </div>
    </div>
  );
}