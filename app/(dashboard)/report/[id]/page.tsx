'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Download, Share2, Loader2, AlertCircle } from 'lucide-react';
import { getDocument } from '@/lib/firebase/firestore';
import { Report } from '@/lib/types';
import { DateRange } from 'react-day-picker';
import Link from 'next/link';
import { MetricSection } from '@/components/MetricSection';
import { ContentTable } from '@/components/ContentTable';
import { ExecutiveSummary } from '@/components/ExecutiveSummary';
import { ComparisonChart } from '@/components/ComparisonChart';
import { TopPosts } from '@/components/TopPosts';
import { AIInsights } from '@/components/AIInsights';
import { exportToPDF } from '@/lib/exportToPDF';

const objectiveLabels = {
  analysis: 'Análisis de Resultados',
  improvements: 'Evidenciar Mejoras Realizadas',
  monthly_report: 'Crear Reporte del Mes',
};

const platformLabels = {
  instagram: 'Instagram 📸',
  facebook: 'Facebook 👍',
};

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Date range filter state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  // Initialize date range when report data loads
  useEffect(() => {
    if (!dateRange && report?.data) {
      // Try to get date range from any available data
      const instagramData = report.data.instagram?.reach || 
                           report.data.instagram?.impressions ||
                           report.data.instagram?.interactions;
      const facebookData = report.data.facebook?.reach ||
                          report.data.facebook?.impressions ||
                          report.data.facebook?.interactions;
      
      const data = instagramData || facebookData;
      if (data && data.length > 0) {
        const minDate = new Date(data[0].date);
        const maxDate = new Date(data[data.length - 1].date);
        setDateRange({ from: minDate, to: maxDate });
      }
    }
  }, [report, dateRange]);

  const loadReport = async () => {
    if (!reportId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getDocument('reports', reportId);

      if (fetchError || !data) {
        throw new Error('No se pudo cargar el reporte');
      }

      setReport(data as Report);
    } catch (err: any) {
      console.error('Error loading report:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!report) return;
    
    setIsExporting(true);
    try {
      const result = await exportToPDF(report, reportId);
      if (!result.success) {
        throw new Error(result.error || 'Error al exportar PDF');
      }
    } catch (err: any) {
      console.error('Error exporting PDF:', err);
      alert('Error al exportar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'No se pudo cargar el reporte'}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/dashboard')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  // Check if we have both platforms for comparisons
  const hasBothPlatforms = report.data?.instagram && report.data?.facebook;

  return (
    <div className="container mx-auto py-8 px-4 space-y-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Tu Reporte</h1>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">
              {objectiveLabels[report.objective as keyof typeof objectiveLabels]}
            </Badge>
            {report.platforms.map((platform) => (
              <Badge key={platform} variant="secondary">
                {platformLabels[platform as keyof typeof platformLabels]}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
          <Button onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <ExecutiveSummary report={report} />

      {/* AI Insights */}
      <AIInsights 
        report={report} 
        reportId={reportId}
        onInsightsGenerated={() => loadReport()}
      />

      {/* Comparison Charts - Only if both platforms exist */}
      {hasBothPlatforms && (
        <div className="space-y-8">
          {/* Alcance/Espectadores Comparison */}
          {report.data.instagram?.reach && report.data.facebook?.reach && (
            <ComparisonChart
              instagramData={report.data.instagram.reach}
              facebookData={report.data.facebook.reach}
              title="Alcance: Instagram vs Facebook"
              instagramLabel="Instagram - Alcance"
              facebookLabel="Facebook - Espectadores"
              chartType="line"
            />
          )}

          {/* Visualizaciones Comparison */}
          {report.data.instagram?.impressions && report.data.facebook?.impressions && (
            <ComparisonChart
              instagramData={report.data.instagram.impressions}
              facebookData={report.data.facebook.impressions}
              title="Visualizaciones: Instagram vs Facebook"
              chartType="bar"
            />
          )}

          {/* Interacciones Comparison */}
          {report.data.instagram?.interactions && report.data.facebook?.interactions && (
            <ComparisonChart
              instagramData={report.data.instagram.interactions}
              facebookData={report.data.facebook.interactions}
              title="Interacciones: Instagram vs Facebook"
              chartType="line"
            />
          )}
        </div>
      )}

      {/* Top Posts */}
      <TopPosts
        instagramPosts={report.data?.instagram?.content}
        facebookPosts={report.data?.facebook?.content}
      />

      {/* Individual Platform Metrics */}
      {report.data?.instagram && (
        <div className="space-y-8">
          <div className="border-t pt-8">
            <h2 className="text-3xl font-bold mb-6">📸 Instagram - Métricas Detalladas</h2>
          </div>

          {report.data.instagram.reach && (
            <MetricSection
              title="Instagram - Alcance"
              emoji="📸"
              data={report.data.instagram.reach}
              color="#e91e63"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.instagram.impressions && (
            <MetricSection
              title="Instagram - Visualizaciones"
              emoji="👁️"
              data={report.data.instagram.impressions}
              color="#9c27b0"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.instagram.interactions && (
            <MetricSection
              title="Instagram - Interacciones"
              emoji="💬"
              data={report.data.instagram.interactions}
              color="#673ab7"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.instagram.followers && (
            <MetricSection
              title="Instagram - Seguidores"
              emoji="👥"
              data={report.data.instagram.followers}
              color="#3f51b5"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.instagram.linkClicks && (
            <MetricSection
              title="Instagram - Clics en el enlace"
              emoji="🔗"
              data={report.data.instagram.linkClicks}
              color="#2196f3"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.instagram.visits && (
            <MetricSection
              title="Instagram - Visitas al perfil"
              emoji="🚪"
              data={report.data.instagram.visits}
              color="#03a9f4"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.instagram.content && (
            <ContentTable
              title="Instagram - Contenido"
              emoji="📱"
              data={report.data.instagram.content}
              color="#e91e63"
            />
          )}
        </div>
      )}

      {report.data?.facebook && (
        <div className="space-y-8">
          <div className="border-t pt-8">
            <h2 className="text-3xl font-bold mb-6">👍 Facebook - Métricas Detalladas</h2>
          </div>

          {report.data.facebook.reach && (
            <MetricSection
              title="Facebook - Espectadores"
              emoji="👍"
              data={report.data.facebook.reach}
              color="#3b82f6"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.facebook.impressions && (
            <MetricSection
              title="Facebook - Visualizaciones"
              emoji="👁️"
              data={report.data.facebook.impressions}
              color="#1e40af"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.facebook.interactions && (
            <MetricSection
              title="Facebook - Interacciones"
              emoji="💬"
              data={report.data.facebook.interactions}
              color="#1e3a8a"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.facebook.followers && (
            <MetricSection
              title="Facebook - Seguidores"
              emoji="👥"
              data={report.data.facebook.followers}
              color="#0ea5e9"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.facebook.linkClicks && (
            <MetricSection
              title="Facebook - Clics en el enlace"
              emoji="🔗"
              data={report.data.facebook.linkClicks}
              color="#0284c7"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.facebook.visits && (
            <MetricSection
              title="Facebook - Visitas al perfil"
              emoji="🚪"
              data={report.data.facebook.visits}
              color="#0369a1"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {report.data.facebook.content && (
            <ContentTable
              title="Facebook - Contenido"
              emoji="📄"
              data={report.data.facebook.content}
              color="#3b82f6"
            />
          )}
        </div>
      )}
    </div>
  );
}