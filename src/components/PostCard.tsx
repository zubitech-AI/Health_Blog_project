import Link from 'next/link';
import { formatDate, generateExcerpt, getReadingTime } from '@/lib/utils';

interface PostCardProps {
    post: {
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt?: string;
        featuredImage?: string | null;
        category: { name: string; slug: string };
        subcategory?: { name: string; slug: string } | null;
        createdAt: string;
        views: number;
        _count?: { comments: number };
    };
}

export default function PostCard({ post }: PostCardProps) {
    const postUrl = post.subcategory
        ? `/${post.category.slug}/${post.subcategory.slug}/${post.slug}`
        : `/${post.category.slug}/${post.slug}`;

    return (
        <article className="post-card">
            <Link href={postUrl}>
                <div className="post-card-image">
                    {post.featuredImage ? (
                        <img src={post.featuredImage} alt={post.title} loading="lazy" />
                    ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0ea5e9, #06d6a0)', color: 'white', fontSize: '2.5rem' }}>
                            🏥
                        </div>
                    )}
                    <span className="post-card-badge">{post.category.name}</span>
                </div>
            </Link>
            <div className="post-card-body">
                <div className="post-card-meta">
                    <span>📅 {formatDate(post.createdAt)}</span>
                    <span>👁 {post.views} views</span>
                </div>
                <Link href={postUrl}>
                    <h3 className="post-card-title">{post.title}</h3>
                </Link>
                <p className="post-card-excerpt">
                    {post.excerpt || generateExcerpt(post.content)}
                </p>
                <div className="post-card-footer">
                    <Link href={postUrl} className="read-more">
                        Read More →
                    </Link>
                    <span className="reading-time">
                        {getReadingTime(post.content)} min read
                    </span>
                </div>
            </div>
        </article>
    );
}
