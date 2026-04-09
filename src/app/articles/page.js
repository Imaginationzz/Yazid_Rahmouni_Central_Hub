import { sql, initDb } from '@/lib/db';
import ArticlesView from '@/components/ArticlesView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Articles | Yazid Rahmouni Portfolio',
  description: 'A collection of articles and thoughts by Yazid Rahmouni.',
};

export default async function ArticlesPage() {
  await initDb();
  const { rows: articles } = await sql`SELECT id, title, content, category, created_at FROM articles ORDER BY created_at DESC`;

  return <ArticlesView articles={articles} />;
}
