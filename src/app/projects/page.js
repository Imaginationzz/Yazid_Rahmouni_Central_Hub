import { getDb } from '@/lib/db';
import ProjectsView from '@/components/ProjectsView';

export const metadata = {
  title: 'Projects | Yazid Rahmouni Portfolio',
  description: 'A showcase of web applications and projects developed by Yazid Rahmouni.',
};

export default function ProjectsPage() {
  const db = getDb();
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();

  return <ProjectsView projects={projects} />;
}
