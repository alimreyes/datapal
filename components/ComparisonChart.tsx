'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DataPoint } from '@/lib/types';
import { formatNumber, formatDate } from '@/lib/parsers/metaParser';

interface ComparisonChartProps {
  instagramData: DataPoint[];
  facebookData: DataPoint[];
  title: string;
  instagramLabel?: string;
  facebookLabel?: string;
  chartType?: 'bar' | 'line';
}

export function ComparisonChart({
  instagramData,
  facebookData,
  title,
  instagramLabel = 'Instagram',
  facebookLabel = 'Facebook',
  chartType = 'bar',
}: ComparisonChartProps) {
  // If no data, don't render
  if (instagramData.length === 0 && facebookData.length === 0) {
    return null;
  }

  // Merge data by date
  const mergedData: { [key: string]: any } = {};

  instagramData.forEach(item => {
    if (!mergedData[item.date]) {
      mergedData[item.date] = { date: item.date };
    }
    mergedData[item.date].instagram = item.value;
  });

  facebookData.forEach(item => {
    if (!mergedData[item.date]) {
      mergedData[item.date] = { date: item.date };
    }
    mergedData[item.date].facebook = item.value;
  });

  // Convert to array and sort by date
  const chartData = Object.values(mergedData)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item: any) => ({
      date: formatDate(item.date),
      Instagram: item.instagram || 0,
      Facebook: item.facebook || 0,
    }));

  // Calculate totals
  const igTotal = instagramData.reduce((sum, item) => sum + item.value, 0);
  const fbTotal = facebookData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">⚖️ {title}</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">📸 {instagramLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{formatNumber(igTotal)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total del período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">👍 {facebookLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatNumber(fbTotal)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total del período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación en el tiempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => formatNumber(value as number)}
                />
                <Legend />
                <Bar dataKey="Instagram" fill="#e91e63" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Facebook" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => formatNumber(value as number)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Instagram" 
                  stroke="#e91e63" 
                  strokeWidth={2}
                  dot={{ fill: '#e91e63', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Facebook" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Winner Badge */}
      {igTotal !== fbTotal && (
        <Card className="bg-accent/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{igTotal > fbTotal ? '📸' : '👍'}</span>
              <p className="text-lg font-semibold">
                {igTotal > fbTotal ? 'Instagram' : 'Facebook'} lidera en esta métrica
              </p>
              <span className="text-lg">
                con {formatNumber(Math.abs(igTotal - fbTotal))} más
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}