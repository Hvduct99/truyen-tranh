"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") || "");
  }, [pathname]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={onSubmit} className="relative flex">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm truyện: One Piece, Đảo Hải Tặc..."
        className="input h-9 rounded-r-none border-r-0 pr-3"
      />
      <button
        type="submit"
        className="h-9 px-3 shrink-0 bg-accent hover:bg-accent-hover text-white rounded-r-md"
        aria-label="Tìm kiếm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}
