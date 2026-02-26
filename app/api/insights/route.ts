import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { generateInsights } from '@/lib/anthropic/insights';

const FREE_AI_LIMIT = 10;

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    const { reportData, insightType, question } = body;

    if (!reportData) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // If user is authenticated, check AI usage limits
    if (userId) {
      const adminDb = getAdminDb();
      const userDocRef = adminDb.collection('users').doc(userId);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data()!;
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
            await userDocRef.update({
              aiUsageCount: 0,
              aiUsageResetDate: FieldValue.serverTimestamp(),
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
          await userDocRef.update({
            aiUsageCount: FieldValue.increment(1),
            lastAIUsage: FieldValue.serverTimestamp(),
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
    const result = await generateInsights(reportData, insightType || 'metrics', question);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al generar insights' },
        { status: 500 }
      );
    }

    // Get updated usage count
    let remaining = FREE_AI_LIMIT;
    if (userId) {
      const adminDb = getAdminDb();
      const userDocRef = adminDb.collection('users').doc(userId);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data()!;
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
