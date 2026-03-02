import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId: null },
            include: {
                children: { orderBy: { order: 'asc' } },
                _count: { select: { posts: { where: { status: 'published' } } } },
            },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { name, slug, description, parentId } = body;

        const category = await prisma.category.create({
            data: { name, slug, description, parentId: parentId || null },
        });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
