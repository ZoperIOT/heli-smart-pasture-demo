import { useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { stores } from "../data/mockData.js";
import { useDemo } from "../context/DemoContext.jsx";
import { demoStores } from "../data/demoFlow.js";

export default function Stores() {
  const demo = useDemo();
  const liveStores = useMemo(
    () =>
      demo.storeUpdated
        ? demoStores.map((store) => ({
            name: store.name,
            replenishment: `${store.inbound.toFixed(1)} 吨`,
            inventory: `${store.after.toFixed(1)} 吨`,
            sales: "演示中",
            loss: "0",
            status: store.status,
            freshMilk: store.after,
            yogurt: 42,
            ecology: 28,
            suggest: store.suggest,
            trend: [store.before, store.before + 0.3, store.before + 0.6, store.after]
          }))
        : stores,
    [demo.storeUpdated]
  );
  const [selectedName, setSelectedName] = useState(liveStores[0].name);
  const selected = liveStores.find((store) => store.name === selectedName) || liveStores[0];

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pasture-50 text-pasture-700">
            <Wand2 size={22} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-950">一键生成补货建议</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              根据签收前库存、入库量、当前库存和近 7 天趋势，自动给出明日补货建议。
            </p>
            {demo.storeUpdated && (
              <p className="mt-3 rounded-[8px] bg-emerald-50 p-3 text-sm font-semibold text-pasture-800">
                演示状态：三家门店已入库，库存预警由 3 家降为 0 家。
              </p>
            )}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="门店列表" eyebrow="stores" />
        <div className="grid gap-3 md:grid-cols-2">
          {liveStores.map((store) => (
            <button
              key={store.name}
              onClick={() => setSelectedName(store.name)}
              className="rounded-[8px] bg-white p-4 text-left shadow-soft ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-950">{store.name}</h3>
                <StatusBadge>{store.status}</StatusBadge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Field label="今日补货量" value={store.replenishment} />
                <Field label="当前库存" value={store.inventory} />
                <Field label="今日销售" value={store.sales} />
                <Field label="损耗数量" value={store.loss} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title={`${selected.name}详情`} eyebrow="store detail" />
          <div className="grid grid-cols-3 gap-2 text-center">
            <Inventory label="鲜牛奶" value={selected.freshMilk} />
            <Inventory label="酸奶" value={selected.yogurt} />
            <Inventory label="生态产品" value={selected.ecology} />
          </div>
          <h3 className="mt-5 font-semibold text-slate-950">近 7 天销量 / 库存趋势</h3>
          <div className="mt-3 flex h-28 items-end gap-2 rounded-[8px] bg-slate-50 p-3">
            {selected.trend.map((value, index) => (
              <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-pasture-600"
                  style={{ height: `${Math.max(18, (value / Math.max(...selected.trend)) * 82)}px` }}
                />
                <span className="text-[10px] text-slate-400">{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[8px] bg-emerald-50 p-4 text-sm leading-6 text-pasture-900">
            系统建议：{selected.suggest}
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-[8px] bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Inventory({ label, value }) {
  return (
    <div className="rounded-[8px] bg-slate-50 p-3">
      <p className="text-xl font-bold text-pasture-700">
        {typeof value === "number" ? `${value.toFixed(1)}t` : value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}
