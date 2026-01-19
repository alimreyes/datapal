import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
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
