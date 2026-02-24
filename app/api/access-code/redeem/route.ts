import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/access-code/redeem
 * Redime un código de acceso y activa prueba Pro de 15 días
 * Body: { code, userId }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userId } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Código inválido' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const normalizedCode = code.trim().toLowerCase();

    // Validar formato: amigos-01 a amigos-10
    const validPattern = /^amigos-(0[1-9]|10)$/;
    if (!validPattern.test(normalizedCode)) {
      return NextResponse.json(
        { error: 'Código de acceso inválido' },
        { status: 400 }
      );
    }

    const adminDb = getAdminDb();

    // Verificar código en Firestore
    const codeRef = adminDb.collection('accessCodes').doc(normalizedCode);
    const codeDoc = await codeRef.get();

    if (!codeDoc.exists) {
      return NextResponse.json(
        { error: 'Código de acceso no encontrado' },
        { status: 404 }
      );
    }

    const codeData = codeDoc.data()!;

    if (codeData.isUsed) {
      return NextResponse.json(
        { error: 'Este código ya fue utilizado' },
        { status: 409 }
      );
    }

    // Verificar que el usuario existe y no tiene trial previo
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const userData = userDoc.data()!;

    if (userData.trialCode) {
      return NextResponse.json(
        { error: 'Ya has utilizado un código de prueba anteriormente' },
        { status: 409 }
      );
    }

    // Calcular expiración: 15 días desde ahora
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 15);
    const expiresAtTimestamp = Timestamp.fromDate(expiresAt);

    // Batch atómico: marcar código + actualizar usuario
    const batch = adminDb.batch();

    batch.update(codeRef, {
      isUsed: true,
      usedBy: userId,
      usedAt: FieldValue.serverTimestamp(),
      expiresAt: expiresAtTimestamp,
    });

    batch.update(userRef, {
      subscription: 'pro',
      trialCode: normalizedCode,
      trialExpiresAt: expiresAtTimestamp,
      subscriptionStartDate: FieldValue.serverTimestamp(),
      subscriptionStatus: 'active',
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    console.log(`[AccessCode] ${normalizedCode} redeemed by ${userId}, expires ${expiresAt.toISOString()}`);

    return NextResponse.json({
      success: true,
      trialExpiresAt: expiresAt.toISOString(),
      daysRemaining: 15,
    });
  } catch (error: any) {
    console.error('[AccessCode] Error redeeming:', error);
    return NextResponse.json(
      { error: 'No se pudo activar el código. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
