import { NextRequest, NextResponse } from 'next/server';
import { ordersController, PLANS, PlanId } from '@/lib/paypal/config';
import { CheckoutPaymentIntent, OrderRequest, OrderApplicationContextLandingPage, OrderApplicationContextUserAction } from '@paypal/paypal-server-sdk';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Rate limiting for checkout creation
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 20; // Max 20 checkout attempts per 15 min

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      console.warn(`Checkout rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Demasiados intentos. Por favor espera unos minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { planId, userId, userEmail } = body;

    // Validate required fields
    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (planId, userId)' },
        { status: 400 }
      );
    }

    // Validate planId format
    if (typeof planId !== 'string' || !['pro', 'enterprise'].includes(planId)) {
      return NextResponse.json(
        { error: 'Plan no válido' },
        { status: 400 }
      );
    }

    // Validate userId format
    if (typeof userId !== 'string' || userId.length < 10 || userId.length > 128) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

    // Verify user exists in database
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.warn(`Checkout attempt for non-existent user: ${userId}`);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 400 }
      );
    }

    // Check if user already has an active subscription
    const userData = userDoc.data();
    if (userData?.subscription === planId && userData?.subscriptionStatus === 'active') {
      return NextResponse.json(
        { error: 'Ya tienes este plan activo' },
        { status: 400 }
      );
    }

    // Get plan from server config (NEVER trust frontend price)
    const plan = PLANS[planId as PlanId];
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan no válido' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

    // Create PayPal order with server-side price
    const orderRequest: OrderRequest = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: plan.currency,
            value: plan.price, // Price from server config, NOT from request
          },
          description: plan.description,
          customId: JSON.stringify({ userId, planId }),
        },
      ],
      applicationContext: {
        brandName: 'DataPal',
        landingPage: OrderApplicationContextLandingPage.Login,
        userAction: OrderApplicationContextUserAction.PayNow,
        returnUrl: `${appUrl}/payment/success?plan=${planId}`,
        cancelUrl: `${appUrl}/payment/failure`,
      },
    };

    const { result: order } = await ordersController.createOrder({
      body: orderRequest,
    });

    // Log checkout creation (without sensitive data)
    console.log('PayPal order created:', {
      orderId: order.id,
      userId,
      planId,
      amount: plan.price,
      currency: plan.currency,
      timestamp: new Date().toISOString(),
    });

    // Find approval URL
    const approvalUrl = order.links?.find((link: { rel?: string; href?: string }) => link.rel === 'approve')?.href;

    if (!approvalUrl) {
      console.error('PayPal order created but no approval URL found');
      return NextResponse.json(
        { error: 'Error al generar el enlace de pago' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      approvalUrl,
    });
  } catch (error: any) {
    // Log internal error but return generic message
    console.error('Error creating PayPal order:', {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: 'No pudimos iniciar el proceso de pago. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
