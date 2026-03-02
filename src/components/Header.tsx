'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
    id: string;
    name: string;
    slug: string;
    children?: Category[];
}

export default function Header() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch(() => { });
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <>
            <header className="header">
                <div className="header-inner">
                    <Link href="/" className="logo">
                        <div className="logo-icon">H</div>
                        <span className="logo-text">HealthBlog</span>
                    </Link>

                    <nav className="nav-links">
                        <Link href="/" className="nav-link">Home</Link>
                        {categories.slice(0, 5).map((cat) => (
                            <div key={cat.id} className="nav-dropdown">
                                <Link href={`/${cat.slug}`} className="nav-link">{cat.name}</Link>
                                {cat.children && cat.children.length > 0 && (
                                    <div className="nav-dropdown-menu">
                                        {cat.children.map((sub) => (
                                            <Link key={sub.id} href={`/${cat.slug}/${sub.slug}`} className="nav-dropdown-item">
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <form onSubmit={handleSearch} className="search-bar">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">🔍</button>
                    </form>

                    <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}>
                <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <span className="logo-text">HealthBlog</span>
                        <button onClick={() => setMobileOpen(false)} style={{ fontSize: '1.5rem' }}>✕</button>
                    </div>
                    <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input"
                        />
                    </form>
                    <Link href="/" className="mobile-menu-link" onClick={() => setMobileOpen(false)}>Home</Link>
                    {categories.map((cat) => (
                        <div key={cat.id}>
                            <Link href={`/${cat.slug}`} className="mobile-menu-link" onClick={() => setMobileOpen(false)}>
                                {cat.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
