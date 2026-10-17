import Link from "next/link";
import MangaCard from "@/components/MangaCard";
import { Manga } from "@/types/manga";

interface MangaGridSectionProps {
  title: string;
  items: Manga[];
  href?: string;
  /** 4 columns when the section sits next to a sidebar, 6 when full width */
  columns?: 4 | 6;
}

export default function MangaGridSection({ title, items, href, columns = 4 }: MangaGridSectionProps) {
  const gridClass =
    columns === 6
      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-5"
      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-5";

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title">{title}</h2>
        {href && (
          <Link href={href} className="text-sm text-link hover:underline">
            Xem tất cả ›
          </Link>
        )}
      </div>
      {items.length > 0 ? (
        <div className={gridClass}>
          {items.map((item) => (
            <MangaCard key={item.id} manga={item} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-sm text-txt-muted">Không có truyện nào.</div>
      )}
    </section>
  );
}
