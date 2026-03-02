import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'HealthBlog - Your Trusted Health & Wellness Resource',
    template: '%s | HealthBlog',
  },
  description: 'Expert health tips, disease guides, nutrition advice, fitness routines, and mental wellness resources. Your comprehensive health and lifestyle blog.',
  keywords: ['health blog', 'wellness', 'nutrition', 'fitness', 'mental health', 'diseases', 'healthy lifestyle'],
  authors: [{ name: 'HealthBlog' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'HealthBlog',
    title: 'HealthBlog - Your Trusted Health & Wellness Resource',
    description: 'Expert health tips, disease guides, nutrition advice, fitness routines, and mental wellness resources.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthBlog',
    description: 'Your Trusted Health & Wellness Resource',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
