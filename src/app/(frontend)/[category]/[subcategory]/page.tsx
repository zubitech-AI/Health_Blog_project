import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ category: string; subcategory: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category: catSlug, subcategory: subSlug } = await params;
    const sub = await prisma.category.findUnique({
        where: { slug: subSlug },
        include: { parent: true },
    });
    if (!sub || !sub.parent || sub.parent.slug !== catSlug) return {};
    return {
        title: `${sub.name} - ${sub.parent.name}`,
        description: sub.description || `Browse ${sub.name} articles on HealthBlog`,
    };
}

export default async function SubcategoryPage({ params, searchParams }: PageProps) {
    const { category: catSlug, subcategory: subSlug } = await params;
    const { page: pageStr } = await searchParams;
    const page = parseInt(pageStr || '1');
    const limit = 12;

    const subcategory = await prisma.category.findUnique({
        where: { slug: subSlug },
        include: { parent: true },
    });

    if (!subcategory || !subcategory.parent || subcategory.parent.slug !== catSlug) {
        // Maybe this is a post slug under the category directly
        const post = await prisma.post.findUnique({
            where: { slug: subSlug },
            include: {
                category: { include: { parent: true, children: true } },
                subcategory: true,
                comments: { where: { status: 'approved' }, orderBy: { createdAt: 'desc' } },
            },
        });

        if (post && post.category.slug === catSlug && !post.subcategoryId) {
            // Render post page inline for /category/post-slug pattern
            const { default: PostPageContent } = await import('@/components/PostPageContent');
            return <PostPageContent post={JSON.parse(JSON.stringify(post))} />;
        }

        notFound();
    }

    const parentCategory = subcategory.parent;

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: { status: 'published', subcategoryId: subcategory.id },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                subcategory: { select: { id: true, name: true, slug: true } },
                _count: { select: { comments: { where: { status: 'approved' } } } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.post.count({ where: { status: 'published', subcategoryId: subcategory.id } }),
    ]);

    return (
        <>
            <section className="hero" style={{ padding: '50px 0' }}>
                <div className="hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">/</span>
                        <Link href={`/${catSlug}`}>{parentCategory!.name}</Link>
                        <span className="breadcrumb-sep">/</span>
                        <span>{subcategory.name}</span>
                    </div>
                    <h1>{subcategory.name}</h1>
                    {subcategory.description && <p>{subcategory.description}</p>}
                </div>
            </section>

            <section className="container" style={{ padding: '40px 24px 60px' }}>
                {posts.length > 0 ? (
                    <>
                        <div className="posts-grid">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={JSON.parse(JSON.stringify(post))} />
                            ))}
                        </div>
                        <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} basePath={`/${catSlug}/${subSlug}`} />
                    </>
                ) : (
                    <div className="empty-state">
                        <h3>No articles in {subcategory.name}</h3>
                        <p>Check back soon!</p>
                    </div>
                )}
            </section>
        </>
    );
}
