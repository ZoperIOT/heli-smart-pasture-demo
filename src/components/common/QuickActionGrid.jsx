import { Link } from "react-router-dom";

export default function QuickActionGrid({ items = [], columns = "sm:grid-cols-3 xl:grid-cols-4" }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${columns}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.to} to={item.to} className="flex min-h-[86px] flex-col justify-center gap-2 rounded-[8px] bg-white p-4 font-bold text-slate-800 shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:ring-pasture-200">
            {Icon && <Icon size={28} className="text-pasture-700" />}
            <span className="text-lg leading-6">{item.label}</span>
            {item.desc && <span className="text-sm font-semibold text-slate-500">{item.desc}</span>}
          </Link>
        );
      })}
    </div>
  );
}
