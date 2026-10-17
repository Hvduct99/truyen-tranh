import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const buildUrl = (page: number) => `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${page}`;
  const base = "min-w-9 h-9 px-3 inline-flex items-center justify-center text-sm rounded-md border transition-colors";
  const idle = `${base} bg-bg-card border-border text-txt-secondary hover:border-accent hover:text-accent`;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5 mt-8">
      {currentPage > 1 && (
        <Link href={buildUrl(currentPage - 1)} className={idle} aria-label="Trang trước">
          ‹
        </Link>
      )}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-1 text-sm text-txt-muted">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={page === currentPage ? `${base} bg-accent border-accent text-white font-semibold` : idle}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={buildUrl(currentPage + 1)} className={idle} aria-label="Trang sau">
          ›
        </Link>
      )}
    </nav>
  );
}
