'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
          <XCircle className="w-12 h-12 text-orange-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Pago Cancelado
        </h1>

        <p className="text-gray-600 mb-2">
          No se procesó ningún cargo.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          Puedes intentar nuevamente cuando estés listo.
        </p>

        <div className="space-y-3">
          <Link href="/tokens" className="block">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 font-medium">
              Intentar Nuevamente
            </Button>
          </Link>

          <Link href="/" className="block">
            <button className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm font-medium">
              Volver al Inicio
            </button>
          </Link>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            ¿Tienes problemas con el pago? Contáctanos en soporte@datapal.com
          </p>
        </div>
      </div>
    </div>
  );
}
