import Link from "next/link";
import MangaGridSection from "@/components/MangaGridSection";
import MangaCard from "@/components/MangaCard";
import { getHotManga, getHomeManga, getMangaTags, getMangaByGenre } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

const HOT_TITLES = [
  "One Piece",
  "Naruto",
  "Dragon Ball",
  "One Punch Man",
  "Baki",
  "Jujutsu Kaisen",
  "Demon Slayer",
  "Attack On Titan",
  "Solo Leveling",
  "Bleach",
  "Hunter x Hunter",
  "My Hero Academia",
  "Spy x Family",
  "Chainsaw Man",
  "Tokyo Revengers",
  "Death Note",
  "Slam Dunk",
  "Fairy Tail",
  "Black Clover",
  "Vinland Saga",
  "Kingdom",
  "Haikyuu",
  "Fullmetal Alchemist",
  "Mob Psycho 100",
  "Blue Lock",
  "Kaiju No. 8",
  "Dandadan",
  "Mashle",
  "Sakamoto Days",
  "Dr. Stone",
];

const FEATURED_GENRES = [
  { name: "Action", slug: "action" },
  { name: "Romance", slug: "romance" },
  { name: "Comedy", slug: "comedy" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Horror", slug: "horror" },
  { name: "Manhwa", slug: "manhwa" },
];

export default async function Home() {
  try {
    const [hotManga, homeData, tags, ...genreResults] = await Promise.all([
      getHotManga(HOT_TITLES),
      getHomeManga(),
      getMangaTags(),
      ...FEATURED_GENRES.map((g) => getMangaByGenre(g.slug, 1)),
    ]);

    return (
      <div className="pt-16 pb-12">
        {/* Hero banner */}
        {hotManga.length > 0 && (
          <section className="container-main mt-6 mb-10">
            <div className="card overflow-hidden p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-status-ongoing" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 0011.95 4.95c.592-.591.98-1.318 1.22-2.065.243-.755.333-1.596.254-2.457-.08-.87-.31-1.78-.676-2.673-.366-.893-.87-1.77-1.518-2.565-.652-.8-1.451-1.543-2.39-2.132a1 1 0 00-.555-.256z" />
                </svg>
                <h2 className="section-title">Truyện Hot Kinh Điển</h2>
              </div>
              <p className="text-sm text-txt-muted mb-5">Những bộ truyện nổi tiếng nhất mọi thời đại</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {hotManga.map((manga) => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="container-main space-y-10">
          {/* Mới cập nhật */}
          <MangaGridSection
            title="Mới cập nhật"
            items={homeData.items.slice(0, 10)}
            href="/latest"
          />

          {/* Thể loại section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Thể loại</h2>
              <Link href="/genre" className="text-sm text-txt-secondary hover:text-accent transition-colors flex items-center gap-1">
                Tất cả
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.slice(0, 20).map((tag) => (
                <Link key={tag.id} href={`/genre/${tag.slug}`} className="tag px-3 py-1.5">
                  {tag.name}
                </Link>
              ))}
            </div>

            {/* Featured genre grids */}
            <div className="space-y-8">
              {FEATURED_GENRES.map((genre, i) => {
                const data = genreResults[i];
                if (!data || data.items.length === 0) return null;
                return (
                  <MangaGridSection
                    key={genre.slug}
                    title={genre.name}
                    items={data.items.slice(0, 5)}
                    href={`/genre/${genre.slug}`}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Home page error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }
}
