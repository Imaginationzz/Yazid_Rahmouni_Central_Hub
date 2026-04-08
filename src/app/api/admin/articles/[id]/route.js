import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = getDb();
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { title, content, category } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('UPDATE articles SET title = ?, content = ?, category = ? WHERE id = ?').run(title, content, category, id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    console.log(`Server: Received DELETE request for article ID: ${id}`);
    
    const db = getDb();
    const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    console.log(`Server: Database delete result. Changes: ${result.changes}`);
    
    if (result.changes === 0) {
      console.warn(`Server: Article with ID ${id} not found for deletion`);
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server: Delete article error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
