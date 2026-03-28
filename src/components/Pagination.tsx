"use client";

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
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const buildUrl = (page: number) => {
    const sep = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${sep}page=${page}`;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-3 py-1.5 text-sm text-txt-secondary hover:text-txt bg-bg-card border border-border rounded-md hover:border-border-light transition-colors"
        >
          Trước
        </Link>
      )}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 py-1.5 text-sm text-txt-muted">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              page === currentPage
                ? "bg-accent text-white border-accent"
                : "text-txt-secondary bg-bg-card border-border hover:border-border-light hover:text-txt"
            }`}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-3 py-1.5 text-sm text-txt-secondary hover:text-txt bg-bg-card border border-border rounded-md hover:border-border-light transition-colors"
        >
          Sau
        </Link>
      )}
    </div>
  );
}
