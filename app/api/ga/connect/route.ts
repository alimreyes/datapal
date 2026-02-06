import { NextRequest, NextResponse } from 'next/server';
import { generateGAAuthUrl } from '@/lib/google-analytics/oauth';

/**
 * GET /api/ga/connect
 * Initiates the Google Analytics OAuth flow
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

    // Generate the OAuth URL with userId as state
    const authUrl = generateGAAuthUrl(userId);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating GA auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
}
