"use client";

import { useState } from "react";
import Link from "next/link";
import { ChapterInfo } from "@/types/manga";
import { extractChapterId } from "@/lib/mangaService";

interface ChapterListProps {
  chapters: ChapterInfo[];
  mangaSlug: string;
}

export default function ChapterList({ chapters, mangaSlug }: ChapterListProps) {
  const [sortAsc, setSortAsc] = useState(false);

  if (chapters.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-txt-muted text-sm">Chưa có chapter nào.</p>
      </div>
    );
  }

  const sorted = [...chapters];
  if (sortAsc) sorted.reverse();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title">
          Danh sách chapter
          <span className="ml-2 text-sm font-normal text-txt-muted">({chapters.length})</span>
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
        {sorted.map((ch, index) => {
          const chId = extractChapterId(ch.chapter_api_data);
          return (
            <Link
              key={`${ch.chapter_name}-${index}`}
              href={`/manga/${mangaSlug}/${chId}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-bg-hover transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-medium text-txt-secondary w-14 shrink-0">
                  Ch.{ch.chapter_name}
                </span>
                <p className="text-sm text-txt group-hover:text-accent transition-colors truncate">
                  {ch.chapter_title || `Chapter ${ch.chapter_name}`}
                </p>
              </div>
              <svg className="w-3.5 h-3.5 text-txt-muted group-hover:text-accent transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
