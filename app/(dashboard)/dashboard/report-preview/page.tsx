'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { parseMetaCSV, calculateStats, formatNumber, formatDate } from '@/lib/parsers/metaParser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReportPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const text = await file.text();
    const parsedData = parseMetaCSV(text);
    const calculatedStats = calculateStats(parsedData);

    setData(parsedData);
    setStats(calculatedStats);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Vista Previa de Reporte</h1>
                <p className="text-sm text-muted-foreground">Prueba con tus datos reales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!data.length ? (
          // Upload State
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Sube tu CSV para ver el reporte</CardTitle>
              <CardDescription>
                Prueba cómo se verá tu reporte con datos reales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => document.getElementById('csv-upload')?.click()}
              >
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm font-medium mb-2">
                  Arrastra tu CSV aquí o haz click para seleccionar
                </p>
                <p className="text-xs text-muted-foreground">
                  Archivos de Alcance, Interacciones, etc. de Meta
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Report View
          <div className="space-y-6">
            {/* Header with badge */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Análisis de Alcance</h2>
                <p className="text-muted-foreground">
                  {data[0]?.date} - {data[data.length - 1]?.date}
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  setData([]);
                  setStats(null);
                }}
              >
                Cargar otro CSV
              </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Alcance Total</CardDescription>
                  <CardTitle className="text-3xl">
                    {stats && formatNumber(stats.total)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Personas únicas alcanzadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Promedio Diario</CardDescription>
                  <CardTitle className="text-3xl">
                    {stats && formatNumber(stats.average)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Alcance promedio por día
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pico Máximo</CardDescription>
                  <CardTitle className="text-3xl">
                    {stats && formatNumber(stats.max)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Mejor día del período
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Tendencia</CardDescription>
                  <CardTitle className="text-3xl flex items-center gap-2">
                    {stats && (
                      <>
                        {stats.trend > 0 && <TrendingUp className="h-6 w-6 text-green-600" />}
                        {stats.trend < 0 && <TrendingDown className="h-6 w-6 text-red-600" />}
                        {stats.trend === 0 && <Minus className="h-6 w-6 text-gray-600" />}
                        <span className={
                          stats.trend > 0 ? 'text-green-600' : 
                          stats.trend < 0 ? 'text-red-600' : 
                          'text-gray-600'
                        }>
                          {stats.trend > 0 ? '+' : ''}{formatNumber(Math.abs(stats.trend))}
                        </span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {stats?.trend > 0 ? 'Crecimiento' : stats?.trend < 0 ? 'Decrecimiento' : 'Estable'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Chart - Area */}
            <Card>
              <CardHeader>
                <CardTitle>Alcance a lo largo del tiempo</CardTitle>
                <CardDescription>
                  Visualización del alcance diario durante el período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        stroke="#888888"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#888888"
                        fontSize={12}
                        tickFormatter={formatNumber}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="text-sm font-medium">{formatDate(payload[0].payload.date)}</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatNumber(payload[0].value as number)}
                              </p>
                              <p className="text-xs text-muted-foreground">personas alcanzadas</p>
                            </div>
                          );
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fill="url(#colorReach)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Chart - Line */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia detallada</CardTitle>
                <CardDescription>
                  Vista más detallada de las variaciones diarias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        stroke="#888888"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#888888"
                        fontSize={12}
                        tickFormatter={formatNumber}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="bg-white p-2 border rounded shadow-lg">
                              <p className="text-xs">{formatDate(payload[0].payload.date)}</p>
                              <p className="text-lg font-bold text-purple-600">
                                {formatNumber(payload[0].value as number)}
                              </p>
                            </div>
                          );
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Datos del período</CardTitle>
                <CardDescription>
                  Vista tabular de todos los datos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white border-b">
                      <tr>
                        <th className="text-left py-2 px-4">Fecha</th>
                        <th className="text-right py-2 px-4">Alcance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{formatDate(item.date)}</td>
                          <td className="text-right py-2 px-4 font-mono">
                            {formatNumber(item.value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}