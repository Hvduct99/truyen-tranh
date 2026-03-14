import Image from "next/image";
import Link from "next/link";
import { Manga } from "@/types/manga";

function formatCompactNumber(value: number | null) {
  if (!value) {
    return "N/A";
  }

  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function MangaCard({ manga }: { manga: Manga }) {
  return (
    <Link href={`/manga/${manga.id}`} className="group manga-card block overflow-hidden rounded-[26px] border border-white/10 bg-slate-900/80">
      <div className="manga-card-image bg-slate-800">
        {manga.imageUrl ? (
          <Image
            src={manga.imageUrl}
            alt={manga.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-500">
            No Cover
          </div>
        )}
        <div className="manga-card-overlay" />
        <div className="absolute left-3 top-3 rounded-full border border-cyan-400/30 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur">
          {manga.score ? `Score ${manga.score}` : manga.status}
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold text-white">{manga.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-slate-400">{manga.authors.join(", ") || "Đang cập nhật tác giả"}</p>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-slate-300">
          {manga.synopsis || "Chưa có mô tả chi tiết cho bộ manga này."}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Top #{manga.rank ?? "-"}</span>
          <span>{formatCompactNumber(manga.members)} độc giả</span>
        </div>
      </div>
    </Link>
  );
}
