import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await initDb();
    const { rows } = await sql`SELECT * FROM articles WHERE id = ${id}`;
    const article = rows[0];
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Fetch Article Error:', error);
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

    await initDb();
    const result = await sql`
      UPDATE articles 
      SET title = ${title}, content = ${content}, category = ${category || null} 
      WHERE id = ${id}
    `;
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Article Error:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    console.log(`Server: Received DELETE request for article ID: ${id}`);
    
    await initDb();
    const result = await sql`DELETE FROM articles WHERE id = ${id}`;
    console.log(`Server: Database delete result. RowCount: ${result.rowCount}`);
    
    if (result.rowCount === 0) {
      console.warn(`Server: Article with ID ${id} not found for deletion`);
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server: Delete article error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
