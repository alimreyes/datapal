import { NextRequest, NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'datapal-indexnow-key-2026';

/**
 * IndexNow API Route
 * Notifies Bing, Yandex, and other search engines about new/updated content.
 * This enables faster indexing by Bing/Copilot (ChatGPT uses Bing index).
 *
 * POST /api/indexnow
 * Body: { urls: string[] }
 *
 * Or call programmatically after publishing blog posts or updating demo pages.
 */
export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'urls array is required' }, { status: 400 });
    }

    // IndexNow API spec: https://www.indexnow.org/documentation
    const payload = {
      host: new URL(APP_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${APP_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls.map((url: string) =>
        url.startsWith('http') ? url : `${APP_URL}${url}`
      ),
    };

    // Submit to IndexNow endpoints (Bing + Yandex + IndexNow hub)
    const endpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
    ];

    const results = await Promise.allSettled(
      endpoints.map((endpoint) =>
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload),
        })
      )
    );

    const summary = results.map((r, i) => ({
      endpoint: endpoints[i],
      status: r.status === 'fulfilled' ? r.value.status : 'failed',
    }));

    return NextResponse.json({
      success: true,
      submitted: urls.length,
      results: summary,
    });
  } catch (error: any) {
    console.error('IndexNow error:', error);
    return NextResponse.json(
      { error: 'IndexNow submission failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/indexnow — Health check / key verification
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    key: INDEXNOW_KEY,
    keyLocation: `${APP_URL}/${INDEXNOW_KEY}.txt`,
    documentation: 'POST { urls: ["/blog/my-post", "/demo"] } to submit URLs',
  });
}
