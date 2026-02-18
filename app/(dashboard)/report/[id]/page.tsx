'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReportLayoutV2 from '@/components/dashboard/ReportLayoutV2';
import ReportSheet1 from '@/components/dashboard/ReportSheet1';
import ReportSheet2 from '@/components/dashboard/ReportSheet2';
import ReportSheetAnalysis from '@/components/dashboard/ReportSheetAnalysis';
import ReportSheetImprovements from '@/components/dashboard/ReportSheetImprovements';
import PersonalNotes from '@/components/dashboard/PersonalNotes';
import DateRangeModal from '@/components/dashboard/DateRangeModal';
import LoginModal from '@/components/auth/LoginModal';
import { Eye, Users, Heart, UserPlus } from 'lucide-react';
import { getDocument, updateDocument, deleteDocument } from '@/lib/firebase/firestore';
import { uploadClientLogo } from '@/lib/cloudinary/upload';
import { useAuth } from '@/contexts/AuthContext';
import type { Report, PlatformData, ReportObjective } from '@/lib/types';
import AIConfirmModal from '@/components/dashboard/AIConfirmModal';
import DiscardConfirmModal from '@/components/dashboard/DiscardConfirmModal';
import ShareReportModal from '@/components/dashboard/ShareReportModal';
import { exportReportToPDF, type ExportProgress } from '@/lib/exportToPDF';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;
  const { user, userData, canUseAI, aiUsageRemaining, refreshUserData } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLimitReachedModal, setShowLimitReachedModal] = useState(false);
  const [showAIConfirmModal, setShowAIConfirmModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // 0 = HOJA 1, 1 = HOJA 2

  // Estado principal del reporte
  const [reportData, setReportData] = useState<any>(null);
  const [fullData, setFullData] = useState<any>(null); // Datos completos sin filtrar
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [clientLogo, setClientLogo] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateStart, setDateStart] = useState<Date>(new Date());
  const [dateEnd, setDateEnd] = useState<Date>(new Date());
  const [reportObjective, setReportObjective] = useState<ReportObjective>('monthly_report');

  // Estado para métrica seleccionada (auto-detectar la más relevante)
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

        // DEBUG: Log report data structure
        console.log('===== REPORT LOADED FROM FIRESTORE =====');
        console.log('Report ID:', reportId);
        console.log('Report platforms:', report.platforms);
        console.log('Report data exists?:', !!report.data);
        console.log('Report data keys:', report.data ? Object.keys(report.data) : 'NO DATA');

        if (report.data?.instagram) {
          console.log('Instagram data keys:', Object.keys(report.data.instagram));
          console.log('Instagram reach length:', report.data.instagram.reach?.length || 0);
          console.log('Instagram impressions length:', report.data.instagram.impressions?.length || 0);
          console.log('Instagram reach stats:', report.data.instagram.reachStats);
          console.log('Instagram impressions stats:', report.data.instagram.impressionsStats);
        }

        if (report.data?.facebook) {
          console.log('Facebook data keys:', Object.keys(report.data.facebook));
          console.log('Facebook reach length:', report.data.facebook.reach?.length || 0);
          console.log('Facebook impressions length:', report.data.facebook.impressions?.length || 0);
        }

        if (report.data?.linkedin) {
          console.log('LinkedIn data keys:', Object.keys(report.data.linkedin));
          console.log('LinkedIn impressions length:', report.data.linkedin.impressions?.length || 0);
          console.log('LinkedIn reach length:', report.data.linkedin.reach?.length || 0);
          console.log('LinkedIn impressions stats:', report.data.linkedin.impressionsStats);
          console.log('LinkedIn reach stats:', report.data.linkedin.reachStats);
          console.log('LinkedIn interactions stats:', report.data.linkedin.interactionsStats);
          console.log('LinkedIn content length:', report.data.linkedin.content?.length || 0);
        }

        if (report.data?.tiktok) {
          console.log('TikTok data keys:', Object.keys(report.data.tiktok));
          console.log('TikTok impressions length:', report.data.tiktok.impressions?.length || 0);
          console.log('TikTok reach length:', report.data.tiktok.reach?.length || 0);
          console.log('TikTok impressions stats:', report.data.tiktok.impressionsStats);
          console.log('TikTok reach stats:', report.data.tiktok.reachStats);
        }

        console.log('========================================');

        // Establecer plataformas desde el reporte
        setSelectedPlatforms(report.platforms || []);
        setAvailablePlatforms(report.platforms || []);

        // Establecer objetivo del reporte
        setReportObjective(report.objective || 'monthly_report');

        // Establecer logo si existe
        if (report.clientLogo) {
          setClientLogo(report.clientLogo);
        }

        // Guardar datos completos
        setFullData(report);

        // Filtrar según plataformas seleccionadas
        const filteredData = filterDataByPlatforms(report, report.platforms || []);

        console.log('===== FILTERED DATA =====');
        console.log('Filtered metrics:', filteredData.metrics);
        console.log('Filtered chartData length:', filteredData.chartData?.length || 0);
        console.log('========================');

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

    // Procesar LinkedIn
    if (platforms.includes('linkedin') && report.data?.linkedin) {
      const linkedin = report.data.linkedin;

      console.log('[LinkedIn] Processing LinkedIn data:', Object.keys(linkedin));
      console.log('[LinkedIn] impressionsStats:', linkedin.impressionsStats);
      console.log('[LinkedIn] reachStats:', linkedin.reachStats);
      console.log('[LinkedIn] interactionsStats:', linkedin.interactionsStats);

      // Sumar totales de cada métrica
      combinedMetrics.visualizations += linkedin.impressionsStats?.total || 0;
      combinedMetrics.reach += linkedin.reachStats?.total || 0;
      combinedMetrics.interactions += linkedin.interactionsStats?.total || 0;
      // LinkedIn no tiene followers en el export de métricas

      // Combinar datos diarios
      const dailyDataMap = new Map<string, any>();

      // Si ya hay datos de otras plataformas, cargar en el mapa
      combinedDailyData.forEach(day => {
        dailyDataMap.set(day.date, day);
      });

      // Procesar cada métrica de LinkedIn
      if (linkedin.impressions && Array.isArray(linkedin.impressions)) {
        linkedin.impressions.forEach((point: any) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.visualizations += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (linkedin.reach && Array.isArray(linkedin.reach)) {
        linkedin.reach.forEach((point: any) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.reach += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (linkedin.interactions && Array.isArray(linkedin.interactions)) {
        linkedin.interactions.forEach((point: any) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.interactions += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      combinedDailyData = Array.from(dailyDataMap.values());
    }

    // Procesar TikTok
    if (platforms.includes('tiktok') && report.data?.tiktok) {
      const tiktok = report.data.tiktok;

      console.log('[TikTok] Processing TikTok data:', Object.keys(tiktok));

      // Sumar totales de cada métrica
      combinedMetrics.visualizations += tiktok.impressionsStats?.total || 0;
      combinedMetrics.reach += tiktok.reachStats?.total || 0;
      combinedMetrics.interactions += tiktok.interactionsStats?.total || 0;
      combinedMetrics.followers += tiktok.followersStats?.total || 0;

      // Combinar datos diarios
      const dailyDataMap = new Map<string, any>();

      // Si ya hay datos de otras plataformas, cargar en el mapa
      combinedDailyData.forEach(day => {
        dailyDataMap.set(day.date, day);
      });

      // Procesar cada métrica de TikTok
      if (tiktok.impressions && Array.isArray(tiktok.impressions)) {
        tiktok.impressions.forEach((point: any) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.visualizations += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (tiktok.reach && Array.isArray(tiktok.reach)) {
        tiktok.reach.forEach((point: any) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.reach += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (tiktok.interactions && Array.isArray(tiktok.interactions)) {
        tiktok.interactions.forEach((point: any) => {
          const existing = dailyDataMap.get(point.date) || { date: point.date, visualizations: 0, reach: 0, interactions: 0, followers: 0 };
          existing.interactions += point.value;
          dailyDataMap.set(point.date, existing);
        });
      }

      if (tiktok.followers && Array.isArray(tiktok.followers)) {
        tiktok.followers.forEach((point: any) => {
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

  // HANDLER: Upload de logo (usando Cloudinary)
  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploadingLogo(true);

      // Subir a Cloudinary (redimensiona automáticamente)
      const { url, error } = await uploadClientLogo(file, reportId);

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

  // HANDLER: Mostrar modal de confirmación para generar insights
  const handleGenerateInsights = () => {
    // Verificar autenticación
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Verificar límite de uso
    if (!canUseAI) {
      setShowLimitReachedModal(true);
      return;
    }

    // Mostrar modal de confirmación
    setShowAIConfirmModal(true);
  };

  // HANDLER: Confirmar y ejecutar generación de insights
  const handleConfirmGenerateInsights = async () => {
    setShowAIConfirmModal(false);

    try {
      setIsGeneratingInsights(true);

      // Llamar a la API de insights con el userId
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.uid || '',
        },
        body: JSON.stringify({
          reportData: fullData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setShowLoginModal(true);
          setIsGeneratingInsights(false);
          return;
        }
        if (response.status === 429) {
          setShowLimitReachedModal(true);
          await refreshUserData();
          setIsGeneratingInsights(false);
          return;
        }
        throw new Error(data.error || 'Error al generar insights');
      }

      // Parsear el insight recibido
      const parsedInsights = parseInsightResponse(data.insight);

      setReportData({
        ...reportData,
        insights: parsedInsights,
      });

      // Guardar insights en Firestore
      await updateDocument('reports', reportId, {
        aiInsights: parsedInsights,
        lastInsightGeneration: new Date(),
      });

      // Refrescar datos del usuario para actualizar contador
      await refreshUserData();

      setIsGeneratingInsights(false);
    } catch (error) {
      console.error('Error generating insights:', error);
      alert('Error al generar insights. Por favor intenta nuevamente.');
      setIsGeneratingInsights(false);
    }
  };

  // Función para parsear la respuesta de la IA
  const parseInsightResponse = (insight: string) => {
    // Crear un insight basado en la respuesta
    return [
      {
        id: Date.now().toString(),
        title: 'Análisis de IA',
        content: insight,
        type: 'info' as const,
      },
    ];
  };

  // HANDLER: Regenerar insights (consume 1 consulta)
  const handleRegenerateInsights = async () => {
    // Verificar autenticación
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Verificar límite de uso
    if (!canUseAI) {
      setShowLimitReachedModal(true);
      return;
    }

    try {
      setIsGeneratingInsights(true);

      // Llamar a la API de insights con el userId
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.uid || '',
        },
        body: JSON.stringify({
          reportData: fullData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setShowLoginModal(true);
          setIsGeneratingInsights(false);
          return;
        }
        if (response.status === 429) {
          setShowLimitReachedModal(true);
          await refreshUserData();
          setIsGeneratingInsights(false);
          return;
        }
        throw new Error(data.error || 'Error al regenerar insights');
      }

      // Parsear el insight recibido
      const parsedInsights = parseInsightResponse(data.insight);

      setReportData({
        ...reportData,
        insights: parsedInsights,
      });

      // Guardar insights en Firestore
      await updateDocument('reports', reportId, {
        aiInsights: parsedInsights,
        lastInsightGeneration: new Date(),
      });

      // Refrescar datos del usuario para actualizar contador
      await refreshUserData();

      setIsGeneratingInsights(false);
    } catch (error) {
      console.error('Error regenerating insights:', error);
      alert('Error al regenerar insights. Por favor intenta nuevamente.');
      setIsGeneratingInsights(false);
    }
  };

  // HANDLER: Navegar a página de pricing
  const handlePurchaseTokens = () => {
    router.push('/pricing');
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

  // HANDLER: Mostrar modal de descartar
  const handleShowDiscardModal = () => {
    setShowDiscardModal(true);
  };

  // HANDLER: Exportar reporte a PDF
  const handleExportPDF = async () => {
    if (!reportData?.title || isExportingPDF) return;

    setIsExportingPDF(true);
    setExportProgress({ step: 0, totalSteps: 4, message: 'Preparando...' });
    try {
      await exportReportToPDF(
        reportData.title,
        setCurrentPage,
        currentPage,
        2,
        {
          onProgress: (progress) => setExportProgress(progress),
          branding: userData?.branding,
        },
      );
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    } finally {
      setIsExportingPDF(false);
      // Mantener el mensaje de éxito por 2 segundos
      setTimeout(() => setExportProgress(null), 2000);
    }
  };

  // HANDLER: Confirmar descarte del reporte
  const handleConfirmDiscard = async () => {
    try {
      // Eliminar el reporte de Firestore
      await deleteDocument('reports', reportId);

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al descartar reporte:', error);
      alert('Error al descartar el reporte');
    }
  };

  // LOADING STATE
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

  if (!reportData) {
    return (
      <div className="min-h-screen bg-[#11120D] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#B6B6B6]">No se encontró el reporte</p>
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
        <div className="fixed top-4 right-4 bg-[#019B77] text-[#FBFEF2] px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 border border-[#019B77]/50">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#FBFEF2] border-t-transparent"></div>
          <span>Subiendo logo...</span>
        </div>
      )}

      {/* NUEVO LAYOUT V2 - 2 HOJAS */}
      <ReportLayoutV2
        reportTitle={reportData.title}
        dateRange={reportData.dateRange}
        platforms={selectedPlatforms}
        availablePlatforms={availablePlatforms}
        clientLogo={clientLogo}
        onTitleChange={handleTitleChange}
        onPlatformChange={handlePlatformChange}
        onDateRangeClick={handleDateRangeClick}
        onLogoUpload={handleLogoUpload}
        onSave={handleSaveReport}
        onDiscard={handleShowDiscardModal}
        onExportPDF={handleExportPDF}
        onShare={() => setShowShareModal(true)}
        isSaving={isSaving}
        isExporting={isExportingPDF}
        exportProgress={exportProgress}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      >
        {/* Contenedor para exportación a PDF */}
        <div id="dashboard-content">
          {/* Renderizado condicional según el objetivo del reporte */}

          {/* OBJETIVO: Análisis de Resultados */}
          {reportObjective === 'analysis' && (
            <ReportSheetAnalysis
              metrics={reportData.metrics}
              chartData={reportData.chartData}
              insights={reportData.insights}
              onGenerateInsights={handleGenerateInsights}
              onRegenerateInsights={handleRegenerateInsights}
              isGenerating={isGeneratingInsights}
              tokensRemaining={aiUsageRemaining}
              currentSheet={currentPage}
              onPurchaseTokens={handlePurchaseTokens}
            />
          )}

          {/* OBJETIVO: Evidenciar Mejoras Realizadas */}
          {reportObjective === 'improvements' && (
            <ReportSheetImprovements
              metrics={reportData.metrics}
              chartData={reportData.chartData}
              insights={reportData.insights}
              onGenerateInsights={handleGenerateInsights}
              onRegenerateInsights={handleRegenerateInsights}
              isGenerating={isGeneratingInsights}
              tokensRemaining={aiUsageRemaining}
              currentSheet={currentPage}
              onPurchaseTokens={handlePurchaseTokens}
            />
          )}

          {/* OBJETIVO: Crear Reporte del Mes (default) */}
          {reportObjective === 'monthly_report' && (
            <>
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
                  tokensRemaining={aiUsageRemaining}
                  onPurchaseTokens={handlePurchaseTokens}
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
                  tokensRemaining={aiUsageRemaining}
                  onPurchaseTokens={handlePurchaseTokens}
                />
              )}
            </>
          )}

          {/* Notas Personales - Visible en todas las hojas */}
          <div className="mt-6">
            <PersonalNotes
              reportId={reportId}
              userId={user?.uid || 'guest'}
            />
          </div>
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

      {/* Modal de Login */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        reason="feature"
      />

      {/* Modal de Límite Alcanzado */}
      <LoginModal
        isOpen={showLimitReachedModal}
        onClose={() => setShowLimitReachedModal(false)}
        reason="ai_limit"
      />

      {/* Modal de Confirmación para IA */}
      <AIConfirmModal
        isOpen={showAIConfirmModal}
        onClose={() => setShowAIConfirmModal(false)}
        onConfirm={handleConfirmGenerateInsights}
        selectedPlatforms={selectedPlatforms}
      />

      {/* Modal de Confirmación para Descartar */}
      <DiscardConfirmModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        reportTitle={reportData?.title || 'Reporte'}
      />

      {/* Modal de Compartir */}
      <ShareReportModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        reportId={reportId}
        userId={user?.uid || ''}
      />
    </>
  );
}