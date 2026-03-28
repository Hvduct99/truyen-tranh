import Image from "next/image";
import Link from "next/link";
import { Manga } from "@/types/manga";

export default function HeroSection({ featured }: { featured: Manga[] }) {
  const lead = featured[0];
  if (!lead) return null;

  return (
    <section className="container-main mb-10">
      {/* Main featured banner */}
      <div className="card overflow-hidden">
        <div className="relative flex flex-col md:flex-row">
          {/* Cover */}
          <div className="relative w-full md:w-72 lg:w-80 shrink-0 aspect-[3/4] md:aspect-auto md:h-auto bg-bg-hover">
            {lead.coverUrl && (
              <Image
                src={lead.coverUrl}
                alt={lead.title}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
                priority
                unoptimized
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Nổi bật
            </span>
            <h2 className="mt-2 text-2xl lg:text-3xl font-semibold text-txt leading-tight">
              {lead.title}
            </h2>
            {lead.authors.length > 0 && (
              <p className="mt-2 text-sm text-txt-secondary">
                {lead.authors.join(", ")}
              </p>
            )}
            <p className="mt-3 text-sm text-txt-muted leading-relaxed line-clamp-3">
              {lead.description || "Khám phá bộ manga nổi bật này."}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {lead.tags.slice(0, 4).map((tag) => (
                <span key={tag.id} className="tag text-xs">
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <Link href={`/manga/${lead.id}`} className="btn-primary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Đọc ngay
              </Link>
              <Link href="/popular" className="btn-outline">
                Xem phổ biến
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured row */}
      {featured.length > 1 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.slice(1, 5).map((item) => (
            <Link
              key={item.id}
              href={`/manga/${item.id}`}
              className="card-hover flex gap-3 p-3 group"
            >
              <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden bg-bg-hover">
                {item.coverThumb && (
                  <Image
                    src={item.coverThumb}
                    alt={item.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-txt line-clamp-2 group-hover:text-accent transition-colors">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-txt-muted line-clamp-1">
                  {item.authors.join(", ") || "Đang cập nhật"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
