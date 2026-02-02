'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import Link from 'next/link';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  aiQueries: number | 'unlimited';
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    currency: 'USD',
    period: '/mes',
    description: 'Perfecto para empezar a analizar tus redes sociales',
    features: [
      'Reportes ilimitados',
      '10 consultas de IA al mes',
      'Exportación a PDF',
      'Análisis básico de métricas',
      'Soporte por email',
    ],
    aiQueries: 10,
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    currency: 'USD',
    period: '/mes',
    description: 'Para profesionales y agencias pequeñas',
    features: [
      'Todo lo del plan Gratis',
      'Consultas de IA ilimitadas',
      'Análisis avanzado de tendencias',
      'Comparativas históricas',
      'Exportación personalizada',
      'Soporte prioritario',
    ],
    aiQueries: 'unlimited',
    popular: true,
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    currency: 'USD',
    period: '/mes',
    description: 'Para agencias y equipos grandes',
    features: [
      'Todo lo del plan Pro',
      'API access',
      'White-label reports',
      'Multi-usuario (hasta 10)',
      'Integraciones personalizadas',
      'Soporte dedicado 24/7',
      'Capacitación incluida',
    ],
    aiQueries: 'unlimited',
    icon: <Crown className="w-6 h-6" />,
  },
];

export default function PricingPage() {
  const { user, userData } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlan = userData?.subscription || 'free';

  const handleSelectPlan = async (planId: string) => {
    // Si no está autenticado, mostrar modal de login
    if (!user) {
      setSelectedPlan(planId);
      setShowLoginModal(true);
      return;
    }

    // Si es el plan actual, no hacer nada
    if (planId === currentPlan) {
      return;
    }

    // Si es el plan gratuito
    if (planId === 'free') {
      alert('Para cambiar al plan gratuito, contacta a soporte.');
      return;
    }

    // Iniciar proceso de pago con PayPal
    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el checkout');
      }

      // Redirigir a PayPal
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('No se recibió la URL de pago de PayPal');
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      alert(error.message || 'Error al procesar el pago. Por favor intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FBFEF2] mb-4">
            Elige tu plan
          </h1>
          <p className="text-lg text-[#B6B6B6] max-w-2xl mx-auto">
            Desbloquea todo el potencial de DataPal con insights de IA ilimitados y funciones avanzadas
          </p>
        </div>

        {/* Current Plan Badge */}
        {user && (
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#019B77]/10 border border-[#019B77]/30 rounded-full text-[#019B77]">
              <Sparkles className="w-4 h-4" />
              Plan actual: {currentPlan === 'free' ? 'Gratis' : currentPlan === 'pro' ? 'Pro' : 'Enterprise'}
            </span>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#1a1b16] rounded-2xl border ${
                plan.popular
                  ? 'border-[#019B77] shadow-lg shadow-[#019B77]/20'
                  : 'border-[#B6B6B6]/20'
              } p-8 flex flex-col`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#019B77] text-[#11120D] px-4 py-1 rounded-full text-sm font-bold">
                    Más Popular
                  </span>
                </div>
              )}

              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${
                  plan.popular ? 'bg-[#019B77] text-[#11120D]' : 'bg-[#B6B6B6]/10 text-[#019B77]'
                }`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#FBFEF2]">{plan.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-[#FBFEF2]">
                  ${plan.price}
                </span>
                <span className="text-[#B6B6B6]">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-[#B6B6B6] mb-6">{plan.description}</p>

              {/* AI Queries Badge */}
              <div className={`mb-6 p-3 rounded-lg ${
                plan.aiQueries === 'unlimited'
                  ? 'bg-[#019B77]/10 border border-[#019B77]/30'
                  : 'bg-[#B6B6B6]/10 border border-[#B6B6B6]/20'
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${
                    plan.aiQueries === 'unlimited' ? 'text-[#019B77]' : 'text-[#B6B6B6]'
                  }`} />
                  <span className={`font-medium ${
                    plan.aiQueries === 'unlimited' ? 'text-[#019B77]' : 'text-[#FBFEF2]'
                  }`}>
                    {plan.aiQueries === 'unlimited' ? 'Consultas de IA ilimitadas' : `${plan.aiQueries} consultas de IA/mes`}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#019B77] flex-shrink-0 mt-0.5" />
                    <span className="text-[#FBFEF2]/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isProcessing || plan.id === currentPlan}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  plan.id === currentPlan
                    ? 'bg-[#B6B6B6]/20 text-[#B6B6B6] cursor-default'
                    : plan.popular
                    ? 'bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D]'
                    : 'bg-[#FBFEF2] hover:bg-[#FBFEF2]/90 text-[#11120D]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : plan.id === currentPlan ? (
                  'Plan Actual'
                ) : (
                  <>
                    {plan.id === 'free' ? 'Comenzar Gratis' : 'Actualizar'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-[#B6B6B6] mb-4">
            ¿Tienes preguntas? Contáctanos en{' '}
            <a href="mailto:soporte@datapal.app" className="text-[#019B77] hover:underline">
              soporte@datapal.app
            </a>
          </p>
          <p className="text-sm text-[#B6B6B6]/60">
            Todos los pagos son procesados de forma segura a través de PayPal.
            Puedes cancelar en cualquier momento.
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-[#019B77] hover:underline inline-flex items-center gap-2"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setSelectedPlan(null);
        }}
        reason="feature"
      />
    </div>
  );
}
