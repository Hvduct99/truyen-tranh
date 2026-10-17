"use client";

import { useState, useEffect } from "react";
import { isBookmarked, addBookmark, removeBookmark } from "@/lib/storage";

interface BookmarkButtonProps {
  mangaId: string;
  mangaTitle: string;
  coverThumb: string;
  authors: string[];
}

export default function BookmarkButton({ mangaId, mangaTitle, coverThumb, authors }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(mangaId));
  }, [mangaId]);

  const toggle = () => {
    if (saved) {
      removeBookmark(mangaId);
      setSaved(false);
    } else {
      addBookmark({ mangaId, mangaTitle, coverThumb, authors });
      setSaved(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={saved ? "btn-outline !border-accent !text-accent !bg-accent-soft" : "btn-outline"}
    >
      <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      {saved ? "Đang theo dõi" : "Theo dõi"}
    </button>
  );
}
