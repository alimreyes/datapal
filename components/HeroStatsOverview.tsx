'use client';

import { TrendingUp, TrendingDown, Users, Eye, Heart, UserPlus } from 'lucide-react';
import { Report } from '@/lib/types';

interface HeroStatsOverviewProps {
  reports: Report[];
}

export default function HeroStatsOverview({ reports }: HeroStatsOverviewProps) {
  // Calcular estadísticas totales de todos los reportes
  const calculateStats = () => {
    let totalFollowers = 0;
    let totalImpressions = 0;
    let totalInteractions = 0;
    let totalReach = 0;

    reports.forEach(report => {
      // Instagram stats
      if (report.data?.instagram) {
        totalFollowers += report.data.instagram.followersStats?.total || 0;
        totalImpressions += report.data.instagram.impressionsStats?.total || 0;
        totalInteractions += report.data.instagram.interactionsStats?.total || 0;
        totalReach += report.data.instagram.reachStats?.total || 0;
      }

      // Facebook stats
      if (report.data?.facebook) {
        totalFollowers += report.data.facebook.followersStats?.total || 0;
        totalImpressions += report.data.facebook.impressionsStats?.total || 0;
        totalInteractions += report.data.facebook.interactionsStats?.total || 0;
        totalReach += report.data.facebook.reachStats?.total || 0;
      }
    });

    // Calcular engagement rate
    const engagementRate = totalReach > 0
      ? ((totalInteractions / totalReach) * 100).toFixed(1)
      : '0.0';

    return {
      followers: totalFollowers,
      impressions: totalImpressions,
      interactions: totalInteractions,
      reach: totalReach,
      engagementRate,
    };
  };

  const stats = calculateStats();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const statCards = [
    {
      label: 'Seguidores',
      value: formatNumber(stats.followers),
      change: '+8.2%',
      isPositive: true,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Alcance',
      value: formatNumber(stats.reach),
      change: '+12.5%',
      isPositive: true,
      icon: Eye,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Interacciones',
      value: formatNumber(stats.interactions),
      change: '+5.8%',
      isPositive: true,
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
    },
    {
      label: 'Engagement',
      value: `${stats.engagementRate}%`,
      change: '-2.1%',
      isPositive: false,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Tu Análisis de un Vistazo
        </h2>
        <p className="text-gray-600 mt-1">
          Resumen de todas tus métricas de redes sociales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.isPositive ? TrendingUp : TrendingDown;

          return (
            <div
              key={stat.label}
              className="relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />

              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
