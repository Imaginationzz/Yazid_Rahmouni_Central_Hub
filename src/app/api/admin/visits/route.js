import { sql, initDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await initDb();

    // Total visits
    const totalRes = await sql`SELECT COUNT(*) as count FROM visits`;
    
    // Today's visits
    const todayRes = await sql`SELECT COUNT(*) as count FROM visits WHERE visited_at::date = CURRENT_DATE`;

    // Last 7 days
    const last7Res = await sql`SELECT COUNT(*) as count FROM visits WHERE visited_at >= NOW() - INTERVAL '7 days'`;

    // Last 30 days
    const last30Res = await sql`SELECT COUNT(*) as count FROM visits WHERE visited_at >= NOW() - INTERVAL '30 days'`;

    // Per-page breakdown (top 10)
    const topPagesRes = await sql`
      SELECT path, COUNT(*) as count FROM visits 
      GROUP BY path ORDER BY count DESC LIMIT 10
    `;

    // Daily visits for the last 14 days for the chart
    const dailyVisitsRes = await sql`
      SELECT visited_at::date as day, COUNT(*) as count 
      FROM visits 
      WHERE visited_at >= NOW() - INTERVAL '14 days'
      GROUP BY visited_at::date
      ORDER BY day ASC
    `;

    return NextResponse.json({
      total: parseInt(totalRes.rows[0].count),
      today: parseInt(todayRes.rows[0].count),
      last7: parseInt(last7Res.rows[0].count),
      last30: parseInt(last30Res.rows[0].count),
      topPages: topPagesRes.rows.map(r => ({ ...r, count: parseInt(r.count) })),
      dailyVisits: dailyVisitsRes.rows.map(r => ({ ...r, count: parseInt(r.count) })),
    });
  } catch (err) {
    console.error('Visit stats error:', err);
    return NextResponse.json({ error: 'Failed to fetch stats: ' + err.message }, { status: 500 });
  }
}
