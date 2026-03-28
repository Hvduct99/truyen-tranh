import Link from "next/link";
import MangaCard from "@/components/MangaCard";
import { Manga } from "@/types/manga";

interface MangaGridSectionProps {
  title: string;
  items: Manga[];
  href?: string;
  columns?: 4 | 5 | 6;
}

export default function MangaGridSection({
  title,
  items,
  href,
  columns = 5,
}: MangaGridSectionProps) {
  const gridClass =
    columns === 6
      ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
      : columns === 4
      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4";

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-txt-secondary hover:text-accent transition-colors flex items-center gap-1"
          >
            Xem thêm
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      <div className={gridClass}>
        {items.map((item) => (
          <MangaCard key={item.id} manga={item} />
        ))}
      </div>
    </section>
  );
}
