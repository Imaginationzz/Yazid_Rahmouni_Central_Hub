import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { password } = await req.json();
    const validPassword = process.env.ADMIN_PASSWORD;
    if (!validPassword) {
      return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });
    }

    if (password === validPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_token', process.env.ADMIN_PASSWORD, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });
      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
