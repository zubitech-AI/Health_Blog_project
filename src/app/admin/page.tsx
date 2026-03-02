'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Stats {
    totalPosts: number;
    totalCategories: number;
    totalComments: number;
    pendingComments: number;
    publishedPosts: number;
    draftPosts: number;
    recentPosts: Array<{
        id: string; title: string; slug: string; status: string;
        createdAt: string; views: number;
        category: { name: string };
        _count: { comments: number };
    }>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        fetch('/api/dashboard')
            .then((res) => res.json())
            .then(setStats)
            .catch(console.error);
    }, []);

    if (!stats) return <div>Loading dashboard...</div>;

    return (
        <>
            <div className="admin-header">
                <h1>Dashboard</h1>
                <Link href="/admin/posts/new" className="btn btn-primary">+ New Post</Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">📝</div>
                    <div className="stat-value">{stats.totalPosts}</div>
                    <div className="stat-label">Total Posts</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">📁</div>
                    <div className="stat-value">{stats.totalCategories}</div>
                    <div className="stat-label">Categories</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple">💬</div>
                    <div className="stat-value">{stats.totalComments}</div>
                    <div className="stat-label">Total Comments</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">⏳</div>
                    <div className="stat-value">{stats.pendingComments}</div>
                    <div className="stat-label">Pending Comments</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Published</h3>
                        <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>{stats.publishedPosts}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${(stats.publishedPosts / Math.max(stats.totalPosts, 1)) * 100}%`, background: 'var(--accent)', borderRadius: '3px' }}></div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Drafts</h3>
                        <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f97316' }}>{stats.draftPosts}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${(stats.draftPosts / Math.max(stats.totalPosts, 1)) * 100}%`, background: '#f97316', borderRadius: '3px' }}></div>
                    </div>
                </div>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '32px' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Posts</h3>
                    <Link href="/admin/posts" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>View All →</Link>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Views</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentPosts.map((post) => (
                            <tr key={post.id}>
                                <td><Link href={`/admin/posts/${post.id}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>{post.title}</Link></td>
                                <td>{post.category.name}</td>
                                <td><span className={`status-badge ${post.status}`}>{post.status}</span></td>
                                <td>{post.views}</td>
                                <td>{formatDate(post.createdAt)}</td>
                            </tr>
                        ))}
                        {stats.recentPosts.length === 0 && (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No posts yet. Create your first post!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
