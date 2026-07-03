import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import { BarRankChart, SharePie, TrendChart } from "../components/ChartCard.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { runAnalysis } from "../services/platformServices.js";

const objects = ["产奶记录", "肉牛体重", "饲料生产", "饲喂执行", "库存", "配送", "账本", "设备", "工单"];
const ranges = ["今日", "近 7 天", "本月", "本季度", "自定义日期"];
const dimensions = ["按业务板块", "按牛舍 / 圈舍", "按牛群", "按物资分类", "按客户", "按供应商", "按负责人", "按状态"];
const metrics = ["数量", "金额", "库存", "产量", "成本", "增长率", "完成率", "异常数"];
const charts = ["柱状图", "饼图", "折线图", "表格"];

export default function AnalysisCenter() {
  const demo = useDemo();
  const [query, setQuery] = useState({ object: "工单", range: "今日", dimension: "按状态", metric: "数量", chartType: "柱状图" });
  const result = useMemo(() => runAnalysis(demo.data, query), [demo.data, query]);

  function saveTemplate() {
    const next = [{ id: `tpl-${Date.now()}`, name: `${query.range}${query.object}${query.metric}分析`, ...query, pinned: false, owner: demo.currentRole, note: "用户保存的常用分析模板" }, ...(demo.data.analysisTemplates || [])];
    demo.updateCollection("analysisTemplates", next);
    alert("已保存为常用分析模板");
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p className="text-sm font-black text-pasture-700">数据流 / 多维分析</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">自定义分析中心</h1>
        <p className="mt-2 text-base leading-7 text-slate-600">基于 localStorage 当前数据进行前端多维分析，展示未来报表平台和指标配置能力。</p>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="grid gap-3 md:grid-cols-5">
          <Select label="分析对象" field="object" value={query.object} setQuery={setQuery} items={objects} />
          <Select label="时间范围" field="range" value={query.range} setQuery={setQuery} items={ranges} />
          <Select label="统计维度" field="dimension" value={query.dimension} setQuery={setQuery} items={dimensions} />
          <Select label="指标" field="metric" value={query.metric} setQuery={setQuery} items={metrics} />
          <Select label="图表" field="chartType" value={query.chartType} setQuery={setQuery} items={charts} />
        </div>
        <button onClick={saveTemplate} className="mt-4 flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Save size={20} /> 保存为模板</button>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="分析结果" eyebrow={`${query.object} · ${query.dimension} · ${query.metric}`} />
        {query.chartType === "饼图" ? <SharePie data={result} /> : query.chartType === "折线图" ? <TrendChart data={result.map((item) => ({ day: item.name, milk: item.value }))} /> : query.chartType === "表格" ? <Table rows={result} /> : <BarRankChart data={result} />}
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="常用分析模板" />
        <div className="grid gap-3 md:grid-cols-2">
          {(demo.data.analysisTemplates || []).map((item) => (
            <article key={item.id} className="rounded-[8px] bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-sm font-black text-pasture-700">{item.object} · {item.range}</p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">{item.name}</h3>
              <p className="mt-2 text-base font-bold text-slate-600">{item.dimension} / {item.metric} / {item.chartType}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Select({ label, field, value, setQuery, items }) {
  return <label className="block text-sm font-black text-slate-500">{label}<select value={value} onChange={(event) => setQuery((current) => ({ ...current, [field]: event.target.value }))} className="input-lg mt-2">{items.map((item) => <option key={item}>{item}</option>)}</select></label>;
}

function Table({ rows }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left"><thead><tr className="text-sm text-slate-500"><th className="p-3">维度</th><th className="p-3">数值</th></tr></thead><tbody>{rows.map((row) => <tr key={row.name} className="border-t border-slate-100"><td className="p-3 font-bold">{row.name}</td><td className="p-3">{Number(row.value).toFixed(1)}</td></tr>)}</tbody></table></div>;
}
