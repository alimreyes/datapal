'use client';

import { Clock, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPendingPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Pending Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#FBFEF2] mb-4">
          Pago en proceso
        </h1>

        {/* Description */}
        <p className="text-lg text-[#B6B6B6] mb-8">
          Tu pago está siendo procesado. Esto puede tomar unos minutos dependiendo del método de pago seleccionado.
        </p>

        {/* Info Box */}
        <div className="bg-[#1a1b16] border border-yellow-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-yellow-500" />
            <span className="text-[#FBFEF2] font-medium">Te notificaremos</span>
          </div>
          <p className="text-[#B6B6B6] text-sm">
            Recibirás un email de confirmación cuando tu pago sea aprobado y tu cuenta sea actualizada automáticamente.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>

          <p className="text-sm text-[#B6B6B6]">
            ¿Tienes dudas?{' '}
            <a href="mailto:soporte@datapal.app" className="text-[#019B77] hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
