import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Protect /admin routes, but let them go to /admin/login
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('MIDDLEWARE ERROR: ADMIN_PASSWORD environment variable is not defined.');
      return NextResponse.next(); // Don't block if we can't verify (or redirect to error)
    }

    const token = request.cookies.get('admin_token')?.value;
    if (token !== adminPassword) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
