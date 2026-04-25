'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch site settings');
      }
    }
    fetchSettings();
  }, []);

  // Helper: get bilingual setting with fallback to translation
  const s = (keyEn, keyAr, fallback) => {
    const key = language === 'ar' ? keyAr : keyEn;
    return settings[key] || fallback;
  };

  return (
    <div className="flex-col gap-12">
      {/* Hero Section */}
      <section className="glass-panel text-center flex-col items-center gap-6 mt-8 animate-fade-up" style={{ padding: '4rem 2rem' }}>
        <div className="animate-fade-scale stagger-1">
           <img src="/logo.png" alt="Logo" width="120" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px var(--gold-glow))' }} />
        </div>
        
        <h1 className="title-glow hero-title animate-fade-up stagger-2" style={{ color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {t('hero.welcome')}{' '}
          <span className="text-gold" style={{ display: 'block', marginTop: '0.5rem' }}>{t('hero.portal')}</span>
        </h1>
        
        {/* Hero description: render as HTML if it contains tags, else plain text */}
        <div className="animate-fade-up stagger-3" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {(() => {
            const desc = t('hero.description');
            const descClasses = "text-secondary hero-description";
            if (desc && desc.includes('<')) {
              return <div className={descClasses} style={{ fontSize: '1.25rem' }} dangerouslySetInnerHTML={{ __html: desc }} />;
            }
            return <p className={descClasses} style={{ fontSize: '1.25rem' }}>{desc}</p>;
          })()}
        </div>

        <div className="flex gap-6 mt-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Link href="/articles" className="btn btn-primary" style={{ minWidth: '180px' }}>
            {s('hero_btn1_en', 'hero_btn1_ar', t('hero.btnArticles'))}
          </Link>
          <Link href="/services" className="btn" style={{ minWidth: '180px' }}>
            {s('hero_btn2_en', 'hero_btn2_ar', t('hero.btnServices'))}
          </Link>
        </div>
      </section>

      {/* Quick Links / Highlights */}
      <section className="responsive-grid mt-4">
        <div className="glass-panel animate-fade-up stagger-1">
          <h2 className="text-gold mb-4" style={{ fontSize: '1.75rem' }}>{s('card1_title_en', 'card1_title_ar', t('sections.latestArticles'))}</h2>
          <p className="text-secondary mb-6" style={{ minHeight: '3rem' }}>{s('card1_text_en', 'card1_text_ar', t('articles.subtitle'))}</p>
          <Link href="/articles" className="text-gold" style={{ fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {s('card1_link_en', 'card1_link_ar', t('sections.browseArticles'))} <span style={{ fontSize: '1.2rem' }}>&rarr;</span>
          </Link>
        </div>
        
        <div className="glass-panel animate-fade-up stagger-2">
          <h2 className="text-gold mb-4" style={{ fontSize: '1.75rem' }}>{s('card2_title_en', 'card2_title_ar', t('sections.webProjects'))}</h2>
          <p className="text-secondary mb-6" style={{ minHeight: '3rem' }}>{s('card2_text_en', 'card2_text_ar', t('projects.subtitle'))}</p>
          <Link href="/projects" className="text-gold" style={{ fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {s('card2_link_en', 'card2_link_ar', t('sections.seeProjects'))} <span style={{ fontSize: '1.2rem' }}>&rarr;</span>
          </Link>
        </div>
        
        <div className="glass-panel text-center flex-col items-center animate-fade-up stagger-3">
          <h2 className="text-gold mb-4" style={{ fontSize: '1.75rem' }}>{t('sections.myServices')}</h2>
          <p className="text-secondary mb-6" style={{ minHeight: '3rem' }}>{t('services.subtitle')}</p>
          <Link href="/services" className="text-gold" style={{ fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {t('sections.viewServices')} <span style={{ fontSize: '1.2rem' }}>&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
