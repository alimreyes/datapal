'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useNewReportStore } from '@/lib/stores/newReportStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { createDocument } from '@/lib/firebase/firestore';
import { parseMetaCSV, calculateStats, parseMetaContent, hasValidData } from '@/lib/parsers/metaParser';
import LoginModal from '@/components/auth/LoginModal';

const objectiveLabels: Record<string, string> = {
  analysis: 'Análisis',
  improvements: 'Mejoras',
  monthly_report: 'Reporte Mensual',
  'brand-awareness': 'Conocimiento de Marca',
  engagement: 'Engagement',
  conversions: 'Conversiones',
  reach: 'Alcance',
  'content-performance': 'Rendimiento de Contenido',
};

const platformLabels: Record<string, string> = {
  instagram: 'Instagram 📸',
  facebook: 'Facebook 👍',
  linkedin: 'LinkedIn 💼',
  tiktok: 'TikTok 🎵',
  google_analytics: 'Google Analytics 📊',
};

const categoryLabels = {
  reach: 'Alcance',
  impressions: 'Visualizaciones',
  interactions: 'Interacciones',
  followers: 'Seguidores',
  content: 'Contenido',
  visits: 'Visitas',
};

export default function Step5Page() {
  const router = useRouter();
  const { user } = useAuth();
  const { user: authUser } = useAuthContext();
  const { objective, platforms, instagramFiles, facebookFiles, reset } = useNewReportStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(false);
  const hasAutoTriggered = useRef(false);

  const instagramFileCount = Object.values(instagramFiles).filter(f => f !== null).length;
  const facebookFileCount = Object.values(facebookFiles).filter(f => f !== null).length;
  const totalFiles = instagramFileCount + facebookFileCount;

  // Effect to auto-continue after login
  useEffect(() => {
    // If user just logged in and we have a pending confirm, proceed automatically
    if (user && pendingConfirm && !hasAutoTriggered.current) {
      hasAutoTriggered.current = true;
      setPendingConfirm(false);
      setShowLoginModal(false);
      // Small delay to ensure auth state is fully propagated
      setTimeout(() => {
        handleConfirm();
      }, 500);
    }
  }, [user, pendingConfirm]);

  const handleBack = () => {
    // Volver al último step con archivos
    if (platforms.includes('facebook')) {
      router.push('/new-report/step-4');
    } else if (platforms.includes('instagram')) {
      router.push('/new-report/step-3');
    } else {
      router.push('/new-report/step-2');
    }
  };

  const handleGoBack = () => {
    handleBack();
  };

  const handleConfirmClick = () => {
    // If user is not authenticated, show login modal
    if (!user) {
      setPendingConfirm(true);
      setShowLoginModal(true);
      return;
    }

    // User is authenticated, proceed with confirmation
    handleConfirm();
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    // Don't reset pendingConfirm here - we want to auto-continue if they successfully log in
  };

  const handleLoginCancel = () => {
    // User closed the modal without completing login
    setPendingConfirm(false);
    setError('No se pudo completar el registro. Inténtalo de nuevo para generar tu reporte.');
  };

  const handleConfirm = async () => {
    if (!user) {
      setError('No estás autenticado');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Generar ID único para el reporte
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Procesar archivos directamente (sin Storage)
      const processedData: any = {};

      // Helper function to process temporal metrics
      const processTemporalFile = async (file: File | null) => {
        if (!file) {
          console.log('[DEBUG] No file provided');
          return null;
        }

        try {
          console.log(`[DEBUG] Processing file: ${file.name}, size: ${file.size} bytes`);
          const text = await file.text();
          console.log(`[DEBUG] File content length: ${text.length} characters`);
          console.log(`[DEBUG] First 200 chars:`, text.substring(0, 200));

          // Check if file has data
          const isValid = hasValidData(text);
          console.log(`[DEBUG] hasValidData returned: ${isValid}`);

          if (!isValid) {
            console.warn(`[DEBUG] File ${file.name} rejected by hasValidData`);
            return null;
          }

          // Parse temporal metrics
          const parsedData = parseMetaCSV(text);
          console.log(`[DEBUG] Parsed ${parsedData.length} data points from ${file.name}`);

          if (parsedData.length > 0) {
            const stats = calculateStats(parsedData);
            console.log(`[DEBUG] Stats for ${file.name}:`, stats);
            return {
              data: parsedData,
              stats: stats
            };
          }
          console.warn(`[DEBUG] No data parsed from ${file.name}`);
          return null;
        } catch (err) {
          console.error('[DEBUG] Error processing temporal file:', file.name, err);
          return null;
        }
      };

      // Helper function to process content files
      const processContentFile = async (file: File | null) => {
        if (!file) return null;

        try {
          const text = await file.text();

          // Parse content/posts
          const parsedContent = parseMetaContent(text);
          return parsedContent.length > 0 ? parsedContent : null;
        } catch (err) {
          console.error('Error processing content file:', file.name, err);
          return null;
        }
      };

      // Procesar Instagram
      if (platforms.includes('instagram')) {
        processedData.instagram = {};

        // Temporal metrics
        const reach = await processTemporalFile(instagramFiles.reach);
        if (reach) {
          processedData.instagram.reach = reach.data;
          processedData.instagram.reachStats = reach.stats;
        }

        const impressions = await processTemporalFile(instagramFiles.impressions);
        if (impressions) {
          processedData.instagram.impressions = impressions.data;
          processedData.instagram.impressionsStats = impressions.stats;
        }

        const interactions = await processTemporalFile(instagramFiles.interactions);
        if (interactions) {
          processedData.instagram.interactions = interactions.data;
          processedData.instagram.interactionsStats = interactions.stats;
        }

        const followers = await processTemporalFile(instagramFiles.followers);
        if (followers) {
          processedData.instagram.followers = followers.data;
          processedData.instagram.followersStats = followers.stats;
        }

        const visits = await processTemporalFile(instagramFiles.visits);
        if (visits) {
          processedData.instagram.visits = visits.data;
          processedData.instagram.visitsStats = visits.stats;
        }

        // Content (posts)
        const content = await processContentFile(instagramFiles.content);
        if (content) {
          processedData.instagram.content = content;
        }
      }

      // Procesar Facebook
      if (platforms.includes('facebook')) {
        processedData.facebook = {};

        // Temporal metrics
        const reach = await processTemporalFile(facebookFiles.reach);
        if (reach) {
          processedData.facebook.reach = reach.data;
          processedData.facebook.reachStats = reach.stats;
        }

        const impressions = await processTemporalFile(facebookFiles.impressions);
        if (impressions) {
          processedData.facebook.impressions = impressions.data;
          processedData.facebook.impressionsStats = impressions.stats;
        }

        const interactions = await processTemporalFile(facebookFiles.interactions);
        if (interactions) {
          processedData.facebook.interactions = interactions.data;
          processedData.facebook.interactionsStats = interactions.stats;
        }

        const followers = await processTemporalFile(facebookFiles.followers);
        if (followers) {
          processedData.facebook.followers = followers.data;
          processedData.facebook.followersStats = followers.stats;
        }

        const visits = await processTemporalFile(facebookFiles.visits);
        if (visits) {
          processedData.facebook.visits = visits.data;
          processedData.facebook.visitsStats = visits.stats;
        }

        // Content (posts)
        const content = await processContentFile(facebookFiles.content);
        if (content) {
          processedData.facebook.content = content;
        }
      }

      // Generar título automático basado en fecha
      const now = new Date();
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const title = `Reporte ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

      // Crear documento del reporte en Firestore con data ya procesada
      const reportData = {
        userId: user.uid,
        title: title,
        objective: objective,
        platforms: platforms,
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

      const { success, error: createError } = await createDocument('reports', reportId, reportData);

      if (!success) {
        throw new Error(createError || 'Error al crear el reporte');
      }

      // Limpiar el store
      reset();

      // Redirigir directamente al reporte (sin processing page)
      router.push(`/report/${reportId}`);
    } catch (err: any) {
      console.error('Error al confirmar:', err);
      setError(err.message || 'Error al procesar. Por favor intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#B6B6B6]">Paso 5 de 5</span>
            <span className="text-sm text-[#B6B6B6]">Confirmación</span>
          </div>
          <div className="w-full h-2 bg-[#2a2b25] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '80%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-[#019B77]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#019B77]/20 rounded-full mb-4 border border-[#019B77]/30">
            <CheckCircle2 className="h-8 w-8 text-[#019B77]" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-[#FBFEF2]">
            ¡Casi listo!
          </h1>
          <p className="text-[#B6B6B6]">
            Revisa tu información antes de continuar
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-6 bg-[#1a1b16] border-[rgba(251,254,242,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#FBFEF2]">
              <FileText className="h-5 w-5 text-[#019B77]" />
              Resumen de tu reporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Objective */}
            <div>
              <p className="text-sm font-medium text-[#B6B6B6] mb-2">Objetivo:</p>
              <Badge variant="secondary" className="text-sm bg-[#2a2b25] text-[#FBFEF2] border border-[rgba(251,254,242,0.1)]">
                {objective && (objectiveLabels[objective] || objective)}
              </Badge>
            </div>

            {/* Platforms */}
            <div>
              <p className="text-sm font-medium text-[#B6B6B6] mb-2">Plataformas:</p>
              <div className="flex gap-2">
                {platforms.map((platform) => (
                  <Badge key={platform} variant="secondary" className="text-sm bg-[#2a2b25] text-[#FBFEF2] border border-[rgba(251,254,242,0.1)]">
                    {platformLabels[platform]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Files */}
            <div>
              <p className="text-sm font-medium text-[#B6B6B6] mb-2">Archivos cargados:</p>
              <div className="space-y-3">
                {/* Instagram */}
                {platforms.includes('instagram') && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <p className="text-sm font-medium mb-2 text-purple-400">📸 Instagram ({instagramFileCount} archivos)</p>
                    <div className="space-y-1">
                      {Object.entries(instagramFiles).map(([category, file]) => {
                        if (!file) return null;
                        return (
                          <div key={category} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3 w-3 text-[#019B77]" />
                            <span className="text-[#FBFEF2]">{categoryLabels[category as keyof typeof categoryLabels]}</span>
                            <span className="text-[#B6B6B6]">• {file.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Facebook */}
                {platforms.includes('facebook') && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-sm font-medium mb-2 text-blue-400">👍 Facebook ({facebookFileCount} archivos)</p>
                    <div className="space-y-1">
                      {Object.entries(facebookFiles).map(([category, file]) => {
                        if (!file) return null;
                        return (
                          <div key={category} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3 w-3 text-[#019B77]" />
                            <span className="text-[#FBFEF2]">{categoryLabels[category as keyof typeof categoryLabels]}</span>
                            <span className="text-[#B6B6B6]">• {file.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Alert */}
        <Alert className="mb-6 border-[#019B77]/30 bg-[#019B77]/10">
          <AlertCircle className="h-4 w-4 text-[#019B77]" />
          <AlertDescription className="text-[#FBFEF2] font-medium">
            ¿Estás segura/o que subiste toda la información?
          </AlertDescription>
        </Alert>

        {/* Login Required Alert (only shown when not authenticated) */}
        {!user && (
          <Alert className="mb-6 border-yellow-500/30 bg-yellow-500/10">
            <LogIn className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              Necesitas iniciar sesión para generar tu reporte. ¡Es gratis y solo toma unos segundos!
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleGoBack}
            size="lg"
            disabled={isProcessing}
            className="border-[rgba(251,254,242,0.1)] text-[#FBFEF2] hover:bg-[#2a2b25] hover:text-[#FBFEF2]"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            No, aún me falta
          </Button>

          <Button
            size="lg"
            onClick={handleConfirmClick}
            disabled={isProcessing}
            className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] border-0"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : !user ? (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Iniciar sesión y continuar
              </>
            ) : (
              'Sí, avancemos'
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#B6B6B6]">
            Total: {totalFiles} archivo{totalFiles !== 1 ? 's' : ''} • Los archivos se procesarán de forma segura
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleLoginModalClose}
        onCancel={handleLoginCancel}
        reason="feature"
      />
    </div>
  );
}
