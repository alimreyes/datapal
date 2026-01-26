'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Opcional: Puedes hacer una llamada para verificar la sesión
    if (sessionId) {
      console.log('Payment successful, session:', sessionId);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          ¡Pago Exitoso!
        </h1>

        <p className="text-gray-600 mb-2">
          Tus tokens han sido agregados a tu cuenta.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          Ya puedes comenzar a hacer preguntas personalizadas con IA.
        </p>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 font-medium">
              Ir a Mis Reportes
            </Button>
          </Link>

          <button
            onClick={() => router.back()}
            className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm font-medium"
          >
            Volver
          </button>
        </div>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-900">
            <strong>Tip:</strong> Puedes ver tu balance de tokens en cualquier reporte
            con la sección de "Insights con IA"
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
