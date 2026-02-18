import { NextRequest, NextResponse } from 'next/server';
import { GADataClient } from '@/lib/google-analytics/client';
import { getAdminDb } from '@/lib/firebase/admin';
import { refreshAccessToken } from '@/lib/google-analytics/oauth';
import { GADateRange } from '@/lib/google-analytics/types';

/**
 * POST /api/ga/data
 * Fetch Google Analytics data for a property
 * Body: { userId, propertyId, startDate, endDate }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, propertyId, startDate, endDate } = body;

    if (!userId || !propertyId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, propertyId, startDate, endDate' },
        { status: 400 }
      );
    }

    const adminDb = getAdminDb();
    const userGARef = adminDb.collection('users').doc(userId).collection('integrations').doc('google_analytics');
    const gaDoc = await userGARef.get();

    if (!gaDoc.exists || !gaDoc.data()?.connected) {
      return NextResponse.json(
        { error: 'Google Analytics not connected', connected: false },
        { status: 401 }
      );
    }

    const gaData = gaDoc.data()!;
    let accessToken = gaData.accessToken;
    const refreshToken = gaData.refreshToken;

    // Check if token needs refresh
    if (gaData.expiresAt && gaData.expiresAt < Date.now() && refreshToken) {
      try {
        const newTokens = await refreshAccessToken(refreshToken);
        accessToken = newTokens.access_token;

        await userGARef.update({
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

    // Create client and fetch data
    const client = new GADataClient(accessToken, refreshToken, async (tokens) => {
      await userGARef.update({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || refreshToken,
      });
    });

    const dateRange: GADateRange = { startDate, endDate };
    const reportData = await client.getReportData(propertyId, dateRange);

    return NextResponse.json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    console.error('Error fetching GA data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google Analytics data' },
      { status: 500 }
    );
  }
}
