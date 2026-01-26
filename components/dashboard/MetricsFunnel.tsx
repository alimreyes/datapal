'use client';

import { Eye, Users, Heart, UserPlus, ArrowRight } from 'lucide-react';

interface MetricsFunnelProps {
  visualizations: number;
  reach: number;
  interactions: number;
  followers: number;
}

export default function MetricsFunnel({
  visualizations,
  reach,
  interactions,
  followers,
}: MetricsFunnelProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const calculateConversion = (from: number, to: number) => {
    if (from === 0) return '0.0';
    return ((to / from) * 100).toFixed(1);
  };

  const vizToReach = calculateConversion(visualizations, reach);
  const reachToInteractions = calculateConversion(reach, interactions);

  const metrics = [
    {
      label: 'Visualizaciones',
      value: visualizations,
      icon: Eye,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Alcance',
      value: reach,
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Interacciones',
      value: interactions,
      icon: Heart,
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200',
    },
    {
      label: 'Seguidores',
      value: followers,
      icon: UserPlus,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
  ];

  const conversions = [vizToReach, reachToInteractions];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-center flex-wrap gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <div key={metric.label} className="flex items-center gap-3">
              {/* Metric Card */}
              <div className={`${metric.bgColor} ${metric.borderColor} border-2 rounded-xl p-4 min-w-[160px]`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-5 h-5 ${metric.textColor}`} />
                  <span className="text-xs font-medium text-gray-600">{metric.label}</span>
                </div>
                <div className={`text-3xl font-bold ${metric.textColor}`}>
                  {formatNumber(metric.value)}
                </div>
              </div>

              {/* Conversion Arrow */}
              {index < conversions.length && (
                <div className="flex flex-col items-center gap-1 px-2">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full">
                    <span className="text-sm font-bold">{conversions[index]}%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
