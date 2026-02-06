'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Check, Link2, Loader2, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import { GoogleAnalyticsIcon } from '@/components/icons/PlatformIcons';

interface GAProperty {
  propertyId: string;
  displayName: string;
}

// Wrapper component for Suspense boundary
export default function StepGAPage() {
  return (
    <Suspense fallback={<StepGALoading />}>
      <StepGAContent />
    </Suspense>
  );
}

function StepGALoading() {
  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E37400]" />
      </div>
    </div>
  );
}

function StepGAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { gaConnection, setGAConnection, isGAStepValid, getNextStep, getPreviousStep } = useNewReportStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<GAProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(gaConnection.propertyId);
  const [dateRange, setDateRange] = useState({
    start: gaConnection.dateRange?.start || getDefaultStartDate(),
    end: gaConnection.dateRange?.end || getDefaultEndDate(),
  });

  // Check URL params for OAuth result
  useEffect(() => {
    const connected = searchParams.get('connected');
    const errorParam = searchParams.get('error');

    if (connected === 'true') {
      setGAConnection({ connected: true });
      fetchProperties();
    } else if (errorParam) {
      setError(getErrorMessage(errorParam));
    }
  }, [searchParams]);

  // Fetch properties on mount if already connected
  useEffect(() => {
    if (gaConnection.connected && user) {
      fetchProperties();
    }
  }, [gaConnection.connected, user]);

  const fetchProperties = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ga/properties?userId=${user.uid}`);
      const data = await response.json();

      if (data.connected && data.properties) {
        setProperties(data.properties);
        setGAConnection({ connected: true });
      } else if (!data.connected) {
        setGAConnection({ connected: false });
        setError(data.error || 'No conectado');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Error al obtener las propiedades');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!user) {
      setError('Debes iniciar sesión primero');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ga/connect?userId=${user.uid}`);
      const data = await response.json();

      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        setError('Error al generar la URL de autenticación');
      }
    } catch (err) {
      console.error('Error connecting to GA:', err);
      setError('Error al conectar con Google Analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;

    setLoading(true);

    try {
      await fetch('/api/ga/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });

      setGAConnection({
        connected: false,
        propertyId: null,
        propertyName: null,
        dateRange: null,
      });
      setProperties([]);
      setSelectedProperty(null);
    } catch (err) {
      console.error('Error disconnecting:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySelect = (propertyId: string) => {
    const property = properties.find(p => p.propertyId === propertyId);
    setSelectedProperty(propertyId);
    setGAConnection({
      propertyId,
      propertyName: property?.displayName || null,
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const newRange = { ...dateRange, [field]: value };
    setDateRange(newRange);
    setGAConnection({ dateRange: newRange });
  };

  const handleNext = () => {
    if (isGAStepValid()) {
      const nextStep = getNextStep('google_analytics');
      router.push(nextStep);
    }
  };

  const handleBack = () => {
    const previousStep = getPreviousStep('google_analytics');
    router.push(previousStep);
  };

  const isValid = gaConnection.connected && selectedProperty && dateRange.start && dateRange.end;

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#B6B6B6]">Conexión de datos</span>
            <span className="text-sm text-[#B6B6B6]">Google Analytics</span>
          </div>
          <div className="w-full h-2 bg-[#2a2b25] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '60%' }}
              animate={{ width: '80%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-[#E37400]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <GoogleAnalyticsIcon className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-[#FBFEF2]">Google Analytics</h1>
          </div>
          <p className="text-[#B6B6B6] mb-2">
            Conecta tu cuenta de Google Analytics para obtener datos de tu sitio web
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E37400]/20 text-[#E37400] rounded-full text-sm border border-[#E37400]/30">
            <span className="font-medium">Conexión API</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Connection Status Card */}
        <GlowCard className="mb-6" glowColor="227, 116, 0">
          <CardContent className="p-6">
            {!gaConnection.connected ? (
              /* Not Connected State */
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E37400]/10 border border-[#E37400]/30 flex items-center justify-center">
                  <Link2 className="w-10 h-10 text-[#E37400]" />
                </div>
                <h3 className="text-xl font-semibold text-[#FBFEF2] mb-2">
                  Conecta tu cuenta de Google Analytics
                </h3>
                <p className="text-[#B6B6B6] mb-6 max-w-md mx-auto">
                  Autoriza a DataPal para acceder a tus datos de Google Analytics 4.
                  Solo tendremos acceso de lectura a tus métricas.
                </p>
                <Button
                  onClick={handleConnect}
                  disabled={loading}
                  className="bg-[#E37400] hover:bg-[#E37400]/80 text-white"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <GoogleAnalyticsIcon className="mr-2 h-5 w-5" />
                      Conectar con Google
                    </>
                  )}
                </Button>
              </div>
            ) : (
              /* Connected State */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-[#FBFEF2]">Cuenta conectada</p>
                      <p className="text-sm text-[#B6B6B6]">Google Analytics vinculado correctamente</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Desconectar
                  </Button>
                </div>

                {/* Property Selector */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#FBFEF2] mb-2">
                      Selecciona una propiedad
                    </label>
                    {loading ? (
                      <div className="flex items-center gap-2 text-[#B6B6B6]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Cargando propiedades...</span>
                      </div>
                    ) : properties.length > 0 ? (
                      <div className="grid gap-2">
                        {properties.map((property) => (
                          <button
                            key={property.propertyId}
                            onClick={() => handlePropertySelect(property.propertyId)}
                            className={`w-full p-4 rounded-lg border text-left transition-all ${
                              selectedProperty === property.propertyId
                                ? 'bg-[#E37400]/20 border-[#E37400] text-[#FBFEF2]'
                                : 'bg-[#1a1b16] border-[rgba(251,254,242,0.1)] text-[#B6B6B6] hover:border-[#E37400]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{property.displayName}</p>
                                <p className="text-sm opacity-70">ID: {property.propertyId}</p>
                              </div>
                              {selectedProperty === property.propertyId && (
                                <Check className="h-5 w-5 text-[#E37400]" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-[#B6B6B6]">
                        <p>No se encontraron propiedades de GA4</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchProperties}
                          className="mt-2"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reintentar
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Date Range Selector */}
                  {selectedProperty && (
                    <div>
                      <label className="block text-sm font-medium text-[#FBFEF2] mb-2">
                        <Calendar className="inline mr-2 h-4 w-4" />
                        Rango de fechas
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#B6B6B6] mb-1">Desde</label>
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => handleDateRangeChange('start', e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] text-[#FBFEF2] focus:border-[#E37400] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#B6B6B6] mb-1">Hasta</label>
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => handleDateRangeChange('end', e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] text-[#FBFEF2] focus:border-[#E37400] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </GlowCard>

        {/* Info Card */}
        <GlowCard className="mb-6" glowColor="227, 116, 0">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-[#FBFEF2]">
              🔒 Privacidad y Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#B6B6B6] space-y-2">
            <p>• Solo solicitamos acceso de <strong className="text-[#FBFEF2]">lectura</strong> a tus datos de Analytics</p>
            <p>• No podemos modificar tu configuración de Google Analytics</p>
            <p>• Puedes revocar el acceso en cualquier momento</p>
            <p>• Tus datos están protegidos y no se comparten con terceros</p>
          </CardContent>
        </GlowCard>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            size="lg"
            className="border-[rgba(251,254,242,0.1)] text-[#FBFEF2] hover:bg-[#2a2b25] hover:text-[#FBFEF2]"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Atrás
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!isValid}
            className="bg-[#E37400] hover:bg-[#E37400]/80 text-white border-0"
          >
            Siguiente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getDefaultStartDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'access_denied':
      return 'Acceso denegado. Por favor, autoriza el acceso a Google Analytics.';
    case 'missing_params':
      return 'Parámetros faltantes en la respuesta de OAuth.';
    case 'auth_failed':
      return 'Error en la autenticación. Por favor, intenta nuevamente.';
    default:
      return `Error: ${errorCode}`;
  }
}
