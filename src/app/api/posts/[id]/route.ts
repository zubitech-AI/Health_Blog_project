import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Try by ID first, then by slug
        const post = await prisma.post.findFirst({
            where: { OR: [{ id }, { slug: id }] },
            include: {
                category: { include: { parent: true } },
                subcategory: true,
                comments: {
                    where: { status: 'approved' },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Increment views
        await prisma.post.update({
            where: { id: post.id },
            data: { views: { increment: 1 } },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await req.json();

        const post = await prisma.post.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content,
                excerpt: body.excerpt,
                featuredImage: body.featuredImage,
                categoryId: body.categoryId,
                subcategoryId: body.subcategoryId || null,
                metaTitle: body.metaTitle,
                metaDescription: body.metaDescription,
                metaKeywords: body.metaKeywords,
                status: body.status,
                commentsEnabled: body.commentsEnabled,
            },
            include: { category: true, subcategory: true },
        });
        return NextResponse.json(post);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await prisma.post.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
