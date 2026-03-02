'use client';
import { useState, useEffect } from 'react';
import { slugify } from '@/lib/utils';

interface Category {
    id: string; name: string; slug: string; description?: string;
    parentId?: string | null;
    children?: Category[];
    _count?: { posts: number };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', slug: '', description: '', parentId: '' });
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSave = async () => {
        if (!form.name) return;
        const slug = form.slug || slugify(form.name);
        const payload = { ...form, slug };

        try {
            const url = editId ? `/api/categories/${editId}` : '/api/categories';
            const method = editId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setToast({ message: editId ? 'Updated!' : 'Created!', type: 'success' });
                resetForm();
                fetchCategories();
            }
        } catch {
            setToast({ message: 'Error', type: 'error' });
        }
    };

    const handleEdit = (cat: Category) => {
        setEditId(cat.id);
        setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', parentId: cat.parentId || '' });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this category and all its subcategories?')) return;
        await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        fetchCategories();
    };

    const resetForm = () => {
        setForm({ name: '', slug: '', description: '', parentId: '' });
        setEditId(null);
        setShowForm(false);
    };

    return (
        <>
            {toast && <div className={`toast ${toast.type}`} onClick={() => setToast(null)}>{toast.message}</div>}

            <div className="admin-header">
                <h1>Categories</h1>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                    {showForm ? 'Cancel' : '+ Add Category'}
                </button>
            </div>

            {showForm && (
                <div className="stat-card" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
                        {editId ? 'Edit Category' : 'New Category'}
                    </h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: slugify(e.target.value) }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Slug</label>
                            <input className="form-input" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Parent Category (optional)</label>
                            <select className="form-select" value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}>
                                <option value="">None (Top Level)</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Update' : 'Create'}</button>
                </div>
            )}

            {categories.map((cat) => (
                <div key={cat.id} className="stat-card" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: cat.children?.length ? '16px' : '0' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{cat.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/{cat.slug} • {cat._count?.posts || 0} posts</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(cat)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>Delete</button>
                        </div>
                    </div>
                    {cat.children && cat.children.length > 0 && (
                        <div style={{ paddingLeft: '20px', borderLeft: '2px solid var(--border)' }}>
                            {cat.children.map((sub) => (
                                <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                                    <div>
                                        <span style={{ fontWeight: 500 }}>{sub.name}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>/{sub.slug}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit({ ...sub, parentId: cat.id })}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sub.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}
