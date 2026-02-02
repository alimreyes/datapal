import { NextRequest, NextResponse } from 'next/server';
import { ordersController, PLANS, PlanId } from '@/lib/paypal/config';
import { CheckoutPaymentIntent, OrderRequest, OrderApplicationContextLandingPage, OrderApplicationContextUserAction } from '@paypal/paypal-server-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId, userEmail } = body;

    // Validate required fields
    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (planId, userId)' },
        { status: 400 }
      );
    }

    // Validate plan exists
    if (!PLANS[planId as PlanId]) {
      return NextResponse.json(
        { error: 'Plan no válido' },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as PlanId];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

    // Create PayPal order
    const orderRequest: OrderRequest = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: plan.currency,
            value: plan.price,
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

    // Find approval URL
    const approvalUrl = order.links?.find((link: { rel?: string; href?: string }) => link.rel === 'approve')?.href;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      approvalUrl,
    });
  } catch (error: any) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear la orden de PayPal' },
      { status: 500 }
    );
  }
}
