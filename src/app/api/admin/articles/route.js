import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(req) {
  try {
    await initDb();
    const { rows } = await sql`SELECT * FROM articles ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Fetch Articles Error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await initDb();
    const { title, content, category } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    await sql`
      INSERT INTO articles (title, content, category) 
      VALUES (${title}, ${content}, ${category || null})
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create Article Error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
