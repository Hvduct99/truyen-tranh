import Link from "next/link";
import ErrorBox from "@/components/ErrorBox";
import { getTags } from "@/lib/mangaService";

export const dynamic = "force-dynamic";
export const metadata = { title: "Thể loại | MangaVerse" };

const GROUPS = [
  { key: "genre", label: "Thể loại" },
  { key: "theme", label: "Chủ đề" },
  { key: "format", label: "Định dạng" },
];

export default async function GenrePage() {
  let tags;
  try {
    tags = await getTags();
  } catch (error) {
    console.error("Genre page error:", error);
    return <ErrorBox message="Không thể tải danh sách thể loại." />;
  }

  return (
    <div className="container-main py-4 space-y-4">
      {GROUPS.map((g) => {
        const items = tags.filter((t) => t.group === g.key);
        if (items.length === 0) return null;
        return (
          <section key={g.key} className="card p-4">
            <h2 className="section-title mb-3">{g.label}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {items.map((t) => (
                <Link key={t.id} href={`/genre/${t.id}`} className="tag justify-center py-2 text-sm">
                  {t.name}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
