"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const current = new URLSearchParams(window.location.search).get("q") || "";
    setQuery(current);
  }, [pathname]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      if (pathname === "/search") {
        router.push("/");
      }
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tìm One Piece, Naruto, Berserk..."
        className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white outline-none transition duration-300 placeholder:text-slate-400 focus:border-cyan-400/60 focus:bg-white/10"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-orange-500 text-slate-950 transition hover:scale-105"
        aria-label="Tìm kiếm"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}
