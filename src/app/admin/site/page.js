'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, Loader2, Globe } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditSiteContent() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('en');

  // Default values from the current hardcoded translations
  const defaults = {
    site_title_en: 'Yazid Rahmouni',
    site_title_ar: 'يزيد رحموني',
    site_subtitle_en: 'Personal Portal',
    site_subtitle_ar: 'البوابة الشخصية',
    hero_welcome_en: 'Welcome to my',
    hero_welcome_ar: 'مرحباً بكم في',
    hero_portal_en: 'Portal',
    hero_portal_ar: 'بوابتي',
    hero_description_en: "I'm Yazid Rahmouni. This is my central hub where I showcase my articles, professional CV, and web projects.",
    hero_description_ar: 'أنا يزيد رحموني. هذا هو مركزي الرئيسي حيث أعرض مقالاتي وسيرتي الذاتية المهنية ومشاريع الويب الخاصة بي.',
    hero_btn1_en: 'Read My Articles',
    hero_btn1_ar: 'اقرأ مقالاتي',
    hero_btn2_en: 'View My CV',
    hero_btn2_ar: 'عرض السيرة الذاتية',
    card1_title_en: 'Latest Articles',
    card1_title_ar: 'أحدث المقالات',
    card1_text_en: 'Exploring technology, life, and innovation.',
    card1_text_ar: 'استكشاف التكنولوجيا والحياة والابتكار.',
    card1_link_en: 'Browse Articles',
    card1_link_ar: 'تصفح المقالات',
    card2_title_en: 'Web Projects',
    card2_title_ar: 'مشاريع الويب',
    card2_text_en: 'Innovative solutions and creative digital experiences.',
    card2_text_ar: 'حلول مبتكرة وتجارب رقمية إبداعية.',
    card2_link_en: 'See Projects',
    card2_link_ar: 'مشاهدة المشاريع',
    card3_title_en: 'My Skills',
    card3_title_ar: 'مهاراتي',
    card3_text_en: 'Full Stack Developer & Technical Writer',
    card3_text_ar: 'مطور ويب كامل وكاتب تقني',
    card3_link_en: 'View Skills',
    card3_link_ar: 'عرض المهارات',
    footer_text_en: '',
    footer_text_ar: '',
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          // Merge: saved values override defaults
          setSettings({ ...defaults, ...data });
        } else {
          setSettings({ ...defaults });
        }
      } catch (err) {
        console.error('Failed to fetch settings');
        setSettings({ ...defaults });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('All settings saved successfully!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save settings.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center" style={{ paddingTop: '5rem' }}>
      <Loader2 className="animate-spin text-gold" size={48} />
    </div>
  );

  // Helper for bilingual fields
  const renderField = (label, keyEn, keyAr, type = 'input') => {
    const key = activeTab === 'en' ? keyEn : keyAr;
    const value = settings[key] || '';

    if (type === 'richtext') {
      return (
        <div className="form-group">
          <label className="text-secondary font-bold" style={{ fontSize: '0.9rem' }}>{label}</label>
          <RichTextEditor value={value} onChange={(val) => updateSetting(key, val)} />
        </div>
      );
    }

    return (
      <div className="form-group">
        <label className="text-secondary font-bold" style={{ fontSize: '0.9rem' }}>{label}</label>
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(e) => updateSetting(key, e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}...`}
          style={activeTab === 'ar' ? { textAlign: 'right', direction: 'rtl' } : {}}
        />
      </div>
    );
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Settings className="text-gold" size={32} />
          <h1 className="text-gold title-glow">Edit Site Content</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn btn-primary ${saving ? 'opacity-50' : ''}`}
          style={{ gap: '0.5rem' }}
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save All Changes
        </button>
      </div>

      {/* Language Toggle */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('en')}
          className={`filter-chip ${activeTab === 'en' ? 'active' : ''}`}
          style={{ gap: '0.4rem' }}
        >
          <Globe size={14} /> English
        </button>
        <button
          onClick={() => setActiveTab('ar')}
          className={`filter-chip ${activeTab === 'ar' ? 'active' : ''}`}
          style={{ gap: '0.4rem' }}
        >
          <Globe size={14} /> العربية
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 mb-6" style={{ color: '#ef4444' }}>
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}
      {message && (
        <div className="flex items-center gap-2 mb-6" style={{ color: '#10b981' }}>
          <CheckCircle size={20} />
          <p>{message}</p>
        </div>
      )}

      {/* ─── Navbar / Branding ─── */}
      <div className="glass-panel mb-8" style={{ padding: '2rem' }}>
        <h3 className="text-gold mb-4" style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.5rem' }}>
          🏷️ Site Branding
        </h3>
        {renderField('Site Title', 'site_title_en', 'site_title_ar')}
        {renderField('Site Subtitle', 'site_subtitle_en', 'site_subtitle_ar')}
      </div>

      {/* ─── Hero Section ─── */}
      <div className="glass-panel mb-8" style={{ padding: '2rem' }}>
        <h3 className="text-gold mb-4" style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.5rem' }}>
          🏠 Homepage Hero
        </h3>
        {renderField('Welcome Line', 'hero_welcome_en', 'hero_welcome_ar')}
        {renderField('Portal Word', 'hero_portal_en', 'hero_portal_ar')}
        {renderField('Hero Description', 'hero_description_en', 'hero_description_ar', 'richtext')}
        {renderField('Button 1 Text (Articles)', 'hero_btn1_en', 'hero_btn1_ar')}
        {renderField('Button 2 Text (CV)', 'hero_btn2_en', 'hero_btn2_ar')}
      </div>

      {/* ─── Section Cards ─── */}
      <div className="glass-panel mb-8" style={{ padding: '2rem' }}>
        <h3 className="text-gold mb-4" style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.5rem' }}>
          📋 Homepage Cards
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            <p className="text-gold mb-2" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Card 1 — Articles</p>
            {renderField('Title', 'card1_title_en', 'card1_title_ar')}
            {renderField('Text', 'card1_text_en', 'card1_text_ar')}
            {renderField('Link Text', 'card1_link_en', 'card1_link_ar')}
          </div>
          <div>
            <p className="text-gold mb-2" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Card 2 — Projects</p>
            {renderField('Title', 'card2_title_en', 'card2_title_ar')}
            {renderField('Text', 'card2_text_en', 'card2_text_ar')}
            {renderField('Link Text', 'card2_link_en', 'card2_link_ar')}
          </div>
          <div>
            <p className="text-gold mb-2" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Card 3 — Skills</p>
            {renderField('Title', 'card3_title_en', 'card3_title_ar')}
            {renderField('Text', 'card3_text_en', 'card3_text_ar')}
            {renderField('Link Text', 'card3_link_en', 'card3_link_ar')}
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className="glass-panel mb-8" style={{ padding: '2rem' }}>
        <h3 className="text-gold mb-4" style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.5rem' }}>
          📝 Footer
        </h3>
        {renderField('Footer Text', 'footer_text_en', 'footer_text_ar')}
      </div>
    </div>
  );
}
