import Link from "next/link";
import MangaGridSection from "@/components/MangaGridSection";
import TopList from "@/components/TopList";
import CoverImage from "@/components/CoverImage";
import ErrorBox from "@/components/ErrorBox";
import { getPopularManga, getLatestUpdates, getCompletedManga, getTags } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

export default async function Home() {
  // allSettled: one failing MangaDex call shouldn't blank the whole homepage
  const [popular, latest, completed, tags] = await Promise.allSettled([
    getPopularManga(1, 12),
    getLatestUpdates(1, 24),
    getCompletedManga(1),
    getTags(),
  ]);

  if (latest.status === "rejected" && popular.status === "rejected") {
    console.error("Home page error:", latest.reason);
    return <ErrorBox message="Không thể tải dữ liệu từ MangaDex. Vui lòng thử lại sau ít phút." />;
  }

  const featured = popular.status === "fulfilled" ? popular.value.items : [];
  const genres = tags.status === "fulfilled" ? tags.value.filter((t) => t.group === "genre") : [];

  return (
    <div className="container-main py-4 space-y-6">
      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Truyện đề cử</h2>
            <Link href="/popular" className="text-sm text-link hover:underline">Xem tất cả ›</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x pb-1">
            {featured.map((m, i) => (
              <Link
                key={m.id}
                href={`/manga/${m.id}`}
                className="group relative shrink-0 w-[42%] sm:w-[27%] md:w-[20%] lg:w-[15.6%] aspect-[3/4] rounded-md overflow-hidden snap-start"
              >
                <CoverImage src={m.cover} alt={m.title} eager={i < 6} className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-2.5 pb-2 pt-10">
                  <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">{m.title}</p>
                  {m.lastChapter && <p className="mt-0.5 text-[11px] text-white/75">Chương {m.lastChapter}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="card p-3 sm:p-4">
          {latest.status === "fulfilled" ? (
            <MangaGridSection title="Truyện mới cập nhật" items={latest.value.items} href="/latest" />
          ) : (
            <p className="p-8 text-center text-sm text-txt-muted">Không tải được danh sách mới cập nhật.</p>
          )}
          <div className="mt-6 text-center">
            <Link href="/latest?page=2" className="btn-outline">Xem thêm truyện</Link>
          </div>
        </div>

        <aside className="space-y-6">
          {completed.status === "fulfilled" && completed.value.items.length > 0 && (
            <TopList title="Hoàn thành hay" items={completed.value.items.slice(0, 10)} href="/completed" />
          )}
          {genres.length > 0 && (
            <section className="card p-3">
              <h2 className="section-title !text-base mb-3">Thể loại</h2>
              <div className="flex flex-wrap gap-1.5">
                {genres.map((t) => (
                  <Link key={t.id} href={`/genre/${t.id}`} className="tag">
                    {t.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
