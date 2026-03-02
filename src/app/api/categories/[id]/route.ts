import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                children: { orderBy: { order: 'asc' } },
                parent: true,
            },
        });
        if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(category);
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
        const category = await prisma.category.update({
            where: { id },
            data: { name: body.name, slug: body.slug, description: body.description, parentId: body.parentId || null },
        });
        return NextResponse.json(category);
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
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
