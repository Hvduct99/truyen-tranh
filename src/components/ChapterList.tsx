"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChapterInfo } from "@/types/manga";
import { chapterLabel, timeAgo } from "@/lib/format";
import { getHistory } from "@/lib/storage";

interface ChapterListProps {
  chapters: ChapterInfo[];
  mangaId: string;
}

export default function ChapterList({ chapters, mangaId }: ChapterListProps) {
  const [sortAsc, setSortAsc] = useState(false);
  const [filter, setFilter] = useState("");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReadIds(new Set(getHistory().filter((h) => h.mangaId === mangaId).map((h) => h.chapterId)));
  }, [mangaId]);

  const visible = useMemo(() => {
    const list = sortAsc ? [...chapters].reverse() : chapters;
    const q = filter.trim();
    return q ? list.filter((c) => (c.chapter ?? "").startsWith(q) || c.title.toLowerCase().includes(q.toLowerCase())) : list;
  }, [chapters, sortAsc, filter]);

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-border">
        <h2 className="section-title">
          Danh sách chương
          <span className="text-sm font-normal normal-case text-txt-muted">({chapters.length})</span>
        </h2>
        {chapters.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Tìm chương..."
              inputMode="decimal"
              className="input h-8 w-32 text-xs"
            />
            <button onClick={() => setSortAsc(!sortAsc)} className="btn-outline !px-2.5 !py-1 h-8 text-xs">
              {sortAsc ? "Cũ → Mới" : "Mới → Cũ"}
            </button>
          </div>
        )}
      </div>

      {chapters.length === 0 ? (
        <p className="p-8 text-center text-sm text-txt-muted">
          Truyện này chưa có chương tiếng Việt hoặc tiếng Anh đọc được trên MangaDex.
        </p>
      ) : (
        <>
          <div className="hidden sm:grid grid-cols-[1fr_8rem_7rem] px-4 py-2 text-xs font-semibold text-txt-muted bg-bg-hover border-b border-border">
            <span>Số chương</span>
            <span>Nhóm dịch</span>
            <span className="text-right">Cập nhật</span>
          </div>
          <ul className="max-h-[560px] overflow-y-auto divide-y divide-border">
            {visible.map((ch) => {
              const read = readIds.has(ch.id);
              return (
                <li key={ch.id}>
                  <Link
                    href={`/manga/${mangaId}/${ch.id}`}
                    className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_8rem_7rem] items-center gap-2 px-4 py-2.5 hover:bg-bg-hover group"
                  >
                    <span className={`min-w-0 truncate text-sm group-hover:text-accent ${read ? "text-txt-muted" : "text-txt"}`}>
                      {ch.lang !== "vi" && (
                        <span className="mr-1.5 px-1 py-px text-[10px] font-bold rounded bg-bg-muted text-txt-secondary uppercase">
                          {ch.lang}
                        </span>
                      )}
                      {chapterLabel(ch)}
                      {ch.chapter !== null && ch.title && <span className="text-txt-muted">: {ch.title}</span>}
                    </span>
                    <span className="hidden sm:block truncate text-xs text-txt-muted">{ch.group}</span>
                    <span suppressHydrationWarning className="text-right text-xs italic text-txt-muted">{timeAgo(ch.publishAt)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
