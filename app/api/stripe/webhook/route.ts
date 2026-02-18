import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Manejar el evento de pago completado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.client_reference_id || session.metadata?.userId;
    const tokens = parseInt(session.metadata?.tokens || '0');

    if (!userId || !tokens) {
      console.error('Missing userId or tokens in session metadata');
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    try {
      const adminDb = getAdminDb();
      const userRef = adminDb.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // Si el usuario no existe, crearlo con tokens iniciales
        await userRef.set({
          aiTokens: tokens,
          aiTokensPurchased: tokens,
          lastTokenPurchase: new Date().toISOString(),
          stripeCustomerId: session.customer as string,
        }, { merge: true });
      } else {
        // Si existe, incrementar los tokens
        await userRef.update({
          aiTokens: FieldValue.increment(tokens),
          aiTokensPurchased: FieldValue.increment(tokens),
          lastTokenPurchase: new Date().toISOString(),
          stripeCustomerId: session.customer as string,
        });
      }

      // Registrar la transacción
      await adminDb.collection('transactions').doc(session.id).set({
        userId,
        sessionId: session.id,
        tokens,
        amount: session.amount_total,
        currency: session.currency,
        status: 'completed',
        createdAt: new Date().toISOString(),
        productType: session.metadata?.productType,
      });

      console.log(`Successfully added ${tokens} tokens to user ${userId}`);
    } catch (error) {
      console.error('Error updating user tokens:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// Desactivar el body parser de Next.js para webhooks
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
