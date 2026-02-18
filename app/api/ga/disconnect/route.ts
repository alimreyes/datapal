import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
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

    const adminDb = getAdminDb();
    const userGARef = adminDb.collection('users').doc(userId).collection('integrations').doc('google_analytics');
    const gaDoc = await userGARef.get();

    if (gaDoc.exists) {
      const gaData = gaDoc.data()!;

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
      await userGARef.delete();
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
