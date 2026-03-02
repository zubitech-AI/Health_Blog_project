'use client';
import { useEffect, useState } from 'react';
import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'unauthenticated' && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [status, pathname, router]);

    if (pathname === '/admin/login') return <>{children}</>;
    if (status === 'loading') return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>;
    if (!session) return null;

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/posts', label: 'Posts', icon: '📝' },
        { href: '/admin/posts/new', label: 'New Post', icon: '➕' },
        { href: '/admin/categories', label: 'Categories', icon: '📁' },
        { href: '/admin/comments', label: 'Comments', icon: '💬' },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <Link href="/admin" className="logo" style={{ marginBottom: '32px' }}>
                    <div className="logo-icon" style={{ width: '36px', height: '36px', fontSize: '16px' }}>H</div>
                    <span className="logo-text" style={{ fontSize: '1.2rem', color: 'white', WebkitTextFillColor: 'white' }}>HealthBlog</span>
                </Link>

                <nav>
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className={`admin-nav-item${pathname === item.href ? ' active' : ''}`}>
                            <span className="admin-nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                    <Link href="/" className="admin-nav-item" target="_blank">
                        <span className="admin-nav-icon">🌐</span>
                        View Site
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="admin-nav-item" style={{ width: '100%', textAlign: 'left' }}>
                        <span className="admin-nav-icon">🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </SessionProvider>
    );
}
