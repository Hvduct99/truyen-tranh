const stats = [
  { label: "Nguồn dữ liệu", value: "Jikan v4" },
  { label: "Phong cách", value: "Cinematic manga UI" },
  { label: "Animation", value: "Framer Motion + Tailwind" },
  { label: "Deploy", value: "Hostinger Business" },
];

export default function StatStrip() {
  return (
    <section className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
