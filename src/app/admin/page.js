'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboard() {
  const { t } = useLanguage();

  return (
    <div className="glass-panel">
      <h1 className="text-gold title-glow">{t('admin.menu')}</h1>
      <p className="text-secondary mt-2">{t('admin.enterCredentials')}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mb-4">{t('admin.stats')}</h3>
          <ul className="text-secondary" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>{t('nav.articles')}: <span className="text-primary font-bold">{t('admin.dashboard')}</span></li>
            <li>{t('nav.projects')}: <span className="text-primary font-bold">{t('admin.dashboard')}</span></li>
            <li>{t('cv.title')}: <span className="text-primary font-bold">{t('admin.dashboard')}</span></li>
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
