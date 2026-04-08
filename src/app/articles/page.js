import { getDb } from '@/lib/db';
import ArticlesView from '@/components/ArticlesView';

export const metadata = {
  title: 'Articles | Yazid Rahmouni Portfolio',
  description: 'A collection of articles and thoughts by Yazid Rahmouni.',
};

export default function ArticlesPage() {
  const db = getDb();
  const articles = db.prepare('SELECT id, title, content, category, created_at FROM articles ORDER BY created_at DESC').all();

  return <ArticlesView articles={articles} />;
}
