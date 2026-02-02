import { NextRequest, NextResponse } from 'next/server';
import { ordersController } from '@/lib/paypal/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { OrderCaptureRequest } from '@paypal/paypal-server-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Falta el orderId' },
        { status: 400 }
      );
    }

    // Capture the PayPal order
    const captureRequest: OrderCaptureRequest = {};
    const { result: captureData } = await ordersController.captureOrder({
      id: orderId,
      body: captureRequest,
    });

    console.log('PayPal capture response:', JSON.stringify(captureData, null, 2));

    // Check if capture was successful
    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'El pago no fue completado', status: captureData.status },
        { status: 400 }
      );
    }

    // Extract user and plan info from customId
    const customId = captureData.purchaseUnits?.[0]?.payments?.captures?.[0]?.customId
      || captureData.purchaseUnits?.[0]?.customId;

    let userId: string | undefined;
    let planId: string | undefined;

    if (customId) {
      try {
        const parsed = JSON.parse(customId);
        userId = parsed.userId;
        planId = parsed.planId;
      } catch (e) {
        console.error('Error parsing customId:', e);
      }
    }

    if (!userId || !planId) {
      console.error('Missing userId or planId in capture data');
      return NextResponse.json(
        { error: 'No se pudo identificar el usuario o plan' },
        { status: 400 }
      );
    }

    // Update user subscription in Firestore
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      subscription: planId,
      subscriptionStartDate: serverTimestamp(),
      subscriptionPaymentId: orderId,
      subscriptionStatus: 'active',
      paypalPayerId: captureData.payer?.payerId,
      // Reset AI usage for new subscribers
      aiUsageCount: 0,
      aiUsageResetDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`User ${userId} upgraded to ${planId} plan via PayPal`);

    return NextResponse.json({
      success: true,
      status: captureData.status,
      userId,
      planId,
    });
  } catch (error: any) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { error: error.message || 'Error al capturar el pago' },
      { status: 500 }
    );
  }
}
