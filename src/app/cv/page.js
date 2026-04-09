import { sql, initDb } from '@/lib/db';
import CVView from '@/components/CVView';

export const metadata = {
  title: 'My CV | Yazid Rahmouni Portfolio',
  description: 'Professional experience, education, and skills of Yazid Rahmouni.',
};

export default async function CVPage() {
  await initDb();
  const { rows } = await sql`SELECT * FROM cv_content ORDER BY updated_at DESC LIMIT 1`;
  const cv = rows[0];

  return <CVView cv={cv} />;
}
