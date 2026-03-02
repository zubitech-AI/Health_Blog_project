'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Post {
    id: string; title: string; slug: string; status: string;
    views: number; createdAt: string;
    category: { name: string };
    subcategory?: { name: string } | null;
}

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`/api/posts?${params}`);
        const data = await res.json();
        setPosts(data.posts || []);
        setTotal(data.pagination?.total || 0);
        setLoading(false);
    };

    useEffect(() => { fetchPosts(); }, [page, statusFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post?')) return;
        await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        fetchPosts();
    };

    return (
        <>
            <div className="admin-header">
                <h1>Posts ({total})</h1>
                <Link href="/admin/posts/new" className="btn btn-primary">+ New Post</Link>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['', 'published', 'draft'].map((s) => (
                    <button key={s} className={`category-chip${statusFilter === s ? ' active' : ''}`} onClick={() => { setStatusFilter(s); setPage(1); }}>
                        {s || 'All'}
                    </button>
                ))}
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
                        ) : posts.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No posts found</td></tr>
                        ) : posts.map((post) => (
                            <tr key={post.id}>
                                <td style={{ maxWidth: '300px' }}>
                                    <Link href={`/admin/posts/${post.id}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>{post.title}</Link>
                                </td>
                                <td>{post.category.name}{post.subcategory ? ` / ${post.subcategory.name}` : ''}</td>
                                <td><span className={`status-badge ${post.status}`}>{post.status}</span></td>
                                <td>{post.views}</td>
                                <td>{formatDate(post.createdAt)}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Link href={`/admin/posts/${post.id}`} className="btn btn-secondary btn-sm">Edit</Link>
                                        <button onClick={() => handleDelete(post.id)} className="btn btn-danger btn-sm">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {total > 20 && (
                <div className="pagination" style={{ marginTop: '24px' }}>
                    <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>←</button>
                    <span className="page-btn active">{page}</span>
                    <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total}>→</button>
                </div>
            )}
        </>
    );
}
