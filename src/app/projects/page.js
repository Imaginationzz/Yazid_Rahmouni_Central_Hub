import { sql, initDb } from '@/lib/db';
import ProjectsView from '@/components/ProjectsView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects | Yazid Rahmouni Portfolio',
  description: 'A showcase of web applications and projects developed by Yazid Rahmouni.',
};

export default async function ProjectsPage() {
  await initDb();
  const { rows: projects } = await sql`SELECT * FROM projects ORDER BY created_at DESC`;

  return <ProjectsView projects={projects} />;
}
