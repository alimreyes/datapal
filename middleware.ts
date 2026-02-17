import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Páginas públicas — no interceptar, dejar que se rendericen normalmente
  // La landing (/) tiene LandingRedirect client-side para usuarios logueados
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/pricing',
    '/demo',
    '/share',
  ];

  const isPublicPath = publicPaths.includes(pathname)
    || pathname.startsWith('/plataformas/')
    || pathname.startsWith('/share/')
    || pathname.startsWith('/demo/');

  if (isPublicPath) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};