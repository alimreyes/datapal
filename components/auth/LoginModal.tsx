'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, BarChart3, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'required' | 'ai_limit' | 'feature';
  onCancel?: () => void; // Called when user cancels without completing login
}

export default function LoginModal({ isOpen, onClose, reason = 'required', onCancel }: LoginModalProps) {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempted, setLoginAttempted] = useState(false);

  // Handle ESC key to close modal
  const handleClose = useCallback(() => {
    if (isLoading) return; // Don't close while loading
    onCancel?.();
    onClose();
  }, [isLoading, onCancel, onClose]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, handleClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoginAttempted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    // Close when clicking the backdrop
    if (!isLoading) {
      handleClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    setLoginAttempted(true);

    const result = await signInWithGoogle();

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'No se pudo completar el registro. Inténtalo de nuevo.');
    }

    setIsLoading(false);
  };

  const getHeaderContent = () => {
    // Logo de DataPal en blanco para todos los casos
    const logo = (
      <Image
        src="/Logo_DataPal.png"
        alt="DataPal"
        width={40}
        height={40}
        className="object-contain invert"
      />
    );

    switch (reason) {
      case 'ai_limit':
        return {
          icon: logo,
          title: 'Límite de IA alcanzado',
          subtitle: 'Has usado todas tus consultas gratuitas de IA este mes.',
        };
      case 'feature':
        return {
          icon: logo,
          title: 'Crear cuenta gratuita',
          subtitle: 'Inicia sesión para generar tu reporte.',
        };
      default:
        return {
          icon: logo,
          title: 'Bienvenido a DataPal',
          subtitle: 'Inicia sesión para acceder a todas las funciones.',
        };
    }
  };

  const header = getHeaderContent();

  const benefits = [
    { icon: Sparkles, text: '10 consultas de IA gratis al mes' },
    { icon: FileText, text: 'Reportes ilimitados' },
    { icon: BarChart3, text: 'Análisis detallados' },
    { icon: CheckCircle2, text: 'Exportación a PDF' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - clickeable para cerrar */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-[#11120D] border border-[#B6B6B6]/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#019B77] via-[#019B77]/50 to-transparent" />

        {/* Close button - visible */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 bg-[#2a2b25] text-[#FBFEF2] hover:bg-[#3a3b35] rounded-full transition-colors z-20 border border-[#B6B6B6]/40 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#019B77]/10 rounded-2xl flex items-center justify-center p-2">
              {header.icon}
            </div>
            <h2 className="text-2xl font-bold text-[#FBFEF2] mb-2">
              {header.title}
            </h2>
            <p className="text-[#B6B6B6]">
              {header.subtitle}
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-8 space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-[#FBFEF2]/80">
                <div className="w-8 h-8 bg-[#019B77]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-4 h-4 text-[#019B77]" />
                </div>
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#FBFEF2] hover:bg-[#FBFEF2]/90 text-[#11120D] font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#11120D]/30 border-t-[#11120D] rounded-full animate-spin" />
            ) : (
              <>
                {/* Google Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Iniciar Sesión / Registrarse
              </>
            )}
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-[#B6B6B6]">
            Al continuar, aceptas nuestros{' '}
            <a href="/terms" className="text-[#019B77] hover:underline">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="/privacy" className="text-[#019B77] hover:underline">
              Política de Privacidad
            </a>
          </p>
        </div>

        {/* Upgrade CTA for AI limit */}
        {reason === 'ai_limit' && (
          <div className="px-8 pb-8 pt-0">
            <div className="p-4 bg-gradient-to-r from-[#019B77]/20 to-[#019B77]/5 border border-[#019B77]/30 rounded-xl">
              <p className="text-center text-sm text-[#FBFEF2]">
                <span className="font-semibold">¿Necesitas más consultas?</span>
                <br />
                <span className="text-[#B6B6B6]">
                  Actualiza a Pro para consultas ilimitadas
                </span>
              </p>
              <button className="mt-3 w-full py-2 bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] font-semibold rounded-lg transition-colors text-sm">
                Ver planes Pro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
