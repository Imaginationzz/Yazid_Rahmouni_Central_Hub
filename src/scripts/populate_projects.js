import { sql, initDb } from '../lib/db.js';

async function populate() {
  try {
    console.log('Initializing DB...');
    await initDb();

    console.log('Inserting projects...');
    const projects = [
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

    for (const project of projects) {
      await sql`
        INSERT INTO projects (title, url, description)
        VALUES (${project.title}, ${project.url}, ${project.description})
      `;
      console.log(`Inserted: ${project.title}`);
    }

    console.log('Successfully populated all projects.');
  } catch (error) {
    console.error('Error populating projects:', error);
  }
}

populate();
