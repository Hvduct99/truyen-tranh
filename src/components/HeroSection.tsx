"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Manga } from "@/types/manga";

export default function HeroSection({ featured }: { featured: Manga[] }) {
  const lead = featured[0];

  return (
    <section className="relative mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-900/80 px-6 py-10 backdrop-blur-xl md:px-10 md:py-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(249,115,22,0.2),_transparent_26%)]" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">
              Manga showcase 2026
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
              Trang chủ truyện tranh mang cảm giác điện ảnh, nhanh, rõ và đủ sang để lên Hostinger.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Tập trung vào các bộ manga kinh điển như One Piece, Naruto, One Punch-Man, Jujutsu Kaisen cùng dữ liệu metadata sạch, hợp pháp và giao diện có chiều sâu thị giác.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/popular" className="btn-primary text-center">Khám phá phổ biến</Link>
              <Link href={lead ? `/manga/${lead.id}` : "/search?q=one%20piece"} className="btn-ghost text-center">Xem bộ nổi bật</Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                "Tailwind CSS 3.4.10 ổn định",
                "Animation mượt bằng Framer Motion",
                "Node.js backend proxy sạch cho Hostinger",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {featured.slice(0, 3).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 p-4"
            >
              <Link href={`/manga/${item.id}`} className="flex gap-4">
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-800">
                  {item.imageThumb ? (
                    <Image src={item.imageThumb} alt={item.title} fill sizes="120px" className="object-cover transition duration-500 group-hover:scale-110" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.28em] text-orange-300">#{index + 1} lựa chọn</p>
                  <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{item.synopsis || "Khám phá thông tin bộ manga này."}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
