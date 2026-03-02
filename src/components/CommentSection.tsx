'use client';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';

interface Comment {
    id: string;
    name: string;
    content: string;
    createdAt: string;
}

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, name, email, content }),
            });
            if (res.ok) {
                setStatus('success');
                setName(''); setEmail(''); setContent('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', marginBottom: '24px' }}>
                Comments ({comments.length})
            </h3>

            {comments.map((c) => (
                <div key={c.id} className="comment-card">
                    <div className="comment-header">
                        <span className="comment-author">{c.name}</span>
                        <span className="comment-date">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="comment-body">{c.content}</p>
                </div>
            ))}

            <div className="comment-form">
                <h4 style={{ marginBottom: '16px' }}>Leave a Comment</h4>
                {status === 'success' && (
                    <div style={{ background: 'rgba(6,214,160,0.1)', color: '#05b384', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                        Your comment has been submitted and is awaiting approval.
                    </div>
                )}
                {status === 'error' && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                        Failed to submit comment. Please try again.
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <input className="form-input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <input className="form-input" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <textarea className="form-textarea" placeholder="Your comment..." value={content} onChange={(e) => setContent(e.target.value)} required rows={4} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Submitting...' : 'Submit Comment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
