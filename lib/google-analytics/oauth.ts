import { OAuth2Client } from 'google-auth-library';
import { GATokens } from './types';

// Google Analytics API scopes
const GA_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
];

/**
 * Create an OAuth2 client for Google Analytics
 */
export function createGAOAuthClient(): OAuth2Client {
  const clientId = process.env.GOOGLE_GA_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_GA_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ga/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('Google Analytics OAuth credentials not configured');
  }

  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

/**
 * Generate the OAuth authorization URL for Google Analytics
 * @param state - State parameter (typically userId) to pass through OAuth flow
 */
export function generateGAAuthUrl(state: string): string {
  const client = createGAOAuthClient();

  const authUrl = client.generateAuthUrl({
    access_type: 'offline', // Get refresh token
    scope: GA_SCOPES,
    state: state,
    prompt: 'consent', // Force consent to get refresh token
    include_granted_scopes: true,
  });

  return authUrl;
}

/**
 * Exchange authorization code for tokens
 * @param code - Authorization code from OAuth callback
 */
export async function exchangeCodeForTokens(code: string): Promise<GATokens> {
  const client = createGAOAuthClient();

  try {
    const { tokens } = await client.getToken(code);

    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || undefined,
      token_type: tokens.token_type || 'Bearer',
      expiry_date: tokens.expiry_date || undefined,
      scope: tokens.scope || undefined,
    };
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw new Error('Failed to exchange authorization code for tokens');
  }
}

/**
 * Refresh an expired access token
 * @param refreshToken - The refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<GATokens> {
  const client = createGAOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });

  try {
    const { credentials } = await client.refreshAccessToken();

    if (!credentials.access_token) {
      throw new Error('No access token received from refresh');
    }

    return {
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token || refreshToken, // Keep old refresh token if not returned
      token_type: credentials.token_type || 'Bearer',
      expiry_date: credentials.expiry_date || undefined,
      scope: credentials.scope || undefined,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh access token');
  }
}

/**
 * Verify if an access token is still valid
 * @param accessToken - The access token to verify
 */
export async function verifyAccessToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.expires_in > 0;
    }

    return false;
  } catch (error) {
    console.error('Error verifying access token:', error);
    return false;
  }
}

/**
 * Revoke access tokens (for disconnecting)
 * @param token - The token to revoke
 */
export async function revokeToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${token}`,
      { method: 'POST' }
    );

    return response.ok;
  } catch (error) {
    console.error('Error revoking token:', error);
    return false;
  }
}
