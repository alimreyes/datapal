import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const FREE_AI_LIMIT = 10;

// GET - Check AI usage status
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado', canUse: false, remaining: 0 },
        { status: 401 }
      );
    }

    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'Usuario no encontrado', canUse: false, remaining: 0 },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const subscription = userData.subscription || 'free';

    // Pro/Enterprise users have unlimited access
    if (subscription !== 'free') {
      return NextResponse.json({
        canUse: true,
        remaining: Infinity,
        subscription,
        usage: userData.aiUsageCount || 0,
      });
    }

    // Check monthly reset
    const now = new Date();
    const resetDate = userData.aiUsageResetDate?.toDate();
    let aiUsageCount = userData.aiUsageCount || 0;

    // Reset if new month
    if (resetDate && (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear())) {
      aiUsageCount = 0;
      await updateDoc(userDocRef, {
        aiUsageCount: 0,
        aiUsageResetDate: serverTimestamp(),
      });
    }

    const remaining = Math.max(0, FREE_AI_LIMIT - aiUsageCount);
    const canUse = aiUsageCount < FREE_AI_LIMIT;

    return NextResponse.json({
      canUse,
      remaining,
      limit: FREE_AI_LIMIT,
      usage: aiUsageCount,
      subscription,
    });
  } catch (error: any) {
    console.error('Error checking AI usage:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno', canUse: false, remaining: 0 },
      { status: 500 }
    );
  }
}

// POST - Increment AI usage
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado', success: false },
        { status: 401 }
      );
    }

    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'Usuario no encontrado', success: false },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const subscription = userData.subscription || 'free';

    // Pro/Enterprise users don't need to track usage
    if (subscription !== 'free') {
      return NextResponse.json({
        success: true,
        remaining: Infinity,
        subscription,
      });
    }

    const aiUsageCount = userData.aiUsageCount || 0;

    // Check if limit reached
    if (aiUsageCount >= FREE_AI_LIMIT) {
      return NextResponse.json(
        {
          error: 'Límite de consultas alcanzado',
          success: false,
          remaining: 0,
          limit: FREE_AI_LIMIT,
        },
        { status: 429 }
      );
    }

    // Increment usage
    await updateDoc(userDocRef, {
      aiUsageCount: increment(1),
      lastAIUsage: serverTimestamp(),
    });

    const newUsage = aiUsageCount + 1;
    const remaining = Math.max(0, FREE_AI_LIMIT - newUsage);

    return NextResponse.json({
      success: true,
      usage: newUsage,
      remaining,
      limit: FREE_AI_LIMIT,
    });
  } catch (error: any) {
    console.error('Error incrementing AI usage:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno', success: false },
      { status: 500 }
    );
  }
}
