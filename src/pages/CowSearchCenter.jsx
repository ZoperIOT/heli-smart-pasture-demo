import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const allOption = "全部";

export default function CowSearchCenter() {
  const { data } = useDemo();
  const [keyword, setKeyword] = useState("");
  const [unit, setUnit] = useState(allOption);
  const [status, setStatus] = useState(allOption);
  const [watchOnly, setWatchOnly] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  const cows = useMemo(() => {
    const dairy = (data.dairyCows || []).map((item) => ({
      ...item,
      businessUnit: "合力牧业奶牛场",
      animalType: "奶牛",
      area: item.barn,
      currentWeight: item.weight || "",
      latestMilk: item.code === "HL-N-1160" ? "下降明显，待复核" : item.code === "HL-N-1028" ? "今日 29.4 kg" : "今日 31.8 kg"
    }));
    const beef = (data.beefCows || []).map((item) => ({
      ...item,
      businessUnit: "欧力菲德肉牛场",
      animalType: "肉牛",
      area: item.pen,
      watch: String(item.status || "").includes("异常") || String(item.note || "").includes("观察"),
      latestMilk: "-",
      currentWeight: item.weight
    }));
    return [...dairy, ...beef].map((cow) => {
      const location = (data.cowLocations || []).find((item) => item.code === cow.code);
      const weight = (data.weightRecords || []).find((item) => String(item.target || "").includes(cow.code) || String(item.note || "").includes(cow.code));
      const health = (data.healthEvents || []).find((item) => item.code === cow.code);
      return {
        ...cow,
        location: location?.position || location?.area || cow.area || "模拟位置未上传",
        lastSeenAt: location?.lastSeenAt || "-",
        latestWeight: weight ? `${weight.weight} kg，增重 ${weight.gain || 0} kg` : cow.currentWeight ? `${cow.currentWeight} kg` : "-",
        latestHealth: health ? `${health.eventType}：${health.status}` : "暂无异常",
        latestVaccination: health?.medicine || "按计划执行",
        recentAbnormal: cow.watch ? cow.note || cow.status : "无",
        owner: cow.personInCharge || health?.owner || "未分配"
      };
    });
  }, [data]);

  const statuses = [allOption, ...Array.from(new Set(cows.map((item) => item.status).filter(Boolean)))];
  const filtered = cows.filter((cow) => {
    const text = `${cow.code}${cow.area}${cow.status}${cow.businessUnit}${cow.note}`.toLowerCase();
    const hitKeyword = !keyword.trim() || text.includes(keyword.trim().toLowerCase());
    const hitUnit = unit === allOption || cow.businessUnit === unit;
    const hitStatus = status === allOption || cow.status === status;
    const hitWatch = !watchOnly || cow.watch;
    return hitKeyword && hitUnit && hitStatus && hitWatch;
  });
  const selected = filtered.find((item) => item.code === selectedCode) || filtered[0];

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p className="text-sm font-black text-pasture-700">集团快速查询</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">牛只查询中心</h1>
        <p className="mt-2 text-base leading-7 text-slate-600">按耳标、牛舍/圈舍、状态、重点关注和所属板块快速找牛；位置为前端 mock 数据，用于展示未来电子耳标/项圈接入效果。</p>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="可查询牛只" value={cows.length} unit="头" />
        <MetricCard label="重点关注" value={cows.filter((item) => item.watch).length} unit="头" tone="amber" />
        <MetricCard label="奶牛记录" value={cows.filter((item) => item.animalType === "奶牛").length} unit="头" tone="green" />
        <MetricCard label="肉牛记录" value={cows.filter((item) => item.animalType === "肉牛").length} unit="头" tone="blue" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_auto]">
          <label className="flex min-h-12 items-center gap-2 rounded-[8px] bg-slate-50 px-3 ring-1 ring-slate-100">
            <Search size={20} className="text-slate-500" />
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none" placeholder="输入耳标、牛舍、状态..." />
          </label>
          <select value={unit} onChange={(event) => setUnit(event.target.value)} className="input-lg">
            {[allOption, "合力牧业奶牛场", "欧力菲德肉牛场"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="input-lg">
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <button onClick={() => setWatchOnly((value) => !value)} className={`min-h-12 rounded-[8px] px-4 text-lg font-bold ${watchOnly ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-700"}`}>
            重点关注
          </button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="查询结果" eyebrow={`${filtered.length} 头`} />
          <div className="space-y-3">
            {filtered.map((cow) => (
              <button key={cow.code} onClick={() => setSelectedCode(cow.code)} className={`w-full rounded-[8px] p-4 text-left ring-1 ${selected?.code === cow.code ? "bg-pasture-50 ring-pasture-200" : "bg-slate-50 ring-slate-100"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl font-black text-slate-950">{cow.code}</p>
                    <p className="mt-1 text-base font-bold text-slate-600">{cow.businessUnit} · {cow.area}</p>
                  </div>
                  {cow.watch && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-800"><Star size={15} /> 关注</span>}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-base font-bold text-slate-700 md:grid-cols-4">
                  <span>状态：{cow.status}</span>
                  <span>位置：{cow.location}</span>
                  <span>产奶：{cow.latestMilk}</span>
                  <span>称重：{cow.latestWeight}</span>
                </div>
              </button>
            ))}
            {!filtered.length && <p className="rounded-[8px] bg-slate-50 p-5 text-lg font-bold text-slate-600">没有匹配牛只。</p>}
          </div>
        </section>

        <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="牛只详情" />
          {selected ? (
            <div className="space-y-3 text-lg">
              <Detail label="耳标编号" value={selected.code} />
              <Detail label="所属板块" value={selected.businessUnit} />
              <Detail label="当前位置" value={`${selected.location}（${selected.lastSeenAt}）`} />
              <Detail label="所属牛舍/圈舍" value={selected.area} />
              <Detail label="当前状态" value={selected.status} />
              <Detail label="最近产奶" value={selected.latestMilk} />
              <Detail label="最近称重" value={selected.latestWeight} />
              <Detail label="最近防疫/用药" value={selected.latestHealth} />
              <Detail label="最近异常" value={selected.recentAbnormal} />
              <Detail label="负责人" value={selected.owner} />
              <Detail label="备注" value={selected.note || "无"} />
            </div>
          ) : (
            <p className="rounded-[8px] bg-slate-50 p-5 text-lg font-bold text-slate-600">请选择一头牛。</p>
          )}
        </section>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-[8px] bg-slate-50 p-3">
      <p className="text-sm font-black text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value || "-"}</p>
    </div>
  );
}
