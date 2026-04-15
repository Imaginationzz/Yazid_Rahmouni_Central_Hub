'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
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

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="navbar">
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src="/logo.png" alt="Logo" width="45" height="45" style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-gold" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {t('siteTitle')}
          </span>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
            {t('siteSubtitle')}
          </span>
        </div>
      </Link>
      
      <div className="flex items-center gap-4">
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li className="mobile-only" style={{ width: '100%', marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
             <button onClick={toggleMenu} className="text-gold"><X size={32} /></button>
          </li>
          <li onClick={() => setIsOpen(false)}><Link href="/">{t('nav.home')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/articles">{t('nav.articles')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/projects">{t('nav.projects')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/services">{t('nav.services')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/contact">{t('nav.contact')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/admin" className="text-gold" style={{ fontWeight: 'bold' }}>{t('nav.admin')}</Link></li>
          <li className="mobile-only mt-8" style={{ width: '100%', display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => { toggleLanguage(); setIsOpen(false); }} 
                className="btn" 
                style={{ flex: 1, gap: '0.5rem' }}
              >
                <Globe size={16} />
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              <ThemeToggle />
          </li>
        </ul>

        {/* Desktop Language Switcher */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleLanguage} 
              className="btn" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', gap: '0.5rem', minWidth: '100px' }}
            >
              <Globe size={16} />
              {language === 'en' ? 'العربية' : 'English'}
            </button>
            <ThemeToggle />
        </div>

        <button className="hamburger" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
}
