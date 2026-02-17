'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReportLayoutV2 from '@/components/dashboard/ReportLayoutV2';
import ReportSheet1 from '@/components/dashboard/ReportSheet1';
import ReportSheet2 from '@/components/dashboard/ReportSheet2';
import ReportSheetAnalysis from '@/components/dashboard/ReportSheetAnalysis';
import ReportSheetImprovements from '@/components/dashboard/ReportSheetImprovements';
import { Eye, Users, Heart, UserPlus } from 'lucide-react';
import { exportReportToPDF } from '@/lib/exportToPDF';
import type { Report, ReportObjective } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default function SharedReportPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const [reportData, setReportData] = useState<any>(null);
  const [fullData, setFullData] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [clientLogo, setClientLogo] = useState<string | undefined>(undefined);
  const [reportObjective, setReportObjective] = useState<ReportObjective>('monthly_report');

  const [selectedMetric, setSelectedMetric] = useState<{
    label: string;
    value: number;
    icon: any;
    color: 'blue' | 'purple' | 'pink' | 'green';
  }>({
    label: 'Alcance',
    value: 0,
    icon: Users,
    color: 'blue',
  });

  // Cargar reporte desde la API pública
  useEffect(() => {
    async function loadSharedReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/share/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Error al cargar el reporte');
          setLoading(false);
          return;
        }

        const report = data.report as Report;

        setSelectedPlatforms(report.platforms || []);
        setAvailablePlatforms(report.platforms || []);
        setReportObjective(report.objective || 'monthly_report');

        if (report.clientLogo) {
          setClientLogo(report.clientLogo);
        }

        setFullData(report);

        const filteredData = filterDataByPlatforms(report, report.platforms || []);
        setReportData(filteredData);
        autoSelectMostRelevantMetric(filteredData.metrics);

        setLoading(false);
      } catch {
        setError('Error de conexión');
        setLoading(false);
      }
    }

    if (token) {
      loadSharedReport();
    }
  }, [token]);

  // Refiltrar cuando cambian las plataformas
  useEffect(() => {
    if (fullData) {
      const filtered = filterDataByPlatforms(fullData, selectedPlatforms);
      setReportData(filtered);
      autoSelectMostRelevantMetric(filtered.metrics);
    }
  }, [selectedPlatforms, fullData]);

  // Misma lógica de filtrado que el reporte original
  function filterDataByPlatforms(report: Report, platforms: string[]) {
    let combinedMetrics = {
      visualizations: 0,
      reach: 0,
      interactions: 0,
      followers: 0,
    };

    let combinedDailyData: any[] = [];

    const processPlatform = (platformData: any, existingData: any[]) => {
      const dailyDataMap = new Map<string, any>();
      existingData.forEach(day => dailyDataMap.set(day.date, day));

      combinedMetrics.visualizations += platformData.impressionsStats?.total || 0;
      combinedMetrics.reach += platformData.reachStats?.total || 0;
      combinedMetrics.interactions += platformData.interactionsStats?.total || 0;
      combinedMetrics.followers += platformData.followersStats?.total || 0;

      const metrics = ['impressions', 'reach', 'interactions', 'followers'];
      const metricKeys = ['visualizations', 'reach', 'interactions', 'followers'];

      metrics.forEach((metric, i) => {
        if (platformData[metric] && Array.isArray(platformData[metric])) {
          platformData[metric].forEach((point: any) => {
            const existing = dailyDataMap.get(point.date) || {
              date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0,
            };
            existing[metricKeys[i]] += point.value;
            dailyDataMap.set(point.date, existing);
          });
        }
      });

      return Array.from(dailyDataMap.values());
    };

    if (platforms.includes('instagram') && report.data?.instagram) {
      combinedDailyData = processPlatform(report.data.instagram, combinedDailyData);
    }
    if (platforms.includes('facebook') && report.data?.facebook) {
      combinedDailyData = processPlatform(report.data.facebook, combinedDailyData);
    }
    if (platforms.includes('linkedin') && report.data?.linkedin) {
      combinedDailyData = processPlatform(report.data.linkedin, combinedDailyData);
    }
    if (platforms.includes('tiktok') && report.data?.tiktok) {
      combinedDailyData = processPlatform(report.data.tiktok, combinedDailyData);
    }

    combinedDailyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const chartData = combinedDailyData.map(day => ({
      date: formatChartDate(day.date),
      visualizations: day.visualizations,
      reach: day.reach,
      interactions: day.interactions,
      followers: day.followers,
    }));

    const dateRange = calculateDateRange(report, combinedDailyData);

    return {
      title: report.title || 'REPORTE',
      dateRange,
      platforms,
      metrics: combinedMetrics,
      chartData,
      insights: report.aiInsights || [],
    };
  }

  function autoSelectMostRelevantMetric(metrics: any) {
    const metricValues = [
      { key: 'reach', value: metrics.reach, label: 'Alcance', icon: Users, color: 'blue' as const },
      { key: 'visualizations', value: metrics.visualizations, label: 'Visualizaciones', icon: Eye, color: 'purple' as const },
      { key: 'interactions', value: metrics.interactions, label: 'Interacciones', icon: Heart, color: 'pink' as const },
      { key: 'followers', value: metrics.followers, label: 'Seguidores', icon: UserPlus, color: 'green' as const },
    ];
    metricValues.sort((a, b) => b.value - a.value);
    setSelectedMetric({
      label: metricValues[0].label,
      value: metricValues[0].value,
      icon: metricValues[0].icon,
      color: metricValues[0].color,
    });
  }

  function formatChartDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  }

  function calculateDateRange(report: Report, dailyData: any[]): string {
    if (dailyData.length === 0) {
      const createdDate = report.createdAt instanceof Date
        ? report.createdAt
        : typeof report.createdAt === 'string'
        ? new Date(report.createdAt)
        : new Date();
      return createdDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const dates = dailyData.map(d => new Date(d.date)).sort((a, b) => a.getTime() - b.getTime());
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    return `${startDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
  };

  const handleExportPDF = async () => {
    if (!reportData?.title || isExportingPDF) return;
    setIsExportingPDF(true);
    try {
      await exportReportToPDF(reportData.title, setCurrentPage, currentPage, 2);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const calculateSheet2Data = () => {
    if (!reportData || !reportData.chartData) {
      return { totalPosts: 0, totalInteractions: 0, frequency: '0 posts/día', chartData: [] };
    }

    const chartData = reportData.chartData || [];
    const totalPosts = chartData.filter((day: any) => day.visualizations > 0 || day.reach > 0).length;
    const totalInteractions = reportData.metrics?.interactions || 0;
    const daysInPeriod = chartData.length || 1;
    const frequency = `${(totalPosts / daysInPeriod).toFixed(1)} posts/día`;

    const sheet2ChartData = chartData.map((day: any) => ({
      date: day.date,
      posts: day.visualizations > 0 ? 1 : 0,
      interactions: day.interactions,
    }));

    return { totalPosts, totalInteractions, frequency, chartData: sheet2ChartData };
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#11120D] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#019B77] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#B6B6B6]">Cargando reporte...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-[#11120D] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">!</span>
          </div>
          <h1 className="text-xl font-bold text-[#FBFEF2] mb-2">Reporte no disponible</h1>
          <p className="text-[#B6B6B6] mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] rounded-lg transition-colors font-medium"
          >
            Ir a DataPal
          </Link>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-[#11120D] flex items-center justify-center">
        <p className="text-[#B6B6B6]">No se encontró el reporte</p>
      </div>
    );
  }

  const sheet2Data = calculateSheet2Data();

  // Funciones no-op para el modo read-only (insights no se pueden generar)
  const noOp = () => {};

  return (
    <>
      {/* Banner DataPal */}
      <div className="bg-[#019B77] text-[#FBFEF2] text-center py-2 px-4 text-sm">
        <span>Reporte generado con </span>
        <Link href="/" className="font-bold underline hover:text-white">
          DataPal
        </Link>
        <span> — Reportes automatizados para agencias y freelancers</span>
      </div>

      {/* Reporte en modo read-only */}
      <ReportLayoutV2
        reportTitle={reportData.title}
        dateRange={reportData.dateRange}
        platforms={selectedPlatforms}
        availablePlatforms={availablePlatforms}
        clientLogo={clientLogo}
        onPlatformChange={handlePlatformChange}
        onExportPDF={handleExportPDF}
        isExporting={isExportingPDF}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      >
        <div id="dashboard-content">
          {reportObjective === 'analysis' && (
            <ReportSheetAnalysis
              metrics={reportData.metrics}
              chartData={reportData.chartData}
              insights={reportData.insights}
              onGenerateInsights={noOp}
              onRegenerateInsights={noOp}
              isGenerating={false}
              tokensRemaining={0}
              currentSheet={currentPage}
              onPurchaseTokens={noOp}
            />
          )}

          {reportObjective === 'improvements' && (
            <ReportSheetImprovements
              metrics={reportData.metrics}
              chartData={reportData.chartData}
              insights={reportData.insights}
              onGenerateInsights={noOp}
              onRegenerateInsights={noOp}
              isGenerating={false}
              tokensRemaining={0}
              currentSheet={currentPage}
              onPurchaseTokens={noOp}
            />
          )}

          {reportObjective === 'monthly_report' && (
            <>
              {currentPage === 0 && (
                <ReportSheet1
                  metrics={reportData.metrics}
                  chartData={reportData.chartData}
                  selectedMetric={selectedMetric}
                  insights={reportData.insights}
                  onGenerateInsights={noOp}
                  onRegenerateInsights={noOp}
                  isGenerating={false}
                  tokensRemaining={0}
                  onPurchaseTokens={noOp}
                />
              )}
              {currentPage === 1 && (
                <ReportSheet2
                  totalPosts={sheet2Data.totalPosts}
                  totalInteractions={sheet2Data.totalInteractions}
                  frequency={sheet2Data.frequency}
                  chartData={sheet2Data.chartData}
                  contentInsights={reportData.insights}
                  onGenerateInsights={noOp}
                  onRegenerateInsights={noOp}
                  isGenerating={false}
                  tokensRemaining={0}
                  onPurchaseTokens={noOp}
                />
              )}
            </>
          )}
        </div>
      </ReportLayoutV2>
    </>
  );
}
