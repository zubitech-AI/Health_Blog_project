import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    const getUrl = (page: number) => {
        const sep = basePath.includes('?') ? '&' : '?';
        return `${basePath}${sep}page=${page}`;
    };

    return (
        <div className="pagination">
            <Link href={getUrl(currentPage - 1)} className={`page-btn${currentPage <= 1 ? ' disabled' : ''}`}
                style={currentPage <= 1 ? { pointerEvents: 'none', opacity: 0.4 } : {}}>
                ←
            </Link>
            {pages.map((p, i) =>
                typeof p === 'string' ? (
                    <span key={`dots-${i}`} className="page-btn" style={{ cursor: 'default' }}>...</span>
                ) : (
                    <Link key={p} href={getUrl(p)} className={`page-btn${p === currentPage ? ' active' : ''}`}>
                        {p}
                    </Link>
                )
            )}
            <Link href={getUrl(currentPage + 1)} className={`page-btn${currentPage >= totalPages ? ' disabled' : ''}`}
                style={currentPage >= totalPages ? { pointerEvents: 'none', opacity: 0.4 } : {}}>
                →
            </Link>
        </div>
    );
}
