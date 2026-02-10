'use client';

import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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

        {/* Logo DataPal */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-[#019B77]/20 rounded-full border border-[#019B77]/30">
            <Image
              src="/DataPal_Logo_Blanco.png"
              alt="DataPal AI"
              width={48}
              height={48}
              className="object-contain"
            />
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
          {/* Plataformas destacadas */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {selectedPlatforms.map((platform) => {
              const platformStyles: Record<string, { bg: string; border: string; text: string }> = {
                instagram: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
                facebook: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
                linkedin: { bg: 'bg-[#0A66C2]/20', border: 'border-[#0A66C2]/50', text: 'text-[#0A66C2]' },
                tiktok: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400' },
                google_analytics: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
              };
              const style = platformStyles[platform] || { bg: 'bg-[#019B77]/20', border: 'border-[#019B77]/50', text: 'text-[#019B77]' };

              return (
                <span
                  key={platform}
                  className={`px-4 py-2 rounded-full ${style.bg} border ${style.border} ${style.text} font-semibold text-sm`}
                >
                  {formatPlatformName(platform)}
                </span>
              );
            })}
          </div>
          <p className="text-[#B6B6B6] text-sm">
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
            <Image
              src="/DataPal_Logo_Blanco.png"
              alt=""
              width={20}
              height={20}
              className="mr-2"
            />
            Generar Insights
          </Button>
        </div>
      </div>
    </div>
  );
}
