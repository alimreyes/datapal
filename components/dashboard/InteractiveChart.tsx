'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Eye, Users, Heart, UserPlus } from 'lucide-react';

interface ChartDataPoint {
  date: string;
  visualizations?: number;
  reach?: number;
  interactions?: number;
  followers?: number;
}

interface InteractiveChartProps {
  data: ChartDataPoint[];
  onPointClick?: (metric: string, value: number) => void;
}

export default function InteractiveChart({ data, onPointClick }: InteractiveChartProps) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    visualizations: true,
    reach: true,
    interactions: true,
    followers: true,
  });

  const metrics = [
    {
      key: 'visualizations',
      label: 'Visualizaciones',
      color: '#9333ea',
      icon: Eye,
    },
    {
      key: 'reach',
      label: 'Alcance',
      color: '#3b82f6',
      icon: Users,
    },
    {
      key: 'interactions',
      label: 'Interacciones',
      color: '#ec4899',
      icon: Heart,
    },
    {
      key: 'followers',
      label: 'Seguidores',
      color: '#10b981',
      icon: UserPlus,
    },
  ];

  const toggleMetric = (key: string) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleClick = (data: any) => {
    if (!data || !data.activePayload) return;
    
    const payload = data.activePayload[0];
    if (payload && onPointClick) {
      onPointClick(payload.dataKey, payload.value);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
      {/* Chart Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Evolución de Métricas</h3>
        
        {/* Metric Toggles */}
        <div className="flex gap-2 flex-wrap">
          {metrics.map(metric => {
            const Icon = metric.icon;
            const isVisible = visibleMetrics[metric.key as keyof typeof visibleMetrics];
            
            return (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                  isVisible
                    ? 'bg-white border-gray-300 shadow-sm'
                    : 'bg-gray-100 border-gray-200 opacity-50'
                }`}
                style={isVisible ? { borderColor: metric.color } : {}}
              >
                <Icon 
                  className="w-4 h-4" 
                  style={{ color: isVisible ? metric.color : '#9ca3af' }}
                />
                <span 
                  className="text-xs font-medium"
                  style={{ color: isVisible ? metric.color : '#9ca3af' }}
                >
                  {metric.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={data} 
          onClick={handleClick}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          <Legend />
          
          {visibleMetrics.visualizations && (
            <Line
              type="monotone"
              dataKey="visualizations"
              stroke="#9333ea"
              strokeWidth={2}
              dot={{ r: 4, fill: '#9333ea' }}
              activeDot={{ r: 6, cursor: 'pointer' }}
              name="Visualizaciones"
            />
          )}
          
          {visibleMetrics.reach && (
            <Line
              type="monotone"
              dataKey="reach"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6, cursor: 'pointer' }}
              name="Alcance"
            />
          )}
          
          {visibleMetrics.interactions && (
            <Line
              type="monotone"
              dataKey="interactions"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ r: 4, fill: '#ec4899' }}
              activeDot={{ r: 6, cursor: 'pointer' }}
              name="Interacciones"
            />
          )}
          
          {visibleMetrics.followers && (
            <Line
              type="monotone"
              dataKey="followers"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4, fill: '#10b981' }}
              activeDot={{ r: 6, cursor: 'pointer' }}
              name="Seguidores"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Chart Description */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Activa/desactiva métricas haciendo click en los botones de arriba. 
          Click en los puntos del gráfico para ver el dato en grande.
        </p>
      </div>
    </div>
  );
}
