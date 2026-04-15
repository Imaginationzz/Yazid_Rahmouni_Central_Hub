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
    <div className="flex-col gap-8 w-full">
      <div className="text-center mb-12">
        <h1 className="title-glow hero-title">{t('services.title')}</h1>
        <p className="text-secondary">{t('services.subtitle')}</p>
      </div>

      {!services || services.length === 0 ? (
        <div className="glass-panel text-center py-12">
          <p className="text-secondary">{t('services.empty')}</p>
        </div>
      ) : (
        <div className="responsive-grid">
          {services.map((service) => (
            <div key={service.id} className="glass-panel flex-col items-center text-center gap-4 hover-lift">
              <div className="icon-wrapper mb-2 p-4 rounded-full" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                {getIcon(service.icon)}
              </div>
              <h3 className="text-gold" style={{ fontSize: '1.4rem' }}>
                {language === 'ar' ? service.title_ar : service.title_en}
              </h3>
              <p className="text-secondary">
                {language === 'ar' ? service.description_ar : service.description_en}
              </p>
              {service.url && (
                <a 
                  href={service.url.startsWith('http') ? service.url : `https://${service.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary mt-2"
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
