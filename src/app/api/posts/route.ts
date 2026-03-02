import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category');
        const subcategory = searchParams.get('subcategory');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        // Admin can see all, public only published
        const session = await auth();
        if (!session) {
            where.status = 'published';
        } else if (status) {
            where.status = status;
        }

        if (category) {
            where.category = { slug: category };
        }
        if (subcategory) {
            where.subcategory = { slug: subcategory };
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    subcategory: { select: { id: true, name: true, slug: true } },
                    _count: { select: { comments: { where: { status: 'approved' } } } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.post.count({ where }),
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const {
            title, slug, content, excerpt, featuredImage,
            categoryId, subcategoryId, metaTitle, metaDescription,
            metaKeywords, status, commentsEnabled,
        } = body;

        const post = await prisma.post.create({
            data: {
                title, slug, content,
                excerpt: excerpt || '',
                featuredImage: featuredImage || null,
                categoryId,
                subcategoryId: subcategoryId || null,
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || '',
                metaKeywords: metaKeywords || '',
                status: status || 'draft',
                commentsEnabled: commentsEnabled !== false,
            },
            include: {
                category: true,
                subcategory: true,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
