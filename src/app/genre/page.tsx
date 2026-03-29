import Link from "next/link";
import { getMangaTags } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Thể loại | MangaVerse",
};

export default async function GenrePage() {
  try {
    const tags = await getMangaTags();

    return (
      <div className="container-main pt-20 pb-12">
        <h1 className="section-title mb-6">Duyệt theo thể loại</h1>
        <div className="flex flex-wrap gap-2">
          {tags
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tag) => (
              <Link key={tag.id} href={`/genre/${tag.slug}`} className="tag px-4 py-2 text-sm">
                {tag.name}
              </Link>
            ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Genre page error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải thể loại.</p>
        </div>
      </div>
    );
  }
}
