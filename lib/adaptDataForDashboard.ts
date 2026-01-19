// utils/adaptDataForDashboard.ts
// Convierte tus datos actuales de DataPal al formato que necesitan los componentes

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * ADAPTA TUS DATOS ACTUALES AL FORMATO DEL DASHBOARD
 * 
 * Usa esta función para convertir lo que ya tienes en Firestore
 * al formato que necesitan los nuevos componentes
 */
export function adaptDataForDashboard(
  reportFromFirestore: any, // Tu objeto actual del reporte
  csvDataInstagram?: any,    // Datos procesados del CSV de Instagram
  csvDataFacebook?: any      // Datos procesados del CSV de Facebook
) {
  // 1. PREPARAR MÉTRICAS PRINCIPALES
  const metrics = {
    visualizations: calculateTotalVisualizations(csvDataInstagram, csvDataFacebook),
    reach: calculateTotalReach(csvDataInstagram, csvDataFacebook),
    interactions: calculateTotalInteractions(csvDataInstagram, csvDataFacebook),
    followers: calculateTotalFollowers(csvDataInstagram, csvDataFacebook),
  };

  // 2. PREPARAR DATOS PARA EL GRÁFICO
  const chartData = prepareChartData(csvDataInstagram, csvDataFacebook);

  // 3. PREPARAR INSIGHTS
  const insights = reportFromFirestore.aiInsight 
    ? parseAIInsight(reportFromFirestore.aiInsight)
    : generateBasicInsights(metrics);

  // 4. DETERMINAR PLATAFORMAS
  const platforms = [];
  if (csvDataInstagram) platforms.push('instagram');
  if (csvDataFacebook) platforms.push('facebook');

  // 5. CALCULAR CAMBIOS (si tienes datos del período anterior)
  const changes = {
    visualizations: calculateChange(metrics.visualizations, reportFromFirestore.previousPeriod?.visualizations),
    reach: calculateChange(metrics.reach, reportFromFirestore.previousPeriod?.reach),
    interactions: calculateChange(metrics.interactions, reportFromFirestore.previousPeriod?.interactions),
    followers: calculateChange(metrics.followers, reportFromFirestore.previousPeriod?.followers),
  };

  return {
    title: reportFromFirestore.title || 'INFORME DE REDES SOCIALES',
    dateRange: formatDateRange(reportFromFirestore.startDate, reportFromFirestore.endDate),
    platforms,
    metrics,
    chartData,
    insights,
    changes,
    clientLogo: reportFromFirestore.clientLogo || null,
  };
}

/**
 * CALCULA VISUALIZACIONES TOTALES
 */
function calculateTotalVisualizations(instagram?: any, facebook?: any): number {
  let total = 0;
  
  if (instagram?.metrics) {
    // Instagram usa "Visualizaciones"
    total += instagram.metrics.totalVisualizaciones || 0;
  }
  
  if (facebook?.metrics) {
    // Facebook también puede usar "Visualizaciones"
    total += facebook.metrics.totalVisualizaciones || 0;
  }
  
  return total;
}

/**
 * CALCULA ALCANCE TOTAL
 */
function calculateTotalReach(instagram?: any, facebook?: any): number {
  let total = 0;
  
  if (instagram?.metrics) {
    total += instagram.metrics.totalAlcance || 0;
  }
  
  if (facebook?.metrics) {
    // Facebook usa "Espectadores" en lugar de "Alcance"
    total += facebook.metrics.totalEspectadores || 0;
  }
  
  return total;
}

/**
 * CALCULA INTERACCIONES TOTALES
 */
function calculateTotalInteractions(instagram?: any, facebook?: any): number {
  let total = 0;
  
  if (instagram?.metrics) {
    total += instagram.metrics.totalInteracciones || 0;
  }
  
  if (facebook?.metrics) {
    total += facebook.metrics.totalInteracciones || 0;
  }
  
  return total;
}

/**
 * CALCULA SEGUIDORES TOTALES
 */
