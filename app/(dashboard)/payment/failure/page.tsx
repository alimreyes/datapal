'use client';

import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailurePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Failure Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#FBFEF2] mb-4">
          Pago no completado
        </h1>

        {/* Description */}
        <p className="text-lg text-[#B6B6B6] mb-8">
          Hubo un problema al procesar tu pago. No se ha realizado ningún cargo a tu cuenta.
        </p>

        {/* Help Box */}
        <div className="bg-[#1a1b16] border border-[#B6B6B6]/20 rounded-xl p-6 mb-8">
          <p className="text-[#B6B6B6] text-sm mb-4">
            Esto puede ocurrir por:
          </p>
          <ul className="text-left text-[#B6B6B6] text-sm space-y-2">
            <li>• Fondos insuficientes</li>
            <li>• Tarjeta rechazada por el banco</li>
            <li>• Datos de pago incorrectos</li>
            <li>• Conexión interrumpida</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href="/pricing"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </Link>

          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B6B6B6]/10 hover:bg-[#B6B6B6]/20 text-[#FBFEF2] font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>

          <p className="text-sm text-[#B6B6B6]">
            ¿Necesitas ayuda?{' '}
            <a href="mailto:soporte@datapal.app" className="text-[#019B77] hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
