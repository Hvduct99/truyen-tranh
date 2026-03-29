import Image from "next/image";
import Link from "next/link";
import { Manga } from "@/types/manga";

export default function MangaCard({ manga }: { manga: Manga }) {
  const statusText =
    manga.status === "completed"
      ? "Hoàn thành"
      : manga.status === "ongoing"
      ? "Đang ra"
      : manga.status;

  const statusClass =
    manga.status === "completed" ? "badge-completed" : "badge-ongoing";

  const latestChapter = manga.chaptersLatest?.[0];

  return (
    <Link href={`/manga/${manga.slug}`} className="group block">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-bg-card border border-border group-hover:border-border-light transition-colors duration-200">
        {manga.thumb_url ? (
          <Image
            src={manga.thumb_url}
            alt={manga.name}
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
        <div className="absolute top-2 left-2">
          <span className={statusClass}>{statusText}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
        {latestChapter && (
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <span className="text-[11px] text-white/80">
              Ch. {latestChapter.chapter_name}
            </span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-txt line-clamp-2 leading-snug group-hover:text-accent transition-colors">
          {manga.name}
        </h3>
        <p className="mt-0.5 text-xs text-txt-muted line-clamp-1">
          {manga.updatedAt
            ? new Date(manga.updatedAt).toLocaleDateString("vi-VN")
            : ""}
        </p>
      </div>
    </Link>
  );
}
