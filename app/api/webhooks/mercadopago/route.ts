import { NextRequest, NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import { mercadopago } from '@/lib/mercadopago/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // MercadoPago sends different notification types
    const { type, data } = body;

    console.log('MercadoPago Webhook received:', { type, data });

    // Only process payment notifications
    if (type !== 'payment') {
      return NextResponse.json({ received: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    // Get payment details from MercadoPago
    const payment = new Payment(mercadopago);
    const paymentData = await payment.get({ id: paymentId });

    console.log('Payment data:', {
      status: paymentData.status,
      external_reference: paymentData.external_reference,
      metadata: paymentData.metadata,
    });

    // Check if payment is approved
    if (paymentData.status !== 'approved') {
      console.log('Payment not approved:', paymentData.status);
      return NextResponse.json({ received: true, status: paymentData.status });
    }

    // Get user info from external_reference or metadata
    let userId: string | undefined;
    let planId: string | undefined;

    // Try to get from metadata first
    if (paymentData.metadata) {
      userId = paymentData.metadata.userId || paymentData.metadata.user_id;
      planId = paymentData.metadata.planId || paymentData.metadata.plan_id;
    }

    // Fallback to external_reference
    if (!userId && paymentData.external_reference) {
      try {
        const refData = JSON.parse(paymentData.external_reference);
        userId = refData.userId;
        planId = refData.planId;
      } catch (e) {
        console.error('Error parsing external_reference:', e);
      }
    }

    if (!userId || !planId) {
      console.error('Missing userId or planId in payment data');
      return NextResponse.json(
        { error: 'Missing user or plan information' },
        { status: 400 }
      );
    }

    // Update user subscription in Firestore
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      subscription: planId,
      subscriptionStartDate: serverTimestamp(),
      subscriptionPaymentId: paymentId,
      subscriptionStatus: 'active',
      // Reset AI usage for new subscribers
      aiUsageCount: 0,
      aiUsageResetDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`User ${userId} upgraded to ${planId} plan`);

    return NextResponse.json({
      received: true,
      processed: true,
      userId,
      planId,
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing error' },
      { status: 500 }
    );
  }
}

// MercadoPago also sends GET requests for validation
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'ok' });
}
