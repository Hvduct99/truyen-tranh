"use client";

import Link from "next/link";
import { Chapter } from "@/types/manga";

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: string;
  total: number;
}

export default function ChapterList({ chapters, mangaId, total }: ChapterListProps) {
  if (chapters.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <p className="text-slate-400">Chua co chapter nao.</p>
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
    return na - nb;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Danh sach chapter</h2>
        <span className="text-sm text-slate-400">{total} chapter</span>
      </div>
      <div className="max-h-[600px] space-y-1.5 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/50 p-3">
        {sortedKeys.map((chNum) => {
          const versions = grouped.get(chNum)!;
          const primary = versions.find((v) => v.language === "vi") || versions[0];
          return (
            <Link
              key={primary.id}
              href={`/manga/${mangaId}/chapter/${primary.id}`}
              className="flex items-center justify-between rounded-xl px-4 py-3
                transition-colors hover:bg-white/5 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                  bg-cyan-400/10 text-xs font-bold text-cyan-300">
                  {chNum}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
                    Chapter {chNum}{primary.title ? `: ${primary.title}` : ""}
                  </p>
                  <p className="text-xs text-slate-500">
                    {primary.scanlationGroup || "Unknown group"}
                    {" · "}
                    {primary.language.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-500">{primary.pages}p</span>
                <svg className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
