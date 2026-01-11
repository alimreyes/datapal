'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Report } from '@/lib/types';
import { formatNumber } from '@/lib/parsers/metaParser';
import { TrendingUp, TrendingDown, Users, Eye, Heart, Target } from 'lucide-react';

interface ExecutiveSummaryProps {
  report: Report;
}

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  // Calculate totals for Instagram
  const igTotalReach = report.data?.instagram?.reachStats?.total || 0;
  const igTotalImpressions = report.data?.instagram?.impressionsStats?.total || 0;
  const igTotalInteractions = report.data?.instagram?.interactionsStats?.total || 0;
  const igPosts = report.data?.instagram?.content?.length || 0;

  // Calculate totals for Facebook
  const fbTotalReach = report.data?.facebook?.reachStats?.total || 0;
  const fbTotalImpressions = report.data?.facebook?.impressionsStats?.total || 0;
  const fbTotalInteractions = report.data?.facebook?.interactionsStats?.total || 0;
  const fbPosts = report.data?.facebook?.content?.length || 0;

  // Combined totals
  const totalReach = igTotalReach + fbTotalReach;
  const totalImpressions = igTotalImpressions + fbTotalImpressions;
  const totalInteractions = igTotalInteractions + fbTotalInteractions;
  const totalPosts = igPosts + fbPosts;

  // Calculate engagement rate
  const engagementRate = totalReach > 0 
    ? ((totalInteractions / totalReach) * 100).toFixed(2)
    : '0.00';

  // Determine best platform
  const bestPlatformByReach = igTotalReach > fbTotalReach ? 'Instagram' : 'Facebook';
  const bestPlatformEmoji = igTotalReach > fbTotalReach ? '📸' : '👍';

  // Get trends
  const igReachTrend = report.data?.instagram?.reachStats?.trend || 0;
  const fbReachTrend = report.data?.facebook?.reachStats?.trend || 0;
  const overallTrend = igReachTrend + fbReachTrend;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">📊 Resumen Ejecutivo</h2>
        <p className="text-muted-foreground">
          Vista general de tu desempeño en redes sociales
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alcance Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalReach)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Personas únicas alcanzadas
            </p>
            {overallTrend !== 0 && (
              <div className={`flex items-center gap-1 text-xs mt-2 ${overallTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {overallTrend > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{overallTrend > 0 ? '+' : ''}{formatNumber(overallTrend)} vs período anterior</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizaciones</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalImpressions)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de impresiones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interacciones</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalInteractions)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Engagement total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Engagement</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Interacciones / Alcance
            </p>
            <Badge 
              variant={parseFloat(engagementRate) > 3 ? "default" : parseFloat(engagementRate) > 1 ? "secondary" : "outline"}
              className="mt-2"
            >
              {parseFloat(engagementRate) > 3 ? "Excelente" : parseFloat(engagementRate) > 1 ? "Bueno" : "Bajo"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Insights Clave</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg">{bestPlatformEmoji}</span>
            </div>
            <div>
              <p className="font-medium">
                {bestPlatformByReach} es tu plataforma líder
              </p>
              <p className="text-sm text-muted-foreground">
                Con {formatNumber(igTotalReach > fbTotalReach ? igTotalReach : fbTotalReach)} personas alcanzadas
              </p>
            </div>
          </div>

          {totalPosts > 0 && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">📱</span>
              </div>
              <div>
                <p className="font-medium">
                  {totalPosts} publicaciones en el período
                </p>
                <p className="text-sm text-muted-foreground">
                  {igPosts > 0 && `${igPosts} en Instagram`}
                  {igPosts > 0 && fbPosts > 0 && ' • '}
                  {fbPosts > 0 && `${fbPosts} en Facebook`}
                </p>
              </div>
            </div>
          )}

          {overallTrend > 0 && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-600">
                  Tendencia positiva
                </p>
                <p className="text-sm text-muted-foreground">
                  Tu alcance está creciendo en comparación con el período anterior
                </p>
              </div>
            </div>
          )}

          {parseFloat(engagementRate) > 3 && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">🎉</span>
              </div>
              <div>
                <p className="font-medium">
                  Excelente engagement
                </p>
                <p className="text-sm text-muted-foreground">
                  Tu audiencia está altamente comprometida con tu contenido
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {report.data?.instagram && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📸</span>
                <span>Instagram</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Alcance</span>
                <span className="font-bold">{formatNumber(igTotalReach)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Visualizaciones</span>
                <span className="font-bold">{formatNumber(igTotalImpressions)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Interacciones</span>
                <span className="font-bold">{formatNumber(igTotalInteractions)}</span>
              </div>
              {igPosts > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Publicaciones</span>
                  <span className="font-bold">{igPosts}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {report.data?.facebook && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👍</span>
                <span>Facebook</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Espectadores</span>
                <span className="font-bold">{formatNumber(fbTotalReach)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Visualizaciones</span>
                <span className="font-bold">{formatNumber(fbTotalImpressions)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Interacciones</span>
                <span className="font-bold">{formatNumber(fbTotalInteractions)}</span>
              </div>
              {fbPosts > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Publicaciones</span>
                  <span className="font-bold">{fbPosts}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}