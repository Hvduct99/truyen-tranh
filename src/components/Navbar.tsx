"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Phổ biến", href: "/popular" },
  { label: "Mới nhất", href: "/latest" },
  { label: "Thể loại", href: "/genre" },
  { label: "Lịch sử", href: "/history" },
  { label: "Yêu thích", href: "/bookmark" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/95 backdrop-blur-md border-b border-border"
          : "bg-bg/70 backdrop-blur-sm"
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-semibold text-sm">M</span>
            </div>
            <span className="text-base font-semibold text-txt hidden sm:block">
              MangaVerse
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-accent bg-accent-soft"
                      : "text-txt-secondary hover:text-txt hover:bg-bg-hover"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Search + Mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-64">
              <SearchBar />
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-txt-secondary hover:text-txt rounded-md hover:bg-bg-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-bg-card border-t border-border">
          <div className="container-main py-3 space-y-1">
            <div className="pb-3 md:hidden">
              <SearchBar />
            </div>
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "text-accent bg-accent-soft"
                      : "text-txt-secondary hover:text-txt hover:bg-bg-hover"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
