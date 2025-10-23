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

  // Allow API routes regardless of maintenance mode
  if (pathname.startsWith('/api/')) {
    return handleI18nRouting(request);
  }

  // If maintenance mode is ON, redirect to maintenance page
  if (maintenanceMode) {
    // Extract locale from pathname or use default
    const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'en';
    
    // Only redirect if not already on maintenance page
    if (!pathname.includes('/maintenance')) {
      return NextResponse.redirect(new URL(`/${locale}/maintenance`, request.url));
    }
  }

  // Normal routing
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
