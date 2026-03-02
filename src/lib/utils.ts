export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function timeAgo(date: Date | string): string {
    const now = new Date();
    const d = new Date(date);
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return formatDate(date);
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

export function generateExcerpt(content: string, length: number = 160): string {
    return truncate(stripHtml(content), length);
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .trim();
}

export function getReadingTime(content: string): number {
    const text = stripHtml(content);
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}
