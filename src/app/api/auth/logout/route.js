import { NextResponse } from 'next/server';

/**
 * API route to log out the admin by clearing the authentication cookie.
 */
export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    
    // Clear the admin_token cookie
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      expires: new Date(0), // Set expiry to the past to delete it
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
