import { sql, initDb } from '@/lib/db';
import ServicesView from '@/components/ServicesView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Professional Services | Yazid Rahmouni',
  description: 'Explore the professional services offered by Yazid Rahmouni, including Book Publishing, Cybersecurity, and Web Development.',
};

export default async function ServicesPage() {
  await initDb();
  const { rows } = await sql`SELECT * FROM services ORDER BY order_index ASC, created_at DESC`;

  return <ServicesView services={rows} />;
}
