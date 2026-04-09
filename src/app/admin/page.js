'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/visits');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch visit stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Find max for chart scaling
  const chartMax = stats?.dailyVisits?.length
    ? Math.max(...stats.dailyVisits.map(d => d.count), 1)
    : 1;

  return (
    <div className="glass-panel">
      <h1 className="text-gold title-glow">{t('admin.dashboard')}</h1>

      {/* Visit Stats Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2 className="text-gold mb-4" style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📊 Site Visits
        </h2>

        {loading ? (
          <p className="text-secondary">Loading stats...</p>
        ) : stats ? (
          <>
            {/* Stat Cards Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              <StatCard label="Total Visits" value={stats.total} icon="🌐" color="#D4AF37" />
              <StatCard label="Today" value={stats.today} icon="📅" color="#4ade80" />
              <StatCard label="Last 7 Days" value={stats.last7} icon="📆" color="#60a5fa" />
              <StatCard label="Last 30 Days" value={stats.last30} icon="🗓️" color="#c084fc" />
            </div>

            {/* Mini bar chart */}
            {stats.dailyVisits?.length > 0 && (
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 className="mb-4" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  Last 14 Days Trend
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '4px',
                  height: '120px',
                  paddingBottom: '1.5rem',
                  position: 'relative',
                }}>
                  {stats.dailyVisits.map((d, i) => {
                    const pct = (d.count / chartMax) * 100;
                    const dayLabel = new Date(d.day + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' });
                    return (
                      <div key={i} style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}>
                        <span style={{
                          fontSize: '0.65rem',
                          color: 'var(--gold-accent)',
                          marginBottom: '4px',
                          fontWeight: 600,
                        }}>{d.count}</span>
                        <div
                          title={`${d.day}: ${d.count} visits`}
                          style={{
                            width: '100%',
                            maxWidth: '36px',
                            height: `${Math.max(pct, 4)}%`,
                            background: 'linear-gradient(180deg, var(--gold-accent), rgba(212,175,55,0.3))',
                            borderRadius: '6px 6px 2px 2px',
                            transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            position: 'relative',
                          }}
                        />
                        <span style={{
                          fontSize: '0.6rem',
                          color: 'var(--text-secondary)',
                          marginTop: '6px',
                          position: 'absolute',
                          bottom: 0,
                        }}>{dayLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Pages */}
            {stats.topPages?.length > 0 && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 className="mb-4" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  Top Pages
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {stats.topPages.map((p, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.8rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--gold-accent)',
                    }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {p.path}
                      </span>
                      <span style={{
                        background: 'rgba(212,175,55,0.15)',
                        color: 'var(--gold-accent)',
                        padding: '0.2rem 0.7rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}>
                        {p.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-secondary">No visit data available yet.</p>
        )}
      </div>

      {/* Original dashboard cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mb-4">{t('admin.stats')}</h3>
          <ul className="text-secondary" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>{t('nav.articles')}: <span className="text-primary font-bold">{stats?.articleCount || 0}</span></li>
            <li>{t('nav.projects')}: <span className="text-primary font-bold">{stats?.projectCount || 0}</span></li>
            <li>{t('cv.title')}: <span className="text-primary font-bold">1 {t('admin.manage')}</span></li>
          </ul>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mb-4">{t('admin.quickActions')}</h3>
          <p className="text-secondary mb-4">{t('hero.description')}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px',
      padding: '1.2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Colored glow behind the number */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: color,
        opacity: 0.08,
        filter: 'blur(20px)',
      }} />
      <span style={{ fontSize: '1.6rem' }}>{icon}</span>
      <span style={{
        fontSize: '2rem',
        fontWeight: 800,
        fontFamily: "'Outfit', sans-serif",
        color: color,
        lineHeight: 1,
      }}>
        {value.toLocaleString()}
      </span>
      <span style={{
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: 600,
      }}>
        {label}
      </span>
    </div>
  );
}
