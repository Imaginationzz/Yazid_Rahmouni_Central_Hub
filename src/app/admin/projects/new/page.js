'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Link as LinkIcon, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url, description }),
      });

      if (res.ok) {
        setMessage('Project added successfully!');
        setTitle('');
        setUrl('');
        setDescription('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save project.');
      }
    } catch (err) {
      setError('An error occurred during save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <div className="flex items-center gap-4 mb-6">
        <Briefcase className="text-gold" size={32} />
        <h1 className="text-gold title-glow">Add New Project</h1>
      </div>

      <form onSubmit={handleSave} className="flex-col gap-6">
        <div className="form-group">
          <label className="text-secondary font-bold">Project Title</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g., E-commerce Platform"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="text-secondary font-bold">Project URL (Optional)</label>
          <div className="flex items-center gap-2">
            <LinkIcon className="text-secondary" size={20} />
            <input 
              type="url" 
              className="form-control" 
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="text-secondary font-bold">Project Description</label>
          <textarea 
            className="form-control" 
            placeholder="Describe the technologies used, your role, and the impact..."
            rows={8}
            style={{ resize: 'vertical' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {error && (
            <div className="flex items-center gap-2" style={{ color: '#ef4444' }}>
                <AlertCircle size={20} />
                <p>{error}</p>
            </div>
        )}

        {message && (
            <div className="flex items-center gap-2" style={{ color: '#10b981' }}>
                <CheckCircle size={20} />
                <p>{message}</p>
            </div>
        )}

        <div className="flex gap-4">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
