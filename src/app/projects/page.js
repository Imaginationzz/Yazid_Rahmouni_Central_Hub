import { sql, initDb } from '@/lib/db';
import ProjectsView from '@/components/ProjectsView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects | Yazid Rahmouni Portfolio',
  description: 'A showcase of web applications and projects developed by Yazid Rahmouni.',
};

export default async function ProjectsPage() {
  await initDb();
  
  let { rows: projects } = await sql`SELECT * FROM projects ORDER BY created_at DESC`;

  // Auto-seed if empty
  if (projects.length === 0) {
    console.log('No projects found. Auto-seeding initial project list...');
    const seedData = [
      {
        title: 'Arabic Text Extractor',
        url: 'https://pdf-to-text-extract.vercel.app/',
        description: 'Professional tool for extracting Arabic text from PDF and images (OCR) with high accuracy.'
      },
      {
        title: 'Quran Memory Grid',
        url: 'https://quran-memory-grid.vercel.app/',
        description: 'An interactive platform for memorizing the Holy Quran through a grid-based interface.'
      },
      {
        title: 'Al-Bayan Quranic Intelligence',
        url: 'https://quran-nlp.vercel.app/',
        description: 'Advanced NLP tool for Quranic research and intelligent query processing.'
      },
      {
        title: 'Mazri Canada',
        url: 'https://www.mazricanada.com/',
        description: 'Authentic Arabic Publishing House platform showcasing contemporary literature.'
      },
      {
        title: 'YazidSafeLab',
        url: 'https://yazid-safe-lab.netlify.app/',
        description: 'Modern Web Security Training platform focusing on laboratory-style security education.'
      },
      {
        title: 'Mazri Publishing Manager',
        url: 'https://mazripublishing-manager.vercel.app/',
        description: 'Comprehensive dashboard for managing publications, authors, and distribution.'
      }
    ];

    for (const p of seedData) {
      await sql`INSERT INTO projects (title, url, description) VALUES (${p.title}, ${p.url}, ${p.description})`;
    }
    
    // Fetch again after seeding
    const finalRes = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    projects = finalRes.rows;
  }

  return <ProjectsView projects={projects} />;
}
