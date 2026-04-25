'use client';

import { useLanguage } from '@/context/LanguageContext';
import * as Icons from 'lucide-react';

export default function ServicesView({ services }) {
  const { t, language } = useLanguage();

  const getIcon = (iconName) => {
    const Icon = Icons[iconName] || Icons.HelpCircle;
    return <Icon size={40} className="text-gold" />;
  };

  return (
    <div className="flex-col gap-8 w-full animate-fade-up">
      <div className="text-center mb-12 animate-fade-up stagger-1">
        <h1 className="title-glow hero-title" style={{ fontSize: '3.5rem' }}>{t('services.title')}</h1>
        <p className="text-secondary" style={{ fontSize: '1.25rem' }}>{t('services.subtitle')}</p>
      </div>

      {!services || services.length === 0 ? (
        <div className="glass-panel text-center py-12 animate-fade-up stagger-2">
          <p className="text-secondary">{t('services.empty')}</p>
        </div>
      ) : (
        <div className="responsive-grid">
          {services.map((service, index) => (
            <div key={service.id} className={`glass-panel flex-col items-center text-center gap-6 animate-fade-up stagger-${(index % 3) + 1}`}>
              <div className="icon-wrapper p-6 rounded-2xl" style={{ 
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid var(--panel-border)',
                boxShadow: 'inset 0 0 15px rgba(212, 175, 55, 0.05)'
              }}>
                {getIcon(service.icon)}
              </div>
              <h3 className="text-gold" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                {language === 'ar' ? service.title_ar : service.title_en}
              </h3>
              <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                {language === 'ar' ? service.description_ar : service.description_en}
              </p>
              {service.url && (
                <a 
                  href={service.url.startsWith('http') ? service.url : `https://${service.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary mt-4"
                  style={{ width: '100%' }}
                >
                  {language === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
