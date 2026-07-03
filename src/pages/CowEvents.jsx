import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const all = "全部";
const eventTypes = ["建档", "入栏", "调群", "称重", "饲喂", "发情", "配种", "妊检", "产犊", "干奶", "疾病", "用药", "疫苗", "隔离", "治愈", "淘汰", "出栏", "死亡", "备注"];

export default function CowEvents() {
  const demo = useDemo();
  const [code, setCode] = useState(all);
  const [type, setType] = useState(all);
  const codes = useMemo(() => [all, ...new Set((demo.data.cowEvents || []).map((item) => item.code))], [demo.data.cowEvents]);
  const events = (demo.data.cowEvents || []).filter((item) => (code === all || item.code === code) && (type === all || item.type === type)).sort((a, b) => String(b.date).localeCompare(String(a.date)));

  function addEvent() {
    const target = code === all ? "HL-N-1028" : code;
    demo.upsertCowEvent({
      code: target,
      businessUnit: target.startsWith("OLF") ? "欧力菲德肉牛场" : "合力牧业奶牛场",
      type: "疾病",
      date: new Date().toISOString().slice(0, 10),
      content: "移动端上报采食异常，系统模拟状态流转为治疗中。",
      handler: demo.currentRole,
      relatedWorkOrder: "WO-NEW",
      relatedObject: "异常上报",
      note: "新增事件会自动更新牛只状态"
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-pasture-700">事件驱动 / 状态自动流转</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">牛只事件时间线</h1>
            <p className="mt-2 text-base leading-7 text-slate-600">将建档、调群、称重、繁育、用药、隔离、出栏等记录串成时间线，并前端模拟更新牛只状态。</p>
          </div>
          <button onClick={addEvent} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 新增事件</button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="事件总数" value={(demo.data.cowEvents || []).length} unit="条" />
        <MetricCard label="涉及牛只" value={codes.length - 1} unit="头" tone="green" />
        <MetricCard label="今日事件" value={(demo.data.cowEvents || []).filter((item) => String(item.date).startsWith(new Date().toISOString().slice(0, 10))).length} unit="条" tone="blue" />
        <MetricCard label="状态流转" value="模拟" unit="" tone="amber" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="grid gap-3 md:grid-cols-2">
          <Select label="耳标编号" value={code} setValue={setCode} items={codes} />
          <Select label="事件类型" value={type} setValue={setType} items={[all, ...eventTypes]} />
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="事件时间线" />
        <div className="space-y-3">
          {events.map((event) => (
            <article key={event.id} className="relative rounded-[8px] bg-slate-50 p-4 pl-6 ring-1 ring-slate-100">
              <span className="absolute left-2 top-5 h-3 w-3 rounded-full bg-pasture-600" />
              <p className="text-sm font-black text-pasture-700">{event.date} · {event.code} · {event.businessUnit}</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-950">{event.type}</h3>
              <p className="mt-2 text-lg leading-8 text-slate-700">{event.content}</p>
              <p className="mt-2 text-sm font-bold text-slate-500">处理人：{event.handler} · 关联工单：{event.relatedWorkOrder || "无"} · 关联对象：{event.relatedObject || "无"}</p>
              {event.note && <p className="mt-2 rounded-[8px] bg-white p-3 text-base font-bold text-slate-700">{event.note}</p>}
            </article>
          ))}
          {!events.length && <p className="rounded-[8px] bg-slate-50 p-5 text-lg font-bold text-slate-600">暂无事件。</p>}
        </div>
      </section>
    </div>
  );
}

function Select({ label, value, setValue, items }) {
  return <label className="block text-sm font-black text-slate-500">{label}<select value={value} onChange={(event) => setValue(event.target.value)} className="input-lg mt-2">{items.map((item) => <option key={item}>{item}</option>)}</select></label>;
}
