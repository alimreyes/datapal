import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DataPoint {
  date: string;
  value: number;
}

interface FollowersGrowthChartProps {
  instagramData?: DataPoint[];
  facebookData?: DataPoint[];
  title?: string;
}

export default function FollowersGrowthChart({ 
  instagramData, 
  facebookData,
  title = "Crecimiento de Seguidores"
}: FollowersGrowthChartProps) {
  // Combine and format data
  const prepareChartData = () => {
    const dataMap = new Map<string, { date: string; instagram: number; facebook: number }>();

    // Add Instagram data
    instagramData?.forEach(item => {
      const existing = dataMap.get(item.date) || { date: item.date, instagram: 0, facebook: 0 };
      existing.instagram = item.value;
      dataMap.set(item.date, existing);
    });

    // Add Facebook data
    facebookData?.forEach(item => {
      const existing = dataMap.get(item.date) || { date: item.date, instagram: 0, facebook: 0 };
      existing.facebook = item.value;
      dataMap.set(item.date, existing);
    });

    // Convert to array and sort by date
    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = prepareChartData();

  // Calculate growth stats
  const calculateGrowth = (data?: DataPoint[]) => {
    if (!data || data.length < 2) return { net: 0, percentage: 0, trend: 'stable' as const };
    
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstValue = sortedData[0].value;
    const lastValue = sortedData[sortedData.length - 1].value;
    const netGrowth = lastValue - firstValue;
    const percentageGrowth = firstValue > 0 ? ((netGrowth / firstValue) * 100) : 0;
    
    return {
      net: netGrowth,
      percentage: percentageGrowth,
      trend: netGrowth > 0 ? 'up' as const : netGrowth < 0 ? 'down' as const : 'stable' as const
    };
  };

  const instagramGrowth = calculateGrowth(instagramData);
  const facebookGrowth = calculateGrowth(facebookData);

  // Get current follower counts
  const instagramCurrent = instagramData && instagramData.length > 0
    ? instagramData[instagramData.length - 1].value
    : 0;
  const facebookCurrent = facebookData && facebookData.length > 0
    ? facebookData[facebookData.length - 1].value
    : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {format(new Date(label), 'dd MMM yyyy', { locale: es })}
          </p>
          {payload.map((entry: any, index: number) => (
            entry.value > 0 && (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value.toLocaleString()} seguidores
              </p>
            )
          ))}
        </div>
      );
    }
    return null;
  };

  const hasInstagram = instagramData && instagramData.length > 0;
  const hasFacebook = facebookData && facebookData.length > 0;
  const hasBoth = hasInstagram && hasFacebook;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Users className="w-6 h-6 text-emerald-600" />
          {title}
        </CardTitle>
        <CardDescription>
          Evolución del número de seguidores en el período analizado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {hasInstagram && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Instagram</p>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  instagramGrowth.trend === 'up' ? 'text-green-600' : 
                  instagramGrowth.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {instagramGrowth.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  {instagramGrowth.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                  {instagramGrowth.net > 0 ? '+' : ''}{instagramGrowth.net.toLocaleString()}
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {instagramCurrent.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {instagramGrowth.percentage > 0 ? '+' : ''}{instagramGrowth.percentage.toFixed(1)}% en este período
              </p>
            </div>
          )}
          
          {hasFacebook && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Facebook</p>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  facebookGrowth.trend === 'up' ? 'text-green-600' : 
                  facebookGrowth.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {facebookGrowth.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  {facebookGrowth.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                  {facebookGrowth.net > 0 ? '+' : ''}{facebookGrowth.net.toLocaleString()}
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {facebookCurrent.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {facebookGrowth.percentage > 0 ? '+' : ''}{facebookGrowth.percentage.toFixed(1)}% en este período
              </p>
            </div>
          )}
        </div>

        {/* Growth Alerts */}
        {(instagramGrowth.net > 0 || facebookGrowth.net > 0) && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <p className="text-sm font-medium text-green-900">
              🎉 ¡Crecimiento positivo detectado!
            </p>
            <p className="text-xs text-green-700 mt-1">
              {instagramGrowth.net > 0 && `Instagram: +${instagramGrowth.net.toLocaleString()} seguidores`}
              {instagramGrowth.net > 0 && facebookGrowth.net > 0 && ' | '}
              {facebookGrowth.net > 0 && `Facebook: +${facebookGrowth.net.toLocaleString()} seguidores`}
            </p>
          </div>
        )}

        {(instagramGrowth.net < 0 || facebookGrowth.net < 0) && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
            <p className="text-sm font-medium text-yellow-900">
              ⚠️ Se detectó pérdida de seguidores
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              {instagramGrowth.net < 0 && `Instagram: ${instagramGrowth.net.toLocaleString()} seguidores`}
              {instagramGrowth.net < 0 && facebookGrowth.net < 0 && ' | '}
              {facebookGrowth.net < 0 && `Facebook: ${facebookGrowth.net.toLocaleString()} seguidores`}
            </p>
          </div>
        )}

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="instagramFollowersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e91e63" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e91e63" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="facebookFollowersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b5998" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b5998" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'dd MMM', { locale: es })}
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              {hasBoth && (
                <Legend 
                  wrapperStyle={{ fontSize: '14px' }}
                  iconType="line"
                />
              )}
              
              {hasInstagram && (
                <>
                  <Area
                    type="monotone"
                    dataKey="instagram"
                    fill="url(#instagramFollowersGradient)"
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="instagram"
                    stroke="#e91e63"
                    strokeWidth={3}
                    dot={{ fill: '#e91e63', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Instagram"
                  />
                </>
              )}
              
              {hasFacebook && (
                <>
                  <Area
                    type="monotone"
                    dataKey="facebook"
                    fill="url(#facebookFollowersGradient)"
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="facebook"
                    stroke="#3b5998"
                    strokeWidth={3}
                    dot={{ fill: '#3b5998', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Facebook"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-6 space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">💡 Sobre el Crecimiento:</span> El crecimiento de seguidores 
              refleja qué tan bien estás atrayendo y reteniendo audiencia. Un crecimiento consistente 
              indica contenido relevante y estrategia efectiva.
            </p>
          </div>

          {hasBoth && (
            <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg">
              <p className="text-sm text-indigo-900">
                <span className="font-semibold">📊 Comparación:</span>{' '}
                {Math.abs(instagramGrowth.percentage) > Math.abs(facebookGrowth.percentage)
                  ? `Instagram muestra ${Math.abs(instagramGrowth.percentage).toFixed(1)}% de cambio vs ${Math.abs(facebookGrowth.percentage).toFixed(1)}% en Facebook.`
                  : `Facebook muestra ${Math.abs(facebookGrowth.percentage).toFixed(1)}% de cambio vs ${Math.abs(instagramGrowth.percentage).toFixed(1)}% en Instagram.`
                }
              </p>
            </div>
          )}

          {(instagramGrowth.percentage > 5 || facebookGrowth.percentage > 5) && (
            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
              <p className="text-sm text-emerald-900">
                <span className="font-semibold">🚀 ¡Excelente!</span> Un crecimiento mayor al 5% es muy bueno. 
                Mantén la estrategia actual y considera aumentar la frecuencia de publicación.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}