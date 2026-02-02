import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { generateInsights } from '@/lib/anthropic/insights';

const FREE_AI_LIMIT = 10;

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    const { reportData } = body;

    if (!reportData) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // If user is authenticated, check AI usage limits
    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const subscription = userData.subscription || 'free';

        // Check limits only for free users
        if (subscription === 'free') {
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

          // Check if limit reached
          if (aiUsageCount >= FREE_AI_LIMIT) {
            return NextResponse.json(
              {
                error: 'Has alcanzado el límite de consultas de IA este mes',
                limitReached: true,
                usage: aiUsageCount,
                limit: FREE_AI_LIMIT,
              },
              { status: 429 }
            );
          }

          // Increment usage BEFORE generating (to prevent race conditions)
          await updateDoc(userDocRef, {
            aiUsageCount: increment(1),
            lastAIUsage: serverTimestamp(),
          });
        }
      }
    } else {
      // User not authenticated - require login
      return NextResponse.json(
        {
          error: 'Debes iniciar sesión para usar la IA',
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    // Generate insights using Claude API
    const result = await generateInsights(reportData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al generar insights' },
        { status: 500 }
      );
    }

    // Get updated usage count
    let remaining = FREE_AI_LIMIT;
    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.subscription === 'free') {
          remaining = Math.max(0, FREE_AI_LIMIT - (userData.aiUsageCount || 0));
        } else {
          remaining = Infinity;
        }
      }
    }

    return NextResponse.json({
      success: true,
      insight: result.insight,
      usage: result.usage,
      remaining,
    });
  } catch (error: any) {
    console.error('Error in insights API:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
