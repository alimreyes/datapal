'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DateRangePicker } from '@/components/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { DataPoint, DataStats } from '@/lib/types';
import { formatNumber, formatDate, calculateStats } from '@/lib/parsers/metaParser';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricSectionProps {
  title: string;
  emoji: string;
  data: DataPoint[];
  color: string;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function MetricSection({
  title,
  emoji,
  data,
  color,
  dateRange,
  onDateRangeChange,
}: MetricSectionProps) {
  // Filter data based on date range
  const getFilteredData = (dataPoints: DataPoint[]) => {
    if (dataPoints.length === 0 || !dateRange?.from || !dateRange?.to) return dataPoints;
    
    return dataPoints.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  };
  
  const filteredData = getFilteredData(data);
  const stats = filteredData.length > 0 ? calculateStats(filteredData) : null;
  
  // Get date range bounds for picker
  const getDateBounds = (dataPoints: DataPoint[]) => {
    if (dataPoints.length === 0) return { min: new Date(), max: new Date() };
    return {
      min: new Date(dataPoints[0].date),
      max: new Date(dataPoints[dataPoints.length - 1].date),
    };
  };

  // Prepare data for chart
  const chartData = filteredData.map(item => ({
    date: formatDate(item.date),
    value: item.value,
  }));

  if (data.length === 0) {
    return null; // Don't render if no data
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{emoji} {title}</h2>
        {data.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredData.length} de {data.length} días
          </p>
        )}
      </div>

      {/* Date Range Filter */}
      {data.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <DateRangePicker
              minDate={getDateBounds(data).min}
              maxDate={getDateBounds(data).max}
              value={dateRange}
              onChange={onDateRangeChange}
            />
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.total)}</div>
              <p className="text-xs text-muted-foreground">
                Suma de todos los valores
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Diario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.average)}</div>
              <p className="text-xs text-muted-foreground">
                Promedio por día
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pico Máximo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.max)}</div>
              <p className="text-xs text-muted-foreground">
                Valor más alto del período
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolución en el tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
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
                  formatter={(value: any) => [formatNumber(value as number), 'Valor']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#gradient-${color})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}