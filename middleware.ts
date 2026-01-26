import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas (no requieren autenticación)
const publicRoutes = ['/login', '/register', '/forgot-password'];

// Rutas protegidas (requieren autenticación)
const protectedRoutes = ['/dashboard', '/new-report', '/report'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener el token de sesión (si existe)
  // Firebase Auth usa el sessionStorage en el cliente, pero podemos verificar
  // usando cookies si configuramos sesiones personalizadas
  
  // Por ahora, Next.js + Firebase Auth se maneja en el cliente
  // Este middleware es más para redirecciones básicas
  
  // Si está en la raíz, redirigir al login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
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