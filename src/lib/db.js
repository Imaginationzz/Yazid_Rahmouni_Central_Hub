import { sql } from '@vercel/postgres';

/**
 * Initializes the Postgres database schema if it doesn't exist.
 * This should be called in API routes or server components that need 
 * to ensure the database structure is ready.
 */
export async function initDb() {
  if (!process.env.POSTGRES_URL) {
    console.error('CRITICAL: POSTGRES_URL environment variable is missing.');
    return;
  }
  
  try {
    // Basic tables
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cv_content (
        id SERIAL PRIMARY KEY,
        raw_text TEXT NOT NULL,
        subtitle TEXT,
        file_data BYTEA,
        filename TEXT,
        file_type TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title_en TEXT NOT NULL,
        title_ar TEXT NOT NULL,
        description_en TEXT NOT NULL,
        description_ar TEXT NOT NULL,
        icon TEXT,
        url TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        path TEXT NOT NULL,
        user_agent TEXT,
        referrer TEXT,
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ensure site_settings key column exists (it's the primary key)
    // Note: In Postgres, migrations are best handled via dedicated scripts,
    // but for this simple app, we check columns using information_schema if needed.

    return true;
  } catch (error) {
    console.error('Database Initialization Error:', error);
    throw error;
  }
}

// Export the sql helper for use in other files
export { sql };
