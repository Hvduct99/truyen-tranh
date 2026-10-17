"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CoverImage from "@/components/CoverImage";
import { getHistory, clearHistory, HistoryEntry } from "@/lib/storage";
import { timeAgo } from "@/lib/format";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    // one row per manga: the latest chapter read
    const seen = new Set<string>();
    setHistory(getHistory().filter((h) => !seen.has(h.mangaId) && seen.add(h.mangaId)));
  }, []);

  if (!history) return <div className="container-main py-20" />;

  return (
    <div className="container-main py-4">
      <div className="card p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="section-title">Lịch sử đọc</h1>
          {history.length > 0 && (
            <button
              onClick={() => {
                clearHistory();
                setHistory([]);
              }}
              className="text-sm text-txt-muted hover:text-status-cancelled"
            >
              Xoá tất cả
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="py-12 text-center text-sm text-txt-muted">Chưa có lịch sử đọc. Đọc truyện để lưu lại tại đây.</p>
        ) : (
          <ul className="divide-y divide-border">
            {history.map((item) => (
              <li key={item.mangaId} className="flex items-center gap-3 py-2.5">
                <Link href={`/manga/${item.mangaId}`} className="shrink-0">
                  <CoverImage src={item.coverThumb || ""} alt={item.mangaTitle} className="w-12 h-16 rounded" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/manga/${item.mangaId}`} className="block text-sm font-semibold text-txt hover:text-accent truncate">
                    {item.mangaTitle}
                  </Link>
                  <p className="text-xs text-txt-muted mt-0.5">
                    Đã đọc {item.chapterLabel} · {timeAgo(new Date(item.timestamp).toISOString())}
                  </p>
                </div>
                <Link href={`/manga/${item.mangaId}/${item.chapterId}`} className="btn-primary !py-1.5 !px-3 text-xs shrink-0">
                  Đọc tiếp
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
