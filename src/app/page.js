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
    <div className="flex-col gap-8">
      {/* Hero Section */}
      <section className="glass-panel text-center flex-col items-center gap-4 mt-8">
        <img src="/logo.png" alt="Logo" width="100" style={{ marginBottom: '1rem' }} />
        <h1 className="title-glow hero-title" style={{ color: 'var(--text-primary)' }}>
          {s('hero_welcome_en', 'hero_welcome_ar', t('hero.welcome'))}{' '}
          <span className="text-gold">{s('hero_portal_en', 'hero_portal_ar', t('hero.portal'))}</span>
        </h1>
        {/* Hero description: render as HTML if it contains tags, else plain text */}
        {(() => {
          const desc = s('hero_description_en', 'hero_description_ar', t('hero.description'));
          if (desc && desc.includes('<')) {
            return <div className="text-secondary hero-description" dangerouslySetInnerHTML={{ __html: desc }} />;
          }
          return <p className="text-secondary hero-description">{desc}</p>;
        })()}
        <div className="flex gap-4 mt-4">
          <Link href="/articles" className="btn btn-primary">
            {s('hero_btn1_en', 'hero_btn1_ar', t('hero.btnArticles'))}
          </Link>
          <Link href="/cv" className="btn">
            {s('hero_btn2_en', 'hero_btn2_ar', t('hero.btnCV'))}
          </Link>
        </div>
      </section>

      {/* Quick Links / Highlights */}
      <section className="responsive-grid mt-8">
        <div className="glass-panel">
          <h2 className="text-gold mb-4">{s('card1_title_en', 'card1_title_ar', t('sections.latestArticles'))}</h2>
          <p className="text-secondary mb-4">{s('card1_text_en', 'card1_text_ar', t('articles.subtitle'))}</p>
          <Link href="/articles" className="text-gold" style={{ textDecoration: 'underline' }}>
            {s('card1_link_en', 'card1_link_ar', t('sections.browseArticles'))} &rarr;
          </Link>
        </div>
        <div className="glass-panel">
          <h2 className="text-gold mb-4">{s('card2_title_en', 'card2_title_ar', t('sections.webProjects'))}</h2>
          <p className="text-secondary mb-4">{s('card2_text_en', 'card2_text_ar', t('projects.subtitle'))}</p>
          <Link href="/projects" className="text-gold" style={{ textDecoration: 'underline' }}>
            {s('card2_link_en', 'card2_link_ar', t('sections.seeProjects'))} &rarr;
          </Link>
        </div>
        <div className="glass-panel">
          <h2 className="text-gold mb-4">{s('card3_title_en', 'card3_title_ar', t('sections.mySkills'))}</h2>
          <p className="text-secondary mb-4">{s('card3_text_en', 'card3_text_ar', t('cv.subtitle'))}</p>
          <Link href="/cv" className="text-gold" style={{ textDecoration: 'underline' }}>
            {s('card3_link_en', 'card3_link_ar', t('sections.viewSkills'))} &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
