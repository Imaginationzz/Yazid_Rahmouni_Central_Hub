'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Mail, Globe, MapPin, Briefcase, GraduationCap, Award, Code, User, Phone, Link as LinkIcon, ExternalLink, Printer } from 'lucide-react';

export default function CVView({ cv }) {
  const { t, isRTL } = useLanguage();
  const rawText = cv?.raw_text || '';

  const handleShare = () => {
    const url = window.location.href;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!rawText) {
    return (
      <div className="glass-panel text-center py-16 animate-fade-in">
        <p className="text-secondary italic">{t('cv.empty') || 'No Resume content available yet.'}</p>
      </div>
    );
  }

  // Helper...
  const extractHeader = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const emailMatch = text.match(/\b[\w.-]+@[\w.-]+\.\w{2,}\b/i);
    const phoneMatch = text.match(/\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    const githubMatch = text.match(/github\.com\/[\w-]+/i);

    return {
      name: (lines[0] || t('siteTitle')).replace(/<[^>]*>/g, '').trim(),
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : null,
      github: githubMatch ? `https://${githubMatch[0]}` : null,
      location: text.match(/(?:Ottawa|Canada|Algiers|Algeria)/i)?.[0] || 'Algiers, Algeria'
    };
  };

  const headerInfo = extractHeader(rawText);

  // Improved section splitting logic
  // Looks for common titles at the beginning of a line, case-insensitive
  const sectionRegex = /(?:\n|^)\s*(?:<(?:h1|h2|h3|strong|b|span)[^>]*>)?\s*(PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EXPERIENCE|KEY SKILLS|SKILLS|EXPERTISE|PROFILE|SUMMARY|EDUCATION|PROJECTS|CERTIFICATIONS|LANGUAGES|COURSES|ملخص|خبرة|تعليم|مهارات|مشاريع|شهادات|لغات)\b\s*(?:<\/(?:h1|h2|h3|strong|b|span)>)?/i;
  
  const rawSections = rawText.split(sectionRegex).filter(s => s.trim().length > 0);
  const sections = [];
  
  // The split above gives us [ContentBeforeFirstHeader, Header1, Content1, Header2, Content2...]
  let startIdx = 0;
  if (rawSections[0] && !sectionRegex.test('\n' + rawSections[0].toUpperCase())) {
      startIdx = 1;
  }

  for (let i = startIdx; i < rawSections.length; i += 2) {
    if (rawSections[i] && rawSections[i+1]) {
      let title = rawSections[i].trim().toUpperCase();
      let displayTitle = rawSections[i].trim();

      // Force specific titles as requested by user
      if (title.includes('EXPERIENCE')) displayTitle = isRTL ? 'الخبرة المهنية' : 'Professional Experience';
      if (title.includes('SKILLS') || title.includes('EXPERTISE')) displayTitle = isRTL ? 'المهارات الأساسية' : 'Key Skills';
      if (title.includes('PROFILE') || title.includes('SUMMARY')) displayTitle = isRTL ? 'الملخص المهني' : 'Professional Profile';

      sections.push({
        title: displayTitle,
        originalTitle: title,
        content: rawSections[i + 1].trim()
      });
    }
  }

  const getIcon = (title) => {
    const t = title.toUpperCase();
    if (t.includes('EXPERIENCE') || t.includes('خبرة')) return <Briefcase size={22} />;
    if (t.includes('EDUCATION') || t.includes('تعليم')) return <GraduationCap size={22} />;
    if (t.includes('SKILLS') || t.includes('مهارات') || t.includes('EXPERTISE')) return <Code size={22} />;
    if (t.includes('PROJECTS') || t.includes('مشاريع')) return <Globe size={22} />;
    if (t.includes('CERTIFICATIONS') || t.includes('شهادات') || t.includes('COURSES')) return <Award size={22} />;
    if (t.includes('PROFILE') || t.includes('SUMMARY') || t.includes('ملخص')) return <User size={22} />;
    return <Code size={22} />;
  };

  return (
    <div className="flex-col gap-8 animate-fade-in print-container cv-container">
      {/* Print/Share Actions */}
      <div className="flex justify-end gap-3 no-print mb-4 flex-wrap">
          <button onClick={handleShare} className="btn hover-scale" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.4rem' }}>
              <Globe size={14} /> Share
          </button>
          <button onClick={handlePrint} className="btn hover-scale" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.4rem' }}>
              <Printer size={14} /> Print Resume
          </button>
      </div>

      {/* Header Profile Section */}
      <div className="glass-panel cv-header-panel">
        <div className="flex-col items-center gap-2">
            <h1 className="text-gold title-glow cv-name">{headerInfo.name}</h1>
            <p className="text-secondary cv-subtitle" style={{ textAlign: 'center', opacity: 0.8, fontWeight: 600 }}>
                {cv?.subtitle || t('cv.subtitle') || 'Professional Portfolio'}
            </p>
        </div>
        
        <div className="cv-contact-info">
          {headerInfo.email && (
            <div className="flex items-center gap-2 px-2">
              <Mail size={18} className="text-gold" /> 
              <span>{headerInfo.email}</span>
            </div>
          )}
          {headerInfo.phone && (
            <div className="flex items-center gap-2 px-2">
              <Phone size={18} className="text-gold" /> 
              <span>{headerInfo.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-2">
            <MapPin size={18} className="text-gold" /> 
            <span>{headerInfo.location}</span>
          </div>
          {headerInfo.linkedin && (
              <a href={headerInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 hover:text-gold transition-all duration-300">
                  <LinkIcon size={18} className="text-gold" /> 
                  <span>LinkedIn</span>
              </a>
          )}
          {headerInfo.github && (
              <a href={headerInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 hover:text-gold transition-all duration-300">
                  <ExternalLink size={18} className="text-gold" /> 
                  <span>GitHub</span>
              </a>
          )}
        </div>
      </div>

      {/* Main Content: Two Columns */}
      <div className="responsive-grid">
        {/* Main Column */}
        <div className="flex-col gap-8">
          {sections.filter(s => !['SKILLS', 'EXPERTISE', 'KEY SKILLS', 'مهارات', 'LANGUAGES', 'لغات'].includes(s.originalTitle)).map((section, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '2.5rem' }}>
              <h2 className="text-gold mb-6 flex items-center gap-3" style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem', unicodeBidi: 'plaintext', textAlign: 'start' }}>
                {getIcon(section.title)}
                {section.title}
              </h2>
              <div 
                className="rich-text-content"
                style={{ lineHeight: '1.8', color: 'var(--text-secondary)', unicodeBidi: 'plaintext', textAlign: 'start', fontSize: '1.05rem' }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>

        {/* Sidebar Column */}
        <div className="flex-col gap-8">
           {sections.filter(s => ['SKILLS', 'EXPERTISE', 'KEY SKILLS', 'مهارات', 'LANGUAGES', 'لغات'].includes(s.originalTitle)).map((section, idx) => {
            const isSkills = section.originalTitle.includes('SKILLS') || section.originalTitle.includes('مهارات') || section.originalTitle.includes('EXPERTISE');
            // Try to split skills into individual tags if it's the skills section
            const skillTags = isSkills ? section.content
              .replace(/^(Technical Skills|Skills|Expertise):\s*/i, '') // Remove prefix labels
              .split(/[,\n•|]+/)
              .map(s => s.trim())
              .filter(s => s.length > 0) : [];

            const tagColors = [
              'rgba(212, 175, 55, 0.1)', // Gold
              'rgba(56, 189, 248, 0.1)', // Blue
              'rgba(16, 185, 129, 0.1)', // Green
              'rgba(168, 85, 247, 0.1)', // Purple
            ];

            return (
              <div key={idx} className="glass-panel" style={{ padding: '2rem', background: 'rgba(212, 175, 55, 0.03)' }}>
                <h2 className="text-gold mb-4 flex items-center gap-3" style={{ fontSize: '1.5rem', unicodeBidi: 'plaintext', textAlign: 'start' }}>
                  {getIcon(section.title)}
                  {section.title}
                </h2>
                
                {isSkills && skillTags.length > 0 ? (
                  <div className="skill-tag-grid">
                    {skillTags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        style={{ 
                          padding: '0.25rem 0.4rem', 
                          fontSize: '0.72rem', 
                          backgroundColor: tagColors[tIdx % tagColors.length],
                          border: `1px solid ${tagColors[tIdx % tagColors.length].replace('0.1', '0.3')}`,
                          color: 'var(--text-primary)',
                          borderRadius: '12px',
                          fontWeight: '500',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block'
                        }}
                        title={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: 'var(--text-secondary)', unicodeBidi: 'plaintext', textAlign: 'start', fontSize: '0.95rem' }}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </div>
            );
          })}

          {/* Quick Contact Box if not in main */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '3px solid var(--gold-accent)' }}>
              <h3 className="text-gold mb-4">{isRTL ? 'معلومات التواصل' : 'Contact Details'}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }} className="text-secondary">
                  {headerInfo.email && <li><strong>Email:</strong> {headerInfo.email}</li>}
                  {headerInfo.phone && <li><strong>Phone:</strong> {headerInfo.phone}</li>}
                  <li><strong>Location:</strong> {headerInfo.location}</li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal placeholder
function FileText({ size }) {
    return <Code size={size} />
}
