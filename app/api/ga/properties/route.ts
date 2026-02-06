import { NextRequest, NextResponse } from 'next/server';
import { GADataClient } from '@/lib/google-analytics/client';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { refreshAccessToken } from '@/lib/google-analytics/oauth';

/**
 * GET /api/ga/properties
 * List Google Analytics properties for a user
 * Query params: userId (required)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get stored tokens
    const userGARef = doc(db, 'users', userId, 'integrations', 'google_analytics');
    const gaDoc = await getDoc(userGARef);

    if (!gaDoc.exists() || !gaDoc.data()?.connected) {
      return NextResponse.json(
        { error: 'Google Analytics not connected', connected: false },
        { status: 401 }
      );
    }

    const gaData = gaDoc.data();
    let accessToken = gaData.accessToken;
    const refreshToken = gaData.refreshToken;

    // Check if token needs refresh
    if (gaData.expiresAt && gaData.expiresAt < Date.now()) {
      if (!refreshToken) {
        return NextResponse.json(
          { error: 'Token expired, please reconnect', connected: false },
          { status: 401 }
        );
      }

      try {
        const newTokens = await refreshAccessToken(refreshToken);
        accessToken = newTokens.access_token;

        // Update stored tokens
        await updateDoc(userGARef, {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token || refreshToken,
          expiresAt: newTokens.expiry_date || null,
        });
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to refresh token, please reconnect', connected: false },
          { status: 401 }
        );
      }
    }

    // Fetch fresh list of properties
    const client = new GADataClient(accessToken, refreshToken, async (tokens) => {
      // Update tokens if refreshed
      await updateDoc(userGARef, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || refreshToken,
      });
    });

    const properties = await client.listProperties();

    // Update cached properties
    await updateDoc(userGARef, {
      properties: properties.map(p => ({
        propertyId: p.propertyId,
        displayName: p.displayName,
      })),
    });

    return NextResponse.json({
      connected: true,
      properties,
    });
  } catch (error) {
    console.error('Error fetching GA properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
