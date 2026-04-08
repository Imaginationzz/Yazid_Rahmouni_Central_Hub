import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req) {
  try {
    const db = getDb();
    const articles = db.prepare('SELECT * FROM articles ORDER BY created_at DESC').all();
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, content, category } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const db = getDb();
    db.prepare('INSERT INTO articles (title, content, category) VALUES (?, ?, ?)').run(title, content, category);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
