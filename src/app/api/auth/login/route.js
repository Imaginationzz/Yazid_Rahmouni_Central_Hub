import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { password } = await req.json();
    const validPassword = process.env.ADMIN_PASSWORD;
    
    // DEBUG LOGS (Temporary for troubleshooting)
    console.log(`[AUTH DEBUG] Attempting login. Input length: ${password?.length}, Env length: ${validPassword?.length}`);
    
    if (!validPassword) {
      console.error('[AUTH ERROR] ADMIN_PASSWORD environment variable is missing.');
      return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });
    }

    // Use .trim() to satisfy possible trailing spaces in the env variable
    if (password?.trim() === validPassword.trim()) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_token', validPassword.trim(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });
      return response;
    }

    console.warn(`[AUTH FAIL] Password mismatch. Input: "${password.trim()}", expected length matching: ${validPassword.trim().length}`);
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
