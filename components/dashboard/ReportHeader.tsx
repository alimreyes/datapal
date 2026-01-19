'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Instagram, Share2, Upload, Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ReportHeaderProps {
  reportTitle: string;
  dateRange: string;
  platforms: string[];
  onTitleChange?: (title: string) => void;
  onPlatformChange?: (platforms: string[]) => void;
  onDateRangeClick?: () => void;
  clientLogo?: string;
  onLogoUpload?: (file: File) => void;
  onExportPDF?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export default function ReportHeader({
  reportTitle,
  dateRange,
  platforms,
  onTitleChange,
  onPlatformChange,
  onDateRangeClick,
  clientLogo,
  onLogoUpload,
  onExportPDF,
  onSave,
  isSaving = false,
}: ReportHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(reportTitle);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleTitleSave = () => {
    if (onTitleChange && editedTitle.trim()) {
      onTitleChange(editedTitle);
    }
    setIsEditingTitle(false);
  };

  const handlePlatformToggle = (platform: string) => {
    if (!onPlatformChange) return;
    
    if (platforms.includes(platform)) {
      if (platforms.length > 1) {
        onPlatformChange(platforms.filter(p => p !== platform));
      }
    } else {
      onPlatformChange([...platforms, platform]);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onLogoUpload) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      
      // Validar tamaño (opcional: máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen debe ser menor a 2MB');
        return;
      }
      
      onLogoUpload(file);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Logo DataPal - Arriba a la izquierda - CLICKEABLE */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white text-xl font-bold hidden lg:block">DataPal</span>
        </Link>

        {/* Botones de acción - Lado izquierdo */}
        <div className="flex gap-2">
          {/* Botón Guardar */}
          {onSave && (
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="bg-green-600 text-white hover:bg-green-700 font-medium flex items-center gap-2"
              size="default"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span className="hidden sm:inline">Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hidden sm:inline">Guardar</span>
                </>
              )}
            </Button>
          )}

          {/* Botón Exportar PDF */}
          <Button
            id="export-pdf-button"
            onClick={onExportPDF}
            className="bg-white text-purple-600 hover:bg-purple-50 font-medium flex items-center gap-2"
            size="default"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>

          {/* Botón Compartir */}
          <Button
            className="bg-white text-purple-600 hover:bg-purple-50 font-medium flex items-center gap-2"
            size="default"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartir</span>
          </Button>
        </div>

        {/* Control de Fecha - CLICKEABLE */}
        <button
          onClick={onDateRangeClick}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30 hover:bg-white/30 transition-all cursor-pointer"
          title="Click para cambiar rango de fechas"
        >
          <Calendar className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">{dateRange}</span>
        </button>

        {/* Título Editable */}
        <div className="flex-1 min-w-[300px] max-w-[500px]">
          {isEditingTitle ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleSave();
                  } else if (e.key === 'Escape') {
                    setEditedTitle(reportTitle);
                    setIsEditingTitle(false);
                  }
                }}
                onBlur={handleTitleSave}
                className="flex-1 px-4 py-2 rounded-lg text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                autoFocus
                placeholder="Ingresa el título del reporte"
              />
              <Button
                onClick={handleTitleSave}
                className="bg-white text-purple-600 hover:bg-purple-50"
                size="sm"
              >
                Guardar
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-white text-lg font-bold hover:text-purple-100 transition-colors text-left w-full"
              title="Click para editar el título"
            >
              {reportTitle}
            </button>
          )}
        </div>

        {/* Selector de Plataforma - Solo íconos */}
        <div className="flex gap-2">
          <button
            onClick={() => handlePlatformToggle('instagram')}
            className={`p-3 rounded-lg font-medium transition-all ${
              platforms.includes('instagram')
                ? 'bg-white text-purple-600 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title="Filtrar por Instagram"
          >
            <Instagram className="w-5 h-5" />
          </button>
          <button
            onClick={() => handlePlatformToggle('facebook')}
            className={`p-3 rounded-lg font-medium transition-all ${
              platforms.includes('facebook')
                ? 'bg-white text-purple-600 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title="Filtrar por Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>

        {/* Logo Cliente - Lado derecho */}
        <div className="relative group">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />

          {clientLogo ? (
            <button
              onClick={() => logoInputRef.current?.click()}
              className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden hover:ring-2 hover:ring-white transition-all group relative"
              title="Click para cambiar logo"
            >
              <Image
                src={clientLogo}
                alt="Logo Cliente"
                width={64}
                height={64}
                className="object-contain"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => logoInputRef.current?.click()}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
              title="Subir logo del cliente (128x128px recomendado)"
            >
              <Upload className="w-5 h-5 text-white mb-1" />
              <span className="text-white text-[10px] font-medium">LOGO</span>
            </button>
          )}

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            Tamaño recomendado: 128x128px
          </div>
        </div>
      </div>
    </div>
  );
}