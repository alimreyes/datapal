import type {
  Report,
  PlatformData,
  DataStats,
  Platform,
  AlertMetric,
  AlertSeverity,
  MetricAlert,
  MonitoringPreferences,
  DEFAULT_MONITORING,
} from '@/lib/types';

interface MetricInfo {
  key: AlertMetric;
  label: string;
  stats?: DataStats;
}

/**
 * Analiza un reporte y detecta anomalías/cambios significativos en las métricas.
 * Compara tendencias internas del reporte (trend) y valores absolutos.
 */
export function detectAnomalies(
  report: Report,
  preferences?: MonitoringPreferences,
): MetricAlert[] {
  const alerts: MetricAlert[] = [];
  const thresholds = preferences?.thresholds || {
    reachDrop: 20,
    interactionsDrop: 25,
    followersDrop: 10,
    impressionsDrop: 20,
    significantGrowth: 30,
  };

  const platforms: { key: Platform; data?: PlatformData }[] = [
    { key: 'instagram', data: report.data.instagram },
    { key: 'facebook', data: report.data.facebook },
    { key: 'linkedin', data: report.data.linkedin },
    { key: 'tiktok', data: report.data.tiktok },
  ];

  for (const platform of platforms) {
    if (!platform.data) continue;

    const metrics: MetricInfo[] = [
      { key: 'reach', label: 'Alcance', stats: platform.data.reachStats },
      { key: 'impressions', label: 'Impresiones', stats: platform.data.impressionsStats },
      { key: 'interactions', label: 'Interacciones', stats: platform.data.interactionsStats },
      { key: 'followers', label: 'Seguidores', stats: platform.data.followersStats },
    ];

    for (const metric of metrics) {
      if (!metric.stats) continue;

      const { total, average, max, min, trend } = metric.stats;
      const trendPercent = trend;

      // Detectar caídas significativas basadas en el trend del reporte
      if (trendPercent < 0) {
        const dropPercent = Math.abs(trendPercent);
        const threshold = getDropThreshold(metric.key, thresholds);

        if (dropPercent >= threshold) {
          const severity = getSeverity(dropPercent, threshold);
          alerts.push({
            id: `${report.id}-${platform.key}-${metric.key}-drop`,
            reportId: report.id,
            reportTitle: report.title,
            platform: platform.key,
            metric: metric.key,
            severity,
            message: `${metric.label} en ${platformLabel(platform.key)} bajó un ${dropPercent.toFixed(1)}% — tendencia negativa detectada.`,
            currentValue: total,
            previousValue: Math.round(total / (1 - dropPercent / 100)),
            changePercent: -dropPercent,
            detectedAt: new Date().toISOString(),
            dismissed: false,
          });
        }
      }

      // Detectar crecimiento significativo
      if (trendPercent > 0 && trendPercent >= thresholds.significantGrowth) {
        alerts.push({
          id: `${report.id}-${platform.key}-${metric.key}-growth`,
          reportId: report.id,
          reportTitle: report.title,
          platform: platform.key,
          metric: metric.key,
          severity: 'info',
          message: `¡${metric.label} en ${platformLabel(platform.key)} creció un ${trendPercent.toFixed(1)}%! Gran resultado.`,
          currentValue: total,
          previousValue: Math.round(total / (1 + trendPercent / 100)),
          changePercent: trendPercent,
          detectedAt: new Date().toISOString(),
          dismissed: false,
        });
      }

      // Detectar varianza alta (diferencia grande entre max y min indica inestabilidad)
      if (average > 0 && max > 0 && min >= 0) {
        const varianceRatio = (max - min) / average;
        if (varianceRatio > 3) {
          alerts.push({
            id: `${report.id}-${platform.key}-${metric.key}-variance`,
            reportId: report.id,
            reportTitle: report.title,
            platform: platform.key,
            metric: metric.key,
            severity: 'warning',
            message: `${metric.label} en ${platformLabel(platform.key)} muestra alta variabilidad — el máximo (${max.toLocaleString()}) es ${varianceRatio.toFixed(1)}x mayor que el promedio (${average.toLocaleString()}).`,
            currentValue: average,
            previousValue: max,
            changePercent: varianceRatio * 100,
            detectedAt: new Date().toISOString(),
            dismissed: false,
          });
        }
      }
    }
  }

  // Ordenar por severidad: critical > warning > info
  const severityOrder: Record<AlertSeverity, number> = {
    critical: 0,
    warning: 1,
    info: 2,
  };
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return alerts;
}

