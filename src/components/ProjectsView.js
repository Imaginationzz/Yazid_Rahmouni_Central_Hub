'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Briefcase, Link as LinkIcon, ExternalLink } from 'lucide-react';

export default function ProjectsView({ projects }) {
  const { t } = useLanguage();

  return (
    <div className="flex-col gap-8 animate-fade-up">
      <div className="flex flex-col gap-2 mb-12 animate-fade-up stagger-1">
        <h1 className="text-gold title-glow projects-title" style={{ fontSize: '3.5rem' }}>{t('projects.title')}</h1>
        <p className="text-secondary projects-subtitle" style={{ fontSize: '1.25rem' }}>{t('projects.subtitle')}</p>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel text-center py-16 animate-fade-up stagger-2">
          <Briefcase className="text-secondary mb-4 mx-auto" size={48} />
          <p className="text-secondary">{t('projects.empty')}</p>
        </div>
      ) : (
        <div className="responsive-grid">
          {projects.map((project, index) => {
            const CardWrapper = project.url ? 'a' : 'div';
            const cardProps = project.url ? {
              href: project.url,
              target: '_blank',
              rel: 'noopener noreferrer'
            } : {};

            return (
              <CardWrapper 
                key={project.id} 
                className={`glass-panel flex-col gap-6 animate-fade-up stagger-${(index % 3) + 1}`} 
                style={{ cursor: project.url ? 'pointer' : 'default', padding: '2.5rem' }}
                {...cardProps}
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <h2 className="text-gold" style={{ fontSize: '1.75rem', fontWeight: 800 }}>{project.title}</h2>
                  {project.url && <ExternalLink size={20} className="text-muted" />}
                </div>
                
                <div className="text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem', flex: 1 }}>
                  {project.description}
                </div>

                {project.url && (
                    <div className="flex items-center gap-2 mt-6 p-3 rounded-lg bg-black/20 border border-white/5 text-gold font-bold transition-all" style={{ fontSize: '0.85rem' }}>
                        <LinkIcon size={14} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.url.replace(/^https?:\/\//, '')}</span>
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
