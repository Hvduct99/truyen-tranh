import Link from "next/link";
import MangaCard from "@/components/MangaCard";
import { Manga } from "@/types/manga";

interface MangaGridSectionProps {
  title: string;
  eyebrow: string;
  description: string;
  items: Manga[];
  href?: string;
}

export default function MangaGridSection({
  title,
  eyebrow,
  description,
  items,
  href,
}: MangaGridSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-7 text-slate-400">{description}</p>
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
          >
            Xem thêm
          </Link>
        ) : null}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <MangaCard key={item.id} manga={item} />
        ))}
      </div>
    </section>
  );
}
