'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Pencil, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      } else {
        setError('Failed to fetch articles');
      }
    } catch (err) {
      setError('An error occurred while fetching articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('articles.confirmDelete'))) return;

    try {
      console.log(`Attempting to delete article with ID: ${id}`);
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      console.log(`Delete response status: ${res.status}`);
      
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
        setMessage('Article deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        console.error('Delete failed:', data.error);
        setError(`Failed to delete article: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('An error occurred during deletion');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="animate-spin text-gold" size={48} />
    </div>
  );

  return (
    <div className="glass-panel">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-gold title-glow">{t('articles.manage')}</h1>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
            {articles.length} {isRTL ? 'مقالة' : 'Articles'} Total
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary">{t('admin.writeArticle')}</Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-4" style={{ color: '#ef4444' }}>
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 mb-4" style={{ color: '#10b981' }}>
          <CheckCircle size={20} />
          <p>{message}</p>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRTL ? 'right' : 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--gold-accent)' }}>#</th>
              <th style={{ padding: '1rem', color: 'var(--gold-accent)' }}>{t('articles.title')}</th>
              <th style={{ padding: '1rem', color: 'var(--gold-accent)' }}>{t('articles.category')}</th>
              <th style={{ padding: '1rem', color: 'var(--gold-accent)' }}>{t('articles.publishedOn')}</th>
              <th style={{ padding: '1rem', color: 'var(--gold-accent)', textAlign: 'center' }}>{t('admin.manage')}</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {t('articles.empty')}
                </td>
              </tr>
            ) : (
              articles.map((article, index) => (
                <tr key={article.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{index + 1}</td>
                  <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {article.title}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {article.category || '-'}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex justify-center gap-4" style={{ position: 'relative', zIndex: 10 }}>
                      <Link href={`/admin/articles/${article.id}/edit`} className="btn" style={{ padding: '0.4rem', border: 'none', position: 'relative', zIndex: 20 }} title={t('articles.edit')}>
                        <Pencil size={18} className="text-secondary hover:text-gold" />
                      </Link>
                      <button 
                        type="button"
                        onClick={() => {
                          console.log('Delete button DOM click triggered');
                          handleDelete(article.id);
                        }} 
                        className="btn" 
                        style={{ padding: '0.4rem', border: 'none', position: 'relative', zIndex: 20 }} 
                        title={t('articles.delete')}
                      >
                        <Trash2 size={18} className="text-secondary hover:text-red-500" style={{'--tw-text-opacity': '1', color: 'rgba(239, 68, 68, var(--tw-text-opacity))'}} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
