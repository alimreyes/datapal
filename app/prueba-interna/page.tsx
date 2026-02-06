'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Upload,
  FileSpreadsheet,
  Shield,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { validateLinkedInXLS, parseLinkedInXLS } from '@/lib/parsers/linkedinXLSParser';
import { LinkedInIcon, GoogleAnalyticsIcon } from '@/components/icons/PlatformIcons';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  data?: any;
}

export default function PruebaInternaPage() {
  const [linkedinFile, setLinkedinFile] = useState<File | null>(null);
  const [linkedinResult, setLinkedinResult] = useState<TestResult | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  // Test LinkedIn XLS Parser
  const testLinkedInParser = async () => {
    if (!linkedinFile) {
      setLinkedinResult({
        name: 'LinkedIn XLS Parser',
        status: 'error',
        message: 'No hay archivo seleccionado'
      });
      return;
    }

    setLinkedinResult({
      name: 'LinkedIn XLS Parser',
      status: 'running',
      message: 'Validando archivo...'
    });

    try {
      // Step 1: Validate
      const validation = await validateLinkedInXLS(linkedinFile);

      if (!validation.valid) {
        setLinkedinResult({
          name: 'LinkedIn XLS Parser',
          status: 'error',
          message: `Validación fallida: ${validation.message}`
        });
        return;
      }

      setLinkedinResult({
        name: 'LinkedIn XLS Parser',
        status: 'running',
        message: 'Parseando archivo...'
      });

      // Step 2: Parse
      const data = await parseLinkedInXLS(linkedinFile);

      setParsedData(data);
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
      setLinkedinResult({
        name: 'LinkedIn XLS Parser',
        status: 'error',
        message: `Error: ${error.message}`
      });
    }
  };

  // Test Google Analytics OAuth (just opens the flow)
  const testGAOAuth = () => {
    window.open('/api/ga/connect', '_blank');
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-[#FBFEF2]">Pruebas Internas</h1>
          </div>
          <p className="text-[#B6B6B6]">
            Página de pruebas para validar integraciones y funcionalidades
          </p>
          <Alert className="mt-4 border-yellow-500/30 bg-yellow-500/10">
            <Shield className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              Esta página es solo para pruebas internas. No compartir el enlace.
            </AlertDescription>
          </Alert>
        </div>

        {/* LinkedIn XLS Parser Test */}
        <Card className="mb-6 bg-[#1a1b16] border-[rgba(251,254,242,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-[#FBFEF2]">
              <div className="text-[#0A66C2]">
                <LinkedInIcon className="w-6 h-6" />
              </div>
              LinkedIn XLS Parser
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#B6B6B6]">
              Prueba el parser de archivos XLS de LinkedIn. Sube un archivo exportado de LinkedIn Analytics.
            </p>

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
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/80"
            >
              {linkedinResult?.status === 'running' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Probar Parser
                </>
              )}
            </Button>

            {/* Result */}
            {linkedinResult && (
              <div className={`p-4 rounded-lg border ${
                linkedinResult.status === 'success'
                  ? 'bg-green-500/10 border-green-500/30'
                  : linkedinResult.status === 'error'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon status={linkedinResult.status} />
                  <span className="font-medium text-[#FBFEF2]">{linkedinResult.name}</span>
                </div>
                <p className="text-sm text-[#B6B6B6]">{linkedinResult.message}</p>

                {linkedinResult.data && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#2a2b25] p-2 rounded">
                      <span className="text-[#B6B6B6]">Días de métricas:</span>
                      <span className="ml-2 text-[#FBFEF2] font-medium">{linkedinResult.data.metricsCount}</span>
                    </div>
                    <div className="bg-[#2a2b25] p-2 rounded">
                      <span className="text-[#B6B6B6]">Publicaciones:</span>
                      <span className="ml-2 text-[#FBFEF2] font-medium">{linkedinResult.data.contentCount}</span>
                    </div>
                    <div className="bg-[#2a2b25] p-2 rounded">
                      <span className="text-[#B6B6B6]">Alcance:</span>
                      <span className={`ml-2 font-medium ${linkedinResult.data.hasReach ? 'text-green-400' : 'text-red-400'}`}>
                        {linkedinResult.data.hasReach ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="bg-[#2a2b25] p-2 rounded">
                      <span className="text-[#B6B6B6]">Interacciones:</span>
                      <span className={`ml-2 font-medium ${linkedinResult.data.hasInteractions ? 'text-green-400' : 'text-red-400'}`}>
                        {linkedinResult.data.hasInteractions ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Parsed Data Preview */}
            {parsedData && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-[#FBFEF2] mb-2">Preview de datos parseados:</h4>
                <pre className="bg-[#2a2b25] p-4 rounded-lg text-xs text-[#B6B6B6] overflow-auto max-h-60">
                  {JSON.stringify({
                    metrics: {
                      impressions: parsedData.metrics.impressions?.slice(0, 3),
                      reach: parsedData.metrics.reach?.slice(0, 3),
                      interactions: parsedData.metrics.interactions?.slice(0, 3),
                      stats: {
                        impressions: parsedData.metrics.impressionsStats,
                        reach: parsedData.metrics.reachStats,
                      }
                    },
                    content: parsedData.content?.slice(0, 2),
                  }, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Google Analytics OAuth Test */}
        <Card className="mb-6 bg-[#1a1b16] border-[rgba(251,254,242,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-[#FBFEF2]">
              <GoogleAnalyticsIcon className="w-6 h-6" />
              Google Analytics OAuth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#B6B6B6]">
              Prueba el flujo de OAuth de Google Analytics. Solo funcionará si tu email está agregado como tester en Google Cloud Console.
            </p>

            <Alert className="border-amber-500/30 bg-amber-500/10">
              <AlertDescription className="text-amber-200 text-sm">
                <strong>Nota:</strong> Para probar, tu cuenta de Google debe estar agregada en:
                <br />
                Google Cloud Console → APIs & Services → OAuth consent screen → Test users
              </AlertDescription>
            </Alert>

            <Button
              onClick={testGAOAuth}
              variant="outline"
              className="border-[#E37400] text-[#E37400] hover:bg-[#E37400]/10"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Iniciar OAuth Flow
            </Button>
          </CardContent>
        </Card>

        {/* Environment Info */}
        <Card className="bg-[#1a1b16] border-[rgba(251,254,242,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-[#FBFEF2]">
              <RefreshCw className="w-6 h-6 text-purple-400" />
              Información del Entorno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#2a2b25] p-3 rounded-lg">
                <span className="text-[#B6B6B6]">Entorno:</span>
                <span className="ml-2 text-[#FBFEF2] font-medium">
                  {process.env.NODE_ENV || 'development'}
                </span>
              </div>
              <div className="bg-[#2a2b25] p-3 rounded-lg">
                <span className="text-[#B6B6B6]">URL Base:</span>
                <span className="ml-2 text-[#FBFEF2] font-medium text-xs">
                  {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#B6B6B6]">
            DataPal - Página de Pruebas Internas
          </p>
        </div>
      </div>
    </div>
  );
}
