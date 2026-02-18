'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Info,
  X,
  Bell,
  ChevronRight,
  Activity,
} from 'lucide-react';
import type { MetricAlert, AlertSeverity } from '@/lib/types';

interface AlertsWidgetProps {
  alerts: MetricAlert[];
  onDismiss?: (alertId: string) => void;
}

const severityConfig: Record<AlertSeverity, {
  icon: typeof AlertTriangle;
  color: string;
  bg: string;
  border: string;
  label: string;
}> = {
  critical: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Crítico',
  },
  warning: {
    icon: TrendingDown,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    label: 'Alerta',
  },
  info: {
    icon: TrendingUp,
    color: 'text-[#019B77]',
    bg: 'bg-[#019B77]/10',
    border: 'border-[#019B77]/20',
    label: 'Positivo',
  },
};

const platformColors: Record<string, string> = {
  instagram: 'text-purple-400',
  facebook: 'text-blue-400',
  linkedin: 'text-sky-400',
  tiktok: 'text-pink-400',
  google_analytics: 'text-amber-400',
};

export default function AlertsWidget({ alerts, onDismiss }: AlertsWidgetProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const visibleAlerts = alerts.filter((a) => !a.dismissed && !dismissedIds.has(a.id));
  const displayAlerts = showAll ? visibleAlerts : visibleAlerts.slice(0, 3);

  const handleDismiss = (alertId: string) => {
    setDismissedIds((prev) => new Set(prev).add(alertId));
    onDismiss?.(alertId);
  };

  if (visibleAlerts.length === 0) {
    return (
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-[#019B77]/10 border border-[#019B77]/20">
            <Activity className="w-5 h-5 text-[#019B77]" />
          </div>
          <h3 className="text-lg font-semibold text-[#FBFEF2]">Monitoreo Inteligente</h3>
        </div>
        <p className="text-sm text-[#B6B6B6]">
          No se detectaron anomalías en tus reportes recientes. Todo se ve estable.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-[#019B77]">
          <Bell className="w-3 h-3" />
          <span>Te avisaremos si detectamos cambios importantes</span>
        </div>
      </div>
    );
  }

  const criticalCount = visibleAlerts.filter((a) => a.severity === 'critical').length;
  const warningCount = visibleAlerts.filter((a) => a.severity === 'warning').length;
  const infoCount = visibleAlerts.filter((a) => a.severity === 'info').length;

  return (
    <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[rgba(251,254,242,0.05)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#FBFEF2]">Monitoreo Inteligente</h3>
            <p className="text-xs text-[#B6B6B6]">
              {visibleAlerts.length} {visibleAlerts.length === 1 ? 'alerta detectada' : 'alertas detectadas'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              {criticalCount} crítica{criticalCount > 1 ? 's' : ''}
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {warningCount} alerta{warningCount > 1 ? 's' : ''}
            </span>
          )}
          {infoCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30">
              {infoCount} positiva{infoCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Alerts list */}
      <div className="divide-y divide-[rgba(251,254,242,0.03)]">
        {displayAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className="px-6 py-4 flex items-start gap-4 hover:bg-[rgba(251,254,242,0.02)] transition-colors"
            >
              <div className={`p-1.5 rounded-lg ${config.bg} ${config.border} border mt-0.5`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#FBFEF2] leading-relaxed">
                  {alert.message}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`text-xs font-medium ${platformColors[alert.platform] || 'text-[#B6B6B6]'}`}>
                    {alert.platform === 'instagram' ? 'Instagram' :
                     alert.platform === 'facebook' ? 'Facebook' :
                     alert.platform === 'linkedin' ? 'LinkedIn' :
                     alert.platform === 'tiktok' ? 'TikTok' : alert.platform}
                  </span>
                  <span className="text-[10px] text-[#B6B6B6]/50">•</span>
                  <Link
                    href={`/report/${alert.reportId}`}
                    className="text-xs text-[#B6B6B6] hover:text-[#019B77] transition-colors flex items-center gap-1"
                  >
                    Ver reporte
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(alert.id)}
                className="p-1 rounded-md text-[#B6B6B6]/40 hover:text-[#B6B6B6] hover:bg-[rgba(251,254,242,0.05)] transition-colors"
                title="Descartar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Show more/less */}
      {visibleAlerts.length > 3 && (
        <div className="px-6 py-3 border-t border-[rgba(251,254,242,0.05)]">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-[#019B77] hover:text-[#02c494] transition-colors"
          >
            {showAll ? 'Mostrar menos' : `Ver las ${visibleAlerts.length} alertas`}
          </button>
        </div>
      )}
    </div>
  );
}
