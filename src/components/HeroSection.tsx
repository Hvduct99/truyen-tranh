import Image from "next/image";
import Link from "next/link";
import { Manga } from "@/types/manga";

export default function HeroSection({ featured }: { featured: Manga[] }) {
  const lead = featured[0];
  if (!lead) return null;

  return (
    <section className="container-main mb-10">
      <div className="card overflow-hidden">
        <div className="relative flex flex-col md:flex-row">
          <div className="relative w-full md:w-72 lg:w-80 shrink-0 aspect-[3/4] md:aspect-auto md:h-auto bg-bg-hover">
            {lead.thumb_url && (
              <Image
                src={lead.thumb_url}
                alt={lead.name}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
                priority
                unoptimized
              />
            )}
          </div>
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Nổi bật
            </span>
            <h2 className="mt-2 text-2xl lg:text-3xl font-semibold text-txt leading-tight">
              {lead.name}
            </h2>
            {lead.origin_name.length > 0 && (
              <p className="mt-1 text-sm text-txt-muted">
                {lead.origin_name[0]}
              </p>
            )}
            <p className="mt-3 text-sm text-txt-muted leading-relaxed line-clamp-3">
              {lead.description
                ? lead.description.replace(/<[^>]*>/g, "")
                : "Khám phá bộ truyện nổi bật này."}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {lead.categories.slice(0, 4).map((cat) => (
                <Link key={cat.id} href={`/genre/${cat.slug}`} className="tag text-xs">
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <Link href={`/manga/${lead.slug}`} className="btn-primary">
                Đọc ngay
              </Link>
              <Link href="/latest" className="btn-outline">
                Truyện mới
              </Link>
            </div>
          </div>
        </div>
      </div>

      {featured.length > 1 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.slice(1, 5).map((item) => (
            <Link
              key={item.id}
              href={`/manga/${item.slug}`}
              className="card-hover flex gap-3 p-3 group"
            >
              <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden bg-bg-hover">
                {item.thumb_url && (
                  <Image
                    src={item.thumb_url}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-txt line-clamp-2 group-hover:text-accent transition-colors">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-txt-muted line-clamp-1">
                  {item.chaptersLatest?.[0]
                    ? `Ch. ${item.chaptersLatest[0].chapter_name}`
                    : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
