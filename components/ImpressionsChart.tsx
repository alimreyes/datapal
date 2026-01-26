import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DataPoint {
  date: string;
  value: number;
}

interface ImpressionsChartProps {
  instagramData?: DataPoint[];
  facebookData?: DataPoint[];
  title?: string;
}

export default function ImpressionsChart({ 
  instagramData, 
  facebookData,
  title = "Visualizaciones a lo largo del tiempo"
}: ImpressionsChartProps) {
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

  // Calculate totals
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {format(new Date(label), 'dd MMM yyyy', { locale: es })}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()} visualizaciones
            </p>
          ))}
          <p className="text-sm font-medium text-gray-700 mt-2 pt-2 border-t">
            Total: {payload.reduce((sum: number, p: any) => sum + p.value, 0).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const hasInstagram = instagramData && instagramData.length > 0;
  const hasFacebook = facebookData && facebookData.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Eye className="w-6 h-6 text-indigo-600" />
          {title}
        </CardTitle>
        <CardDescription>
          Número total de veces que tu contenido fue visto
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
                Promedio: {instagramAvg.toLocaleString()}/día
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
                Promedio: {facebookAvg.toLocaleString()}/día
              </p>
            </div>
          )}
          
          {hasInstagram && hasFacebook && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Combinado</p>
              <p className="text-2xl font-bold text-indigo-600">
                {overallTotal.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Todas las plataformas
              </p>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="instagramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e91e63" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#e91e63" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="facebookGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b5998" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b5998" stopOpacity={0.1}/>
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
              <Legend 
                wrapperStyle={{ fontSize: '14px' }}
                iconType="circle"
              />
              
              {hasInstagram && (
                <Area
                  type="monotone"
                  dataKey="instagram"
                  stroke="#e91e63"
                  strokeWidth={2}
                  fill="url(#instagramGradient)"
                  name="Instagram"
                />
              )}
              
              {hasFacebook && (
                <Area
                  type="monotone"
                  dataKey="facebook"
                  stroke="#3b5998"
                  strokeWidth={2}
                  fill="url(#facebookGradient)"
                  name="Facebook"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">💡 Sobre las Visualizaciones:</span> Las visualizaciones 
            (impresiones) muestran cuántas veces tu contenido apareció en las pantallas de los usuarios. 
            Un mismo usuario puede generar múltiples visualizaciones.
            {hasInstagram && hasFacebook && (
              <> {instagramTotal > facebookTotal 
                ? ' Instagram está generando más visualizaciones.' 
                : ' Facebook está generando más visualizaciones.'}</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}