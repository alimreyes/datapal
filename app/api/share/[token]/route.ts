import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, getDocs, collection, query, where, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    // Find share link by token
    const shareQuery = query(
      collection(db, 'shared_links'),
      where('token', '==', token)
    );
    const shareSnap = await getDocs(shareQuery);

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
    const reportRef = doc(db, 'reports', shareData.reportId);
    const reportSnap = await getDoc(reportRef);

    if (!reportSnap.exists()) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    const reportData = reportSnap.data();

    // Increment access count
    await updateDoc(shareDoc.ref, { accessCount: increment(1) });

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
