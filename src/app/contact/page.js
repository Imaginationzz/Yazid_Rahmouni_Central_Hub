'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex-col gap-8 w-full">
      <div className="text-center mb-12">
        <h1 className="title-glow hero-title">{t('contact.title')}</h1>
        <p className="text-secondary">{t('contact.subtitle')}</p>
      </div>

      <div className="responsive-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Contact info cards */}
        <div className="flex-col gap-6">
          <div className="glass-panel flex items-center gap-4 hover-lift">
            <div className="icon-wrapper p-3 rounded-full" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
              <Mail className="text-gold" size={24} />
            </div>
            <div>
              <p className="text-secondary text-sm">{t('contact.email')}</p>
              <a href="mailto:yazid@mazricanada.com" className="text-white font-bold hover:text-gold transition-colors">
                yazid@mazricanada.com
              </a>
            </div>
          </div>

          <div className="glass-panel flex items-center gap-4 hover-lift">
            <div className="icon-wrapper p-3 rounded-full" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
              <Phone className="text-gold" size={24} />
            </div>
            <div>
              <p className="text-secondary text-sm">{t('contact.phone')}</p>
              <a href="tel:+16137090054" className="text-white font-bold hover:text-gold transition-colors">
                +1 613 709 0054
              </a>
            </div>
          </div>
        </div>

        {/* Call to action card */}
        <div className="glass-panel flex-col justify-center items-center text-center gap-6 p-8">
          <h2 className="text-gold">{t('contact.getInTouch')}</h2>
          <p className="text-secondary">
            Whether you have a question about services, projects, or anything else, 
            I'm ready to answer all your questions.
          </p>
          <a href="mailto:yazid@mazricanada.com" className="btn btn-primary gap-2 w-full justify-center">
            <Send size={18} /> {language === 'ar' ? 'أرسل رسالة' : 'Send a Message'}
          </a>
        </div>
      </div>
    </div>
  );
}
