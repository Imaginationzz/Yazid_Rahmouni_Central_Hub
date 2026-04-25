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
    <header className="navbar" style={{ 
      background: 'var(--nav-bg)', 
      backdropFilter: 'blur(20px)', 
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--panel-border)',
      padding: '1rem 0'
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'var(--transition)' }} className="hover-scale">
        <div style={{ 
          background: 'rgba(212, 175, 55, 0.1)', 
          padding: '5px', 
          borderRadius: '12px',
          border: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img src="/logo.png" alt="Logo" width="40" height="40" style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-gold" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            {t('siteTitle')}
          </span>
          <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.8 }}>
            {t('siteSubtitle')}
          </span>
        </div>
      </Link>
      
      <div className="flex items-center gap-4">
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li className="mobile-only" style={{ width: '100%', marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
             <button onClick={toggleMenu} className="text-gold"><X size={32} /></button>
          </li>
          <li onClick={() => setIsOpen(false)}><Link href="/" className="nav-item">{t('nav.home')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/articles" className="nav-item">{t('nav.articles')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/projects" className="nav-item">{t('nav.projects')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/services" className="nav-item">{t('nav.services')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/contact" className="nav-item">{t('nav.contact')}</Link></li>
          <li onClick={() => setIsOpen(false)}><Link href="/admin" className="text-gold nav-item" style={{ fontWeight: 800 }}>{t('nav.admin')}</Link></li>
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
