'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Zap, FileText, Palette, Link2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'trialModal_lastShown';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export default function TrialWelcomeModal() {
  const { trialDaysRemaining, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Solo mostrar para usuarios con trial activo
    if (!userData?.trialCode) return;
    if (userData.subscription === 'free') return;
    if (trialDaysRemaining === null || trialDaysRemaining <= 0) return;

    // Verificar si ya se mostró en las últimas 24 horas
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown) {
      const elapsed = Date.now() - parseInt(lastShown, 10);
      if (elapsed < TWENTY_FOUR_HOURS) return;
    }

    // Mostrar modal y guardar timestamp
    setIsOpen(true);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, [userData, trialDaysRemaining]);

  if (!isOpen) return null;

  const features = [
    { icon: Zap, text: 'Consultas de IA ilimitadas' },
    { icon: FileText, text: 'Exportación a PDF profesional' },
    { icon: Palette, text: 'White-label: tu marca en los reportes' },
    { icon: Link2, text: 'Smart Links para compartir reportes' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1a1b16] border border-[#019B77]/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[#B6B6B6] hover:text-[#FBFEF2] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header con gradiente verde */}
        <div className="bg-gradient-to-br from-[#019B77]/20 to-transparent px-6 pt-8 pb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#019B77]/20 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#019B77]" />
          </div>
          <h2 className="text-xl font-bold text-[#FBFEF2] mb-1">
            ¡Tu prueba Pro está activa!
          </h2>
          <p className="text-[#B6B6B6]">
            Te quedan <span className="text-[#019B77] font-semibold">{trialDaysRemaining} día{trialDaysRemaining !== 1 ? 's' : ''}</span> para explorar todas las funciones
          </p>
        </div>

        {/* Features desbloqueadas */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-xs uppercase tracking-wider text-[#B6B6B6] font-medium mb-3">
            Funciones desbloqueadas
          </p>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#019B77]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-4 h-4 text-[#019B77]" />
              </div>
              <span className="text-sm text-[#FBFEF2]/90">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 px-6 bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            ¡Explorar!
          </button>
        </div>
      </div>
    </div>
  );
}
