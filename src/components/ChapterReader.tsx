"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChapterDetail } from "@/types/manga";
import { addHistory } from "@/lib/storage";

interface ChapterReaderProps {
  chapter: ChapterDetail;
  mangaSlug: string;
  mangaName: string;
  mangaThumb: string;
  prevChapterId: string | null;
  nextChapterId: string | null;
}

export default function ChapterReader({
  chapter,
  mangaSlug,
  mangaName,
  mangaThumb,
  prevChapterId,
  nextChapterId,
}: ChapterReaderProps) {
  const [mode, setMode] = useState<"scroll" | "page">("scroll");
  const [currentPage, setCurrentPage] = useState(0);
  const [showToolbar, setShowToolbar] = useState(true);

  const pages = chapter.images.map((img) => ({
    url: `${chapter.domain_cdn}/${chapter.chapter_path}/${img.image_file}`,
  }));

  useEffect(() => {
    addHistory({
      mangaId: mangaSlug,
      mangaTitle: mangaName,
      coverThumb: mangaThumb,
      chapterId: chapter.chapter_name,
      chapterNum: chapter.chapter_name,
    });
  }, [mangaSlug, mangaName, mangaThumb, chapter.chapter_name]);

  const prevUrl = prevChapterId ? `/manga/${mangaSlug}/${prevChapterId}` : null;
  const nextUrl = nextChapterId ? `/manga/${mangaSlug}/${nextChapterId}` : null;

  const goNext = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
    } else if (nextUrl) {
      window.location.href = nextUrl;
    }
  }, [currentPage, pages.length, nextUrl]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    } else if (prevUrl) {
      window.location.href = prevUrl;
    }
  }, [currentPage, prevUrl]);

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
        <p className="text-txt-muted text-sm">Không có trang nào để hiển thị.</p>
      </div>
    );
  }

  const chapterTitle = `Chapter ${chapter.chapter_name}${chapter.chapter_title ? `: ${chapter.chapter_title}` : ""}`;

  return (
    <div className="min-h-screen bg-bg">
      {/* Top toolbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-200 ${showToolbar ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="bg-bg/95 backdrop-blur-sm border-b border-border px-4 py-2.5">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <Link href={`/manga/${mangaSlug}`} className="flex items-center gap-2 text-sm text-txt-secondary hover:text-txt transition-colors shrink-0">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline truncate max-w-[200px]">{mangaName}</span>
            </Link>
            <p className="text-sm text-txt truncate">{chapterTitle}</p>
            <button
              onClick={() => setMode(mode === "scroll" ? "page" : "scroll")}
              className="px-2.5 py-1 text-xs text-txt-muted border border-border rounded hover:text-txt hover:border-border-light transition-colors shrink-0"
            >
              {mode === "scroll" ? "Trang" : "Cuộn"}
            </button>
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 h-12 z-40 cursor-pointer" onClick={() => setShowToolbar(!showToolbar)} />

      {/* Content */}
      <div className="pt-14 pb-16">
        {mode === "scroll" ? (
          <div className="mx-auto max-w-4xl">
            {pages.map((page, i) => (
              <div key={i} className="relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.url}
                  alt={`Trang ${i + 1}`}
                  className="w-full h-auto"
                  loading={i < 3 ? "eager" : "lazy"}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        ) : (
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={currentPage}
                src={pages[currentPage].url}
                alt={`Trang ${currentPage + 1}`}
                className="max-h-[85vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-3">
              <button onClick={goPrev} disabled={currentPage === 0 && !prevUrl} className="px-3 py-1.5 text-sm text-txt-secondary border border-border rounded hover:text-txt transition-colors disabled:opacity-30">Trước</button>
              <span className="text-sm text-txt-muted">{currentPage + 1} / {pages.length}</span>
              <button onClick={goNext} disabled={currentPage === pages.length - 1 && !nextUrl} className="px-3 py-1.5 text-sm text-txt-secondary border border-border rounded hover:text-txt transition-colors disabled:opacity-30">Sau</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-sm border-t border-border px-4 py-2.5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          {prevUrl ? (
            <Link href={prevUrl} className="text-sm text-txt-secondary hover:text-txt transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Ch. trước
            </Link>
          ) : <div />}
          <span className="text-xs text-txt-muted">
            {mode === "scroll" ? `${pages.length} trang` : `${currentPage + 1}/${pages.length}`}
          </span>
          {nextUrl ? (
            <Link href={nextUrl} className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
              Ch. sau
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
