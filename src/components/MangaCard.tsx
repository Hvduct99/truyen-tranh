import Link from "next/link";
import CoverImage from "@/components/CoverImage";
import { Manga, MangaStatus } from "@/types/manga";
import { STATUS_LABEL, chapterLabel, timeAgo } from "@/lib/format";

const STATUS_BG: Record<MangaStatus, string> = {
  ongoing: "bg-status-ongoing",
  completed: "bg-status-completed",
  hiatus: "bg-status-hiatus",
  cancelled: "bg-status-cancelled",
};

export function StatusBadge({ status }: { status: MangaStatus }) {
  return <span className={`badge ${STATUS_BG[status] || "bg-txt-muted"}`}>{STATUS_LABEL[status] || status}</span>;
}

export default function MangaCard({ manga }: { manga: Manga }) {
  const href = `/manga/${manga.id}`;

  return (
    <div className="group">
      <Link href={href} className="block relative aspect-[3/4] rounded-md overflow-hidden bg-bg-muted">
        <CoverImage
          src={manga.cover}
          alt={manga.title}
          className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-1.5 left-1.5">
          <StatusBadge status={manga.status} />
        </div>
        {manga.latestChapters.length === 0 && manga.lastChapter && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 pb-1.5 pt-6">
            <span className="text-[11px] font-medium text-white">{manga.lastChapter} chương</span>
          </div>
        )}
      </Link>

      <Link href={href} className="mt-1.5 block">
        <h3 className="text-sm font-semibold text-txt line-clamp-2 leading-snug group-hover:text-accent transition-colors">
          {manga.title}
        </h3>
      </Link>

      {manga.latestChapters.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {manga.latestChapters.map((ch) => (
            <li key={ch.id} className="flex items-center justify-between gap-2 text-xs">
              <Link
                href={`/manga/${manga.id}/${ch.id}`}
                className="text-txt-secondary hover:text-accent truncate"
              >
                {chapterLabel(ch)}
              </Link>
              <span className="shrink-0 text-[11px] italic text-txt-muted">{timeAgo(ch.publishAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
