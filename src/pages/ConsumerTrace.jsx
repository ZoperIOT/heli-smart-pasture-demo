import { CheckCircle2, Snowflake, Truck } from "lucide-react";

export default function ConsumerTrace() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <section className="overflow-hidden rounded-[8px] bg-white shadow-soft ring-1 ring-slate-100">
        <img src="/images/milk-bottles.jpg" alt="鲜牛奶产品" className="h-56 w-full object-cover" />
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pasture-600">
            consumer trace
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">合力鲜牛奶</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            从牧场到奶杯，全流程可追溯。
          </p>
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="生产批次" value="HL-AM-002" />
          <Info label="生产日期" value="2026-06-27" />
          <Info label="牧场来源" value="山东合力牧业示范牧场" wide />
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <h2 className="font-bold text-slate-950">质检摘要</h2>
        <div className="mt-3 space-y-3">
          {["脂肪 3.92%", "蛋白 3.31%", "抗生素残留未检出", "菌落总数符合企业内控标准"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 size={18} className="text-pasture-600" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <h2 className="font-bold text-slate-950">冷链配送记录</h2>
        <div className="mt-3 space-y-3 text-sm text-slate-700">
          <div className="flex gap-3 rounded-[8px] bg-sky-50 p-3">
            <Snowflake size={20} className="text-cold-700" />
            <span>装车温度 3.7℃，全程冷链监测</span>
          </div>
          <div className="flex gap-3 rounded-[8px] bg-emerald-50 p-3">
            <Truck size={20} className="text-pasture-700" />
            <span>鲁Q·A3188 冷链罐车，预计 10:40 完成客户接收</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value, wide }) {
  return (
    <div className={wide ? "col-span-2 rounded-[8px] bg-slate-50 p-3" : "rounded-[8px] bg-slate-50 p-3"}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}
