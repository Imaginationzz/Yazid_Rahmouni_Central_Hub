import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(req) {
  try {
    await initDb();
    const { rows } = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Fetch Projects Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await initDb();
    const { title, url, description } = await req.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    await sql`
      INSERT INTO projects (title, url, description) 
      VALUES (${title}, ${url || null}, ${description})
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create Project Error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
