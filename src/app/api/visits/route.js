import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const db = getDb();
    
    db.prepare(
      'INSERT INTO visits (path, user_agent, referrer) VALUES (?, ?, ?)'
    ).run(
      body.path || '/',
      body.userAgent || null,
      body.referrer || null
    );
    
    db.close();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Visit tracking error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
