import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { sql, initDb } from '@/lib/db';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    // Advanced regex to split by article numbers (standard and Hindi)
    const rawParts = text.split(/(?:^|\n)\s*[\d\u0660-\u0669]+\s*[\.\-]\s+/);
    
    await initDb();
    
    // Clear existing articles before starting the new batch extraction
    await sql`DELETE FROM articles`;
    
    let savedCount = 0;

    for (let part of rawParts) {
      if (!part.trim()) continue;

      const lines = part.trim().split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !/^[\s\u200B-\u200F\u202A-\u202E\uFEFF]+$/.test(trimmed);
      });

      if (lines.length > 0) {
        let title = '';
        let category = null;
        let contentStartIndex = 0;

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          line = line.replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '').trim();
          
          if (!line) {
            if (contentStartIndex === i) contentStartIndex++;
            continue;
          }

          const categoryMatch = line.match(/\[\s*(.*?)\s*\]/);
          
          if (categoryMatch) {
            if (!category) {
              category = categoryMatch[1].trim();
            }
            if (contentStartIndex === i) contentStartIndex++;
          } else if (!title) {
            title = line;
            if (contentStartIndex === i) contentStartIndex++;
          } else {
            break;
          }
        }

        const content = lines.slice(contentStartIndex).join('\n').trim()
                             .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '');

        if (!title && content) {
          const firstLine = content.split('\n')[0].trim();
          title = firstLine.substring(0, 70) + (firstLine.length > 70 ? '...' : '');
        }

        if (content.length > 5) {
          await sql`
            INSERT INTO articles (title, content, category) 
            VALUES (${title || 'Untitled Article'}, ${content}, ${category || null})
          `;
          savedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, count: savedCount });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to process document: ' + error.message }, { status: 500 });
  }
}
