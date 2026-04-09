import { sql, initDb } from '@/lib/db';

export default async function sitemap() {
  const baseUrl = 'https://yazidrahmouni.com';

  try {
    await initDb();
    
    // Fetch all articles
    const { rows: articles } = await sql`SELECT id, updated_at FROM articles`;
    const articleUrls = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.id}`,
      lastModified: article.updated_at || new Date(),
    }));

    // Fetch all projects
    const { rows: projects } = await sql`SELECT id, created_at FROM projects`;
    const projectUrls = projects.map((project) => ({
      url: `${baseUrl}/projects`,
      lastModified: project.created_at || new Date(),
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        priority: 1,
      },
      {
        url: `${baseUrl}/articles`,
        lastModified: new Date(),
        priority: 0.8,
      },
      {
        url: `${baseUrl}/cv`,
        lastModified: new Date(),
        priority: 0.8,
      },
      ...articleUrls,
      ...projectUrls,
    ];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}
