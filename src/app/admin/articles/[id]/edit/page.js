'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Pencil, Save, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditArticle() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setCategory(data.category || '');
        setContent(data.content);
      } else {
        setError('Failed to fetch article data');
      }
    } catch (err) {
      setError('An error occurred while fetching the article');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category }),
      });

      if (res.ok) {
        setMessage(t('articles.saveChanges') + '!');
        // Optional: redirect after some time
        setTimeout(() => router.push('/admin/articles'), 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update article.');
      }
    } catch (err) {
      setError('An error occurred during save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="animate-spin text-gold" size={48} />
    </div>
  );

  return (
    <div className="glass-panel">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/articles" className="btn" style={{ padding: '0.4rem', border: 'none' }} title={t('articles.back')}>
            <ArrowLeft size={24} className={isRTL ? 'rotate-180 text-secondary' : 'text-secondary'} />
        </Link>
        <Pencil className="text-gold" size={32} />
        <h1 className="text-gold title-glow">{t('articles.edit')}</h1>
      </div>

      <form onSubmit={handleUpdate} className="flex-col gap-6">
        <div className="form-group">
          <label className="text-secondary font-bold">{t('articles.title')}</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          />
        </div>

        <div className="form-group">
          <label className="text-secondary font-bold">Category</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g., Politics, Philosophy, Economics..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          />
        </div>

        <div className="form-group">
          <label className="text-secondary font-bold">{t('hero.description')}</label>
          <RichTextEditor 
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>

        {error && (
            <div className="flex items-center gap-2" style={{ color: '#ef4444' }}>
                <AlertCircle size={20} />
                <p>{error}</p>
            </div>
        )}

        {message && (
            <div className="flex items-center gap-2" style={{ color: '#10b981' }}>
                <CheckCircle size={20} />
                <p>{message}</p>
            </div>
        )}

        <div className="flex gap-4">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={saving}
            style={{ width: '100%', gap: '0.5rem' }}
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {t('admin.saveChanges')}...
              </>
            ) : (
              <>
                <Save size={20} />
                {t('articles.saveChanges')}
              </>
            )}
          </button>
          
          <Link href="/admin/articles" className="btn" style={{ width: '100%' }}>
            {t('articles.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
