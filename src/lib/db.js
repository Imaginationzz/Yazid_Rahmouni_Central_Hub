import { sql as vercelSql } from '@vercel/postgres';
import path from 'path';

// Detection for local vs production
const isPostgres = !!process.env.POSTGRES_URL;
let db;

/**
 * Compatible SQL helper that works with both Postgres and local SQLite.
 */
const sql = async (strings, ...values) => {
  if (isPostgres) {
    return vercelSql(strings, ...values);
  }

  // SQLite Fallback - Dynamic Import for native module compatibility
  if (!db) {
    const Database = (await import('better-sqlite3')).default;
    db = new Database(path.resolve(process.cwd(), 'portfolio.db'));
  }

  // Reconstruct the query string with SQLite placeholders (?)
  let query = strings[0];
  for (let i = 0; i < values.length; i++) {
    query += '?' + strings[i + 1];
  }

  try {
    const prepared = db.prepare(query);
    
    // Check if it's a SELECT query to return rows
    if (query.trim().toLowerCase().startsWith('select')) {
      const rows = prepared.all(...values);
      return { rows };
    } else {
      const result = prepared.run(...values);
      return { result };
    }
  } catch (err) {
    console.error('SQLite Error:', err);
    throw err;
  }
};

/**
 * Initializes the database schema.
 */
export async function initDb() {
  if (isPostgres) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS articles (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      // ... (rest of postgres-specific types like SERIAL)
    } catch (error) {
      console.error('Postgres Initialization Warning:', error.message);
    }
  } else {
    // SQLite Specific Initialization (using INTEGER PRIMARY KEY AUTOINCREMENT)
    try {
      if (!db) {
        const Database = (await import('better-sqlite3')).default;
        db = new Database(path.resolve(process.cwd(), 'portfolio.db'));
      }
      
      db.exec(`
        CREATE TABLE IF NOT EXISTS articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          url TEXT,
          description TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title_en TEXT NOT NULL,
          title_ar TEXT NOT NULL,
          description_en TEXT NOT NULL,
          description_ar TEXT NOT NULL,
          icon TEXT,
          url TEXT,
          order_index INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Local SQLite database initialized.');
    } catch (err) {
      console.error('SQLite Initialization Error:', err);
    }
  }
  return true;
}

export { sql };
