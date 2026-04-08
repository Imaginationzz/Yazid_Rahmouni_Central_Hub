import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { getDb } from '@/lib/db';

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
    // We split by the number line and keep the title part
    const rawParts = text.split(/(?:^|\n)\s*[\d\u0660-\u0669]+\s*[\.\-]\s+/);
    
    const db = getDb();
    
    // Clear existing articles before starting the new batch extraction
    // This allows clicking "Start Extraction" again to fix issues without duplicates
    db.prepare('DELETE FROM articles').run();
    
    let savedCount = 0;

    for (let part of rawParts) {
      if (!part.trim()) continue;

      const lines = part.trim().split('\n').filter(line => {
        const trimmed = line.trim();
        // Filter out empty lines or lines with only invisible Unicode control characters
        return trimmed.length > 0 && !/^[\s\u200B-\u200F\u202A-\u202E\uFEFF]+$/.test(trimmed);
      });

      if (lines.length > 0) {
        let title = '';
        let category = null;
        let contentStartIndex = 0;

        // Step 1: Find Title and Category
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          // Strip invisible control characters from the line itself
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

        // Fallback for missing title: use first 70 chars of first content line
        if (!title && content) {
          const firstLine = content.split('\n')[0].trim();
          title = firstLine.substring(0, 70) + (firstLine.length > 70 ? '...' : '');
        }

        if (content.length > 5) {
          db.prepare('INSERT INTO articles (title, content, category) VALUES (?, ?, ?)').run(
            title || 'Untitled Article', 
            content, 
            category
          );
          savedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, count: savedCount });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
  }
}
