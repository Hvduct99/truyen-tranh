"use client";

import { useState, useEffect } from "react";
import { isBookmarked, addBookmark, removeBookmark } from "@/lib/storage";

interface BookmarkButtonProps {
  mangaId: string;
  mangaTitle: string;
  coverThumb: string | null;
  authors: string[];
}

export default function BookmarkButton({
  mangaId,
  mangaTitle,
  coverThumb,
  authors,
}: BookmarkButtonProps) {
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
    <button onClick={toggle} className={`btn-outline gap-2 ${saved ? "!border-accent !text-accent" : ""}`}>
      <svg
        className="w-4 h-4"
        fill={saved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
      {saved ? "Đã lưu" : "Yêu thích"}
    </button>
  );
}
