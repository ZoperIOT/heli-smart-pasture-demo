export default function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-pasture-600">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{title}</h2>
      </div>
      {action}
    </div>
  );
}
