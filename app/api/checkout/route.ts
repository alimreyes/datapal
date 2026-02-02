import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import { mercadopago, PLANS, PlanId } from '@/lib/mercadopago/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId, userEmail } = body;

    // Validate required fields
    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (planId, userId, userEmail)' },
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

    // Create MercadoPago preference
    const preference = new Preference(mercadopago);

    const preferenceData = await preference.create({
      body: {
        items: [
          {
            id: plan.id,
            title: plan.name,
            description: plan.description,
            quantity: 1,
            unit_price: plan.price,
            currency_id: 'USD',
          },
        ],
        payer: {
          email: userEmail,
        },
        back_urls: {
          success: `${appUrl}/payment/success?plan=${planId}`,
          failure: `${appUrl}/payment/failure`,
          pending: `${appUrl}/payment/pending`,
        },
        auto_return: 'approved',
        external_reference: JSON.stringify({
          userId,
          planId,
          timestamp: Date.now(),
        }),
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        statement_descriptor: 'DATAPAL',
        metadata: {
          userId,
          planId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      preferenceId: preferenceData.id,
      initPoint: preferenceData.init_point,
      sandboxInitPoint: preferenceData.sandbox_init_point,
    });
  } catch (error: any) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear el checkout' },
      { status: 500 }
    );
  }
}
