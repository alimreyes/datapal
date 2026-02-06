import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/google-analytics/oauth';
import { GADataClient } from '@/lib/google-analytics/client';
import { db } from '@/lib/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * GET /api/ga/callback
 * OAuth callback handler for Google Analytics
 * Query params: code (from Google), state (userId)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // userId
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/new-report/step-ga?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/new-report/step-ga?error=missing_params', request.url)
      );
    }

    const userId = state;

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Create a client to list properties
    const client = new GADataClient(tokens.access_token, tokens.refresh_token);
    const properties = await client.listProperties();

    // Store tokens in Firestore (encrypted storage would be better for production)
    const userGARef = doc(db, 'users', userId, 'integrations', 'google_analytics');

    await setDoc(userGARef, {
      connected: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      expiresAt: tokens.expiry_date || null,
      connectedAt: new Date().toISOString(),
      properties: properties.map(p => ({
        propertyId: p.propertyId,
        displayName: p.displayName,
      })),
    });

    // Redirect back to GA step with success
    return NextResponse.redirect(
      new URL('/new-report/step-ga?connected=true', request.url)
    );
  } catch (error) {
    console.error('Error in GA OAuth callback:', error);
    return NextResponse.redirect(
      new URL('/new-report/step-ga?error=auth_failed', request.url)
    );
  }
}
