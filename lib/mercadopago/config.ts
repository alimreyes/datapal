import { MercadoPagoConfig } from 'mercadopago';

// Initialize MercadoPago with access token
export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

// Plans configuration
export const PLANS = {
  pro: {
    id: 'pro',
    name: 'DataPal Pro',
    price: 9.99,
    currency: 'USD',
    description: 'Consultas de IA ilimitadas + funciones avanzadas',
    features: [
      'Consultas de IA ilimitadas',
      'Análisis avanzado de tendencias',
      'Comparativas históricas',
      'Exportación personalizada',
      'Soporte prioritario',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'DataPal Enterprise',
    price: 29.99,
    currency: 'USD',
    description: 'Para agencias y equipos grandes',
    features: [
      'Todo lo del plan Pro',
      'API access',
      'White-label reports',
      'Multi-usuario (hasta 10)',
      'Integraciones personalizadas',
      'Soporte dedicado 24/7',
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
