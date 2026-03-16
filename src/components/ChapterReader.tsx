"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChapterPage } from "@/types/manga";

interface ChapterReaderProps {
  pages: ChapterPage[];
  chapterTitle: string;
  mangaId: string;
  mangaTitle: string;
  prevChapterId: string | null;
  nextChapterId: string | null;
}

export default function ChapterReader({
  pages,
  chapterTitle,
  mangaId,
  mangaTitle,
  prevChapterId,
  nextChapterId,
}: ChapterReaderProps) {
  const [mode, setMode] = useState<"scroll" | "page">("scroll");
  const [currentPage, setCurrentPage] = useState(0);
  const [showToolbar, setShowToolbar] = useState(true);
  const [hdMode, setHdMode] = useState(false);

  const goNext = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
    } else if (nextChapterId) {
      window.location.href = `/manga/${mangaId}/chapter/${nextChapterId}`;
    }
  }, [currentPage, pages.length, nextChapterId, mangaId]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    } else if (prevChapterId) {
      window.location.href = `/manga/${mangaId}/chapter/${prevChapterId}`;
    }
  }, [currentPage, prevChapterId, mangaId]);

  useEffect(() => {
    if (mode !== "page") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "d") goNext();
      if (e.key === "ArrowLeft" || e.key === "a") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, goNext, goPrev]);

  if (pages.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-400">Khong co trang nao de hien thi.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Toolbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          showToolbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-dark-950/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <Link
              href={`/manga/${mangaId}`}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">{mangaTitle}</span>
            </Link>
            <p className="text-sm font-medium text-white truncate">{chapterTitle}</p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setHdMode(!hdMode)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  hdMode
                    ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                    : "bg-white/5 text-slate-400 border border-white/10 hover:text-white"
                }`}
              >
                HD
              </button>
              <button
                onClick={() => setMode(mode === "scroll" ? "page" : "scroll")}
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                {mode === "scroll" ? "Trang" : "Cuon"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle toolbar on click */}
      <div
        className="fixed top-0 left-0 right-0 h-16 z-40 cursor-pointer"
        onClick={() => setShowToolbar(!showToolbar)}
      />

      {/* Reader content */}
      <div className="pt-16 pb-20">
        {mode === "scroll" ? (
          /* Scroll mode */
          <div className="mx-auto max-w-4xl space-y-1">
            {pages.map((page, i) => (
              <div key={i} className="relative w-full">
                <Image
                  src={hdMode ? page.urlHD : page.url}
                  alt={`Trang ${i + 1}`}
                  width={1200}
                  height={1800}
                  className="w-full h-auto"
                  priority={i < 3}
                  unoptimized
                />
              </div>
            ))}
          </div>
        ) : (
          /* Page mode */
          <div className="mx-auto max-w-4xl">
            <div
              className="relative flex items-center justify-center min-h-[70vh] cursor-pointer select-none"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x > rect.width / 2) goNext();
                else goPrev();
              }}
            >
              <Image
                key={currentPage}
                src={hdMode ? pages[currentPage].urlHD : pages[currentPage].url}
                alt={`Trang ${currentPage + 1}`}
                width={1200}
                height={1800}
                className="max-h-[85vh] w-auto object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={goPrev}
                disabled={currentPage === 0 && !prevChapterId}
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-slate-400
                  hover:text-white transition-colors disabled:opacity-30"
              >
                Truoc
              </button>
              <span className="text-sm text-slate-400">
                {currentPage + 1} / {pages.length}
              </span>
              <button
                onClick={goNext}
                disabled={currentPage === pages.length - 1 && !nextChapterId}
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-slate-400
                  hover:text-white transition-colors disabled:opacity-30"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-950/95 backdrop-blur-xl border-t border-white/10 px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          {prevChapterId ? (
            <Link
              href={`/manga/${mangaId}/chapter/${prevChapterId}`}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Chapter truoc
            </Link>
          ) : (
            <div />
          )}
          {mode === "scroll" && (
            <span className="text-xs text-slate-500">{pages.length} trang</span>
          )}
          {nextChapterId ? (
            <Link
              href={`/manga/${mangaId}/chapter/${nextChapterId}`}
              className="rounded-xl bg-cyan-400/10 border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/20 transition-colors"
            >
              Chapter sau
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
