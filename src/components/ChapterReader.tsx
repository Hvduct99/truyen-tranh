"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChapterPages } from "@/types/manga";
import { addHistory } from "@/lib/storage";
import { chapterLabel } from "@/lib/format";

interface ChapterReaderProps {
  chapter: ChapterPages;
  mangaId: string;
  mangaTitle: string;
  mangaCover: string;
  chapterOptions: { id: string; label: string }[]; // newest first
  prevId: string | null;
  nextId: string | null;
}

function ReaderNav({
  mangaId,
  chapterId,
  chapterOptions,
  prevHref,
  nextHref,
}: {
  mangaId: string;
  chapterId: string;
  chapterOptions: { id: string; label: string }[];
  prevHref: string | null;
  nextHref: string | null;
}) {
  const router = useRouter();
  const btn = "h-9 px-3 inline-flex items-center gap-1 rounded-md text-sm font-semibold transition-colors";
  return (
    <div className="flex items-center justify-center gap-2">
      {prevHref ? (
        <Link href={prevHref} className={`${btn} bg-accent text-white hover:bg-accent-hover`}>‹ Trước</Link>
      ) : (
        <span className={`${btn} bg-white/10 text-white/30 cursor-not-allowed`}>‹ Trước</span>
      )}
      <select
        value={chapterId}
        onChange={(e) => router.push(`/manga/${mangaId}/${e.target.value}`)}
        className="h-9 max-w-[45vw] sm:max-w-xs px-2 rounded-md bg-white text-txt text-sm outline-none"
      >
        {chapterOptions.map((c) => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
      {nextHref ? (
        <Link href={nextHref} className={`${btn} bg-accent text-white hover:bg-accent-hover`}>Sau ›</Link>
      ) : (
        <span className={`${btn} bg-white/10 text-white/30 cursor-not-allowed`}>Sau ›</span>
      )}
    </div>
  );
}

export default function ChapterReader({
  chapter,
  mangaId,
  mangaTitle,
  mangaCover,
  chapterOptions,
  prevId,
  nextId,
}: ChapterReaderProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"scroll" | "page">("scroll");
  const [hd, setHd] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    try {
      setMode(localStorage.getItem("reader_mode") === "page" ? "page" : "scroll");
      setHd(localStorage.getItem("reader_hd") === "1");
    } catch {}
  }, []);

  const changeMode = (m: "scroll" | "page") => {
    setMode(m);
    try { localStorage.setItem("reader_mode", m); } catch {}
  };
  const toggleHd = () => {
    setHd(!hd);
    try { localStorage.setItem("reader_hd", hd ? "0" : "1"); } catch {}
  };

  const pages = hd && chapter.pagesHd.length ? chapter.pagesHd : chapter.pages;
  const label = chapterLabel(chapter);

  useEffect(() => {
    addHistory({
      mangaId,
      mangaTitle,
      coverThumb: mangaCover,
      chapterId: chapter.id,
      chapterLabel: label,
    });
    setCurrentPage(0);
  }, [mangaId, mangaTitle, mangaCover, chapter.id, label]);

  const prevHref = prevId ? `/manga/${mangaId}/${prevId}` : null;
  const nextHref = nextId ? `/manga/${mangaId}/${nextId}` : null;

  const goNext = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0 });
    } else if (nextHref) router.push(nextHref);
  }, [currentPage, pages.length, nextHref, router]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0 });
    } else if (prevHref) router.push(prevHref);
  }, [currentPage, prevHref, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "SELECT") return;
      if (mode === "page") {
        if (e.key === "ArrowRight" || e.key === "d") goNext();
        if (e.key === "ArrowLeft" || e.key === "a") goPrev();
      } else {
        if (e.key === "ArrowRight" && nextHref) router.push(nextHref);
        if (e.key === "ArrowLeft" && prevHref) router.push(prevHref);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, goNext, goPrev, nextHref, prevHref, router]);

  const toggleBtn = (active: boolean) =>
    `px-2.5 py-1 text-xs font-medium rounded ${active ? "bg-accent text-white" : "text-white/70 hover:text-white"}`;

  return (
    <div className="bg-[#1b1c20] min-h-screen">
      {/* Title + settings */}
      <div className="container-main pt-4 pb-3 text-center">
        <nav className="text-xs text-white/50">
          <Link href="/" className="hover:text-white">Trang chủ</Link> ›{" "}
          <Link href={`/manga/${mangaId}`} className="hover:text-white">{mangaTitle}</Link> › {label}
        </nav>
        <h1 className="mt-2 text-lg font-bold text-white">
          <Link href={`/manga/${mangaId}`} className="hover:text-accent">{mangaTitle}</Link>
          <span className="text-white/60 font-medium"> – {label}</span>
        </h1>
        {chapter.title && chapter.chapter !== null && <p className="text-sm text-white/50">{chapter.title}</p>}
      </div>

      {/* Sticky toolbar */}
      <div className="sticky top-0 z-[60] bg-[#111214]/95 backdrop-blur border-y border-white/10 py-2">
        <div className="container-main flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <ReaderNav mangaId={mangaId} chapterId={chapter.id} chapterOptions={chapterOptions} prevHref={prevHref} nextHref={nextHref} />
          <div className="flex items-center gap-1 rounded-md bg-white/5 p-0.5">
            <button onClick={() => changeMode("scroll")} className={toggleBtn(mode === "scroll")}>Cuộn dọc</button>
            <button onClick={() => changeMode("page")} className={toggleBtn(mode === "page")}>Từng trang</button>
            <button onClick={toggleHd} className={toggleBtn(hd)} title="Ảnh chất lượng cao (tốn dung lượng hơn)">HD</button>
          </div>
        </div>
      </div>

      {/* Pages */}
      {pages.length === 0 ? (
        <p className="py-24 text-center text-sm text-white/60">Chương này không có trang nào để hiển thị.</p>
      ) : mode === "scroll" ? (
        <div className="mx-auto max-w-3xl">
          {pages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`Trang ${i + 1}`}
              loading={i < 3 ? "eager" : "lazy"}
              className="block w-full h-auto min-h-[200px] bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-4xl py-3">
          <div
            className="flex items-center justify-center min-h-[70vh] cursor-pointer select-none"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              if (e.clientX - rect.left > rect.width / 2) goNext();
              else goPrev();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={pages[currentPage]} src={pages[currentPage]} alt={`Trang ${currentPage + 1}`} className="max-h-[88vh] w-auto object-contain" />
          </div>
          <p className="mt-2 text-center text-sm text-white/60">
            Trang {currentPage + 1} / {pages.length} · bấm nửa phải/trái ảnh hoặc phím ← → để lật
          </p>
          {/* preload the next page */}
          {pages[currentPage + 1] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pages[currentPage + 1]} alt="" className="hidden" />
          )}
        </div>
      )}

      {/* Bottom nav */}
      <div className="container-main py-6">
        <ReaderNav mangaId={mangaId} chapterId={chapter.id} chapterOptions={chapterOptions} prevHref={prevHref} nextHref={nextHref} />
      </div>
    </div>
  );
}
