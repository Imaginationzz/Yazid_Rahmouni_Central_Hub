import { sql, initDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import ArticleDetailView from '@/components/ArticleDetailView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await initDb();
  const { rows } = await sql`SELECT title, content FROM articles WHERE id = ${id}`;
  const article = rows[0];
  
  if (!article) return { title: 'Article Not Found' };

  const plainContent = article.content.replace(/<[^>]*>?/gm, '').substring(0, 160);

  return {
    title: article.title,
    description: plainContent,
    openGraph: {
      title: article.title,
      description: plainContent,
      type: 'article',
      url: `https://yazidrahmouni.com/articles/${id}`,
      images: ['/logo.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: plainContent,
      images: ['/logo.png'],
    }
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
