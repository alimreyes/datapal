'use client';

import { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function TrialBanner() {
  const { trialDaysRemaining, userData } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Solo mostrar para usuarios con trial activo
  if (!userData?.trialCode) return null;
  if (userData.subscription === 'free') return null;
  if (trialDaysRemaining === null) return null;
  if (dismissed) return null;

  const isUrgent = trialDaysRemaining <= 3;

  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border ${
      isUrgent
        ? 'bg-yellow-500/10 border-yellow-500/30'
        : 'bg-[#019B77]/10 border-[#019B77]/30'
    }`}>
      <div className="flex items-center gap-3 flex-wrap">
        <Clock className={`w-4 h-4 flex-shrink-0 ${isUrgent ? 'text-yellow-400' : 'text-[#019B77]'}`} />
        <span className={`text-sm font-medium ${isUrgent ? 'text-yellow-300' : 'text-[#019B77]'}`}>
          {trialDaysRemaining === 0
            ? 'Tu prueba Pro expira hoy'
            : `${trialDaysRemaining} día${trialDaysRemaining !== 1 ? 's' : ''} restante${trialDaysRemaining !== 1 ? 's' : ''} de tu prueba Pro`
          }
        </span>
        <Link
          href="/pricing"
          className={`text-xs underline hover:no-underline opacity-80 hover:opacity-100 ${
            isUrgent ? 'text-yellow-300' : 'text-[#019B77]'
          }`}
        >
          Continuar con Pro
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className={`flex-shrink-0 hover:opacity-70 transition-opacity ${
          isUrgent ? 'text-yellow-400' : 'text-[#019B77]'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
