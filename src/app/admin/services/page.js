'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Trash2, Edit2, Save, X, ExternalLink, MoveUp, MoveDown } from 'lucide-react';

export default function ManageServices() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    icon: 'Shield',
    url: '',
    order_index: 0
  });
  const [loading, setLoading] = useState(true);

  const icons = ['Shield', 'Code', 'Book', 'Globe', 'Lock', 'Cpu', 'Terminal', 'Search', 'PenTool', 'Layers'];

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const res = await fetch('/api/admin/services');
    if (res.ok) {
      const data = await res.json();
      setServices(data);
    }
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const payload = editingId ? { ...formData, id: editingId } : formData;

    const res = await fetch('/api/admin/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setEditingId(null);
      setFormData({
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
        icon: 'Shield',
        url: '',
        order_index: services.length
      });
      fetchServices();
    }
  };

  const deleteService = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchServices();
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      title_en: service.title_en,
      title_ar: service.title_ar,
      description_en: service.description_en,
      description_ar: service.description_ar,
      icon: service.icon || 'Shield',
      url: service.url || '',
      order_index: service.order_index || 0
    });
  };

  const seedInitial = async () => {
    const initial = [
      {
        title_en: 'Book Publisher',
        title_ar: 'ناشر كتب',
        description_en: 'Professional book publishing and digital distribution.',
        description_ar: 'نشر الكتب الاحترافي والتوزيع الرقمي.',
        icon: 'Book',
        url: 'imaginationzz.com',
        order_index: 0
      },
      {
        title_en: 'Cybersecurity Analyst',
        title_ar: 'محلل أمن سيبراني',
        description_en: 'Security auditing, threat analysis, and digital protection.',
        description_ar: 'تدقيق الأمان، تحليل التهديدات، والحماية الرقمية.',
        icon: 'Shield',
        url: '',
        order_index: 1
      },
      {
        title_en: 'Web App Developer',
        title_ar: 'مطور تطبيقات ويب',
        description_en: 'Modern, scalable web applications and portal solutions.',
        description_ar: 'تطبيقات ويب حديثة وقابلة للتوسع وحلول بوابات.',
        icon: 'Code',
        url: '',
        order_index: 2
      }
    ];

    for (const service of initial) {
      await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
    }
    fetchServices();
  };

  return (
    <div className="glass-panel">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gold title-glow">{t('admin.manageServices')}</h1>
        {services.length === 0 && !loading && (
          <button onClick={seedInitial} className="btn btn-primary">
            Seed Initial Services
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="glass-panel mb-8 p-6" style={{ background: 'rgba(212,175,55,0.05)' }}>
        <h3 className="mb-4 text-gold flex items-center gap-2">
          {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
          {editingId ? 'Edit Service' : 'Add New Service'}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="flex-col gap-4">
            <input 
              type="text" 
              placeholder="Title (English)" 
              value={formData.title_en}
              onChange={e => setFormData({...formData, title_en: e.target.value})}
              required
            />
            <textarea 
              placeholder="Description (English)" 
              value={formData.description_en}
              onChange={e => setFormData({...formData, description_en: e.target.value})}
              required
              rows="3"
            />
          </div>
          <div className="flex-col gap-4" dir="rtl">
            <input 
              type="text" 
              placeholder="العنوان (العربية)" 
              value={formData.title_ar}
              onChange={e => setFormData({...formData, title_ar: e.target.value})}
              required
            />
            <textarea 
              placeholder="الوصف (العربية)" 
              value={formData.description_ar}
              onChange={e => setFormData({...formData, description_ar: e.target.value})}
              required
              rows="3"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4 items-center">
          <div className="flex-col flex-1">
            <label className="text-secondary text-sm mb-1">Icon</label>
            <select 
              value={formData.icon} 
              onChange={e => setFormData({...formData, icon: e.target.value})}
              className="w-full"
            >
              {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
          <div className="flex-col flex-1">
            <label className="text-secondary text-sm mb-1">Website URL (Optional)</label>
            <input 
              type="text" 
              placeholder="example.com" 
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
            />
          </div>
          <div className="flex-col" style={{ width: '100px' }}>
            <label className="text-secondary text-sm mb-1">Order</label>
            <input 
              type="number" 
              value={formData.order_index}
              onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary flex-1 gap-2">
            <Save size={18} /> {editingId ? 'Update Service' : 'Create Service'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ title_en: '', title_ar: '', description_en: '', description_ar: '', icon: 'Shield', url: '', order_index: services.length }); }} className="btn gap-2">
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex-col gap-4">
        {loading ? (
          <p className="text-center text-secondary py-10">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-secondary py-10">No services found. Add one above!</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="glass-panel p-4 flex justify-between items-center hover-lift">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full" style={{ background: 'rgba(212,175,55,0.1)' }}>
                  {(() => {
                    const Icon = Plus; // Fallback
                    const DynamicIcon = require('lucide-react')[service.icon] || Plus;
                    return <DynamicIcon size={24} className="text-gold" />;
                  })()}
                </div>
                <div>
                  <h4 className="text-white font-bold">{service.title_en} <small className="text-secondary">/ {service.title_ar}</small></h4>
                  <p className="text-secondary text-sm truncate" style={{ maxWidth: '300px' }}>{service.description_en}</p>
                  {service.url && <span className="text-gold text-xs flex items-center gap-1 mt-1"><ExternalLink size={12} /> {service.url}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(service)} className="btn p-2" title="Edit"><Edit2 size={16} /></button>
                <button onClick={() => deleteService(service.id)} className="btn p-2" title="Delete" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
