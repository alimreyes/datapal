'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refreshUserData } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const plan = searchParams.get('plan');
  const token = searchParams.get('token'); // PayPal order ID
  const planName = plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Premium';

  useEffect(() => {
    const capturePayment = async () => {
      // If we have a token (PayPal order ID), capture the payment
      if (token) {
        try {
          const response = await fetch('/api/checkout/capture', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: token }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Error al procesar el pago');
          }

          // Payment captured successfully
          if (user) {
            await refreshUserData();
          }
          setStatus('success');
        } catch (error: any) {
          console.error('Error capturing payment:', error);
          setErrorMessage(error.message || 'Error al procesar el pago');
          setStatus('error');
        }
      } else {
        // No token, just refresh user data (maybe payment was already processed)
        if (user) {
          await refreshUserData();
        }
        setStatus('success');
      }
    };

    capturePayment();
  }, [token, user, refreshUserData]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <Loader2 className="w-16 h-16 mx-auto text-[#019B77] animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-[#FBFEF2] mb-4">
            Procesando tu pago...
          </h1>
          <p className="text-[#B6B6B6]">
            Por favor espera mientras confirmamos tu pago con PayPal.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#FBFEF2] mb-4">
            Error en el pago
          </h1>
          <p className="text-lg text-[#B6B6B6] mb-8">
            {errorMessage}
          </p>
          <div className="space-y-4">
            <Link
              href="/pricing"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] font-semibold rounded-xl transition-colors"
            >
              Intentar de nuevo
            </Link>
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B6B6B6]/10 hover:bg-[#B6B6B6]/20 text-[#FBFEF2] font-medium rounded-xl transition-colors"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
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
            Recibirás un email de confirmación de PayPal en breve.
          </p>
        </div>
      </div>
    </div>
  );
}
