"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Hot", href: "/popular" },
  { label: "Mới cập nhật", href: "/latest" },
  { label: "Hoàn thành", href: "/completed" },
  { label: "Thể loại", href: "/genre" },
  { label: "Lịch sử", href: "/history" },
  { label: "Theo dõi", href: "/bookmark" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Top bar: logo + search */}
      <div className="bg-bg-card border-b border-border">
        <div className="container-main flex items-center gap-3 h-14">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white font-bold">M</span>
            <span className="text-lg font-bold text-txt hidden sm:block">
              Manga<span className="text-accent">Verse</span>
            </span>
          </Link>
          <div className="flex-1 max-w-md ml-auto hidden sm:block">
            <SearchBar />
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden ml-auto sm:ml-0 p-2 text-txt-secondary hover:text-accent rounded-md"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search always visible */}
      <div className="sm:hidden bg-bg-card border-b border-border px-3 py-2">
        <SearchBar />
      </div>

      {/* Desktop menu bar */}
      <nav className="hidden lg:block bg-accent">
        <div className="container-main flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2.5 text-sm font-semibold uppercase text-white transition-colors ${
                isActive(pathname, item.href) ? "bg-black/15" : "hover:bg-black/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden bg-bg-card border-b border-border">
          <div className="container-main grid grid-cols-2 gap-1 py-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(pathname, item.href) ? "bg-accent-soft text-accent" : "text-txt-secondary hover:bg-bg-hover"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
