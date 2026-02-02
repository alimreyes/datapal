'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const plan = searchParams.get('plan');
  const planName = plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Premium';

  useEffect(() => {
    // Refresh user data to get updated subscription
    const refresh = async () => {
      if (user) {
        await refreshUserData();
      }
      setIsLoading(false);
    };

    refresh();
  }, [user, refreshUserData]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-[#019B77]/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-[#019B77]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#FBFEF2] mb-4">
          ¡Pago Exitoso!
        </h1>

        {/* Description */}
        <p className="text-lg text-[#B6B6B6] mb-8">
          Tu suscripción al plan <span className="text-[#019B77] font-semibold">{planName}</span> ha sido activada correctamente.
        </p>

        {/* Benefits Box */}
        <div className="bg-[#1a1b16] border border-[#019B77]/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#019B77]" />
            <span className="text-[#FBFEF2] font-medium">Ahora tienes acceso a:</span>
          </div>
          <ul className="text-left text-[#B6B6B6] space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#019B77]" />
              Consultas de IA ilimitadas
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#019B77]" />
              Análisis avanzado de tendencias
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#019B77]" />
              Soporte prioritario
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] font-semibold rounded-xl transition-colors"
          >
            Ir al Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-sm text-[#B6B6B6]">
            Recibirás un email de confirmación en breve.
          </p>
        </div>
      </div>
    </div>
  );
}