function calculateTotalFollowers(instagram?: any, facebook?: any): number {
  let total = 0;
  
  if (instagram?.metrics) {
    total += instagram.metrics.totalSeguidores || 0;
  }
  
  if (facebook?.metrics) {
    total += facebook.metrics.totalSeguidores || 0;
  }
  
  return total;
}

/**
 * PREPARA DATOS PARA EL GRÁFICO
 * Combina datos diarios de ambas plataformas
 */
function prepareChartData(instagram?: any, facebook?: any) {
  const chartData: any[] = [];
  
  // Si tienes datos diarios en tu CSV procesado
  const instagramDaily = instagram?.dailyMetrics || [];
  const facebookDaily = facebook?.dailyMetrics || [];
  
  // Combinar por fecha
  const allDates = new Set([
    ...instagramDaily.map((d: any) => d.date),
    ...facebookDaily.map((d: any) => d.date),
  ]);
  
  allDates.forEach(date => {
    const igData = instagramDaily.find((d: any) => d.date === date) || {};
    const fbData = facebookDaily.find((d: any) => d.date === date) || {};
    
    chartData.push({
      date: formatChartDate(date),
      visualizations: (igData.visualizations || 0) + (fbData.visualizations || 0),
      reach: (igData.reach || 0) + (fbData.espectadores || 0),
      interactions: (igData.interactions || 0) + (fbData.interactions || 0),
      followers: (igData.followers || 0) + (fbData.followers || 0),
    });
  });
  
  // Ordenar por fecha
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return chartData;
}

/**
 * PARSEA EL INSIGHT DE IA QUE YA TIENES
 * Convierte el string de insight en formato estructurado
 */
function parseAIInsight(aiInsightText: string) {
  // Si ya tienes un insight generado, lo conviertes a formato estructurado
  return [
    {
      id: '1',
      title: 'Análisis de IA',
      content: aiInsightText,
      type: 'info' as const,
    },
  ];
}

/**
 * GENERA INSIGHTS BÁSICOS
 * Si no tienes insight de IA todavía
 */
function generateBasicInsights(metrics: any) {
  const insights = [];
  
  // Engagement Rate
  const engagementRate = (metrics.interactions / metrics.reach) * 100;
  
  if (engagementRate > 3) {
    insights.push({
      id: '1',
      title: 'Excelente Engagement',
      content: `Tu tasa de engagement es de ${engagementRate.toFixed(2)}%, muy por encima del promedio.`,
      type: 'positive' as const,
    });
  } else if (engagementRate < 1) {
    insights.push({
      id: '1',
      title: 'Engagement Bajo',
      content: `Tu tasa de engagement es de ${engagementRate.toFixed(2)}%. Considera optimizar tu contenido.`,
      type: 'warning' as const,
    });
  } else {
    insights.push({
      id: '1',
      title: 'Engagement Moderado',
      content: `Tu tasa de engagement es de ${engagementRate.toFixed(2)}%, dentro del rango promedio.`,
      type: 'info' as const,
    });
  }
  
  // Conversión a seguidores
  const conversionRate = (metrics.followers / metrics.interactions) * 100;
  
  if (conversionRate < 10) {
    insights.push({
      id: '2',
      title: 'Oportunidad de Conversión',
      content: `Solo el ${conversionRate.toFixed(1)}% de las interacciones se convierten en seguidores. Incluye más CTAs.`,
      type: 'suggestion' as const,
    });
  }
  
  return insights;
}

/**
 * FORMATEA RANGO DE FECHAS
 */
function formatDateRange(startDate: any, endDate: any): string {
  if (!startDate || !endDate) return 'Período no especificado';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return `${format(start, 'd MMM', { locale: es })} - ${format(end, 'd MMM yyyy', { locale: es })}`;
}

/**
 * FORMATEA FECHA PARA EL GRÁFICO
 */
function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'd MMM', { locale: es });
}

/**
 * CALCULA % DE CAMBIO
 */
function calculateChange(current: number, previous?: number): number | undefined {
  if (!previous || previous === 0) return undefined;
  
  return ((current - previous) / previous) * 100;
}