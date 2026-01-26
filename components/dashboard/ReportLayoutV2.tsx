'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface ReportLayoutV2Props {
  reportTitle: string;
  dateRange: string;
  platforms: string[];
  clientLogo?: string;
  onTitleChange?: (title: string) => void;
  onPlatformChange?: (platforms: string[]) => void;
  onDateRangeClick?: () => void;
  onLogoUpload?: (file: File) => void;
  onSave?: () => void;
  isSaving?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
}

export default function ReportLayoutV2({
  reportTitle,
  dateRange,
  platforms,
  clientLogo,
  onTitleChange,
  onPlatformChange,
  onDateRangeClick,
  onLogoUpload,
  onSave,
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

          {/* Grid Visual */}
          <div className="grid grid-cols-2 gap-1 w-10 h-10">
            <div className="bg-[#019B77]/40 rounded-sm"></div>
            <div className="bg-[#019B77]/30 rounded-sm"></div>
            <div className="bg-[#019B77]/20 rounded-sm"></div>
            <div className="bg-[#019B77]/10 rounded-sm"></div>
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
          </div>

          {/* Filtros RRSS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onPlatformChange) {
                  const newPlatforms = platforms.includes('instagram')
                    ? platforms.filter(p => p !== 'instagram')
                    : [...platforms, 'instagram'];
                  onPlatformChange(newPlatforms);
                }
              }}
              className={`p-2 rounded-lg border transition-all ${
                platforms.includes('instagram')
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'bg-[#1a1b16] border-[rgba(251,254,242,0.1)] opacity-50'
              }`}
              title={platforms.includes('instagram') ? 'Ocultar Instagram' : 'Mostrar Instagram'}
            >
              <Instagram className={`w-5 h-5 ${platforms.includes('instagram') ? 'text-purple-400' : 'text-[#B6B6B6]'}`} />
            </button>

            <button
              onClick={() => {
                if (onPlatformChange) {
                  const newPlatforms = platforms.includes('facebook')
                    ? platforms.filter(p => p !== 'facebook')
                    : [...platforms, 'facebook'];
                  onPlatformChange(newPlatforms);
                }
              }}
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
