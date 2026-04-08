import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req) {
  try {
    const db = getDb();
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, url, description } = await req.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const db = getDb();
    db.prepare('INSERT INTO projects (title, url, description) VALUES (?, ?, ?)').run(title, url || '', description);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
