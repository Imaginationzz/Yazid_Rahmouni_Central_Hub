const { sql } = require('./node_modules/@vercel/postgres');

async function checkArticles() {
  try {
    const { rows } = await sql`SELECT id, title, category FROM articles`;
    console.log('ARTICLES_DATA_START');
    console.log(JSON.stringify(rows, null, 2));
    console.log('ARTICLES_DATA_END');
  } catch (err) {
    console.error('Error fetching articles:', err);
  }
}

checkArticles();
