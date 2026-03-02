import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const posts = await prisma.post.findMany({
        where: { status: 'published' },
        select: { slug: true, updatedAt: true, category: { select: { slug: true } }, subcategory: { select: { slug: true } } },
    });

    const categories = await prisma.category.findMany({
        select: { slug: true, updatedAt: true, parentId: true, parent: { select: { slug: true } } },
    });

    const postUrls = posts.map((post) => {
        const url = post.subcategory
            ? `${siteUrl}/${post.category.slug}/${post.subcategory.slug}/${post.slug}`
            : `${siteUrl}/${post.category.slug}/${post.slug}`;
        return { url, lastModified: post.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 };
    });

    const categoryUrls = categories.map((cat) => {
        const url = cat.parent
            ? `${siteUrl}/${cat.parent.slug}/${cat.slug}`
            : `${siteUrl}/${cat.slug}`;
        return { url, lastModified: cat.updatedAt, changeFrequency: 'daily' as const, priority: 0.6 };
    });

    return [
        { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        ...categoryUrls,
        ...postUrls,
    ];
}
