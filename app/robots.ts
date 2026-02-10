import { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/demo', '/demo/*', '/login', '/register'],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/create',
          '/report/*',
          '/api/*',
          '/checkout/*',
          '/tokens',
          '/settings',
        ],
      },
      // Explicitly allow AI crawlers to index public content
      {
        userAgent: 'GPTBot',
        allow: ['/', '/demo', '/demo/*'],
        disallow: ['/dashboard', '/dashboard/*', '/api/*'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/demo', '/demo/*'],
        disallow: ['/dashboard', '/dashboard/*', '/api/*'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/demo', '/demo/*'],
        disallow: ['/dashboard', '/dashboard/*', '/api/*'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/demo', '/demo/*'],
        disallow: ['/dashboard', '/dashboard/*', '/api/*'],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
