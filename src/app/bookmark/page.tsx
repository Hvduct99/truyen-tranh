"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CoverImage from "@/components/CoverImage";
import { getBookmarks, removeBookmark, BookmarkEntry } from "@/lib/storage";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[] | null>(null);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  if (!bookmarks) return <div className="container-main py-20" />;

  return (
    <div className="container-main py-4">
      <div className="card p-3 sm:p-4">
        <h1 className="section-title mb-3">Truyện đang theo dõi</h1>

        {bookmarks.length === 0 ? (
          <p className="py-12 text-center text-sm text-txt-muted">
            Chưa theo dõi truyện nào. Bấm &quot;Theo dõi&quot; ở trang truyện để lưu lại tại đây.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-5">
            {bookmarks.map((item) => (
              <div key={item.mangaId} className="group relative">
                <Link href={`/manga/${item.mangaId}`} className="block relative aspect-[3/4] rounded-md overflow-hidden">
                  <CoverImage
                    src={item.coverThumb || ""}
                    alt={item.mangaTitle}
                    className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <Link href={`/manga/${item.mangaId}`} className="mt-1.5 block text-sm font-semibold text-txt line-clamp-2 leading-snug hover:text-accent">
                  {item.mangaTitle}
                </Link>
                <button
                  onClick={() => {
                    removeBookmark(item.mangaId);
                    setBookmarks(getBookmarks());
                  }}
                  className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-status-cancelled"
                  title="Bỏ theo dõi"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
