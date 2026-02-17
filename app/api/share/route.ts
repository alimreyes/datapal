import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, getDocs, collection, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
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

    // Verify report belongs to user
    const reportRef = doc(db, 'reports', reportId);
    const reportSnap = await getDoc(reportRef);

    if (!reportSnap.exists()) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    const reportData = reportSnap.data();
    if (reportData.userId !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Check if active link already exists for this report
    const existingQuery = query(
      collection(db, 'shared_links'),
      where('reportId', '==', reportId),
      where('isActive', '==', true)
    );
    const existingSnap = await getDocs(existingQuery);

    if (!existingSnap.empty) {
      const existingDoc = existingSnap.docs[0];
      const existingData = existingDoc.data();
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

    await setDoc(doc(db, 'shared_links', shareDocId), {
      token,
      reportId,
      createdBy: userId,
      createdAt: serverTimestamp(),
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

    // Find active link for this report
    const activeQuery = query(
      collection(db, 'shared_links'),
      where('reportId', '==', reportId),
      where('createdBy', '==', userId),
      where('isActive', '==', true)
    );
    const activeSnap = await getDocs(activeQuery);

    if (activeSnap.empty) {
      return NextResponse.json({ error: 'No hay link activo' }, { status: 404 });
    }

    // Deactivate all active links for this report
    for (const docSnap of activeSnap.docs) {
      await updateDoc(docSnap.ref, { isActive: false });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deactivating share link:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
