import { Client, Environment, LogLevel, OrdersController, PaymentsController } from '@paypal/paypal-server-sdk';

// Initialize PayPal client
export const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || '',
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  },
  environment: process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

export const ordersController = new OrdersController(paypalClient);
export const paymentsController = new PaymentsController(paypalClient);

// Plans configuration
export const PLANS = {
  pro: {
    id: 'pro',
    name: 'DataPal Pro',
    price: '9.99',
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
    price: '29.99',
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
