"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHistory, clearHistory, HistoryEntry } from "@/lib/storage";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setLoaded(true);
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  if (!loaded) {
    return (
      <div className="container-main pt-20 pb-12">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-main pt-20 pb-12">
      <div className="flex items-center justify-between mb-4">
        <h1 className="section-title">Lịch sử đọc</h1>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-txt-muted hover:text-status-hiatus transition-colors"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="card p-10 text-center">
          <svg
            className="w-12 h-12 text-txt-muted mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-txt-secondary">Chưa có lịch sử đọc.</p>
          <p className="text-sm text-txt-muted mt-1">Đọc truyện để lưu lịch sử tại đây.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <Link
              key={`${item.chapterId}-${item.timestamp}`}
              href={`/manga/${item.mangaId}/chapter/${item.chapterId}`}
              className="card-hover flex items-center gap-3 p-3 group"
            >
              <div className="relative w-10 h-14 shrink-0 rounded overflow-hidden bg-bg-hover">
                {item.coverThumb && (
                  <Image
                    src={item.coverThumb}
                    alt={item.mangaTitle}
                    fill
                    sizes="40px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-txt group-hover:text-accent transition-colors truncate">
                  {item.mangaTitle}
                </p>
                <p className="text-xs text-txt-muted mt-0.5">
                  Chapter {item.chapterNum}
                </p>
              </div>
              <span className="text-xs text-txt-muted shrink-0">
                {new Date(item.timestamp).toLocaleDateString("vi-VN")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
