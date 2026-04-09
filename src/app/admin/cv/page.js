'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, FileText, CheckCircle, AlertCircle, Loader2, Upload, Save } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

export default function ManageCV() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentCV, setCurrentCV] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchCV() {
      try {
        const res = await fetch('/api/admin/cv');
        if (res.ok) {
          const data = await res.json();
          setCurrentCV(data);
          setEditedText(data.raw_text || '');
          setSubtitle(data.subtitle || '');
        }
      } catch (err) {
        console.error('Failed to fetch CV info');
      }
    }
    fetchCV();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/cv', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setMessage('CV uploaded and parsed successfully!');
        setFile(null);
        setEditedText(data.text || '');
        // If a subtitle was already set, keep it, or let the user re-save
        setCurrentCV(prev => ({ ...prev, raw_text: data.text }));
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to upload and parse CV.');
      }
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveText = async () => {
    setSaveLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/admin/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editedText, subtitle: subtitle }),
      });

      if (res.ok) {
        setMessage('CV updated successfully!');
        setCurrentCV(prev => ({ ...prev, raw_text: editedText, subtitle: subtitle }));
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save edits.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <User className="text-gold" size={32} />
        <h1 className="text-gold title-glow">Manage My CV</h1>
      </div>

      <p className="text-secondary mb-8">
        You can upload a file to extract its text, or manually edit the content below to refine how it appears on your public portfolio.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        {/* Upload Side */}
        <section className="flex-col gap-6">
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="text-gold mb-4 flex items-center gap-2"><Upload size={20} /> Upload New Document</h3>
            <form onSubmit={handleUpload} className="flex-col gap-6">
              <div 
                className="glass-panel text-center" 
                style={{ 
                  border: '2px dashed var(--panel-border)', 
                  padding: '2rem',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(212, 175, 55, 0.02)',
                  transition: 'background 0.3s'
                }}
                onClick={() => document.getElementById('cv-upload').click()}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.02)'}
              >
                <input 
                  id="cv-upload"
                  type="file" 
                  accept=".docx,.pdf" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="text-gold" size={40} />
                    <p className="text-primary font-bold" style={{ fontSize: '0.9rem' }}>{file.name}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-secondary" size={40} />
                    <p className="text-primary font-bold">Select CV File</p>
                    <p className="text-secondary" style={{ fontSize: '0.8rem' }}>.docx or .pdf</p>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary ${loading || !file ? 'opacity-50' : ''}`}
                disabled={loading || !file}
                style={{ width: '100%', gap: '0.5rem', justifyContent: 'center' }}
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /> Parsing...</>
                ) : (
                  <><Upload size={20} /> Upload & Replace Text</>
                )}
              </button>
            </form>
          </div>

          {(error || message) && (
            <div className={`glass-panel flex items-center gap-3`} style={{ 
                padding: '1rem', 
                backgroundColor: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${error ? '#ef4444' : '#10b981'}`
            }}>
              {error ? <AlertCircle className="text-red-500" size={20} /> : <CheckCircle className="text-green-500" size={20} />}
              <p style={{ fontSize: '0.9rem', color: error ? '#ef4444' : '#10b981' }}>{error || message}</p>
            </div>
          )}
        </section>

        {/* Edit Side */}
        <section className="flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gold flex items-center gap-2"><FileText size={20} /> CV Content Editor</h3>
            <button 
              onClick={handleSaveText}
              disabled={saveLoading || !editedText}
              className={`btn btn-primary ${saveLoading || !editedText ? 'opacity-50' : ''}`}
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', gap: '0.5rem' }}
            >
              {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Changes
            </button>
          </div>

          <div className="flex-col gap-2 mb-4">
            <label className="text-gold" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Professional Title (e.g. Full Stack Developer)</label>
            <input 
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. FULL STACK DEVELOPER & TECHNICAL WRITER"
              className="glass-panel"
              style={{
                width: '100%',
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text-primary)',
                padding: '0.8rem 1rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
          
          <RichTextEditor 
            value={editedText}
            onChange={(newContent) => setEditedText(newContent)}
            placeholder="Write or paste your CV content here. Use Headers (PROFESSIONAL EXPERIENCE, SKILLS, etc.) to trigger the two-column layout..."
          />
          <p className="text-secondary" style={{ fontSize: '0.8rem' }}>
            Tip: Use clear headings (e.g. WORK EXPERIENCE, SKILLS) for better automated organizing on the public page.
          </p>
        </section>
      </div>
    </div>
  );
}
