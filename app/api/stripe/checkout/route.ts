import { NextRequest, NextResponse } from 'next/server';
import { stripe, TOKEN_PRODUCTS, TokenProductType } from '@/lib/stripe/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productType, userId } = body as { productType: TokenProductType; userId: string };

    if (!productType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: productType and userId' },
        { status: 400 }
      );
    }

    const product = TOKEN_PRODUCTS[productType];
    if (!product) {
      return NextResponse.json(
        { error: 'Invalid product type' },
        { status: 400 }
      );
    }

    // Crear sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/cancel`,
      metadata: {
        userId,
        productType,
        tokens: product.tokens.toString(),
      },
      client_reference_id: userId,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear sesión de pago' },
      { status: 500 }
    );
  }
}
