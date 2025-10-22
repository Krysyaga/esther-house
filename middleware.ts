import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en'
});

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const pathname = request.nextUrl.pathname;

  // Allow maintenance page and API routes regardless of maintenance mode
  if (pathname === '/maintenance' || pathname.startsWith('/api/')) {
    return handleI18nRouting(request);
  }

  // If maintenance mode is ON, block all other routes
  if (maintenanceMode && pathname !== '/maintenance') {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // Normal routing
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
