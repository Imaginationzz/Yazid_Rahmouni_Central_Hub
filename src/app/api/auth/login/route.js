import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { password } = await req.json();
    const validPassword = process.env.ADMIN_PASSWORD;
    
    // DEBUG LOGS
    console.log(`[AUTH DEBUG] Login attempt received.`);
    console.log(`[AUTH DEBUG] Input length: ${password?.length || 0}`);
    console.log(`[AUTH DEBUG] Env password status: ${validPassword ? 'Set (Length: ' + validPassword.length + ')' : 'MISSING'}`);
    
    if (!validPassword) {
      console.error('[AUTH ERROR] ADMIN_PASSWORD environment variable is missing.');
      return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });
    }

    if (password?.trim() === validPassword.trim()) {
      console.log('[AUTH SUCCESS] Password matched.');
      const response = NextResponse.json({ success: true });
      
      // Determine if we should use secure cookies
      // We disable 'secure' on localhost even in production mode to allow local testing
      const isLocalhost = req.headers.get('host')?.includes('localhost');
      const isProduction = process.env.NODE_ENV === 'production';
      const useSecure = isProduction && !isLocalhost;

      response.cookies.set('admin_token', validPassword.trim(), {
        httpOnly: true,
        secure: useSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });
      
      console.log(`[AUTH DEBUG] Cookie set. Secure: ${useSecure}`);
      return response;
    }

    console.warn(`[AUTH FAIL] Password mismatch. Input: "${password.trim()}", Expected length: ${validPassword.trim().length}`);
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('[AUTH ERROR] Exception during login:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
