'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Calendar, Share2, Printer } from 'lucide-react';

export default function ArticleDetailView({ article }) {
  const { t, isRTL } = useLanguage();

  const handleShare = () => {
    const url = window.location.href;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <article className="animate-fade-in print-container article-detail-container">
      <Link href="/articles" className="flex items-center gap-2 text-secondary mb-12 hover:text-gold no-print" style={{ fontSize: '0.9rem' }}>
        {isRTL ? <span style={{transform: 'rotate(180deg)', display: 'inline-block'}}>&rarr;</span> : <ArrowLeft size={16} />}
        <span>{t('articles.back')}</span>
      </Link>

      <div className="flex flex-col gap-4 mb-12">
        <div className="flex items-center justify-between no-print flex-wrap gap-4" style={{ fontSize: '0.95rem' }}>
          <div className="flex items-center gap-2 text-secondary">
            <Calendar size={18} className="text-gold" />
            <span>{t('articles.publishedOn')} {new Date(article.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {article.category && (
            <span className="category-badge" style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>{article.category}</span>
          )}
        </div>
        <h1 className="text-gold title-glow print-title article-detail-title" style={{ unicodeBidi: 'plaintext' }}>{article.title}</h1>
      </div>

      <div className="glass-panel print-content article-detail-content" style={{ 
        whiteSpace: 'pre-wrap', 
        unicodeBidi: 'plaintext',
        textAlign: 'start'
      }}
      dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="flex justify-between items-center mt-12 py-8 border-t border-panel-border no-print flex-wrap gap-6">
          <div className="flex gap-4">
              <button 
                className="btn hover-scale" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.4rem' }}
                onClick={handleShare}
              >
                  <Share2 size={16} /> Share
              </button>
              <button 
                className="btn hover-scale" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.4rem' }}
                onClick={handlePrint}
              >
                  <Printer size={16} /> Print
              </button>
          </div>
          <Link href="/articles" className="text-gold font-bold hover:underline">{t('articles.more')} &rarr;</Link>
      </div>
    </article>
  );
}
