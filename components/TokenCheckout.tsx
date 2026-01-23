'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Coins, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { loadStripe } from '@stripe/stripe-js';

// Validar que la key de Stripe esté configurada
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface TokenPackage {
  id: 'single' | 'pack5' | 'pack10';
  name: string;
  tokens: number;
  questions: number;
  price: number;
  originalPrice?: number;
  savings?: string;
  popular?: boolean;
}

const packages: TokenPackage[] = [
  {
    id: 'single',
    name: '1 Token',
    tokens: 1,
    questions: 5,
    price: 2990,
  },
  {
    id: 'pack5',
    name: 'Pack 5 Tokens',
    tokens: 5,
    questions: 25,
    price: 11990,
    originalPrice: 14950,
    savings: '20%',
    popular: true,
  },
  {
    id: 'pack10',
    name: 'Pack 10 Tokens',
    tokens: 10,
    questions: 50,
    price: 20990,
    originalPrice: 29900,
    savings: '30%',
  },
];

export default function TokenCheckout() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (productType: string) => {
    if (!user) {
      setError('Debes iniciar sesión para comprar tokens');
      return;
    }

    if (!stripePromise) {
      setError('Stripe no está configurado. Por favor contacta al administrador.');
      return;
    }

    try {
      setLoading(productType);
      setError(null);

      // Crear sesión de checkout
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear sesión de pago');
      }

      // Redirigir a Stripe Checkout usando la URL de la sesión
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (err: any) {
      console.error('Error en checkout:', err);
      setError(err.message || 'Error al procesar el pago');
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4">
          <Coins className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Compra Tokens de IA
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Obtén acceso a análisis profundos con Claude Sonnet 4.5.
          Haz preguntas específicas sobre tus datos y obtén insights accionables.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
              pkg.popular
                ? 'border-purple-400 shadow-md'
                : 'border-gray-200'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                MÁS POPULAR
              </div>
            )}

            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
                <Coins className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {pkg.name}
              </h3>
              <p className="text-sm text-gray-600">
                {pkg.questions} preguntas con IA
              </p>
            </div>

            <div className="text-center mb-6">
              {pkg.originalPrice && (
                <p className="text-sm text-gray-500 line-through">
                  ${pkg.originalPrice.toLocaleString('es-CL')} CLP
                </p>
              )}
              <p className="text-3xl font-bold text-gray-900">
                ${pkg.price.toLocaleString('es-CL')}
                <span className="text-sm font-normal text-gray-600"> CLP</span>
              </p>
              {pkg.savings && (
                <p className="text-sm font-medium text-green-600 mt-1">
                  ¡Ahorra {pkg.savings}!
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                <span>{pkg.tokens} {pkg.tokens === 1 ? 'token' : 'tokens'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                <span>{pkg.questions} preguntas personalizadas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                <span>Análisis con Claude Sonnet 4.5</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                <span>Sin vencimiento</span>
              </div>
            </div>

            <Button
              onClick={() => handlePurchase(pkg.id)}
              disabled={loading !== null}
              className={`w-full py-6 font-medium transition-all ${
                pkg.popular
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {loading === pkg.id ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Comprar Ahora'
              )}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
          ¿Cómo funcionan los tokens?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2">
              <span className="text-purple-600 font-bold">1</span>
            </div>
            <p className="font-medium mb-1">Compra tokens</p>
            <p className="text-gray-600">Elige el pack que mejor se adapte a tus necesidades</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2">
              <span className="text-purple-600 font-bold">2</span>
            </div>
            <p className="font-medium mb-1">Haz preguntas</p>
            <p className="text-gray-600">Cada token te permite hacer 5 preguntas específicas</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <p className="font-medium mb-1">Obtén insights</p>
            <p className="text-gray-600">Claude analiza tus datos y te da recomendaciones accionables</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Pagos seguros procesados por Stripe • Sin cargos ocultos</p>
      </div>
    </div>
  );
}
