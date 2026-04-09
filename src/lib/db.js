import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Local dev only: path to db file
const dbPath = path.resolve(process.cwd(), 'portfolio.db');

export function getDb() {
  const db = new Database(dbPath);
  
  // Initialize tables if they don't exist
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

    CREATE TABLE IF NOT EXISTS cv_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      raw_text TEXT NOT NULL,
      subtitle TEXT,
      file_data BLOB,
      filename TEXT,
      file_type TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      user_agent TEXT,
      referrer TEXT,
      visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: Add columns if table existed before
  const tableInfo = db.prepare("PRAGMA table_info(cv_content)").all();
  const hasSubtitle = tableInfo.some(col => col.name === 'subtitle');
  if (!hasSubtitle) {
    try { db.exec(`ALTER TABLE cv_content ADD COLUMN subtitle TEXT;`); } catch(e){}
  }
  const hasFileData = tableInfo.some(col => col.name === 'file_data');
  if (!hasFileData) {
    try { db.exec(`ALTER TABLE cv_content ADD COLUMN file_data BLOB;`); } catch(e){}
    try { db.exec(`ALTER TABLE cv_content ADD COLUMN filename TEXT;`); } catch(e){}
    try { db.exec(`ALTER TABLE cv_content ADD COLUMN file_type TEXT;`); } catch(e){}
  }

  // Migration for articles: Add category column
  const articleTableInfo = db.prepare("PRAGMA table_info(articles)").all();
  const hasCategory = articleTableInfo.some(col => col.name === 'category');
  if (!hasCategory) {
    try { db.exec(`ALTER TABLE articles ADD COLUMN category TEXT;`); } catch(e){}
  }

  return db;
}
