import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const adminDb = getAdminDb();

    // Find share link by token
    const shareSnap = await adminDb.collection('shared_links')
      .where('token', '==', token)
      .get();

    if (shareSnap.empty) {
      return NextResponse.json({ error: 'Link no encontrado' }, { status: 404 });
    }

    const shareDoc = shareSnap.docs[0];
    const shareData = shareDoc.data();

    // Check if link is active
    if (!shareData.isActive) {
      return NextResponse.json({ error: 'Este link ha sido desactivado' }, { status: 410 });
    }

    // Check expiration
    if (shareData.expiresAt) {
      const expiresAt = shareData.expiresAt.toDate();
      if (new Date() > expiresAt) {
        return NextResponse.json({ error: 'Este link ha expirado' }, { status: 410 });
      }
    }

    // Get the report data
    const reportSnap = await adminDb.collection('reports').doc(shareData.reportId).get();

    if (!reportSnap.exists) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    const reportData = reportSnap.data()!;

    // Increment access count
    await shareDoc.ref.update({ accessCount: FieldValue.increment(1) });

    // Return report data without sensitive fields
    return NextResponse.json({
      report: {
        id: reportSnap.id,
        title: reportData.title,
        objective: reportData.objective,
        platforms: reportData.platforms,
        data: reportData.data,
        aiInsights: reportData.aiInsights || null,
        clientLogo: reportData.clientLogo || null,
        createdAt: reportData.createdAt,
        customization: reportData.customization || null,
      },
    });
  } catch (error: any) {
    console.error('Error fetching shared report:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
