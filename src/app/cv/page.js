import { getDb } from '@/lib/db';
import CVView from '@/components/CVView';

export const metadata = {
  title: 'My CV | Yazid Rahmouni Portfolio',
  description: 'Professional experience, education, and skills of Yazid Rahmouni.',
};

export default function CVPage() {
  const db = getDb();
  const cv = db.prepare('SELECT * FROM cv_content ORDER BY updated_at DESC LIMIT 1').get();

  return <CVView cv={cv} />;
}
