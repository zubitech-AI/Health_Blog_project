import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PostPageContent from '@/components/PostPageContent';
import PostCard from '@/components/PostCard';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ category: string; subcategory: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug },
        select: { metaTitle: true, title: true, metaDescription: true, excerpt: true, featuredImage: true, metaKeywords: true },
    });
    if (!post) return {};

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt || '',
        keywords: post.metaKeywords || '',
        openGraph: {
            title: post.metaTitle || post.title,
            description: post.metaDescription || '',
            type: 'article',
            images: post.featuredImage ? [post.featuredImage] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.metaTitle || post.title,
            description: post.metaDescription || '',
        },
    };
}

export default async function PostPage({ params }: PageProps) {
    const { category: catSlug, subcategory: subSlug, slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            category: { include: { parent: true } },
            subcategory: true,
            comments: { where: { status: 'approved' }, orderBy: { createdAt: 'desc' } },
        },
    });

    if (!post || post.status !== 'published') notFound();

    // Increment views
    await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

    // Related posts (same category)
    const relatedPosts = await prisma.post.findMany({
        where: {
            status: 'published',
            categoryId: post.categoryId,
            id: { not: post.id },
        },
        include: {
            category: { select: { id: true, name: true, slug: true } },
            subcategory: { select: { id: true, name: true, slug: true } },
            _count: { select: { comments: { where: { status: 'approved' } } } },
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
    });

    // Schema markup
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        image: post.featuredImage || '',
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
        author: { '@type': 'Organization', name: 'HealthBlog' },
        publisher: { '@type': 'Organization', name: 'HealthBlog' },
        description: post.metaDescription || '',
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <PostPageContent post={JSON.parse(JSON.stringify(post))} />

            {relatedPosts.length > 0 && (
                <section className="container" style={{ paddingBottom: '60px' }}>
                    <div className="section-header">
                        <h2 className="section-title">Related Articles</h2>
                    </div>
                    <div className="posts-grid">
                        {relatedPosts.map((p) => (
                            <PostCard key={p.id} post={JSON.parse(JSON.stringify(p))} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
