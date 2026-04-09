import { sql, initDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import ArticleDetailView from '@/components/ArticleDetailView';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await initDb();
  const { rows } = await sql`SELECT title FROM articles WHERE id = ${id}`;
  const article = rows[0];
  
  return {
    title: `${article?.title || 'Article Not Found'} | Yazid Rahmouni Portfolio`,
  };
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  await initDb();
  const { rows } = await sql`SELECT title, content, category, created_at FROM articles WHERE id = ${id}`;
  const article = rows[0];

  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} />;
}
