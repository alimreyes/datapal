import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { reportId } = await request.json();
    if (!reportId) {
      return NextResponse.json({ error: 'reportId requerido' }, { status: 400 });
    }

    const adminDb = getAdminDb();

    // Verify report belongs to user
    const reportSnap = await adminDb.collection('reports').doc(reportId).get();

    if (!reportSnap.exists) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    const reportData = reportSnap.data()!;
    if (reportData.userId !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Check if active link already exists for this report
    const existingSnap = await adminDb.collection('shared_links')
      .where('reportId', '==', reportId)
      .where('isActive', '==', true)
      .get();

    if (!existingSnap.empty) {
      const existingData = existingSnap.docs[0].data();
      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app'}/share/${existingData.token}`;

      return NextResponse.json({
        token: existingData.token,
        shareUrl,
        isExisting: true,
      });
    }

    // Generate new share token
    const token = randomUUID();
    const shareDocId = `share_${token}`;

    await adminDb.collection('shared_links').doc(shareDocId).set({
      token,
      reportId,
      createdBy: userId,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: null,
      isActive: true,
      accessCount: 0,
    });

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app'}/share/${token}`;

    return NextResponse.json({ token, shareUrl, isExisting: false });
  } catch (error: any) {
    console.error('Error creating share link:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE — Deactivate a share link
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { reportId } = await request.json();
    if (!reportId) {
      return NextResponse.json({ error: 'reportId requerido' }, { status: 400 });
    }

    const adminDb = getAdminDb();

    // Find active link for this report
    const activeSnap = await adminDb.collection('shared_links')
      .where('reportId', '==', reportId)
      .where('createdBy', '==', userId)
      .where('isActive', '==', true)
      .get();

    if (activeSnap.empty) {
      return NextResponse.json({ error: 'No hay link activo' }, { status: 404 });
    }

    // Deactivate all active links for this report
    for (const docSnap of activeSnap.docs) {
      await docSnap.ref.update({ isActive: false });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deactivating share link:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
