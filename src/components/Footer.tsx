import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <div className="logo">
                        <div className="logo-icon">H</div>
                        <span className="logo-text" style={{ color: 'white', WebkitTextFillColor: 'white' }}>HealthBlog</span>
                    </div>
                    <p>Your trusted source for expert health advice, wellness tips, and lifestyle guidance. We help you make informed decisions about your health.</p>
                </div>
                <div>
                    <h4 className="footer-title">Categories</h4>
                    <Link href="/health" className="footer-link">Health</Link>
                    <Link href="/diseases" className="footer-link">Diseases</Link>
                    <Link href="/diet-nutrition" className="footer-link">Diet & Nutrition</Link>
                    <Link href="/fitness-exercise" className="footer-link">Fitness & Exercise</Link>
                    <Link href="/mental-health" className="footer-link">Mental Health</Link>
                    <Link href="/wellness-lifestyle" className="footer-link">Wellness & Lifestyle</Link>
                </div>
                <div>
                    <h4 className="footer-title">Quick Links</h4>
                    <Link href="/" className="footer-link">Home</Link>
                    <Link href="/search" className="footer-link">Search</Link>
                    <Link href="/sitemap.xml" className="footer-link">Sitemap</Link>
                </div>
                <div>
                    <h4 className="footer-title">Legal</h4>
                    <Link href="/" className="footer-link">Privacy Policy</Link>
                    <Link href="/" className="footer-link">Terms of Service</Link>
                    <Link href="/" className="footer-link">Disclaimer</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} HealthBlog. All rights reserved. Content is for informational purposes only.</p>
            </div>
        </footer>
    );
}
