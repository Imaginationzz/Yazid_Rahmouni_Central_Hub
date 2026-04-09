import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const { rows } = await sql`SELECT key, value FROM site_settings`;
    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await initDb();

    // In Postgres, we'll run upserts for each key-value pair.
    // For large operations, we'd use a transaction or a single unnest query,
    // but for settings, a simple loop with Promise.all is sufficient.
    const entries = Object.entries(data);
    
    await Promise.all(entries.map(([key, value]) => {
      if (value !== undefined && value !== null) {
        return sql`
          INSERT INTO site_settings (key, value, updated_at)
          VALUES (${key}, ${value}, CURRENT_TIMESTAMP)
          ON CONFLICT(key) DO UPDATE SET 
            value = EXCLUDED.value,
            updated_at = CURRENT_TIMESTAMP
        `;
      }
      return Promise.resolve();
    }));

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Settings POST Error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
