import Image from "next/image";
import Link from "next/link";
import MangaGridSection from "@/components/MangaGridSection";
import { getMangaById, getRecommendations } from "@/lib/api";

export const dynamic = "force-dynamic";

interface MangaDetailPageProps {
  params: Promise<{ id: string }>;
}

function compactNumber(value: number | null) {
  if (!value) {
    return "N/A";
  }

  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export async function generateMetadata({ params }: MangaDetailPageProps) {
  const { id } = await params;
  const manga = await getMangaById(id);

  return {
    title: `${manga.title} | MangaVerse Vietnam`,
    description: manga.synopsis || `Thông tin chi tiết cho manga ${manga.title}`,
  };
}

export default async function MangaDetailPage({ params }: MangaDetailPageProps) {
  const { id } = await params;
  const [manga, recommendations] = await Promise.all([
    getMangaById(id),
    getRecommendations(id),
  ]);

  const chips = [
    manga.type,
    manga.status,
    manga.demographic,
    manga.year ? `Năm ${manga.year}` : null,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="grid gap-8 p-6 md:grid-cols-[320px_1fr] md:p-8">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-slate-800">
            {manga.imageUrl ? (
              <Image
                src={manga.imageUrl}
                alt={manga.title}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Manga detail</p>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">{manga.title}</h1>
            {manga.titleJapanese ? (
              <p className="mt-2 text-base text-slate-400">{manga.titleJapanese}</p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200">
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Score</p>
                <p className="mt-2 text-2xl font-bold text-white">{manga.score ?? "N/A"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Rank</p>
                <p className="mt-2 text-2xl font-bold text-white">#{manga.rank ?? "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Readers</p>
                <p className="mt-2 text-2xl font-bold text-white">{compactNumber(manga.members)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Favorites</p>
                <p className="mt-2 text-2xl font-bold text-white">{compactNumber(manga.favorites)}</p>
              </div>
            </div>
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Tóm tắt</h2>
                <p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-300">
                  {manga.synopsis || "Chưa có tóm tắt cho manga này."}
                </p>
              </div>
              {manga.background ? (
                <div>
                  <h2 className="text-xl font-semibold text-white">Bối cảnh</h2>
                  <p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-400">{manga.background}</p>
                </div>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-sm font-semibold text-white">Tác giả</p>
                  <p className="mt-2 text-slate-300">{manga.authors.join(", ") || "Đang cập nhật"}</p>
                  <p className="mt-5 text-sm font-semibold text-white">Thể loại</p>
                  <p className="mt-2 text-slate-300">{manga.genres.map((item) => item.name).join(", ") || "Đang cập nhật"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-sm font-semibold text-white">Theme</p>
                  <p className="mt-2 text-slate-300">{manga.themes.map((item) => item.name).join(", ") || "Đang cập nhật"}</p>
                  <p className="mt-5 text-sm font-semibold text-white">Đăng tải</p>
                  <p className="mt-2 text-slate-300">{manga.serializations.join(", ") || "Đang cập nhật"}</p>
                </div>
              </div>
            </div>
            {manga.officialUrl ? (
              <div className="mt-8">
                <Link href={manga.officialUrl} target="_blank" className="btn-primary inline-flex items-center justify-center">
                  Xem nguồn metadata chính thức
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {recommendations.data.length ? (
        <div className="mt-14">
          <MangaGridSection
            title="Có thể bạn cũng thích"
            eyebrow="Recommendation"
            description="Gợi ý thêm các manga cùng tệp độc giả để user không rời site quá sớm."
            items={recommendations.data.map((item) => ({
              id: item.id,
              title: item.title,
              titleEnglish: item.title,
              titleJapanese: null,
              synopsis: `${item.votes} lượt đề cử từ cộng đồng.`,
              background: "",
              status: "Recommended",
              year: null,
              score: null,
              scoredBy: null,
              rank: null,
              popularity: null,
              members: null,
              favorites: null,
              chapters: null,
              volumes: null,
              type: "Manga",
              demographic: null,
              genres: [],
              themes: [],
              authors: [],
              serializations: [],
              imageUrl: item.imageUrl,
              imageThumb: item.imageUrl,
              officialUrl: item.officialUrl,
            }))}
          />
        </div>
      ) : null}
    </div>
  );
}
