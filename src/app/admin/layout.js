'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({ children }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex gap-8" style={{ marginTop: '2rem' }}>
      {!isLoginPage && (
        <aside className="glass-panel" style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '1rem', alignSelf: 'flex-start' }}>
          <h3 className="text-gold mb-4">{t('admin.menu')}</h3>
          <Link href="/admin" className="text-secondary" style={{ textDecoration: 'none' }}>{t('admin.dashboard')}</Link>
          <Link href="/admin/articles" className="text-secondary" style={{ textDecoration: 'none' }}>{t('articles.manage')}</Link>
          <Link href="/admin/articles/upload" className="text-secondary" style={{ textDecoration: 'none' }}>{t('admin.uploadArticles')}</Link>
          <Link href="/admin/articles/new" className="text-secondary" style={{ textDecoration: 'none' }}>{t('admin.writeArticle')}</Link>
          <Link href="/admin/projects/new" className="text-secondary" style={{ textDecoration: 'none' }}>{t('admin.addProject')}</Link>
          <Link href="/admin/cv" className="text-secondary" style={{ textDecoration: 'none' }}>{t('admin.manageCV')}</Link>
          <Link href="/admin/site" className="text-secondary" style={{ textDecoration: 'none' }}>✏️ Edit Site Content</Link>
          
          <button 
            onClick={handleLogout} 
            className="btn" 
            style={{ 
              marginTop: '2rem', 
              borderColor: '#ef4444', 
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)'
            }}
          >
            {t('admin.logout') || 'Logout'}
          </button>
        </aside>
      )}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
