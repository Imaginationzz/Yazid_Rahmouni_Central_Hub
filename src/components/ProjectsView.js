'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Briefcase, Link as LinkIcon, ExternalLink } from 'lucide-react';

export default function ProjectsView({ projects }) {
  const { t } = useLanguage();

  return (
    <div className="flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-gold title-glow projects-title">{t('projects.title')}</h1>
        <p className="text-secondary projects-subtitle">{t('projects.subtitle')}</p>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel text-center py-16">
          <Briefcase className="text-secondary mb-4 mx-auto" size={48} />
          <p className="text-secondary">{t('projects.empty')}</p>
        </div>
      ) : (
        <div className="responsive-grid">
          {projects.map((project) => {
            const CardWrapper = project.url ? 'a' : 'div';
            const cardProps = project.url ? {
              href: project.url,
              target: '_blank',
              rel: 'noopener noreferrer'
            } : {};

            return (
              <CardWrapper 
                key={project.id} 
                className="glass-panel flex-col gap-6" 
                style={{ cursor: project.url ? 'pointer' : 'default' }}
                {...cardProps}
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <h2 className="text-gold" style={{ fontSize: '1.5rem' }}>{project.title}</h2>
                </div>
                
                <div className="text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '1.05rem' }}>
                  {project.description}
                </div>

                {project.url && (
                    <div className="flex items-center gap-2 mt-auto text-gold font-bold" style={{ fontSize: '0.9rem' }}>
                        <LinkIcon size={14} />
                        <span>{project.url.replace(/^https?:\/\//, '')}</span>
                    </div>
                )}
              </CardWrapper>
            );
          })}
        </div>
      )}
    </div>
  );
}
