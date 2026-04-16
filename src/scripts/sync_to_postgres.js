import { sql, initDb } from '../lib/db.js';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function sync() {
  console.log('🔄 Starting sync from local SQLite (portfolio.db) to Postgres...');
  
  if (!process.env.POSTGRES_URL) {
    console.error('❌ Error: POSTGRES_URL is missing. Please run with --env-file=.env or set the environment variable.');
    process.exit(1);
  }

  const dbPath = path.resolve(__dirname, '../../portfolio.db');
  const sqliteDb = new Database(dbPath);

  try {
    await initDb();
    
    console.log('Reading articles from local database...');
    const articles = sqliteDb.prepare('SELECT id, category FROM articles').all();
    console.log(`Found ${articles.length} articles to sync categories for.`);

    let syncedCount = 0;
    for (const article of articles) {
      if (article.category) {
        await sql`
          UPDATE articles 
          SET category = ${article.category} 
          WHERE id = ${article.id}
        `;
        syncedCount++;
        if (syncedCount % 100 === 0) console.log(`- Synced ${syncedCount} articles...`);
      }
    }

    console.log(`✅ Success! Synced categories for ${syncedCount} articles to Postgres.`);
  } catch (err) {
    console.error('❌ Sync failed:', err);
  } finally {
    sqliteDb.close();
  }
}

sync();
