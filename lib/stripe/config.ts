import Stripe from 'stripe';

// En build time, usar una key dummy para evitar errores
// En runtime, la variable real debe estar presente
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';

if (!process.env.STRIPE_SECRET_KEY && typeof window !== 'undefined') {
  console.warn('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

// Productos y precios de tokens
export const TOKEN_PRODUCTS = {
  single: {
    name: '1 Token - 5 Preguntas IA',
    description: 'Un token para hacer 5 preguntas personalizadas a Claude sobre tus datos',
    price: 2990, // En centavos de CLP
    currency: 'clp',
    tokens: 1,
  },
  pack5: {
    name: 'Pack 5 Tokens - 25 Preguntas IA',
    description: 'Pack de 5 tokens (25 preguntas). ¡Ahorra 20%!',
    price: 11990, // En centavos de CLP
    currency: 'clp',
    tokens: 5,
  },
  pack10: {
    name: 'Pack 10 Tokens - 50 Preguntas IA',
    description: 'Pack de 10 tokens (50 preguntas). ¡Ahorra 30%!',
    price: 20990, // En centavos de CLP
    currency: 'clp',
    tokens: 10,
  },
} as const;

export type TokenProductType = keyof typeof TOKEN_PRODUCTS;
