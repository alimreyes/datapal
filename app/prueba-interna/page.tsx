'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  FileSpreadsheet,
  Shield,
  ExternalLink,
  RefreshCw,
  Play,
  ArrowRight,
  FileText,
  Zap
} from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { validateLinkedInXLS, parseLinkedInXLS } from '@/lib/parsers/linkedinXLSParser';
import { parseTikTokCSV, parseTikTokContent, hasValidTikTokData } from '@/lib/parsers/tiktokParser';
import { LinkedInIcon, TikTokIcon, GoogleAnalyticsIcon } from '@/components/icons/PlatformIcons';
import { useAuth } from '@/lib/hooks/useAuth';
import { createDocument } from '@/lib/firebase/firestore';
import { parseMetaCSV, calculateStats, parseMetaContent, hasValidData } from '@/lib/parsers/metaParser';
import GlowCard from '@/components/ui/GlowCard';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  data?: any;
}

export default function PruebaInternaPage() {
  const router = useRouter();
  const { user } = useAuth();

  // LinkedIn State
  const [linkedinFile, setLinkedinFile] = useState<File | null>(null);
  const [linkedinResult, setLinkedinResult] = useState<TestResult | null>(null);
  const [linkedinParsedData, setLinkedinParsedData] = useState<any>(null);

  // TikTok State
  const [tiktokFile, setTiktokFile] = useState<File | null>(null);
  const [tiktokResult, setTiktokResult] = useState<TestResult | null>(null);
  const [tiktokParsedData, setTiktokParsedData] = useState<any>(null);

  // GA State
  const [gaStatus, setGaStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [gaProperties, setGaProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [gaData, setGaData] = useState<any>(null);

  // Full Workflow State
  const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);

  // Check GA connection on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('ga') === 'connected') {
      setGaStatus('connected');
      fetchGAProperties();
    }
  }, []);

  // Fetch GA Properties
  const fetchGAProperties = async () => {
    try {
      const response = await fetch('/api/ga/properties');
      if (response.ok) {
        const data = await response.json();
        setGaProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Error fetching GA properties:', error);
    }
  };

  // Fetch GA Data for selected property
  const fetchGAData = async () => {
    if (!selectedProperty) return;

    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await fetch(`/api/ga/data?propertyId=${selectedProperty}&startDate=${startDate}&endDate=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        setGaData(data);
      }
    } catch (error) {
      console.error('Error fetching GA data:', error);
    }
  };

  // Test LinkedIn XLS Parser
  const testLinkedInParser = async () => {
    if (!linkedinFile) {
      setLinkedinResult({ name: 'LinkedIn XLS Parser', status: 'error', message: 'No hay archivo seleccionado' });
      return;
    }

    setLinkedinResult({ name: 'LinkedIn XLS Parser', status: 'running', message: 'Validando archivo...' });

    try {
      const validation = await validateLinkedInXLS(linkedinFile);
      if (!validation.valid) {
        setLinkedinResult({ name: 'LinkedIn XLS Parser', status: 'error', message: `Validación fallida: ${validation.message}` });
        return;
      }

      setLinkedinResult({ name: 'LinkedIn XLS Parser', status: 'running', message: 'Parseando archivo...' });
      const data = await parseLinkedInXLS(linkedinFile);

      setLinkedinParsedData(data);
      setLinkedinResult({
        name: 'LinkedIn XLS Parser',
        status: 'success',
        message: `Parseado exitoso! Métricas: ${data.metrics.impressions?.length || 0} días, Contenido: ${data.content?.length || 0} publicaciones`,
        data: {
          metricsCount: data.metrics.impressions?.length || 0,
          contentCount: data.content?.length || 0,
          hasReach: !!data.metrics.reach?.length,
          hasInteractions: !!data.metrics.interactions?.length,
        }
      });
    } catch (error: any) {
      setLinkedinResult({ name: 'LinkedIn XLS Parser', status: 'error', message: `Error: ${error.message}` });
    }
  };

  // Test TikTok CSV Parser
  const testTikTokParser = async () => {
    if (!tiktokFile) {
      setTiktokResult({ name: 'TikTok CSV Parser', status: 'error', message: 'No hay archivo seleccionado' });
      return;
    }

    setTiktokResult({ name: 'TikTok CSV Parser', status: 'running', message: 'Leyendo archivo...' });

    try {
      const text = await tiktokFile.text();

      if (!hasValidTikTokData(text)) {
        setTiktokResult({ name: 'TikTok CSV Parser', status: 'error', message: 'El archivo no tiene datos válidos de TikTok' });
        return;
      }

      setTiktokResult({ name: 'TikTok CSV Parser', status: 'running', message: 'Parseando datos...' });

      // Try temporal data first
      const temporalData = parseTikTokCSV(text);
      // Try content data
      const contentData = parseTikTokContent(text);

      const result = {
        temporal: temporalData,
        content: contentData,
        stats: temporalData.length > 0 ? calculateStats(temporalData) : null
      };

      setTiktokParsedData(result);
      setTiktokResult({
        name: 'TikTok CSV Parser',
        status: 'success',
        message: `Parseado exitoso! Días: ${temporalData.length}, Posts: ${contentData.length}`,
        data: result
      });
    } catch (error: any) {
      setTiktokResult({ name: 'TikTok CSV Parser', status: 'error', message: `Error: ${error.message}` });
    }
  };

  // Start GA OAuth
  const startGAOAuth = () => {
    setGaStatus('connecting');
    // Redirect to GA connect with return URL to this page
    const returnUrl = encodeURIComponent(window.location.origin + '/prueba-interna?ga=connected');
    window.location.href = `/api/ga/connect?returnUrl=${returnUrl}`;
  };

  // Create Test Report with all data
  const createTestReport = async () => {
    if (!user) {
      alert('Debes iniciar sesión para crear un reporte de prueba');
      return;
    }

    setWorkflowStatus('running');

    try {
      const reportId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const processedData: any = {};

      // Add LinkedIn data if available
      if (linkedinParsedData) {
        processedData.linkedin = {
          ...linkedinParsedData.metrics,
          content: linkedinParsedData.content,
        };
      }

      // Add TikTok data if available
      if (tiktokParsedData) {
        processedData.tiktok = {
          impressions: tiktokParsedData.temporal,
          impressionsStats: tiktokParsedData.stats,
          content: tiktokParsedData.content,
        };
      }

      // Add GA data if available
      if (gaData) {
        processedData.googleAnalytics = gaData;
      }

      const now = new Date();
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      const platforms: string[] = [];
      if (linkedinParsedData) platforms.push('linkedin');
      if (tiktokParsedData) platforms.push('tiktok');
      if (gaData) platforms.push('google_analytics');

      const reportData = {
        userId: user.uid,
        title: `[PRUEBA] Reporte ${monthNames[now.getMonth()]} ${now.getFullYear()}`,
        objective: 'analysis',
        platforms,
        status: 'ready' as const,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        customization: {
          creative: 3,
          analytical: 3,
          professional: 3,
          colorPalette: null,
          colorPaletteImageUrl: null,
        },
        data: processedData,
        aiInsights: null,
      };

      const { success, error } = await createDocument('reports', reportId, reportData);

      if (!success) {
        throw new Error(error || 'Error al crear el reporte');
      }

      setCreatedReportId(reportId);
      setWorkflowStatus('success');
    } catch (error: any) {
      console.error('Error creating test report:', error);
      setWorkflowStatus('error');
    }
  };

  const StatusIcon = ({ status }: { status: TestResult['status'] }) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-[#FBFEF2]">Pruebas Internas</h1>
          </div>
          <p className="text-[#B6B6B6]">
            Página de pruebas para LinkedIn, TikTok y Google Analytics
          </p>
          <Alert className="mt-4 border-yellow-500/30 bg-yellow-500/10">
            <Shield className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              Esta página es solo para pruebas internas. Aquí puedes probar las integraciones antes de habilitarlas en producción.
            </AlertDescription>
          </Alert>

          {/* User Status */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-[#B6B6B6]">Usuario:</span>
            {user ? (
              <span className="text-sm text-green-400">{user.email} (Autenticado)</span>
            ) : (
              <span className="text-sm text-red-400">No autenticado - Inicia sesión para crear reportes de prueba</span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LinkedIn Test Card */}
          <GlowCard glowColor="10, 102, 194">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-[#FBFEF2]">
                <div className="text-[#0A66C2]">
                  <LinkedInIcon className="w-6 h-6" />
                </div>
                LinkedIn XLS Parser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                label="Archivo XLS de LinkedIn"
                description="Archivo con hojas 'Indicadores' y 'Todas las publicaciones'"
                file={linkedinFile}
                onFileChange={setLinkedinFile}
                accept=".xls,.xlsx"
                maxSize={10}
              />

              <Button
                onClick={testLinkedInParser}
                disabled={!linkedinFile || linkedinResult?.status === 'running'}
                className="w-full bg-[#0A66C2] hover:bg-[#0A66C2]/80"
              >
                {linkedinResult?.status === 'running' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Procesando...</>
                ) : (
                  <><FileSpreadsheet className="mr-2 h-4 w-4" />Probar Parser</>
                )}
              </Button>

              {linkedinResult && (
                <div className={`p-3 rounded-lg border text-sm ${
                  linkedinResult.status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
                  linkedinResult.status === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
                  'bg-blue-500/10 border-blue-500/30 text-blue-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={linkedinResult.status} />
                    <span>{linkedinResult.message}</span>
                  </div>
                </div>
              )}

              {linkedinParsedData && (
                <details className="text-xs">
                  <summary className="text-[#B6B6B6] cursor-pointer hover:text-[#FBFEF2]">Ver datos parseados</summary>
                  <pre className="mt-2 bg-[#2a2b25] p-3 rounded-lg overflow-auto max-h-40 text-[#B6B6B6]">
                    {JSON.stringify({ metrics: linkedinParsedData.metrics.impressionsStats, contentSample: linkedinParsedData.content?.slice(0, 1) }, null, 2)}
                  </pre>
                </details>
              )}
            </CardContent>
          </GlowCard>

          {/* TikTok Test Card */}
          <GlowCard glowColor="255, 0, 80">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-[#FBFEF2]">
                <TikTokIcon className="w-6 h-6" />
                TikTok CSV Parser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                label="Archivo CSV de TikTok"
                description="Exportado desde TikTok Analytics"
                file={tiktokFile}
                onFileChange={setTiktokFile}
                accept=".csv"
                maxSize={10}
              />

              <Button
                onClick={testTikTokParser}
                disabled={!tiktokFile || tiktokResult?.status === 'running'}
                className="w-full bg-gradient-to-r from-[#00f2ea] to-[#ff0050] hover:opacity-90"
              >
                {tiktokResult?.status === 'running' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Procesando...</>
                ) : (
                  <><FileText className="mr-2 h-4 w-4" />Probar Parser</>
                )}
              </Button>

              {tiktokResult && (
                <div className={`p-3 rounded-lg border text-sm ${
                  tiktokResult.status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
                  tiktokResult.status === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
                  'bg-blue-500/10 border-blue-500/30 text-blue-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={tiktokResult.status} />
                    <span>{tiktokResult.message}</span>
                  </div>
                </div>
              )}

              {tiktokParsedData && (
                <details className="text-xs">
                  <summary className="text-[#B6B6B6] cursor-pointer hover:text-[#FBFEF2]">Ver datos parseados</summary>
                  <pre className="mt-2 bg-[#2a2b25] p-3 rounded-lg overflow-auto max-h-40 text-[#B6B6B6]">
                    {JSON.stringify({ stats: tiktokParsedData.stats, sampleData: tiktokParsedData.temporal?.slice(0, 3) }, null, 2)}
                  </pre>
                </details>
              )}
            </CardContent>
          </GlowCard>
        </div>

        {/* Google Analytics Card - Full Width */}
        <Card className="mt-6 bg-[#1a1b16] border-[rgba(251,254,242,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-[#FBFEF2]">
              <GoogleAnalyticsIcon className="w-6 h-6" />
              Google Analytics - Workflow Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-amber-500/30 bg-amber-500/10">
              <AlertDescription className="text-amber-200 text-sm">
                <strong>Requisito:</strong> Tu cuenta de Google debe estar en la lista de testers en Google Cloud Console.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Step 1: Connect */}
              <div className={`p-4 rounded-lg border ${gaStatus === 'connected' ? 'bg-green-500/10 border-green-500/30' : 'bg-[#2a2b25] border-[rgba(251,254,242,0.1)]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#E37400] text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span className="font-medium text-[#FBFEF2]">Conectar</span>
                  {gaStatus === 'connected' && <CheckCircle2 className="h-4 w-4 text-green-400 ml-auto" />}
                </div>
                <Button
                  onClick={startGAOAuth}
                  disabled={gaStatus === 'connecting' || gaStatus === 'connected'}
                  variant="outline"
                  size="sm"
                  className="w-full border-[#E37400] text-[#E37400] hover:bg-[#E37400]/10"
                >
                  {gaStatus === 'connecting' ? <Loader2 className="h-4 w-4 animate-spin" /> :
                   gaStatus === 'connected' ? 'Conectado' : 'Conectar GA'}
                </Button>
              </div>

              {/* Step 2: Select Property */}
              <div className={`p-4 rounded-lg border ${selectedProperty ? 'bg-green-500/10 border-green-500/30' : 'bg-[#2a2b25] border-[rgba(251,254,242,0.1)]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#E37400] text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span className="font-medium text-[#FBFEF2]">Seleccionar Propiedad</span>
                  {selectedProperty && <CheckCircle2 className="h-4 w-4 text-green-400 ml-auto" />}
                </div>
                {gaProperties.length > 0 ? (
                  <select
                    value={selectedProperty || ''}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full bg-[#11120D] border border-[rgba(251,254,242,0.2)] rounded px-2 py-1 text-sm text-[#FBFEF2]"
                  >
                    <option value="">Seleccionar...</option>
                    {gaProperties.map((prop: any) => (
                      <option key={prop.name} value={prop.name}>{prop.displayName}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-[#B6B6B6]">{gaStatus === 'connected' ? 'Cargando propiedades...' : 'Conecta primero'}</p>
                )}
              </div>

              {/* Step 3: Fetch Data */}
              <div className={`p-4 rounded-lg border ${gaData ? 'bg-green-500/10 border-green-500/30' : 'bg-[#2a2b25] border-[rgba(251,254,242,0.1)]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#E37400] text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span className="font-medium text-[#FBFEF2]">Obtener Datos</span>
                  {gaData && <CheckCircle2 className="h-4 w-4 text-green-400 ml-auto" />}
                </div>
                <Button
                  onClick={fetchGAData}
                  disabled={!selectedProperty || !!gaData}
                  variant="outline"
                  size="sm"
                  className="w-full border-[#E37400] text-[#E37400] hover:bg-[#E37400]/10"
                >
                  {gaData ? 'Datos obtenidos' : 'Obtener datos'}
                </Button>
              </div>
            </div>

            {gaData && (
              <details className="text-xs">
                <summary className="text-[#B6B6B6] cursor-pointer hover:text-[#FBFEF2]">Ver datos de GA</summary>
                <pre className="mt-2 bg-[#2a2b25] p-3 rounded-lg overflow-auto max-h-40 text-[#B6B6B6]">
                  {JSON.stringify(gaData, null, 2)}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>

        {/* Create Test Report */}
        <Card className="mt-6 bg-[#1a1b16] border-[#019B77]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-[#FBFEF2]">
              <Zap className="w-6 h-6 text-[#019B77]" />
              Crear Reporte de Prueba
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#B6B6B6]">
              Crea un reporte con los datos que hayas parseado arriba. Esto te permite verificar cómo se ven los datos en el dashboard real.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[#B6B6B6]">Datos disponibles:</span>
              {linkedinParsedData && <span className="px-2 py-1 bg-[#0A66C2]/20 text-[#0A66C2] rounded text-xs">LinkedIn</span>}
              {tiktokParsedData && <span className="px-2 py-1 bg-gradient-to-r from-[#00f2ea]/20 to-[#ff0050]/20 text-white rounded text-xs">TikTok</span>}
              {gaData && <span className="px-2 py-1 bg-[#E37400]/20 text-[#E37400] rounded text-xs">Google Analytics</span>}
              {!linkedinParsedData && !tiktokParsedData && !gaData && <span className="text-xs text-[#B6B6B6]">Ninguno - parsea datos arriba primero</span>}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={createTestReport}
                disabled={(!linkedinParsedData && !tiktokParsedData && !gaData) || !user || workflowStatus === 'running'}
                className="bg-[#019B77] hover:bg-[#02c494]"
              >
                {workflowStatus === 'running' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</>
                ) : (
                  <><Play className="mr-2 h-4 w-4" />Crear Reporte de Prueba</>
                )}
              </Button>

              {createdReportId && (
                <Button
                  onClick={() => router.push(`/report/${createdReportId}`)}
                  variant="outline"
                  className="border-[#019B77] text-[#019B77]"
                >
                  Ver Reporte <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {workflowStatus === 'success' && (
              <Alert className="border-green-500/30 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  Reporte creado exitosamente! ID: {createdReportId}
                </AlertDescription>
              </Alert>
            )}

            {workflowStatus === 'error' && (
              <Alert className="border-red-500/30 bg-red-500/10">
                <XCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  Error al crear el reporte. Revisa la consola para más detalles.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Environment Info */}
        <Card className="mt-6 bg-[#1a1b16] border-[rgba(251,254,242,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-[#FBFEF2]">
              <RefreshCw className="w-6 h-6 text-purple-400" />
              Información del Entorno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-[#2a2b25] p-3 rounded-lg">
                <span className="text-[#B6B6B6] block text-xs">Entorno</span>
                <span className="text-[#FBFEF2] font-medium">{process.env.NODE_ENV}</span>
              </div>
              <div className="bg-[#2a2b25] p-3 rounded-lg">
                <span className="text-[#B6B6B6] block text-xs">GA Status</span>
                <span className={`font-medium ${gaStatus === 'connected' ? 'text-green-400' : 'text-[#B6B6B6]'}`}>{gaStatus}</span>
              </div>
              <div className="bg-[#2a2b25] p-3 rounded-lg">
                <span className="text-[#B6B6B6] block text-xs">LinkedIn</span>
                <span className={`font-medium ${linkedinParsedData ? 'text-green-400' : 'text-[#B6B6B6]'}`}>{linkedinParsedData ? 'Listo' : 'Sin datos'}</span>
              </div>
              <div className="bg-[#2a2b25] p-3 rounded-lg">
                <span className="text-[#B6B6B6] block text-xs">TikTok</span>
                <span className={`font-medium ${tiktokParsedData ? 'text-green-400' : 'text-[#B6B6B6]'}`}>{tiktokParsedData ? 'Listo' : 'Sin datos'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#B6B6B6]">
            DataPal - Página de Pruebas Internas v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
