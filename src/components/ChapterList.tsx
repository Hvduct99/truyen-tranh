"use client";

import { useState } from "react";
import Link from "next/link";
import { Chapter } from "@/types/manga";

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: string;
  total: number;
}

export default function ChapterList({ chapters, mangaId, total }: ChapterListProps) {
  const [sortAsc, setSortAsc] = useState(true);

  if (chapters.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-txt-muted text-sm">Chưa có chapter nào.</p>
      </div>
    );
  }

  const grouped = new Map<string, Chapter[]>();
  for (const ch of chapters) {
    const key = ch.chapter || "Oneshot";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(ch);
  }

  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    const na = parseFloat(a) || 0;
    const nb = parseFloat(b) || 0;
    return sortAsc ? na - nb : nb - na;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title">
          Danh sách chapter
          <span className="ml-2 text-sm font-normal text-txt-muted">({total})</span>
        </h2>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center gap-1.5 text-sm text-txt-secondary hover:text-txt transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {sortAsc ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
            )}
          </svg>
          {sortAsc ? "Cũ → Mới" : "Mới → Cũ"}
        </button>
      </div>

      <div className="card divide-y divide-border max-h-[600px] overflow-y-auto">
        {sortedKeys.map((chNum) => {
          const versions = grouped.get(chNum)!;
          const primary = versions.find((v) => v.language === "vi") || versions[0];
          const date = primary.publishAt
            ? new Date(primary.publishAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "";

          return (
            <Link
              key={primary.id}
              href={`/manga/${mangaId}/chapter/${primary.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-bg-hover transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-medium text-txt-secondary w-12 shrink-0">
                  Ch.{chNum}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-txt group-hover:text-accent transition-colors truncate">
                    {primary.title || `Chapter ${chNum}`}
                  </p>
                  <p className="text-xs text-txt-muted mt-0.5">
                    {primary.scanlationGroup || "Unknown"} &middot; {primary.language.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs text-txt-muted hidden sm:block">{date}</span>
                <span className="text-xs text-txt-muted">{primary.pages}p</span>
                <svg className="w-3.5 h-3.5 text-txt-muted group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
