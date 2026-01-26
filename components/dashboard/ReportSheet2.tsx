'use client';

import { useState, useMemo } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Eye, Heart, MessageCircle, Share2, Bookmark, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Tipo para los datos de contenido/publicaciones
interface ContentItem {
  id: string;
  postType: string;
  description?: string;
  publishedAt: string;
  permalink: string;
  date: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
  videoViews?: number;
}

// Filtros disponibles para ordenar publicaciones
type SortFilter = 'interactions' | 'reach' | 'impressions' | 'likes' | 'comments' | 'saves';

interface ReportSheet2Props {
  totalPosts: number;
  totalInteractions: number;
  frequency: string; // Ej: "3.5 posts/día"
  chartData: Array<{
    date: string;
    posts: number;
    interactions: number;
  }>;
  // Nuevos datos de contenido
  contentData?: ContentItem[];
  contentInsights?: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
  }>;
  onGenerateInsights?: () => void;
  onRegenerateInsights?: () => void;
  isGenerating?: boolean;
  tokensRemaining?: number;
  onPurchaseTokens?: () => void;
}

export default function ReportSheet2({
  totalPosts,
  totalInteractions,
  frequency,
  chartData,
  contentData = [],
  contentInsights = [],
  onGenerateInsights,
  onRegenerateInsights,
  isGenerating = false,
  tokensRemaining = 0,
  onPurchaseTokens,
}: ReportSheet2Props) {
  // Estado para paginación y filtros del listado de publicaciones
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [sortFilter, setSortFilter] = useState<SortFilter>('interactions');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  // Función para detectar si un post es un reel basado en el permalink o postType
  const isReel = (item: ContentItem): boolean => {
    // Detectar por postType
    if (item.postType === 'VIDEO' || item.postType === 'REELS' || item.postType === 'video') {
      return true;
    }
    // Detectar por permalink (si contiene "reel" en el URL)
    if (item.permalink && item.permalink.toLowerCase().includes('reel')) {
      return true;
    }
    return false;
  };

  // Calcular datos para el gráfico de torta (posts estáticos vs reels)
  const pieChartData = useMemo(() => {
    const reels = contentData.filter((item) => isReel(item)).length;
    const staticPosts = contentData.length - reels;

    return [
      { name: 'Posts Estáticos', value: staticPosts, color: '#9333ea' },
      { name: 'Reels/Videos', value: reels, color: '#ec4899' },
    ];
  }, [contentData]);

  // Ordenar publicaciones según el filtro seleccionado
  const sortedContent = useMemo(() => {
    if (!contentData || contentData.length === 0) return [];

    return [...contentData].sort((a, b) => {
      switch (sortFilter) {
        case 'interactions':
          return (b.likes + b.comments + b.shares + (b.saves || 0)) - (a.likes + a.comments + a.shares + (a.saves || 0));
        case 'reach':
          return b.reach - a.reach;
        case 'impressions':
          return b.impressions - a.impressions;
        case 'likes':
          return b.likes - a.likes;
        case 'comments':
          return b.comments - a.comments;
        case 'saves':
          return (b.saves || 0) - (a.saves || 0);
        default:
          return 0;
      }
    });
  }, [contentData, sortFilter]);

  // Publicación actual para mostrar
  const currentPost = sortedContent[currentPostIndex];

  // Navegación entre publicaciones
  const handlePrevPost = () => {
    setCurrentPostIndex((prev) => (prev > 0 ? prev - 1 : sortedContent.length - 1));
  };

  const handleNextPost = () => {
    setCurrentPostIndex((prev) => (prev < sortedContent.length - 1 ? prev + 1 : 0));
  };

  // Resetear índice cuando cambia el filtro
  const handleFilterChange = (filter: SortFilter) => {
    setSortFilter(filter);
    setCurrentPostIndex(0);
  };

  // Calcular interacciones totales de un post
  const getPostInteractions = (post: ContentItem) => {
    return post.likes + post.comments + post.shares + (post.saves || 0);
  };

  return (
    <div className="space-y-6">
      {/* 3 Cards Horizontales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Publicaciones Totales
          </h3>
          <div className="text-4xl font-bold text-purple-600">
            {formatNumber(totalPosts)}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Interacciones Totales
          </h3>
          <div className="text-4xl font-bold text-pink-600">
            {formatNumber(totalInteractions)}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Frecuencia
          </h3>
          <div className="text-4xl font-bold text-blue-600">{frequency}</div>
        </div>
      </div>

      {/* Gráfico de Área: Interacciones en el Tiempo */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
          Interacciones en el Tiempo
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Area
              type="monotone"
              dataKey="interactions"
              stroke="#9333ea"
              strokeWidth={2}
              fill="url(#colorInteractions)"
              name="Interacciones"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sección: Gráfico de Torta + Listado de Publicaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de Torta: Posts Estáticos vs Reels */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Distribución de Contenido
          </h3>
          {contentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value ?? 0, 'Publicaciones']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No hay datos de contenido disponibles
            </div>
          )}
        </div>

        {/* Listado de Publicaciones con Carrusel */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
            CONTENIDO MÁS DESTACADO
          </h3>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {[
              { key: 'interactions', label: 'Interacciones' },
              { key: 'reach', label: 'Alcance' },
              { key: 'impressions', label: 'Visualizaciones' },
              { key: 'likes', label: 'Likes' },
              { key: 'comments', label: 'Comentarios' },
              { key: 'saves', label: 'Guardados' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key as SortFilter)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  sortFilter === filter.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {sortedContent.length > 0 && currentPost ? (
            <div className="relative">
              {/* Navegación */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevPost}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Tarjeta de publicación */}
                <div className="flex-1 mx-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isReel(currentPost)
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {isReel(currentPost)
                        ? 'Reel/Video'
                        : 'Post Estático'}
                    </span>
                    <a
                      href={currentPost.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {currentPost.description || 'Sin descripción'}
                  </p>

                  <div className="text-xs text-gray-500 mb-3">
                    {new Date(currentPost.date || currentPost.publishedAt).toLocaleDateString('es-CL', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>

                  {/* Métricas del post */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2">
                      <Eye className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                      <div className="text-xs font-semibold">{formatNumber(currentPost.reach)}</div>
                      <div className="text-[10px] text-gray-500">Alcance</div>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <Heart className="w-4 h-4 mx-auto text-red-500 mb-1" />
                      <div className="text-xs font-semibold">{formatNumber(currentPost.likes)}</div>
                      <div className="text-[10px] text-gray-500">Likes</div>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <MessageCircle className="w-4 h-4 mx-auto text-green-500 mb-1" />
                      <div className="text-xs font-semibold">{formatNumber(currentPost.comments)}</div>
                      <div className="text-[10px] text-gray-500">Comentarios</div>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <Bookmark className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                      <div className="text-xs font-semibold">{formatNumber(currentPost.saves || 0)}</div>
                      <div className="text-[10px] text-gray-500">Guardados</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextPost}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Indicador de posición */}
              <div className="text-center mt-3 text-sm text-gray-500">
                {currentPostIndex + 1} de {sortedContent.length}
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              No hay publicaciones disponibles
            </div>
          )}
        </div>
      </div>

      {/* Sección de IA - Enfocada en Contenido */}
      <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          SECCIÓN DE IA:{' '}
          <span className="font-normal">
            Enfocado en analizar y dar resultados enfocados en el Contenido.
          </span>
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Podemos dar algunas sugerencias de preguntas para hacer, y preguntar si
          quiere sugerencias de contenido.
        </p>

        {contentInsights.length > 0 ? (
          <div className="space-y-4">
            {/* Botón Regenerar Insights */}
            {onRegenerateInsights && (
              <div className="mb-4">
                <Button
                  onClick={async () => {
                    if (tokensRemaining <= 0) {
                      alert('No tienes tokens disponibles. Compra más tokens para regenerar insights.');
                      if (onPurchaseTokens) onPurchaseTokens();
                      return;
                    }
                    if (confirm('Regenerar insights consumirá 1 token. ¿Deseas continuar?')) {
                      await onRegenerateInsights();
                    }
                  }}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? 'Generando...' : 'Regenerar Insights (1 token)'}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Tokens restantes: {tokensRemaining}
                </p>
              </div>
            )}

            {/* Insights Generados */}
            <div className="space-y-3">
              {contentInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-white rounded-lg p-4 border border-pink-200"
                >
                  <h4 className="font-bold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-700">{insight.content}</p>
                </div>
              ))}

              {/* Sugerencias de Preguntas */}
              <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 mt-4">
                <h4 className="font-bold text-purple-900 mb-2">
                  💡 Preguntas sugeridas:
                </h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>• ¿Qué tipo de contenido genera más interacciones?</li>
                  <li>• ¿Cuál es el mejor horario para publicar?</li>
                  <li>• ¿Qué temas debo explorar más?</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Genera insights con IA para obtener análisis detallado de tu
              contenido
            </p>
            {onGenerateInsights && (
              <Button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                {isGenerating ? 'Generando...' : 'Generar Análisis de Contenido'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
