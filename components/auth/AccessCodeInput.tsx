'use client';

import { useState } from 'react';
import { Gift, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';

interface AccessCodeInputProps {
  userId?: string | null;
  onSuccess?: (expiresAt: string, daysRemaining: number) => void;
}

export default function AccessCodeInput({ userId, onSuccess }: AccessCodeInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleActivate = async () => {
    setError('');
    const normalized = code.trim().toLowerCase();

    if (!normalized) {
      setError('Ingresa un código de acceso');
      return;
    }

    setIsLoading(true);

    if (!userId) {
      // Pre-auth: guardar en sessionStorage para redimir después del login
      sessionStorage.setItem('pendingAccessCode', normalized);
      setSuccess(true);
      setIsLoading(false);
      return;
    }

    // Post-auth: redimir inmediatamente
    try {
      const res = await fetch('/api/access-code/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalized, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Código inválido');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      onSuccess?.(data.trialExpiresAt, data.daysRemaining);
    } catch {
      setError('Error al activar el código. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success && !userId) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#019B77]">
        <CheckCircle2 className="w-4 h-4" />
        <span>Código guardado. Se activará al iniciar sesión.</span>
      </div>
    );
  }

  if (success && userId) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#019B77]">
        <CheckCircle2 className="w-4 h-4" />
        <span>Prueba Pro activada por 15 días</span>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-[#B6B6B6] hover:text-[#FBFEF2] transition-colors"
      >
        <Gift className="w-4 h-4 text-[#019B77]" />
        <span>¿Tienes un código de acceso?</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ingresa tu código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleActivate();
                }
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#11120D] border border-[rgba(251,254,242,0.15)] rounded-xl text-[#FBFEF2] text-sm placeholder:text-[#B6B6B6]/50 focus:outline-none focus:border-[#019B77] focus:ring-1 focus:ring-[#019B77] transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleActivate}
              disabled={isLoading}
              className="px-4 py-2 bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activar'}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
