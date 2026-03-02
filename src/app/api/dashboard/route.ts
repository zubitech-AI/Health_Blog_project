import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const [totalPosts, totalCategories, totalComments, pendingComments, publishedPosts, draftPosts, recentPosts] = await Promise.all([
            prisma.post.count(),
            prisma.category.count({ where: { parentId: null } }),
            prisma.comment.count(),
            prisma.comment.count({ where: { status: 'pending' } }),
            prisma.post.count({ where: { status: 'published' } }),
            prisma.post.count({ where: { status: 'draft' } }),
            prisma.post.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: { select: { name: true } },
                    _count: { select: { comments: true } },
                },
            }),
        ]);

        return NextResponse.json({
            totalPosts, totalCategories, totalComments,
            pendingComments, publishedPosts, draftPosts, recentPosts,
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
