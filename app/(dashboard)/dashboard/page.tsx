'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

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

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Mis Reportes</CardTitle>
                <CardDescription>0 reportes creados</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
                <CardDescription>Ver mi actividad</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Empty State */}
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