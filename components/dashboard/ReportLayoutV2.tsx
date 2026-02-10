'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { LinkedInIcon } from '@/components/icons/PlatformIcons';

interface ReportLayoutV2Props {
  reportTitle: string;
  dateRange: string;
  platforms: string[];
  availablePlatforms: string[]; // Plataformas que tiene el reporte (para mostrar botones)
  clientLogo?: string;
  onTitleChange?: (title: string) => void;
  onPlatformChange?: (platforms: string[]) => void;
  onDateRangeClick?: () => void;
  onLogoUpload?: (file: File) => void;
  onSave?: () => void;
  onDiscard?: () => void;
  isSaving?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
}

export default function ReportLayoutV2({
  reportTitle,
  dateRange,
  platforms,
  availablePlatforms,
  clientLogo,
  onTitleChange,
  onPlatformChange,
  onDateRangeClick,
  onLogoUpload,
  onSave,
  onDiscard,
  isSaving = false,
  currentPage,
  onPageChange,
  children,
}: ReportLayoutV2Props) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(reportTitle);

  const handleTitleSave = () => {
    if (onTitleChange && editedTitle.trim()) {
      onTitleChange(editedTitle);
    }
    setIsEditingTitle(false);
  };

  // Función para manejar selección de plataforma con lógica especial
  // LinkedIn es exclusivo (no se puede combinar con Instagram/Facebook)
  const handlePlatformToggle = (platform: string) => {
    if (!onPlatformChange) return;

    if (platform === 'linkedin') {
      // Si se selecciona LinkedIn, solo mostrar LinkedIn
      if (platforms.includes('linkedin')) {
        // Si ya está seleccionado, volver a mostrar todas las disponibles
        onPlatformChange(availablePlatforms);
      } else {
        // Seleccionar solo LinkedIn
        onPlatformChange(['linkedin']);
      }
    } else {
      // Instagram o Facebook
      if (platforms.includes('linkedin')) {
        // Si LinkedIn está activo, cambiar a la nueva plataforma
        onPlatformChange([platform]);
      } else {
        // Toggle normal
        const newPlatforms = platforms.includes(platform)
          ? platforms.filter(p => p !== platform)
          : [...platforms, platform];

        // Si queda vacío, mostrar todas
        if (newPlatforms.length === 0) {
          onPlatformChange(availablePlatforms.filter(p => p !== 'linkedin'));
        } else {
          // Asegurar que LinkedIn no esté incluido
          onPlatformChange(newPlatforms.filter(p => p !== 'linkedin'));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#11120D]">
      {/* HEADER */}
      <div className="bg-[#11120D] border-b border-[rgba(251,254,242,0.1)] px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo DataPal */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Image
              src="/Logo_DataPal.png"
              alt="DataPal"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="text-lg font-bold text-[#FBFEF2] font-[var(--font-roboto-mono)] group-hover:text-[#019B77] transition-colors">
              DataPal
            </span>
          </Link>

          {/* Logo Usuario/Cliente */}
          <div className="relative">
            {clientLogo ? (
              <div
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1b16] rounded-lg border border-[rgba(251,254,242,0.1)] cursor-pointer hover:border-[#019B77]/50 transition-colors"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) => {
                    const file = e.target?.files?.[0];
                    if (file && onLogoUpload) {
                      onLogoUpload(file);
                    }
                  };
                  input.click();
                }}
              >
                <Image src={clientLogo} alt="Logo" width={32} height={32} className="rounded" />
                <span className="text-sm text-[#B6B6B6]">Cliente</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) => {
                    const file = e.target?.files?.[0];
                    if (file && onLogoUpload) {
                      onLogoUpload(file);
                    }
                  };
                  input.click();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1b16] rounded-lg border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-[#2a2b25] rounded flex items-center justify-center">
                  <span className="text-xs text-[#B6B6B6]">Logo</span>
                </div>
                <span className="text-sm text-[#B6B6B6]">Subir Logo</span>
              </button>
            )}
          </div>

          {/* Título Editable */}
          <div className="flex-1 min-w-[200px] max-w-[400px]">
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') {
                    setEditedTitle(reportTitle);
                    setIsEditingTitle(false);
                  }
                }}
                onBlur={handleTitleSave}
                className="w-full px-3 py-2 bg-[#1a1b16] border-2 border-[#019B77] rounded-lg text-sm font-medium text-[#FBFEF2] focus:outline-none"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-sm font-medium text-[#FBFEF2] hover:text-[#019B77] transition-colors"
              >
                {reportTitle}
              </button>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-2">
            {onSave && (
              <Button
                onClick={onSave}
                disabled={isSaving}
                size="sm"
                className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] border-0"
              >
                {isSaving ? 'Guardando...' : 'Guardar Reporte'}
              </Button>
            )}
            {onDiscard && (
              <Button
                onClick={onDiscard}
                size="sm"
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Descartar
              </Button>
            )}
          </div>

          {/* Filtros RRSS - Solo mostrar botones para plataformas disponibles */}
          <div className="flex items-center gap-2">
            {/* Instagram */}
            {availablePlatforms.includes('instagram') && (
              <button
                onClick={() => handlePlatformToggle('instagram')}
                className={`p-2 rounded-lg border transition-all ${
                  platforms.includes('instagram')
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-[#1a1b16] border-[rgba(251,254,242,0.1)] opacity-50'
                }`}
                title={platforms.includes('instagram') ? 'Ocultar Instagram' : 'Mostrar Instagram'}
              >
                <svg className={`w-5 h-5 ${platforms.includes('instagram') ? 'text-purple-400' : 'text-[#B6B6B6]'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
            )}

            {/* Facebook */}
            {availablePlatforms.includes('facebook') && (
              <button
                onClick={() => handlePlatformToggle('facebook')}
                className={`p-2 rounded-lg border transition-all ${
                  platforms.includes('facebook')
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-[#1a1b16] border-[rgba(251,254,242,0.1)] opacity-50'
                }`}
                title={platforms.includes('facebook') ? 'Ocultar Facebook' : 'Mostrar Facebook'}
              >
                <svg className={`w-5 h-5 ${platforms.includes('facebook') ? 'text-blue-400' : 'text-[#B6B6B6]'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            )}

            {/* LinkedIn */}
            {availablePlatforms.includes('linkedin') && (
              <button
                onClick={() => handlePlatformToggle('linkedin')}
                className={`p-2 rounded-lg border transition-all ${
                  platforms.includes('linkedin')
                    ? 'bg-[#0A66C2]/20 border-[#0A66C2]/50'
                    : 'bg-[#1a1b16] border-[rgba(251,254,242,0.1)] opacity-50'
                }`}
                title={platforms.includes('linkedin') ? 'Ocultar LinkedIn' : 'Mostrar LinkedIn'}
              >
                <LinkedInIcon className={`w-5 h-5 ${platforms.includes('linkedin') ? 'text-[#0A66C2]' : 'text-[#B6B6B6]'}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="relative">
        <div className="max-w-[1600px] mx-auto p-6">
          {children}
        </div>

        {/* Navegación */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
          <button
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${
              currentPage === 0
                ? 'bg-[#1a1b16] border-[rgba(251,254,242,0.1)] cursor-not-allowed'
                : 'bg-[#1a1b16] border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50 hover:bg-[#2a2b25]'
            }`}
            title="Página anterior"
          >
            <ChevronLeft className={`w-6 h-6 ${currentPage === 0 ? 'text-[#B6B6B6]/50' : 'text-[#FBFEF2]'}`} />
          </button>
          <button
            onClick={() => onPageChange(Math.min(1, currentPage + 1))}
            disabled={currentPage === 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${
              currentPage === 1
                ? 'bg-[#1a1b16] border-[rgba(251,254,242,0.1)] cursor-not-allowed'
                : 'bg-[#1a1b16] border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50 hover:bg-[#2a2b25]'
            }`}
            title="Página siguiente"
          >
            <ChevronRight className={`w-6 h-6 ${currentPage === 1 ? 'text-[#B6B6B6]/50' : 'text-[#FBFEF2]'}`} />
          </button>
        </div>

        {/* Indicador de Página */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1a1b16] px-4 py-2 rounded-full border border-[rgba(251,254,242,0.1)]">
          <span className="text-sm font-medium text-[#FBFEF2]">
            Hoja {currentPage + 1} de 2
          </span>
        </div>
      </div>
    </div>
  );
}
