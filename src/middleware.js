import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Protect /admin routes, but let them go to /admin/login
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('[MIDDLEWARE ERROR] ADMIN_PASSWORD environment variable is not defined.');
      return NextResponse.next(); 
    }

    const token = request.cookies.get('admin_token')?.value;
    
    // DEBUG LOG
    console.log(`[MIDDLEWARE DEBUG] Path: ${path}, Cookie Present: ${!!token}, Match: ${token?.trim() === adminPassword.trim()}`);

    if (!token || token.trim() !== adminPassword.trim()) {
      console.warn(`[MIDDLEWARE AUTH FAIL] Redirecting to /admin/login. Token: ${token ? 'Mismatch' : 'Missing'}`);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
