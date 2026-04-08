import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import ArticleDetailView from '@/components/ArticleDetailView';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const db = getDb();
  const article = db.prepare('SELECT title FROM articles WHERE id = ?').get(id);
  
  return {
    title: `${article?.title || 'Article Not Found'} | Yazid Rahmouni Portfolio`,
  };
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  const db = getDb();
  const article = db.prepare('SELECT title, content, category, created_at FROM articles WHERE id = ?').get(id);

  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} />;
}
