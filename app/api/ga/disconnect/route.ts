import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { revokeToken } from '@/lib/google-analytics/oauth';

/**
 * POST /api/ga/disconnect
 * Disconnect Google Analytics integration
 * Body: { userId }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get stored tokens to revoke
    const userGARef = doc(db, 'users', userId, 'integrations', 'google_analytics');
    const gaDoc = await getDoc(userGARef);

    if (gaDoc.exists()) {
      const gaData = gaDoc.data();

      // Try to revoke the access token (best effort)
      if (gaData.accessToken) {
        try {
          await revokeToken(gaData.accessToken);
        } catch (error) {
          console.warn('Failed to revoke token:', error);
          // Continue anyway - token will expire
        }
      }

      // Delete the integration document
      await deleteDoc(userGARef);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting GA:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Google Analytics' },
      { status: 500 }
    );
  }
}
