import prisma from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import type { Metadata } from 'next';

interface PageProps {
    searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `Search: ${q}` : 'Search Articles',
        description: q ? `Search results for "${q}" on HealthBlog` : 'Search health articles',
        robots: { index: false, follow: true },
    };
}

export default async function SearchPage({ searchParams }: PageProps) {
    const { q, page: pageStr } = await searchParams;
    const page = parseInt(pageStr || '1');
    const limit = 12;
    const query = q?.trim() || '';

    let posts: unknown[] = [];
    let total = 0;

    if (query) {
        const where = {
            status: 'published' as const,
            OR: [
                { title: { contains: query, mode: 'insensitive' as const } },
                { content: { contains: query, mode: 'insensitive' as const } },
            ],
        };

        [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    subcategory: { select: { id: true, name: true, slug: true } },
                    _count: { select: { comments: { where: { status: 'approved' } } } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.post.count({ where }),
        ]);
    }

    return (
        <>
            <section className="hero" style={{ padding: '50px 0' }}>
                <div className="hero-content">
                    <h1>{query ? `Results for "${query}"` : 'Search Articles'}</h1>
                    <p>{query ? `${total} article${total !== 1 ? 's' : ''} found` : 'Search for health topics, diseases, nutrition and more'}</p>
                    <form className="hero-search">
                        <input type="text" name="q" defaultValue={query} placeholder="Search for health topics..." />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </section>

            <section className="container" style={{ padding: '40px 24px 60px' }}>
                {posts.length > 0 ? (
                    <>
                        <div className="posts-grid">
                            {(posts as Array<Record<string, unknown>>).map((post) => (
                                <PostCard key={post.id as string} post={JSON.parse(JSON.stringify(post))} />
                            ))}
                        </div>
                        <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} basePath={`/search?q=${encodeURIComponent(query)}`} />
                    </>
                ) : query ? (
                    <div className="empty-state">
                        <h3>No results found</h3>
                        <p>Try different keywords or browse our categories.</p>
                    </div>
                ) : null}
            </section>
        </>
    );
}
