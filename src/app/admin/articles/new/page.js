'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenTool, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

export default function NewArticle() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
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
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category }),
      });

      if (res.ok) {
        setMessage('Article saved successfully!');
        setTitle('');
        setContent('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save article.');
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
        <PenTool className="text-gold" size={32} />
        <h1 className="text-gold title-glow">Write New Article</h1>
      </div>

      <form onSubmit={handleSave} className="flex-col gap-6">
        <div className="form-group">
          <label className="text-secondary font-bold">Article Title</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter a descriptive title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="text-secondary font-bold">Category</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g., Politics, Philosophy, Economics..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-secondary font-bold">Article Content</label>
          <RichTextEditor 
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
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
                Save Article
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
