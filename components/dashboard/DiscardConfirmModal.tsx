'use client';

import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiscardConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reportTitle: string;
}

export default function DiscardConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  reportTitle,
}: DiscardConfirmModalProps) {
  if (!isOpen) return null;

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
          <div className="p-4 bg-yellow-500/20 rounded-full border border-yellow-500/30">
            <Trash2 className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#FBFEF2] text-center mb-2">
          Mover a la Papelera
        </h2>

        {/* Description */}
        <div className="text-center mb-6">
          <p className="text-[#B6B6B6] mb-4">
            Estás a punto de mover a la papelera:
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a2b25] rounded-lg border border-yellow-500/30">
            <span className="text-[#FBFEF2] font-medium">{reportTitle}</span>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#B6B6B6]">
            <p className="font-medium text-yellow-400 mb-1">El reporte se moverá a la papelera</p>
            <p>Podrás recuperarlo desde <strong className="text-[#FBFEF2]">Configuración → Papelera</strong> durante los próximos 7 días. Después de ese plazo se eliminará automáticamente.</p>
          </div>
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
            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white border-0"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Mover a Papelera
          </Button>
        </div>
      </div>
    </div>
  );
}
