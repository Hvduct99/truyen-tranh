"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBookmarks, removeBookmark, BookmarkEntry } from "@/lib/storage";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBookmarks(getBookmarks());
    setLoaded(true);
  }, []);

  const handleRemove = (mangaId: string) => {
    removeBookmark(mangaId);
    setBookmarks(getBookmarks());
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
      <h1 className="section-title mb-4">Truyện yêu thích</h1>

      {bookmarks.length === 0 ? (
        <div className="card p-10 text-center">
          <svg
            className="w-12 h-12 text-txt-muted mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          <p className="text-txt-secondary">Chưa có truyện yêu thích.</p>
          <p className="text-sm text-txt-muted mt-1">
            Nhấn nút &quot;Yêu thích&quot; ở trang chi tiết truyện để lưu tại đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {bookmarks.map((item) => (
            <div key={item.mangaId} className="group relative">
              <Link href={`/manga/${item.mangaId}`} className="block">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-bg-card border border-border group-hover:border-border-light transition-colors">
                  {item.coverThumb ? (
                    <Image
                      src={item.coverThumb}
                      alt={item.mangaTitle}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-txt-muted text-xs">
                      No Cover
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-txt line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                    {item.mangaTitle}
                  </h3>
                  <p className="mt-0.5 text-xs text-txt-muted line-clamp-1">
                    {item.authors.join(", ") || "Đang cập nhật"}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleRemove(item.mangaId)}
                className="absolute top-2 right-2 p-1.5 bg-bg/80 rounded border border-border text-txt-muted hover:text-status-hiatus hover:border-status-hiatus/30 transition-colors"
                title="Bỏ yêu thích"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
