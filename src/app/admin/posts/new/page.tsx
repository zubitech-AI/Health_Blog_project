'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { slugify } from '@/lib/utils';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface Category {
    id: string; name: string; slug: string;
    children?: Category[];
}

export default function NewPostPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
    const [form, setForm] = useState({
        title: '', slug: '', content: '', excerpt: '',
        featuredImage: '', categoryId: '', subcategoryId: '',
        metaTitle: '', metaDescription: '', metaKeywords: '',
        status: 'draft', commentsEnabled: true,
    });

    useEffect(() => {
        fetch('/api/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []));
    }, []);

    const selectedCategory = categories.find(c => c.id === form.categoryId);

    const updateField = useCallback((field: string, value: string | boolean) => {
        setForm(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'title' && !prev.slug) {
                updated.slug = slugify(value as string);
            }
            if (field === 'categoryId') {
                updated.subcategoryId = '';
            }
            return updated;
        });
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
            const data = await res.json();
            updateField('featuredImage', data.url);
        }
    };

    const handleSave = async (status?: string) => {
        if (!form.title || !form.categoryId || !form.content) {
            setToast({ message: 'Title, category, and content are required', type: 'error' });
            return;
        }
        setSaving(true);
        const payload = { ...form, status: status || form.status, slug: form.slug || slugify(form.title) };
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setToast({ message: 'Post created!', type: 'success' });
                setTimeout(() => router.push('/admin/posts'), 1000);
            } else {
                setToast({ message: 'Failed to create post', type: 'error' });
            }
        } catch {
            setToast({ message: 'Error saving post', type: 'error' });
        }
        setSaving(false);
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            [{ align: [] }],
            ['clean'],
        ],
    };

    return (
        <>
            {toast && (
                <div className={`toast ${toast.type}`} onClick={() => setToast(null)}>
                    {toast.message}
                </div>
            )}

            <div className="admin-header">
                <h1>New Post</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={() => handleSave('draft')} disabled={saving}>Save Draft</button>
                    <button className="btn btn-primary" onClick={() => handleSave('published')} disabled={saving}>Publish</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
                <div>
                    <div className="stat-card" style={{ marginBottom: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input className="form-input" value={form.title} onChange={e => updateField('title', e.target.value)} placeholder="Post title..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Slug</label>
                            <input className="form-input" value={form.slug} onChange={e => updateField('slug', e.target.value)} placeholder="post-url-slug" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Excerpt</label>
                            <textarea className="form-textarea" value={form.excerpt} onChange={e => updateField('excerpt', e.target.value)} placeholder="Brief summary..." rows={2} />
                        </div>
                    </div>

                    <div className="stat-card">
                        <label className="form-label">Content</label>
                        <ReactQuill theme="snow" value={form.content} onChange={v => updateField('content', v)} modules={quillModules} style={{ minHeight: '400px' }} />
                    </div>
                </div>

                <div>
                    <div className="stat-card" style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Publish Settings</h3>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-select" value={form.categoryId} onChange={e => updateField('categoryId', e.target.value)}>
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        {selectedCategory?.children && selectedCategory.children.length > 0 && (
                            <div className="form-group">
                                <label className="form-label">Subcategory</label>
                                <select className="form-select" value={form.subcategoryId} onChange={e => updateField('subcategoryId', e.target.value)}>
                                    <option value="">Select subcategory</option>
                                    {selectedCategory.children.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={form.status} onChange={e => updateField('status', e.target.value)}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.commentsEnabled} onChange={e => updateField('commentsEnabled', e.target.checked)} />
                                <span className="form-label" style={{ margin: 0 }}>Enable Comments</span>
                            </label>
                        </div>
                    </div>

                    <div className="stat-card" style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Featured Image</h3>
                        {form.featuredImage && (
                            <div style={{ marginBottom: '12px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={form.featuredImage} alt="Featured" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" />
                    </div>

                    <div className="stat-card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>SEO Settings</h3>
                        <div className="form-group">
                            <label className="form-label">Meta Title</label>
                            <input className="form-input" value={form.metaTitle} onChange={e => updateField('metaTitle', e.target.value)} placeholder="SEO title..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Meta Description</label>
                            <textarea className="form-textarea" value={form.metaDescription} onChange={e => updateField('metaDescription', e.target.value)} placeholder="SEO description..." rows={3} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Meta Keywords</label>
                            <input className="form-input" value={form.metaKeywords} onChange={e => updateField('metaKeywords', e.target.value)} placeholder="keyword1, keyword2, ..." />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
