import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();

    const total = db.prepare('SELECT COUNT(*) as count FROM visits').get();

    const today = db.prepare(
      "SELECT COUNT(*) as count FROM visits WHERE date(visited_at) = date('now')"
    ).get();

    const last7 = db.prepare(
      "SELECT COUNT(*) as count FROM visits WHERE visited_at >= datetime('now', '-7 days')"
    ).get();

    const last30 = db.prepare(
      "SELECT COUNT(*) as count FROM visits WHERE visited_at >= datetime('now', '-30 days')"
    ).get();

    // Per-page breakdown (top 10)
    const topPages = db.prepare(
      `SELECT path, COUNT(*) as count FROM visits 
       GROUP BY path ORDER BY count DESC LIMIT 10`
    ).all();

    // Daily visits for the last 14 days for the chart
    const dailyVisits = db.prepare(
      `SELECT date(visited_at) as day, COUNT(*) as count 
       FROM visits 
       WHERE visited_at >= datetime('now', '-14 days')
       GROUP BY date(visited_at)
       ORDER BY day ASC`
    ).all();

    db.close();

    return NextResponse.json({
      total: total.count,
      today: today.count,
      last7: last7.count,
      last30: last30.count,
      topPages,
      dailyVisits,
    });
  } catch (err) {
    console.error('Visit stats error:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
