import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isLoginPage = req.nextUrl.pathname === '/admin/login';
    const isApiRoute = req.nextUrl.pathname.startsWith('/api');

    // Skip middleware for API routes and login page
    if (isApiRoute || isLoginPage) return NextResponse.next();

    // Protect admin routes
    if (isAdminRoute && !req.auth) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*'],
};
