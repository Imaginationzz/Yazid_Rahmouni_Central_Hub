import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { sql, initDb } from '@/lib/db';

export async function GET(req) {
  try {
    await initDb();
    const { rows } = await sql`SELECT raw_text, subtitle, updated_at FROM cv_content ORDER BY updated_at DESC LIMIT 1`;
    return NextResponse.json(rows[0] || { raw_text: '' });
  } catch (error) {
    console.error('CV Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const { text, subtitle } = await request.json();
      if (!text) return NextResponse.json({ error: 'Text content is required' }, { status: 400 });

      await sql`
        INSERT INTO cv_content (id, raw_text, subtitle, updated_at)
        VALUES (1, ${text}, ${subtitle || null}, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET 
          raw_text = EXCLUDED.raw_text,
          subtitle = COALESCE(EXCLUDED.subtitle, cv_content.subtitle),
          updated_at = CURRENT_TIMESTAMP
      `;

      return NextResponse.json({ success: true, message: 'CV text updated manually' });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let extractedText = '';

    if (file.name.endsWith('.docx')) {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (file.name.endsWith('.pdf')) {
      const pdf = require('pdf-parse');
      const data = await pdf(buffer);
      extractedText = data.text;
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Save to DB
    await sql`
      INSERT INTO cv_content (id, raw_text, updated_at)
      VALUES (1, ${extractedText}, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET 
        raw_text = EXCLUDED.raw_text,
        updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({ success: true, text: extractedText });
  } catch (err) {
    console.error('CV Upload Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
