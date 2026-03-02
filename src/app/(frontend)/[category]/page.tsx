import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category: slug } = await params;
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) return {};
    return {
        title: cat.name,
        description: cat.description || `Browse ${cat.name} articles on HealthBlog`,
        openGraph: { title: cat.name, description: cat.description || '' },
    };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { category: slug } = await params;
    const { page: pageStr } = await searchParams;
    const page = parseInt(pageStr || '1');
    const limit = 12;

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            children: { orderBy: { order: 'asc' } },
        },
    });

    if (!category || category.parentId !== null) notFound();

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: { status: 'published', categoryId: category.id },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                subcategory: { select: { id: true, name: true, slug: true } },
                _count: { select: { comments: { where: { status: 'approved' } } } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.post.count({ where: { status: 'published', categoryId: category.id } }),
    ]);

    return (
        <>
            <section className="hero" style={{ padding: '50px 0' }}>
                <div className="hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">/</span>
                        <span>{category.name}</span>
                    </div>
                    <h1>{category.name}</h1>
                    {category.description && <p>{category.description}</p>}
                </div>
            </section>

            {category.children.length > 0 && (
                <section className="categories-bar">
                    <div className="categories-bar-inner">
                        <Link href={`/${slug}`} className="category-chip active">All</Link>
                        {category.children.map((sub) => (
                            <Link key={sub.id} href={`/${slug}/${sub.slug}`} className="category-chip">
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="container" style={{ padding: '40px 24px 60px' }}>
                {posts.length > 0 ? (
                    <>
                        <div className="posts-grid">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={JSON.parse(JSON.stringify(post))} />
                            ))}
                        </div>
                        <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} basePath={`/${slug}`} />
                    </>
                ) : (
                    <div className="empty-state">
                        <h3>No articles in {category.name}</h3>
                        <p>Check back soon!</p>
                    </div>
                )}
            </section>
        </>
    );
}
