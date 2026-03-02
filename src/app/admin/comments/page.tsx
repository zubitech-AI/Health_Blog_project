'use client';
import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

interface Comment {
    id: string; name: string; email: string; content: string;
    status: string; createdAt: string;
    post: { title: string; slug: string };
}

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`/api/comments?${params}`);
        const data = await res.json();
        setComments(data.comments || []);
        setLoading(false);
    };

    useEffect(() => { fetchComments(); }, [statusFilter]);

    const handleAction = async (id: string, action: 'approve' | 'delete') => {
        if (action === 'delete' && !confirm('Delete this comment?')) return;
        if (action === 'approve') {
            await fetch(`/api/comments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' }),
            });
        } else {
            await fetch(`/api/comments/${id}`, { method: 'DELETE' });
        }
        fetchComments();
    };

    return (
        <>
            <div className="admin-header">
                <h1>Comments</h1>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['', 'pending', 'approved'].map((s) => (
                    <button key={s} className={`category-chip${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
                        {s || 'All'}
                    </button>
                ))}
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr><th>Author</th><th>Comment</th><th>Post</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
                        ) : comments.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No comments</td></tr>
                        ) : comments.map((c) => (
                            <tr key={c.id}>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{c.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.email}</div>
                                </td>
                                <td style={{ maxWidth: '280px' }}>{c.content.substring(0, 100)}{c.content.length > 100 ? '...' : ''}</td>
                                <td style={{ fontSize: '0.85rem' }}>{c.post.title}</td>
                                <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                                <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {c.status === 'pending' && (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleAction(c.id, 'approve')}>Approve</button>
                                        )}
                                        <button className="btn btn-danger btn-sm" onClick={() => handleAction(c.id, 'delete')}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
