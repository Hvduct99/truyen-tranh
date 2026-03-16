import Image from "next/image";
import Link from "next/link";
import ChapterList from "@/components/ChapterList";
import { getMangaById, getChapters } from "@/lib/api";

export const dynamic = "force-dynamic";

interface MangaDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MangaDetailPageProps) {
  const { id } = await params;
  const manga = await getMangaById(id);
  return {
    title: `${manga.title} | MangaVerse Vietnam`,
    description: manga.description?.slice(0, 160) || `Doc truyen ${manga.title} online.`,
  };
}

export default async function MangaDetailPage({ params }: MangaDetailPageProps) {
  const { id } = await params;
  const [manga, chaptersData] = await Promise.all([
    getMangaById(id),
    getChapters(id, 96),
  ]);

  const chips = [
    manga.status === "completed" ? "Hoan thanh" : manga.status === "ongoing" ? "Dang ra" : manga.status,
    manga.contentRating,
    manga.year ? `Nam ${manga.year}` : null,
  ].filter(Boolean);

  const firstChapter = chaptersData.data[0];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="grid gap-8 p-6 md:grid-cols-[320px_1fr] md:p-8">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-slate-800">
            {manga.coverUrl ? (
              <Image
                src={manga.coverUrl}
                alt={manga.title}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
                unoptimized
              />
            ) : null}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Chi tiet manga</p>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">{manga.title}</h1>
            {manga.altTitles.length > 0 && (
              <p className="mt-2 text-base text-slate-400">{manga.altTitles[0]}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200">
                  {chip}
                </span>
              ))}
            </div>

            {/* Read button */}
            {firstChapter && (
              <div className="mt-6">
                <Link
                  href={`/manga/${manga.id}/chapter/${firstChapter.id}`}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Doc tu dau
                </Link>
              </div>
            )}

            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Mo ta</h2>
                <p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-300">
                  {manga.description || "Chua co mo ta cho manga nay."}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-sm font-semibold text-white">Tac gia</p>
                  <p className="mt-2 text-slate-300">{manga.authors.join(", ") || "Dang cap nhat"}</p>
                  <p className="mt-5 text-sm font-semibold text-white">Hoa si</p>
                  <p className="mt-2 text-slate-300">{manga.artists.join(", ") || "Dang cap nhat"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-sm font-semibold text-white">The loai</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {manga.tags.length > 0
                      ? manga.tags.map((tag) => (
                          <span key={tag.id} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                            {tag.name}
                          </span>
                        ))
                      : <span className="text-slate-400">Dang cap nhat</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter list */}
      <div className="mt-10">
        <ChapterList
          chapters={chaptersData.data}
          mangaId={manga.id}
          total={chaptersData.total}
        />
      </div>
    </div>
  );
}
