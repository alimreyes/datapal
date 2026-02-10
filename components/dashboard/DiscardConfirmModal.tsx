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
          <div className="p-4 bg-red-500/20 rounded-full border border-red-500/30">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#FBFEF2] text-center mb-2">
          Descartar Informe
        </h2>

        {/* Description */}
        <div className="text-center mb-6">
          <p className="text-[#B6B6B6] mb-4">
            Estás a punto de eliminar permanentemente:
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a2b25] rounded-lg border border-red-500/30">
            <span className="text-[#FBFEF2] font-medium">{reportTitle}</span>
          </div>
        </div>

        {/* Warning box */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#B6B6B6]">
            <p className="font-medium text-red-400 mb-1">Esta acción no se puede deshacer</p>
            <p>Se eliminarán todos los datos del informe, incluyendo las notas personales y los insights generados.</p>
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
            className="flex-1 bg-red-600 hover:bg-red-500 text-white border-0"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar Informe
          </Button>
        </div>
      </div>
    </div>
  );
}
