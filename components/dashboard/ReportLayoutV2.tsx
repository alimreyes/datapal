'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Instagram, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface ReportLayoutV2Props {
  reportTitle: string;
  dateRange: string;
  platforms: string[]; // ['instagram', 'facebook']
  clientLogo?: string;
  onTitleChange?: (title: string) => void;
  onPlatformChange?: (platforms: string[]) => void;
  onDateRangeClick?: () => void;
  onLogoUpload?: (file: File) => void;
  onSave?: () => void;
  onExportPDF?: () => void;
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
  onExportPDF,
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
    <div className="min-h-screen bg-gray-50">
      {/* NUEVO HEADER HORIZONTAL */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo DataPal - Clickeable - SIEMPRE va al inicio */}
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/Logo_DataPal.png"
              alt="DataPal"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="text-lg font-bold text-gray-900">DataPal</span>
          </Link>

          {/* Logo Usuario/Cliente - CON opción de subir logo */}
          <div className="relative">
            {clientLogo ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => {
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
              }}>
                <Image src={clientLogo} alt="Logo" width={32} height={32} className="rounded" />
                <span className="text-sm text-gray-700">Usuario</span>
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
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-600">Logo</span>
                </div>
                <span className="text-sm text-gray-700">Subir Logo</span>
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
                className="w-full px-3 py-2 border-2 border-purple-500 rounded-lg text-sm font-medium focus:outline-none"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors"
              >
                {reportTitle}
              </button>
            )}
          </div>

          {/* Grid 2x2 (Visual) */}
          <div className="grid grid-cols-2 gap-1 w-10 h-10">
            <div className="bg-purple-200 rounded-sm"></div>
            <div className="bg-pink-200 rounded-sm"></div>
            <div className="bg-blue-200 rounded-sm"></div>
            <div className="bg-green-200 rounded-sm"></div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-2">
            {onSave && (
              <Button
                onClick={onSave}
                disabled={isSaving}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? 'Guardando...' : 'Guardar Reporte'}
              </Button>
            )}
            {onExportPDF && (
              <Button
                onClick={onExportPDF}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Exportar PDF
              </Button>
            )}
          </div>

          {/* Logos RRSS - Filtros Clickeables */}
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
              className={`p-2 rounded-lg border transition-all hover:shadow-md ${
                platforms.includes('instagram')
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 shadow-sm'
                  : 'bg-gray-100 border-gray-300 opacity-50'
              }`}
              title={platforms.includes('instagram') ? 'Click para ocultar Instagram' : 'Click para mostrar Instagram'}
            >
              <Instagram className={`w-5 h-5 ${platforms.includes('instagram') ? 'text-purple-600' : 'text-gray-400'}`} />
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
              className={`p-2 rounded-lg border transition-all hover:shadow-md ${
                platforms.includes('facebook')
                  ? 'bg-blue-100 border-blue-300 shadow-sm'
                  : 'bg-gray-100 border-gray-300 opacity-50'
              }`}
              title={platforms.includes('facebook') ? 'Click para ocultar Facebook' : 'Click para mostrar Facebook'}
            >
              <svg className={`w-5 h-5 ${platforms.includes('facebook') ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO CON NAVEGACIÓN */}
      <div className="relative">
        {/* Contenido de la página actual */}
        <div className="max-w-[1600px] mx-auto p-6">
          {children}
        </div>

        {/* Botones de Navegación - Flechas */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
          <button
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
              currentPage === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100 hover:shadow-xl'
            }`}
            title="Página anterior"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => onPageChange(Math.min(1, currentPage + 1))}
            disabled={currentPage === 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100 hover:shadow-xl'
            }`}
            title="Página siguiente"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Indicador de Página */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            Hoja {currentPage + 1} de 2
          </span>
        </div>
      </div>
    </div>
  );
}
