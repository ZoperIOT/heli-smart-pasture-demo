export default function PageHeader({ eyebrow, title, description, action, dark = false }) {
  return (
    <section className={`rounded-[8px] p-5 shadow-soft ring-1 ${dark ? "bg-slate-950 text-white ring-slate-900" : "bg-white text-slate-950 ring-slate-100"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className={`text-sm font-black ${dark ? "text-emerald-100" : "text-pasture-700"}`}>{eyebrow}</p>}
          <h1 className="mt-1 text-3xl font-bold">{title}</h1>
          {description && <p className={`mt-2 max-w-4xl text-base leading-7 ${dark ? "text-white/75" : "text-slate-600"}`}>{description}</p>}
        </div>
        {action}
      </div>
    </section>
  );
}
