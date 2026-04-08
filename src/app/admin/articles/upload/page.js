'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function UploadArticles() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/articles/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ count: data.count });
        setFile(null);
        // Reset file input
        e.target.reset();
      } else {
        setError(data.error || 'Failed to upload and parse articles.');
      }
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <div className="flex items-center gap-4 mb-6">
        <Upload className="text-gold" size={32} />
        <h1 className="text-gold title-glow">Batch Upload Articles</h1>
      </div>

      <p className="text-secondary mb-8">
        Upload a Word document (.docx) containing multiple articles. 
        Each article should start with a number (e.g., "1.", "2.", etc.). 
        The system will automatically split them and save them as separate entries.
      </p>

      <form onSubmit={handleUpload} className="flex-col gap-6">
        <div 
          className="glass-panel text-center" 
          style={{ 
            border: '2px dashed var(--panel-border)', 
            padding: '3rem',
            cursor: 'pointer',
            backgroundColor: 'rgba(212, 175, 55, 0.02)'
          }}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input 
            id="file-upload"
            type="file" 
            accept=".docx" 
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="text-gold" size={48} />
              <p className="text-primary font-bold">{file.name}</p>
              <p className="text-secondary">Click to change file</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="text-secondary" size={48} />
              <p className="text-primary font-bold">Click to select Word file</p>
              <p className="text-secondary">Supports .docx files only</p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2" style={{ color: '#ef4444', marginTop: '1rem' }}>
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="flex items-center gap-2" style={{ color: '#10b981', marginTop: '1rem' }}>
            <CheckCircle size={20} />
            <p>Successfully extracted and saved {result.count} articles!</p>
          </div>
        )}

        <div className="mt-8">
          <button 
            type="submit" 
            className={`btn btn-primary ${loading || !file ? 'opacity-50' : ''}`}
            disabled={loading || !file}
            style={{ width: '100%', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              'Start Extraction'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
