import { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/report/*',
          '/new-report/*',
          '/api/*',
          '/tokens',
          '/settings',
          '/prueba-interna',
        ],
      },
      // AI crawlers — same private routes blocked, everything public allowed
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/dashboard', '/dashboard/*', '/report/*', '/api/*'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/dashboard', '/dashboard/*', '/report/*', '/api/*'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/dashboard', '/dashboard/*', '/report/*', '/api/*'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/dashboard', '/dashboard/*', '/report/*', '/api/*'],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
