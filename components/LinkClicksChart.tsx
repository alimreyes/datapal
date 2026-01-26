import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MousePointerClick } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DataPoint {
  date: string;
  value: number;
}

interface LinkClicksChartProps {
  instagramData?: DataPoint[];
  facebookData?: DataPoint[];
  title?: string;
}

export default function LinkClicksChart({ 
  instagramData, 
  facebookData,
  title = "Clics en Enlaces"
}: LinkClicksChartProps) {
  // Combine and format data
  const prepareChartData = () => {
    const dataMap = new Map<string, { date: string; instagram: number; facebook: number; total: number }>();

    // Add Instagram data
    instagramData?.forEach(item => {
      const existing = dataMap.get(item.date) || { date: item.date, instagram: 0, facebook: 0, total: 0 };
      existing.instagram = item.value;
      existing.total += item.value;
      dataMap.set(item.date, existing);
    });

    // Add Facebook data
    facebookData?.forEach(item => {
      const existing = dataMap.get(item.date) || { date: item.date, instagram: 0, facebook: 0, total: 0 };
      existing.facebook = item.value;
      existing.total += item.value;
      dataMap.set(item.date, existing);
    });

    // Convert to array and sort by date
    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = prepareChartData();

  // Calculate totals and stats
  const instagramTotal = instagramData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const facebookTotal = facebookData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const overallTotal = instagramTotal + facebookTotal;

  // Find peak day
  const peakDay = chartData.length > 0 
    ? chartData.reduce((max, item) => item.total > max.total ? item : max, chartData[0])
    : null;

  // Calculate averages
  const instagramAvg = instagramData && instagramData.length > 0 
    ? Math.round(instagramTotal / instagramData.length) 
    : 0;
  const facebookAvg = facebookData && facebookData.length > 0
    ? Math.round(facebookTotal / facebookData.length)
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
                {entry.name}: {entry.value.toLocaleString()} clics
              </p>
            )
          ))}
          <p className="text-sm font-medium text-gray-700 mt-2 pt-2 border-t">
            Total: {payload.reduce((sum: number, p: any) => sum + p.value, 0).toLocaleString()} clics
          </p>
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
          <MousePointerClick className="w-6 h-6 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>
          Clics en los enlaces de tu perfil o publicaciones que dirigen tráfico externo
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {hasInstagram && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Instagram</p>
              <p className="text-2xl font-bold text-purple-600">
                {instagramTotal.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Promedio: {instagramAvg.toLocaleString()} clics/día
              </p>
            </div>
          )}
          
          {hasFacebook && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Facebook</p>
              <p className="text-2xl font-bold text-blue-600">
                {facebookTotal.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Promedio: {facebookAvg.toLocaleString()} clics/día
              </p>
            </div>
          )}
          
          {hasBoth && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Combinado</p>
              <p className="text-2xl font-bold text-green-600">
                {overallTotal.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Todas las plataformas
              </p>
            </div>
          )}
        </div>

        {/* Peak Day Alert */}
        {peakDay && peakDay.total > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-sm font-medium text-blue-900">
              🔥 Día con más clics: {format(new Date(peakDay.date), 'dd MMM yyyy', { locale: es })}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {peakDay.total.toLocaleString()} clics totales ese día
            </p>
          </div>
        )}

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
                  iconType="square"
                />
              )}
              
              {hasInstagram && (
                <Bar
                  dataKey="instagram"
                  fill="#e91e63"
                  name="Instagram"
                  radius={[8, 8, 0, 0]}
                />
              )}
              
              {hasFacebook && (
                <Bar
                  dataKey="facebook"
                  fill="#3b5998"
                  name="Facebook"
                  radius={[8, 8, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-6 space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">💡 Sobre los Link Clicks:</span> Los clics en enlaces 
              muestran cuántas personas hicieron clic en los URLs de tu perfil o publicaciones para 
              visitar sitios externos (tu website, tienda online, etc.).
            </p>
          </div>

          {hasBoth && instagramTotal !== facebookTotal && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p className="text-sm text-yellow-900">
                <span className="font-semibold">📊 Insight:</span>{' '}
                {instagramTotal > facebookTotal 
                  ? `Instagram está generando ${Math.round((instagramTotal / facebookTotal - 1) * 100)}% más clics que Facebook.`
                  : `Facebook está generando ${Math.round((facebookTotal / instagramTotal - 1) * 100)}% más clics que Instagram.`
                }
                {' '}Considera optimizar tu estrategia de enlaces en la plataforma con menor desempeño.
              </p>
            </div>
          )}

          {overallTotal > 0 && chartData.length > 0 && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <p className="text-sm text-green-900">
                <span className="font-semibold">✅ CTR (Click-Through Rate):</span>{' '}
                En promedio, estás generando {Math.round(overallTotal / chartData.length)} clics por día. 
                {Math.round(overallTotal / chartData.length) > 10 
                  ? ' ¡Excelente desempeño!' 
                  : ' Considera agregar más CTAs (llamados a la acción) en tus publicaciones.'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}