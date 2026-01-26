import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Instagram, Facebook } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Report } from '@/lib/types';

interface EngagementRateCardProps {
  report: Report;
}

export default function EngagementRateCard({ report }: EngagementRateCardProps) {
  // Calculate engagement rates
  const calculateEngagementRate = (reach: number, interactions: number): string => {
    if (reach === 0) return '0.00';
    return ((interactions / reach) * 100).toFixed(2);
  };

  // Instagram metrics
  const instagramReach = report.data?.instagram?.reachStats?.total || 0;
  const instagramInteractions = report.data?.instagram?.interactionsStats?.total || 0;
  const instagramEngagement = calculateEngagementRate(instagramReach, instagramInteractions);

  // Facebook metrics
  const facebookReach = report.data?.facebook?.reachStats?.total || 0;
  const facebookInteractions = report.data?.facebook?.interactionsStats?.total || 0;
  const facebookEngagement = calculateEngagementRate(facebookReach, facebookInteractions);

  // Overall engagement
  const totalReach = instagramReach + facebookReach;
  const totalInteractions = instagramInteractions + facebookInteractions;
  const overallEngagement = calculateEngagementRate(totalReach, totalInteractions);

  // Prepare trend data for sparkline (last 7 days if available)
  const prepareTrendData = () => {
    const instagramData = report.data?.instagram?.content || [];
    const facebookData = report.data?.facebook?.content || [];
    
    // Combine and sort by date
    const allData = [...instagramData, ...facebookData]
      .filter(item => item.date && item.reach)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days

    return allData.map((item) => {
      // Calculate interactions from available data
      const itemInteractions = (item.likes || 0) + (item.comments || 0) + (item.shares || 0);
      return {
        date: item.date,
        rate: parseFloat(calculateEngagementRate(item.reach || 0, itemInteractions))
      };
    });
  };

  const trendData = prepareTrendData();

  // Determine trend direction
  const getTrendIndicator = () => {
    if (trendData.length < 2) return null;
    const firstRate = trendData[0].rate;
    const lastRate = trendData[trendData.length - 1].rate;
    const change = lastRate - firstRate;
    return {
      isPositive: change > 0,
      percentage: Math.abs(change).toFixed(2)
    };
  };

  const trend = getTrendIndicator();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white pb-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Engagement Rate
            </CardTitle>
            <CardDescription className="text-purple-100 mt-1">
              Interacciones / Alcance × 100
            </CardDescription>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive ? 'text-green-100' : 'text-red-100'
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`} />
              {trend.percentage}%
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Overall Engagement Rate */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {overallEngagement}%
          </div>
          <p className="text-sm text-gray-600">
            Engagement Rate General
          </p>
        </div>

        {/* Trend Sparkline */}
        {trendData.length > 1 && (
          <div className="mb-6 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  fill="url(#engagementGradient)" 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${Number(value).toFixed(2)}%`, 'Engagement']}
                  labelFormatter={(label: any) => `${label}`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Platform Breakdown */}
        <div className="space-y-4">
          {/* Instagram */}
          {report.data?.instagram && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Instagram className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Instagram</p>
                  <p className="text-xs text-gray-500">
                    {instagramInteractions.toLocaleString()} interacciones
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  {instagramEngagement}%
                </p>
                <p className="text-xs text-gray-500">
                  {instagramReach.toLocaleString()} alcance
                </p>
              </div>
            </div>
          )}

          {/* Facebook */}
          {report.data?.facebook && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Facebook</p>
                  <p className="text-xs text-gray-500">
                    {facebookInteractions.toLocaleString()} interacciones
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {facebookEngagement}%
                </p>
                <p className="text-xs text-gray-500">
                  {facebookReach.toLocaleString()} alcance
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info tooltip */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold">💡 Engagement Rate</span> mide qué tan bien tu audiencia 
            interactúa con tu contenido. Un engagement rate del 1-3% es promedio, 
            3-6% es bueno, y más del 6% es excelente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}