const toneMap = {
  green: "from-emerald-50 to-white text-emerald-700",
  blue: "from-sky-50 to-white text-sky-700",
  amber: "from-amber-50 to-white text-amber-700",
  sky: "from-cyan-50 to-white text-cyan-700",
  red: "from-rose-50 to-white text-rose-700"
};

export default function MetricCard({ label, value, unit, tone = "green" }) {
  return (
    <div className={`touch-card rounded-[8px] bg-gradient-to-br ${toneMap[tone]} p-4 shadow-soft ring-1 ring-slate-100`}>
      <p className="text-base font-bold text-slate-600">{label}</p>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold leading-none">{value}</span>
        <span className="text-base font-bold text-slate-500">{unit}</span>
      </div>
    </div>
  );
}
