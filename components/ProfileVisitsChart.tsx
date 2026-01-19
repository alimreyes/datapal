import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DataPoint {
  date: string;
  value: number;
}

interface ProfileVisitsChartProps {
  instagramData?: DataPoint[];
  facebookData?: DataPoint[];
  title?: string;
}

export default function ProfileVisitsChart({ 
  instagramData, 
  facebookData,
  title = "Visitas al Perfil"
}: ProfileVisitsChartProps) {
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

  // Calculate totals and stats
  const instagramTotal = instagramData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const facebookTotal = facebookData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const overallTotal = instagramTotal + facebookTotal;

  // Calculate averages
  const instagramAvg = instagramData && instagramData.length > 0 
    ? Math.round(instagramTotal / instagramData.length) 
    : 0;
  const facebookAvg = facebookData && facebookData.length > 0
    ? Math.round(facebookTotal / facebookData.length)
    : 0;

  // Find peak day
  const peakDay = chartData.length > 0 
    ? chartData.reduce((max, item) => {
        const total = item.instagram + item.facebook;
        const maxTotal = max.instagram + max.facebook;
        return total > maxTotal ? item : max;
      }, chartData[0])
    : null;

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
                {entry.name}: {entry.value.toLocaleString()} visitas
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
          <Eye className="w-6 h-6 text-teal-600" />
          {title}
        </CardTitle>
        <CardDescription>
          Número de veces que los usuarios visitaron tu perfil
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
                Promedio: {instagramAvg.toLocaleString()} visitas/día
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
                Promedio: {facebookAvg.toLocaleString()} visitas/día
              </p>
            </div>
          )}
          
          {hasBoth && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Combinado</p>
              <p className="text-2xl font-bold text-teal-600">
                {overallTotal.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Todas las plataformas
              </p>
            </div>
          )}
        </div>

        {/* Peak Day Alert */}
        {peakDay && (peakDay.instagram + peakDay.facebook) > 0 && (
          <div className="mb-6 p-4 bg-teal-50 border-l-4 border-teal-500 rounded-r-lg">
            <p className="text-sm font-medium text-teal-900">
              🔥 Día con más visitas: {format(new Date(peakDay.date), 'dd MMM yyyy', { locale: es })}
            </p>
            <p className="text-xs text-teal-700 mt-1">
              {(peakDay.instagram + peakDay.facebook).toLocaleString()} visitas totales ese día
            </p>
          </div>
        )}

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
                <Line
                  type="monotone"
                  dataKey="instagram"
                  stroke="#e91e63"
                  strokeWidth={3}
                  dot={{ fill: '#e91e63', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Instagram"
                />
              )}
              
              {hasFacebook && (
                <Line
                  type="monotone"
                  dataKey="facebook"
                  stroke="#3b5998"
                  strokeWidth={3}
                  dot={{ fill: '#3b5998', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Facebook"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-6 space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">💡 Sobre las Visitas:</span> Las visitas al perfil 
              indican cuántas personas llegaron a tu perfil después de ver tu contenido. 
              Un alto número de visitas muestra que tu contenido genera curiosidad.
            </p>
          </div>

          {hasBoth && instagramTotal !== facebookTotal && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p className="text-sm text-yellow-900">
                <span className="font-semibold">📊 Comparación:</span>{' '}
                {instagramTotal > facebookTotal 
                  ? `Instagram atrae ${Math.round((instagramTotal / facebookTotal - 1) * 100)}% más visitas al perfil que Facebook.`
                  : `Facebook atrae ${Math.round((facebookTotal / instagramTotal - 1) * 100)}% más visitas al perfil que Instagram.`
                }
              </p>
            </div>
          )}

          {overallTotal > 0 && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <p className="text-sm text-green-900">
                <span className="font-semibold">✅ Conversión:</span>{' '}
                Estás atrayendo un promedio de {Math.round(overallTotal / (chartData.length || 1))} visitas al perfil por día.
                {Math.round(overallTotal / (chartData.length || 1)) > 50
                  ? ' ¡Excelente! Tu contenido está generando mucho interés.'
                  : ' Considera usar CTAs más fuertes en tus publicaciones para atraer más visitantes.'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}