import { sql, initDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Ensure DB is initialized
    await initDb();
    
    await sql`
      INSERT INTO visits (path, user_agent, referrer) 
      VALUES (${body.path || '/'}, ${body.userAgent || null}, ${body.referrer || null})
    `;
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Visit tracking error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
