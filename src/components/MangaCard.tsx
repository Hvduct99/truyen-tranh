import Image from "next/image";
import Link from "next/link";
import { Manga } from "@/types/manga";

export default function MangaCard({ manga }: { manga: Manga }) {
  const statusBadge =
    manga.status === "completed"
      ? "badge-completed"
      : manga.status === "hiatus"
      ? "badge-hiatus"
      : "badge-ongoing";

  const statusText =
    manga.status === "completed"
      ? "Hoàn thành"
      : manga.status === "ongoing"
      ? "Đang ra"
      : manga.status === "hiatus"
      ? "Tạm ngưng"
      : manga.status;

  return (
    <Link href={`/manga/${manga.id}`} className="group block">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-bg-card border border-border group-hover:border-border-light transition-colors duration-200">
        {manga.coverThumb ? (
          <Image
            src={manga.coverThumb}
            alt={manga.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-txt-muted text-xs">
            No Cover
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span className={statusBadge}>{statusText}</span>
        </div>
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          {manga.lastChapter && (
            <span className="text-[10px] text-white/70">
              Ch. {manga.lastChapter}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-txt line-clamp-2 leading-snug group-hover:text-accent transition-colors">
          {manga.title}
        </h3>
        <p className="mt-0.5 text-xs text-txt-muted line-clamp-1">
          {manga.authors.join(", ") || "Đang cập nhật"}
        </p>
      </div>
    </Link>
  );
}
