import MangaGridSection from "@/components/MangaGridSection";
import { searchManga } from "@/lib/api";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const result = query ? await searchManga(query, 24) : { data: [], total: 0, offset: 0, limit: 24 };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      {query ? (
        <MangaGridSection
          title={`Ket qua cho "${query}"`}
          eyebrow="Tim kiem"
          description={`Tim thay ${result.data.length} ket qua tu MangaDex.`}
          items={result.data}
        />
      ) : (
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Tim kiem</p>
          <h1 className="mt-4 text-3xl font-bold text-white">Nhap ten manga de bat dau</h1>
          <p className="mt-3 text-slate-400">Vi du: One Piece, Naruto, Berserk, Solo Leveling, Jujutsu Kaisen.</p>
        </section>
      )}
    </div>
  );
}
