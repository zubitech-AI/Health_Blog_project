'use client';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import CommentSection from '@/components/CommentSection';
import { formatDate, getReadingTime } from '@/lib/utils';

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    featuredImage?: string | null;
    category: { name: string; slug: string; parent?: { name: string; slug: string } | null };
    subcategory?: { name: string; slug: string } | null;
    metaKeywords?: string | null;
    views: number;
    commentsEnabled: boolean;
    createdAt: string;
    updatedAt: string;
    comments: Array<{ id: string; name: string; content: string; createdAt: string }>;
}

export default function PostPageContent({ post }: { post: Post }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const catSlug = post.category.parent?.slug || post.category.slug;
    const postUrl = post.subcategory
        ? `${siteUrl}/${catSlug}/${post.subcategory.slug}/${post.slug}`
        : `${siteUrl}/${post.category.slug}/${post.slug}`;

    return (
        <>
            <section className="article-header">
                <div className="article-header-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">/</span>
                        {post.category.parent ? (
                            <>
                                <Link href={`/${post.category.parent.slug}`}>{post.category.parent.name}</Link>
                                <span className="breadcrumb-sep">/</span>
                                <Link href={`/${post.category.parent.slug}/${post.category.slug}`}>{post.category.name}</Link>
                            </>
                        ) : (
                            <Link href={`/${post.category.slug}`}>{post.category.name}</Link>
                        )}
                        {post.subcategory && (
                            <>
                                <span className="breadcrumb-sep">/</span>
                                <Link href={`/${catSlug}/${post.subcategory.slug}`}>{post.subcategory.name}</Link>
                            </>
                        )}
                    </div>
                    <h1 className="article-title">{post.title}</h1>
                    <div className="article-meta">
                        <span className="article-meta-item">📅 {formatDate(post.createdAt)}</span>
                        <span className="article-meta-item">⏱ {getReadingTime(post.content)} min read</span>
                        <span className="article-meta-item">👁 {post.views} views</span>
                    </div>
                </div>
            </section>

            <div className="container">
                <div className="article-content">
                    {post.featuredImage && (
                        <div className="article-featured-image">
                            <img src={post.featuredImage} alt={post.title} />
                        </div>
                    )}
                    <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />

                    {post.metaKeywords && (
                        <div className="tags">
                            {post.metaKeywords.split(',').map((kw, i) => (
                                <span key={i} className="tag">{kw.trim()}</span>
                            ))}
                        </div>
                    )}

                    <ShareButtons url={postUrl} title={post.title} />

                    {post.commentsEnabled && (
                        <CommentSection postId={post.id} comments={post.comments} />
                    )}
                </div>
            </div>
        </>
    );
}
