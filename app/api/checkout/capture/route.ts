import { NextRequest, NextResponse } from 'next/server';
import { ordersController, PLANS, PlanId } from '@/lib/paypal/config';
import { getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { OrderCaptureRequest } from '@paypal/paypal-server-sdk';

// In-memory store for processed payments (in production, use Redis/DB)
const processedPayments = new Set<string>();

// Rate limiting: max 10 attempts per IP per 15 minutes
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10;

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
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Demasiados intentos de pago. Intenta en 15 minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Falta el orderId' },
        { status: 400 }
      );
    }

    // Validate orderId format (basic validation)
    if (typeof orderId !== 'string' || orderId.length < 10 || orderId.length > 50) {
      return NextResponse.json(
        { error: 'Formato de orderId inválido' },
        { status: 400 }
      );
    }

    // Check if this payment was already processed (idempotency)
    if (processedPayments.has(orderId)) {
      console.log(`Payment ${orderId} already processed (idempotency check)`);
      return NextResponse.json({
        success: true,
        message: 'Pago ya procesado anteriormente',
        alreadyProcessed: true,
      });
    }

    // First, verify the order exists and get its details from PayPal
    // This is CRITICAL - never trust client data alone
    let orderDetails;
    try {
      const { result } = await ordersController.getOrder({ id: orderId });
      orderDetails = result;
    } catch (verifyError: any) {
      console.error('Error verifying PayPal order:', verifyError);
      return NextResponse.json(
        { error: 'No se pudo verificar la orden con PayPal' },
        { status: 400 }
      );
    }

    // Verify order is in approved status (ready to capture)
    if (orderDetails.status !== 'APPROVED' && orderDetails.status !== 'COMPLETED') {
      console.warn(`Order ${orderId} has invalid status: ${orderDetails.status}`);
      return NextResponse.json(
        { error: `Estado de orden inválido: ${orderDetails.status}` },
        { status: 400 }
      );
    }

    // If already completed, skip capture
    if (orderDetails.status === 'COMPLETED') {
      console.log(`Order ${orderId} already completed`);
      processedPayments.add(orderId);

      // Extract user info and update if not done
      const customId = orderDetails.purchaseUnits?.[0]?.customId;
      if (customId) {
        try {
          const parsed = JSON.parse(customId);
          return NextResponse.json({
            success: true,
            status: 'COMPLETED',
            userId: parsed.userId,
            planId: parsed.planId,
            alreadyCompleted: true,
          });
        } catch (e) {
          // Continue with response
        }
      }

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        alreadyCompleted: true,
      });
    }

    // Extract and validate amount from order details (NEVER trust frontend amount)
    const orderAmount = orderDetails.purchaseUnits?.[0]?.amount?.value;
    const orderCurrency = orderDetails.purchaseUnits?.[0]?.amount?.currencyCode;
    const customIdFromOrder = orderDetails.purchaseUnits?.[0]?.customId;

    let userId: string | undefined;
    let planId: string | undefined;

    if (customIdFromOrder) {
      try {
        const parsed = JSON.parse(customIdFromOrder);
        userId = parsed.userId;
        planId = parsed.planId;
      } catch (e) {
        console.error('Error parsing customId from order:', e);
      }
    }

    // Validate the plan and amount match our records
    if (planId && PLANS[planId as PlanId]) {
      const expectedPlan = PLANS[planId as PlanId];
      if (orderAmount !== expectedPlan.price || orderCurrency !== expectedPlan.currency) {
        console.error(`Amount mismatch! Expected: ${expectedPlan.price} ${expectedPlan.currency}, Got: ${orderAmount} ${orderCurrency}`);
        return NextResponse.json(
          { error: 'El monto del pago no coincide con el plan seleccionado' },
          { status: 400 }
        );
      }
    }

    // Capture the PayPal order
    const captureRequest: OrderCaptureRequest = {};
    const { result: captureData } = await ordersController.captureOrder({
      id: orderId,
      body: captureRequest,
    });

    // Log payment info (without sensitive data)
    console.log('PayPal capture completed:', {
      orderId,
      status: captureData.status,
      userId,
      planId,
      amount: orderAmount,
      currency: orderCurrency,
      timestamp: new Date().toISOString(),
    });

    // Check if capture was successful
    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'El pago no fue completado', status: captureData.status },
        { status: 400 }
      );
    }

    // Mark as processed for idempotency
    processedPayments.add(orderId);

    // Update user info from capture data if not already set
    if (!userId || !planId) {
      const captureCustomId = captureData.purchaseUnits?.[0]?.payments?.captures?.[0]?.customId
        || captureData.purchaseUnits?.[0]?.customId;

      if (captureCustomId) {
        try {
          const parsed = JSON.parse(captureCustomId);
          userId = userId || parsed.userId;
          planId = planId || parsed.planId;
        } catch (e) {
          console.error('Error parsing customId from capture:', e);
        }
      }
    }

    if (!userId || !planId) {
      console.error('Missing userId or planId in capture data');
      return NextResponse.json(
        { error: 'No se pudo identificar el usuario o plan' },
        { status: 400 }
      );
    }

    const adminDb = getAdminDb();

    // Verify user exists before updating
    const userDocRef = adminDb.collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.error(`User ${userId} not found in database`);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 400 }
      );
    }

    // Update user subscription in Firestore
    await userDocRef.update({
      subscription: planId,
      subscriptionStartDate: FieldValue.serverTimestamp(),
      subscriptionPaymentId: orderId,
      subscriptionStatus: 'active',
      paypalPayerId: captureData.payer?.payerId,
      // Reset AI usage for new subscribers
      aiUsageCount: 0,
      aiUsageResetDate: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Store payment record for audit trail
    await adminDb.collection('payments').doc(orderId).set({
      orderId,
      userId,
      planId,
      amount: orderAmount,
      currency: orderCurrency,
      status: 'COMPLETED',
      payerId: captureData.payer?.payerId,
      payerEmail: captureData.payer?.emailAddress,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log(`User ${userId} upgraded to ${planId} plan via PayPal`);

    return NextResponse.json({
      success: true,
      status: captureData.status,
      userId,
      planId,
    });
  } catch (error: any) {
    // Log internal error details but return generic message to client
    console.error('Error capturing PayPal order:', {
      message: error.message,
      stack: error.stack,
    });

    // Never expose internal error details to client
    return NextResponse.json(
      { error: 'No pudimos procesar el pago. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
