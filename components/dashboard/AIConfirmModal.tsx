'use client';

import { X, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedPlatforms: string[];
}

export default function AIConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedPlatforms,
}: AIConfirmModalProps) {
  if (!isOpen) return null;

  // Formatear nombres de plataformas para mostrar
  const formatPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
      google_analytics: 'Google Analytics',
    };
    return names[platform] || platform;
  };

  const platformsText = selectedPlatforms
    .map(formatPlatformName)
    .join(' y ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#B6B6B6] hover:text-[#FBFEF2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#019B77]/20 rounded-full border border-[#019B77]/30">
            <Sparkles className="w-8 h-8 text-[#019B77]" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#FBFEF2] text-center mb-2">
          Generar Insights con IA
        </h2>

        {/* Description */}
        <div className="text-center mb-6">
          <p className="text-[#B6B6B6] mb-4">
            Actualmente tienes seleccionado:
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a2b25] rounded-lg border border-[rgba(251,254,242,0.1)]">
            <span className="text-[#FBFEF2] font-medium">{platformsText}</span>
          </div>
          <p className="text-[#B6B6B6] mt-4 text-sm">
            {selectedPlatforms.length > 1
              ? '¿Deseas continuar con los insights de IA para estas plataformas combinadas?'
              : '¿Deseas continuar con los insights de IA para esta plataforma?'}
          </p>
        </div>

        {/* Info box */}
        <div className="bg-[#019B77]/10 border border-[#019B77]/30 rounded-lg p-3 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#019B77] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#B6B6B6]">
            Esta acción consumirá 1 token de tu cuenta. Los insights se generarán basados en los datos de las métricas seleccionadas.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-[rgba(251,254,242,0.2)] text-[#B6B6B6] hover:bg-[#2a2b25] hover:text-[#FBFEF2]"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] border-0"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generar Insights
          </Button>
        </div>
      </div>
    </div>
  );
}
