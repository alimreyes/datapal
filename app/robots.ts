import { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/dashboard',
          '/create',
          '/report/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}