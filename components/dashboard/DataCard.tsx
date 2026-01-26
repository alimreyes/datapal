'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'purple' | 'blue' | 'pink' | 'green';
  change?: number; // Porcentaje de cambio vs período anterior
}

export default function DataCard({
  label,
  value,
  icon: Icon,
  color = 'purple',
  change,
}: DataCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const colorConfig = {
    purple: {
      bg: 'bg-gradient-to-br from-purple-100 to-pink-100',
      border: 'border-purple-300',
      text: 'text-purple-700',
      iconBg: 'bg-purple-600',
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      border: 'border-blue-300',
      text: 'text-blue-700',
      iconBg: 'bg-blue-600',
    },
    pink: {
      bg: 'bg-gradient-to-br from-pink-100 to-rose-100',
      border: 'border-pink-300',
      text: 'text-pink-700',
      iconBg: 'bg-pink-600',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-100 to-emerald-100',
      border: 'border-green-300',
      text: 'text-green-700',
      iconBg: 'bg-green-600',
    },
  };

  const colors = colorConfig[color];

  return (
    <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 h-full flex flex-col justify-center shadow-sm`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`${colors.iconBg} p-3 rounded-xl shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Data más relevante</p>
          <h3 className={`text-lg font-bold ${colors.text}`}>{label}</h3>
        </div>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className={`text-6xl font-bold ${colors.text} mb-2`}>
          {formatNumber(value)}
        </div>
        
        {/* Change Indicator */}
        {change !== undefined && change !== 0 && (
          <div className="flex items-center gap-2">
            {change > 0 ? (
              <>
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-base font-semibold text-green-700">
                  +{Math.abs(change).toFixed(1)}% vs anterior
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="text-base font-semibold text-red-700">
                  -{Math.abs(change).toFixed(1)}% vs anterior
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="pt-4 border-t-2 border-gray-300/50">
        <p className="text-xs text-gray-600">
          ℹ️ Click en puntos del gráfico para cambiar la métrica mostrada
        </p>
      </div>
    </div>
  );
}