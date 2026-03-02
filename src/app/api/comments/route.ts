import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where: Record<string, unknown> = {};
        if (postId) where.postId = postId;

        const session = await auth();
        if (!session) {
            where.status = 'approved';
        } else if (status) {
            where.status = status;
        }

        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where,
                include: { post: { select: { title: true, slug: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.comment.count({ where }),
        ]);

        return NextResponse.json({ comments, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { postId, name, email, content } = body;

        if (!postId || !name || !email || !content) {
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: { postId, name, email, content, status: 'pending' },
        });
        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
