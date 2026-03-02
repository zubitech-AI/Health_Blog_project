import Link from 'next/link';
import prisma from '@/lib/prisma';
import PostCard from '@/components/PostCard';

export const revalidate = 60;

async function getHomeData() {
    const [posts, categories] = await Promise.all([
        prisma.post.findMany({
            where: { status: 'published' },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                subcategory: { select: { id: true, name: true, slug: true } },
                _count: { select: { comments: { where: { status: 'approved' } } } },
            },
            orderBy: { createdAt: 'desc' },
            take: 12,
        }),
        prisma.category.findMany({
            where: { parentId: null },
            include: {
                _count: { select: { posts: { where: { status: 'published' } } } },
            },
            orderBy: { order: 'asc' },
        }),
    ]);
    return { posts, categories };
}

const categoryIcons: Record<string, string> = {
    'health': '❤️',
    'diseases': '🏥',
    'diet-nutrition': '🥗',
    'fitness-exercise': '💪',
    'mental-health': '🧠',
    'wellness-lifestyle': '🌿',
};

export default async function HomePage() {
    const { posts, categories } = await getHomeData();

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Your Trusted Health & Wellness Resource</h1>
                    <p>Expert health tips, nutrition guides, fitness routines, and mental wellness resources — all in one place.</p>
                    <form action="/search" className="hero-search">
                        <input type="text" name="q" placeholder="Search for health topics..." />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </section>

            {/* Categories Bar */}
            <section className="categories-bar">
                <div className="categories-bar-inner">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/${cat.slug}`} className="category-chip">
                            {categoryIcons[cat.slug] || '📋'} {cat.name}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Latest Posts */}
            <section className="container" style={{ padding: '60px 24px' }}>
                <div className="section-header">
                    <h2 className="section-title">Latest Articles</h2>
                    <Link href="/search" className="section-link">View All →</Link>
                </div>

                {posts.length > 0 ? (
                    <div className="posts-grid">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={JSON.parse(JSON.stringify(post))} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>No articles yet</h3>
                        <p>Check back soon for health and wellness content!</p>
                    </div>
                )}
            </section>

            {/* Categories Section */}
            <section style={{ background: 'white', padding: '60px 0' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Browse Categories</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/${cat.slug}`} style={{
                                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                                padding: '28px', transition: 'var(--transition)', border: '1px solid var(--border-light)',
                                display: 'block',
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>
                                    {categoryIcons[cat.slug] || '📋'}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>{cat.name}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {cat._count.posts} article{cat._count.posts !== 1 ? 's' : ''}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
