import Link from "next/link";
import CoverImage from "@/components/CoverImage";
import { Manga } from "@/types/manga";

const RANK_COLOR = ["bg-accent", "bg-[#f59e0b]", "bg-[#3b82f6]"];

/** Ranked sidebar list ("Top theo dõi"). */
export default function TopList({ title, items, href }: { title: string; items: Manga[]; href?: string }) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <h2 className="section-title !text-base">{title}</h2>
        {href && (
          <Link href={href} className="text-xs text-link hover:underline">
            Xem thêm
          </Link>
        )}
      </div>
      <ol className="divide-y divide-border">
        {items.map((m, i) => (
          <li key={m.id}>
            <Link href={`/manga/${m.id}`} className="flex items-center gap-3 px-3 py-2 hover:bg-bg-hover group">
              <span
                className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < 3 ? `${RANK_COLOR[i]} text-white` : "bg-bg-muted text-txt-muted"
                }`}
              >
                {i + 1}
              </span>
              <CoverImage src={m.cover.replace(".512.jpg", ".256.jpg")} alt={m.title} className="w-10 h-14 shrink-0 rounded" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-txt line-clamp-2 leading-snug group-hover:text-accent">{m.title}</p>
                {m.lastChapter && <p className="mt-0.5 text-xs text-txt-muted">Chương {m.lastChapter}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
