import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(req) {
  try {
    await initDb();
    const { rows } = await sql`SELECT * FROM services ORDER BY order_index ASC, created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Fetch Services Error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await initDb();
    const { title_en, title_ar, description_en, description_ar, icon, url, order_index } = await req.json();
    
    if (!title_en || !title_ar || !description_en || !description_ar) {
      return NextResponse.json({ error: 'Titles and descriptions are required' }, { status: 400 });
    }

    await sql`
      INSERT INTO services (title_en, title_ar, description_en, description_ar, icon, url, order_index) 
      VALUES (${title_en}, ${title_ar}, ${description_en}, ${description_ar}, ${icon || null}, ${url || null}, ${order_index || 0})
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create Service Error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await initDb();
    const { id, title_en, title_ar, description_en, description_ar, icon, url, order_index } = await req.json();
    
    await sql`
      UPDATE services 
      SET title_en = ${title_en}, 
          title_ar = ${title_ar}, 
          description_en = ${description_en}, 
          description_ar = ${description_ar}, 
          icon = ${icon},
          url = ${url},
          order_index = ${order_index}
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Service Error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await sql`DELETE FROM services WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Service Error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
