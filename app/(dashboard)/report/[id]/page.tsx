'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import ReportLayoutV2 from '@/components/dashboard/ReportLayoutV2';
import ReportSheet1 from '@/components/dashboard/ReportSheet1';
import ReportSheet2 from '@/components/dashboard/ReportSheet2';
import PersonalNotes from '@/components/dashboard/PersonalNotes';
import DateRangeModal from '@/components/dashboard/DateRangeModal';
import { Eye, Users, Heart, UserPlus } from 'lucide-react';
import { getDocument, updateDocument } from '@/lib/firebase/firestore';
import { uploadClientLogo, resizeImage } from '@/lib/firebase/storage';
import { exportDashboardToPDF } from '@/lib/exportToPDF';
import type { Report, PlatformData } from '@/lib/types';

export default function ReportPage() {
  const params = useParams();
  const reportId = params?.id as string;
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [tokensRemaining, setTokensRemaining] = useState(3); // TODO: Cargar desde Firestore user.tokens
  const [currentPage, setCurrentPage] = useState(0); // 0 = HOJA 1, 1 = HOJA 2

  // Estado principal del reporte
  const [reportData, setReportData] = useState<any>(null);
  const [fullData, setFullData] = useState<any>(null); // Datos completos sin filtrar
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [clientLogo, setClientLogo] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateStart, setDateStart] = useState<Date>(new Date());
  const [dateEnd, setDateEnd] = useState<Date>(new Date());

  // Estado para métrica seleccionada (auto-detectar la más relevante)
  const [selectedMetric, setSelectedMetric] = useState({
    label: 'Alcance',
    value: 0,
    icon: Users,
    color: 'blue' as const,
  });

  // PASO 1: CARGAR DATOS DESDE FIRESTORE
  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);

        // Obtener datos reales de Firestore
        const { data: firestoreReport, error } = await getDocument('reports', reportId);

        if (error || !firestoreReport) {
          console.error('Error loading report:', error);
          setLoading(false);
          return;
        }

        const report = firestoreReport as Report;

        // Establecer plataformas desde el reporte
        setSelectedPlatforms(report.platforms || []);

        // Establecer logo si existe
        if (report.clientLogo) {
          setClientLogo(report.clientLogo);
        }

        // Guardar datos completos
        setFullData(report);

        // Filtrar según plataformas seleccionadas
        const filteredData = filterDataByPlatforms(report, report.platforms || []);
        setReportData(filteredData);

        // Auto-seleccionar métrica más relevante
        autoSelectMostRelevantMetric(filteredData.metrics);

        setLoading(false);
      } catch (error) {
        console.error('Error loading report:', error);
        setLoading(false);
      }
    }

    if (reportId) {
      loadReport();
    }
  }, [reportId]);

  // PASO 2: FILTRAR DATOS CUANDO CAMBIAN LAS PLATAFORMAS
  useEffect(() => {
    if (fullData) {
      const filtered = filterDataByPlatforms(fullData, selectedPlatforms);
      setReportData(filtered);
      autoSelectMostRelevantMetric(filtered.metrics);
    }
  }, [selectedPlatforms, fullData]);

  // FUNCIÓN: Filtrar datos por plataformas seleccionadas
  function filterDataByPlatforms(report: Report, platforms: string[]) {
    let combinedMetrics = {
      visualizations: 0,
      reach: 0,
      interactions: 0,
      followers: 0,
    };

    let combinedDailyData: any[] = [];

    // Combinar métricas según plataformas seleccionadas
    if (platforms.includes('instagram') && report.data?.instagram) {
      const instagram = report.data.instagram;

      // Sumar totales de cada métrica
      combinedMetrics.visualizations += instagram.impressionsStats?.total || 0;
      combinedMetrics.reach += instagram.reachStats?.total || 0;
      combinedMetrics.interactions += instagram.interactionsStats?.total || 0;
      combinedMetrics.followers += instagram.followersStats?.total || 0;

      // Combinar datos diarios de todas las métricas
      const dailyDataMap = new Map<string, any>();

      // Procesar cada métrica
      if (instagram.impressions) {
        instagram.impressions.forEach((point) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.visualizations += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (instagram.reach) {
        instagram.reach.forEach((point) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.reach += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (instagram.interactions) {
        instagram.interactions.forEach((point) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.interactions += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (instagram.followers) {
        instagram.followers.forEach((point) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.followers += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      combinedDailyData = Array.from(dailyDataMap.values());
    }

    if (platforms.includes('facebook') && report.data?.facebook) {
      const facebook = report.data.facebook;

      // Sumar totales de cada métrica
      combinedMetrics.visualizations += facebook.impressionsStats?.total || 0;
      combinedMetrics.reach += facebook.reachStats?.total || 0;
      combinedMetrics.interactions += facebook.interactionsStats?.total || 0;
      combinedMetrics.followers += facebook.followersStats?.total || 0;

      // Combinar datos diarios
      const dailyDataMap = new Map<string, any>();

      // Si ya hay datos de Instagram, cargar en el mapa
      combinedDailyData.forEach(day => {
        dailyDataMap.set(day.date, day);
      });

      // Procesar cada métrica de Facebook
      if (facebook.impressions) {
        facebook.impressions.forEach((point) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.visualizations += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (facebook.reach) {
        facebook.reach.forEach((point) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.reach += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (facebook.interactions) {
        facebook.interactions.forEach((point) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.interactions += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (facebook.followers) {
        facebook.followers.forEach((point) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.followers += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      combinedDailyData = Array.from(dailyDataMap.values());
    }

    // Ordenar por fecha
    combinedDailyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Formatear fechas para el gráfico
    const chartData = combinedDailyData.map(day => ({
      date: formatChartDate(day.date),
      visualizations: day.visualizations,
      reach: day.reach,
      interactions: day.interactions,
      followers: day.followers,
    }));

    // Calcular rango de fechas
    const dateRange = calculateDateRange(report, combinedDailyData);

    return {
      title: report.title || 'MI REPORTE',
      dateRange,
      platforms,
      metrics: combinedMetrics,
      chartData,
      insights: report.aiInsights || [],
    };
  }

  // FUNCIÓN: Auto-seleccionar métrica más relevante
  function autoSelectMostRelevantMetric(metrics: any) {
    // Lógica: Seleccionar la métrica con mayor valor
    const metricValues = [
      { key: 'reach', value: metrics.reach, label: 'Alcance', icon: Users, color: 'blue' as const },
      { key: 'visualizations', value: metrics.visualizations, label: 'Visualizaciones', icon: Eye, color: 'purple' as const },
      { key: 'interactions', value: metrics.interactions, label: 'Interacciones', icon: Heart, color: 'pink' as const },
      { key: 'followers', value: metrics.followers, label: 'Seguidores', icon: UserPlus, color: 'green' as const },
    ];
    
    // Ordenar por valor descendente
    metricValues.sort((a, b) => b.value - a.value);
    
    // Seleccionar el primero (mayor valor)
    const mostRelevant = metricValues[0];
    
    setSelectedMetric({
      label: mostRelevant.label,
      value: mostRelevant.value,
      icon: mostRelevant.icon,
      color: mostRelevant.color,
    });
  }

  // FUNCIÓN: Formatear fecha para gráfico
  function formatChartDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  }

  // FUNCIÓN: Calcular rango de fechas
  function calculateDateRange(report: Report, dailyData: any[]): string {
    if (dailyData.length === 0) {
      // Si no hay datos diarios, usar createdAt
      const createdDate = report.createdAt instanceof Date
        ? report.createdAt
        : typeof report.createdAt === 'string'
        ? new Date(report.createdAt)
        : report.createdAt.toDate();

      return createdDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // Usar las fechas de los datos diarios
    const dates = dailyData.map(d => new Date(d.date)).sort((a, b) => a.getTime() - b.getTime());
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    return `${startDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  // HANDLER: Click en punto del gráfico
  const handleChartClick = (metric: string, value: number) => {
    const config: Record<string, any> = {
      visualizations: { label: 'Visualizaciones', icon: Eye, color: 'purple' },
      reach: { label: 'Alcance', icon: Users, color: 'blue' },
      interactions: { label: 'Interacciones', icon: Heart, color: 'pink' },
      followers: { label: 'Seguidores', icon: UserPlus, color: 'green' },
    };

    if (config[metric]) {
      setSelectedMetric({
        label: config[metric].label,
        value,
        icon: config[metric].icon,
        color: config[metric].color,
      });
    }
  };

  // HANDLER: Cambio de plataformas
  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
  };

  // HANDLER: Cambio de título
  const handleTitleChange = async (newTitle: string) => {
    try {
      // Actualizar en Firestore
      await updateDocument('reports', reportId, { title: newTitle });
      
      // Actualizar localmente
      setReportData({ ...reportData, title: newTitle });
      setFullData({ ...fullData, title: newTitle });
      
      console.log('Título actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar título:', error);
      alert('Error al guardar el título. Por favor intenta nuevamente.');
    }
  };

  // HANDLER: Click en date picker (por implementar)
  const handleDateRangeClick = () => {
    setIsDateModalOpen(true);
  };

  const handleApplyDateRange = (start: Date, end: Date) => {
    setDateStart(start);
    setDateEnd(end);

    // Actualizar el rango en reportData
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const newDateRange = `${formatDate(start)} - ${formatDate(end)}`;

    setReportData({
      ...reportData,
      dateRange: newDateRange,
    });

    // TODO: Filtrar datos del gráfico por rango de fechas si lo deseas
  };

  // HANDLER: Upload de logo
  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploadingLogo(true);
      
      // Redimensionar imagen para optimizar
      const resizedFile = await resizeImage(file, 128, 128);
      
      // Subir a Firebase Storage
      const { url, error } = await uploadClientLogo(resizedFile, reportId);
      
      if (error) {
        alert(`Error al subir logo: ${error}`);
        setIsUploadingLogo(false);
        return;
      }
      
      if (url) {
        // Actualizar en Firestore
        await updateDocument('reports', reportId, { clientLogo: url });
        
        // Actualizar localmente
        setClientLogo(url);
        
        console.log('Logo subido exitosamente:', url);
      }
      
      setIsUploadingLogo(false);
    } catch (error) {
      console.error('Error al subir logo:', error);
      alert('Error al subir el logo. Por favor intenta nuevamente.');
      setIsUploadingLogo(false);
    }
  };

  // HANDLER: Exportar a PDF
  const handleExportPDF = async () => {
    try {
      await exportDashboardToPDF(reportData.title);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al generar el PDF. Por favor intenta nuevamente.');
    }
  };

  // HANDLER: Generar insights con IA (primera vez - gratis)
  const handleGenerateInsights = async () => {
    try {
      setIsGeneratingInsights(true);

      // TODO: Llamar a tu API route que usa Claude
      // const response = await fetch('/api/generate-insights', {
      //   method: 'POST',
      //   body: JSON.stringify({ reportId, metrics: reportData.metrics }),
      // });
      // const insights = await response.json();

      // SIMULACIÓN - Eliminar esto cuando conectes la API real
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockInsights = [
        {
          id: '1',
          title: 'Rendimiento Destacado',
          content: 'Tu alcance está por encima del promedio. Continúa con tu estrategia actual.',
          type: 'positive' as const,
        },
        {
          id: '2',
          title: 'Oportunidad de Mejora',
          content: 'Las interacciones son bajas en comparación con el alcance. Considera agregar más llamados a la acción.',
          type: 'warning' as const,
        },
      ];

      setReportData({
        ...reportData,
        insights: mockInsights,
      });

      setIsGeneratingInsights(false);
    } catch (error) {
      console.error('Error generating insights:', error);
      setIsGeneratingInsights(false);
    }
  };

  // HANDLER: Regenerar insights (consume 1 token)
  const handleRegenerateInsights = async () => {
    if (tokensRemaining <= 0) {
      alert('No tienes tokens disponibles');
      return;
    }

    try {
      setIsGeneratingInsights(true);

      // TODO: Llamar a tu API route que usa Claude Y descontar 1 token
      // const response = await fetch('/api/regenerate-insights', {
      //   method: 'POST',
      //   body: JSON.stringify({ reportId, metrics: reportData.metrics, userId: user.uid }),
      // });
      // const { insights, tokensRemaining: newTokens } = await response.json();

      // SIMULACIÓN - Eliminar esto cuando conectes la API real
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockInsights = [
        {
          id: '3',
          title: 'Nuevo Insight Generado',
          content: 'Este es un insight regenerado. Tu estrategia de contenido está mejorando.',
          type: 'info' as const,
        },
        {
          id: '4',
          title: 'Recomendación Actualizada',
          content: 'Enfócate en crear más contenido visual para aumentar el engagement.',
          type: 'suggestion' as const,
        },
      ];

      // Descontar 1 token
      setTokensRemaining(prev => prev - 1);

      // TODO: Actualizar tokens en Firestore
      // await updateDocument('users', user.uid, { tokens: tokensRemaining - 1 });

      setReportData({
        ...reportData,
        insights: mockInsights,
      });

      setIsGeneratingInsights(false);
    } catch (error) {
      console.error('Error regenerating insights:', error);
      setIsGeneratingInsights(false);
    }
  };

  // HANDLER: Guardar reporte
  const handleSaveReport = async () => {
    try {
      setIsSaving(true);

      // Guardar cambios en Firestore
      await updateDocument('reports', reportId, {
        title: reportData.title,
        clientLogo: clientLogo,
        updatedAt: new Date(),
      });

      alert('Reporte guardado exitosamente');
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Error al guardar el reporte');
      setIsSaving(false);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reporte...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se encontró el reporte</p>
        </div>
      </div>
    );
  }

  // Calcular datos derivados para HOJA 2
  const calculateSheet2Data = () => {
    if (!reportData || !reportData.chartData) {
      return {
        totalPosts: 0,
        totalInteractions: 0,
        frequency: '0 posts/día',
        chartData: [],
      };
    }

    // Contar posts totales (días con publicaciones > 0)
    const chartData = reportData.chartData || [];
    const totalPosts = chartData.filter((day: any) => day.visualizations > 0 || day.reach > 0).length;

    // Total de interacciones
    const totalInteractions = reportData.metrics?.interactions || 0;

    // Calcular frecuencia (posts por día)
    const daysInPeriod = chartData.length || 1;
    const frequency = `${(totalPosts / daysInPeriod).toFixed(1)} posts/día`;

    // Preparar datos para el gráfico combinado (barras + líneas)
    const sheet2ChartData = chartData.map((day: any) => ({
      date: day.date,
      posts: day.visualizations > 0 ? 1 : 0, // 1 si hubo post ese día, 0 si no
      interactions: day.interactions,
    }));

    return {
      totalPosts,
      totalInteractions,
      frequency,
      chartData: sheet2ChartData,
    };
  };

  const sheet2Data = calculateSheet2Data();

  return (
    <>
      {/* Indicador de carga para upload de logo */}
      {isUploadingLogo && (
        <div className="fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Subiendo logo...</span>
        </div>
      )}

      {/* NUEVO LAYOUT V2 - 2 HOJAS */}
      <ReportLayoutV2
        reportTitle={reportData.title}
        dateRange={reportData.dateRange}
        platforms={selectedPlatforms}
        clientLogo={clientLogo}
        onTitleChange={handleTitleChange}
        onPlatformChange={handlePlatformChange}
        onDateRangeClick={handleDateRangeClick}
        onLogoUpload={handleLogoUpload}
        onSave={handleSaveReport}
        onExportPDF={handleExportPDF}
        isSaving={isSaving}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      >
        {/* Contenedor para exportación a PDF */}
        <div id="dashboard-content">
          {/* HOJA 1 - Métricas */}
          {currentPage === 0 && (
            <ReportSheet1
              metrics={reportData.metrics}
              chartData={reportData.chartData}
              selectedMetric={selectedMetric}
              insights={reportData.insights}
              onGenerateInsights={handleGenerateInsights}
              onRegenerateInsights={handleRegenerateInsights}
              isGenerating={isGeneratingInsights}
              tokensRemaining={tokensRemaining}
              onPurchaseTokens={() => window.location.href = '/tokens'}
            />
          )}

          {/* HOJA 2 - Contenido */}
          {currentPage === 1 && (
            <ReportSheet2
              totalPosts={sheet2Data.totalPosts}
              totalInteractions={sheet2Data.totalInteractions}
              frequency={sheet2Data.frequency}
              chartData={sheet2Data.chartData}
              contentInsights={reportData.insights}
              onGenerateInsights={handleGenerateInsights}
              onRegenerateInsights={handleRegenerateInsights}
              isGenerating={isGeneratingInsights}
              tokensRemaining={tokensRemaining}
              onPurchaseTokens={() => window.location.href = '/tokens'}
            />
          )}

          {/* Notas Personales - Visible en ambas hojas */}
          {user && (
            <div className="mt-6">
              <PersonalNotes
                reportId={reportId}
                userId={user.uid}
              />
            </div>
          )}
        </div>
      </ReportLayoutV2>

      {/* Modal Date Picker */}
      <DateRangeModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        currentStartDate={dateStart}
        currentEndDate={dateEnd}
        onApply={handleApplyDateRange}
      />
    </>
  );
}