/**
 * Compara dos reportes y detecta cambios entre ellos.
 */
export function compareReports(
  current: Report,
  previous: Report,
  preferences?: MonitoringPreferences,
): MetricAlert[] {
  const alerts: MetricAlert[] = [];
  const thresholds = preferences?.thresholds || {
    reachDrop: 20,
    interactionsDrop: 25,
    followersDrop: 10,
    impressionsDrop: 20,
    significantGrowth: 30,
  };

  const platformKeys: Platform[] = ['instagram', 'facebook', 'linkedin', 'tiktok'];

  for (const platformKey of platformKeys) {
    const currentData = current.data[platformKey as keyof typeof current.data] as PlatformData | undefined;
    const previousData = previous.data[platformKey as keyof typeof previous.data] as PlatformData | undefined;

    if (!currentData || !previousData) continue;

    const metricPairs: { key: AlertMetric; label: string; currentStats?: DataStats; prevStats?: DataStats }[] = [
      { key: 'reach', label: 'Alcance', currentStats: currentData.reachStats, prevStats: previousData.reachStats },
      { key: 'impressions', label: 'Impresiones', currentStats: currentData.impressionsStats, prevStats: previousData.impressionsStats },
      { key: 'interactions', label: 'Interacciones', currentStats: currentData.interactionsStats, prevStats: previousData.interactionsStats },
      { key: 'followers', label: 'Seguidores', currentStats: currentData.followersStats, prevStats: previousData.followersStats },
    ];

    for (const metric of metricPairs) {
      if (!metric.currentStats || !metric.prevStats) continue;
      if (metric.prevStats.total === 0) continue;

      const changePercent = ((metric.currentStats.total - metric.prevStats.total) / metric.prevStats.total) * 100;

      if (changePercent < 0) {
        const dropPercent = Math.abs(changePercent);
        const threshold = getDropThreshold(metric.key, thresholds);

        if (dropPercent >= threshold) {
          alerts.push({
            id: `compare-${current.id}-${platformKey}-${metric.key}`,
            reportId: current.id,
            reportTitle: current.title,
            platform: platformKey,
            metric: metric.key,
            severity: getSeverity(dropPercent, threshold),
            message: `${metric.label} en ${platformLabel(platformKey)} bajó ${dropPercent.toFixed(1)}% comparado con "${previous.title}".`,
            currentValue: metric.currentStats.total,
            previousValue: metric.prevStats.total,
            changePercent: -dropPercent,
            detectedAt: new Date().toISOString(),
            dismissed: false,
          });
        }
      }

      if (changePercent >= thresholds.significantGrowth) {
        alerts.push({
          id: `compare-${current.id}-${platformKey}-${metric.key}-growth`,
          reportId: current.id,
          reportTitle: current.title,
          platform: platformKey,
          metric: metric.key,
          severity: 'info',
          message: `¡${metric.label} en ${platformLabel(platformKey)} creció ${changePercent.toFixed(1)}% comparado con "${previous.title}"!`,
          currentValue: metric.currentStats.total,
          previousValue: metric.prevStats.total,
          changePercent,
          detectedAt: new Date().toISOString(),
          dismissed: false,
        });
      }
    }
  }

  return alerts;
}

// ==================== HELPERS ====================

function getDropThreshold(
  metric: AlertMetric,
  thresholds: MonitoringPreferences['thresholds'],
): number {
  switch (metric) {
    case 'reach': return thresholds.reachDrop;
    case 'impressions': return thresholds.impressionsDrop;
    case 'interactions': return thresholds.interactionsDrop;
    case 'followers': return thresholds.followersDrop;
    default: return 20;
  }
}

function getSeverity(dropPercent: number, threshold: number): AlertSeverity {
  if (dropPercent >= threshold * 2.5) return 'critical';
  if (dropPercent >= threshold * 1.5) return 'warning';
  return 'warning';
}

function platformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
    google_analytics: 'Google Analytics',
  };
  return labels[platform] || platform;
}
