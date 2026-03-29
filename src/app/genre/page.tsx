import Link from "next/link";
import { getMangaTags } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Thể loại | MangaVerse",
};

export default async function GenrePage() {
  const tags = await getMangaTags();

  const genres = tags.filter((t) => t.group === "genre");
  const themes = tags.filter((t) => t.group === "theme");
  const formats = tags.filter((t) => t.group === "format");
  const others = tags.filter(
    (t) => t.group !== "genre" && t.group !== "theme" && t.group !== "format"
  );

  const sections = [
    { label: "Thể loại", items: genres },
    { label: "Chủ đề", items: themes },
    { label: "Định dạng", items: formats },
    { label: "Khác", items: others },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="container-main pt-20 pb-12">
      <h1 className="section-title mb-6">Duyệt theo thể loại</h1>
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.label}>
            <h2 className="text-sm font-medium text-txt-muted uppercase tracking-wider mb-3">
              {section.label}
            </h2>
            <div className="flex flex-wrap gap-2">
              {section.items
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tag) => (
                  <Link key={tag.id} href={`/genre/${tag.id}`} className="tag">
                    {tag.name}
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
