'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, ArrowRight, Globe, ExternalLink, Hash } from 'lucide-react';

export default function ArticlesView({ articles }) {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category).filter(Boolean));
    return ['All', ...Array.from(cats).sort()];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') return articles;
    return articles.filter(a => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  const handleShare = () => {
    const url = window.location.href;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-col gap-8 animate-fade-in print-container articles-container">
      {/* Print/Share Actions */}
      <div className="flex justify-end gap-3 no-print mb-4 flex-wrap">
          <button onClick={handleShare} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.4rem' }}>
              <Globe size={14} /> {isRTL ? 'مشاركة' : 'Share'}
          </button>
          <button onClick={handlePrint} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.4rem' }}>
              <ExternalLink size={14} /> {isRTL ? 'طباعة' : 'Print'}
          </button>
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-gold title-glow articles-title">{t('articles.title')}</h1>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-secondary articles-subtitle">{t('articles.subtitle')}</p>
          <span className="category-badge" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
            {filteredArticles.length} {isRTL ? 'مقالة' : 'Articles'}
          </span>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="filter-bar no-print">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat === 'All' ? (isRTL ? 'الكل' : 'All') : cat}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="glass-panel text-center py-12">
          <p className="text-secondary">{t('articles.empty')}</p>
        </div>
      ) : (
        <div className="responsive-grid">
          {filteredArticles.map((article) => (
            <Link href={`/articles/${article.id}`} key={article.id} className="glass-panel flex-col gap-4 hover-scale" style={{ cursor: 'pointer' }}>
              <div className="flex justify-between items-center gap-2 text-secondary" style={{ fontSize: '0.85rem' }}>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{new Date(article.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {article.category && (
                  <span className="category-badge">{article.category}</span>
                )}
              </div>
              <h2 className="text-gold" style={{ unicodeBidi: 'plaintext', textAlign: 'start' }}>{article.title}</h2>
              <p className="text-secondary" style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden',
                fontSize: '0.95rem',
                unicodeBidi: 'plaintext',
                textAlign: 'start'
              }}>
                {article.content.replace(/<[^>]*>?/gm, '')}
              </p>
              <div className="flex items-center gap-2 text-gold font-bold mt-auto" style={{ fontSize: '0.9rem' }}>
                {t('articles.readMore')} {isRTL ? <span style={{transform: 'rotate(180deg)', display: 'inline-block'}}>&rarr;</span> : <ArrowRight size={16} />}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
