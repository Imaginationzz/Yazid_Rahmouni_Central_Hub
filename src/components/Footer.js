'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
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

  const s = (keyEn, keyAr, fallback) => {
    const key = language === 'ar' ? keyAr : keyEn;
    return settings[key] || fallback;
  };

  const footerText = s('footer_text_en', 'footer_text_ar', '');
  const siteTitle = s('site_title_en', 'site_title_ar', t('siteTitle'));

  return (
    <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid var(--panel-border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
      {footerText ? (
        <p>{footerText}</p>
      ) : (
        <p>&copy; {new Date().getFullYear()} {siteTitle}. {t('footer.rights')}</p>
      )}
    </footer>
  );
}
