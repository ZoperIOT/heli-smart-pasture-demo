import { Power, Plus, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { evaluateRules } from "../services/platformServices.js";

export default function RuleCenter() {
  const demo = useDemo();
  const triggered = evaluateRules(demo.data);
  const enabled = (demo.data.alertRules || []).filter((item) => item.enabled).length;

  function toggle(rule) {
    demo.updateCollection("alertRules", demo.data.alertRules.map((item) => item.id === rule.id ? { ...item, enabled: !item.enabled } : item));
  }

  function addRule() {
    demo.updateCollection("alertRules", [
      { id: `rule-${Date.now()}`, name: "新增规则", type: "质检不合格规则", businessUnit: "欧力菲德乳品厂", condition: "质检结果 != 合格", threshold: "不合格", enabled: true, priority: "高", suggestion: "锁定批次并生成质检异常消息", lastTriggeredAt: "", note: "新增演示规则" },
      ...(demo.data.alertRules || [])
    ]);
  }

  function remove(id) {
    if (window.confirm("确定删除该规则吗？")) demo.updateCollection("alertRules", demo.data.alertRules.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-pasture-700">数据质量 / 异常规则</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">规则中心</h1>
            <p className="mt-2 text-base leading-7 text-slate-600">用前端规则扫描 localStorage 数据，解释库存、设备、环境、配送、账本等预警为何触发。</p>
          </div>
          <button onClick={addRule} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 新增规则</button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="规则总数" value={(demo.data.alertRules || []).length} unit="条" />
        <MetricCard label="启用规则" value={enabled} unit="条" tone="green" />
        <MetricCard label="触发异常" value={triggered.length} unit="条" tone={triggered.length ? "red" : "green"} />
        <MetricCard label="消息联动" value={(demo.data.messages || []).filter((item) => item.priority === "紧急" || item.priority === "高").length} unit="条" tone="amber" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="当前触发结果" />
        <div className="grid gap-2 md:grid-cols-2">
          {triggered.map((item) => <p key={`${item.ruleType}-${item.title}`} className="rounded-[8px] bg-red-50 p-3 text-base font-bold text-red-700">{item.ruleType}：{item.title}，{item.reason}</p>)}
          {!triggered.length && <p className="rounded-[8px] bg-emerald-50 p-3 text-lg font-bold text-pasture-800">当前启用规则未发现异常。</p>}
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="规则列表" />
        <div className="space-y-3">
          {(demo.data.alertRules || []).map((rule) => (
            <article key={rule.id} className="rounded-[8px] bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-pasture-700">{rule.type} · {rule.businessUnit}</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">{rule.name}</h3>
                  <p className="mt-2 text-base font-bold text-slate-600">条件：{rule.condition} · 阈值：{rule.threshold} · 级别：{rule.priority}</p>
                  <p className="mt-2 text-base text-slate-600">建议：{rule.suggestion}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-black ${rule.enabled ? "bg-pasture-100 text-pasture-800" : "bg-slate-200 text-slate-600"}`}>{rule.enabled ? "启用" : "停用"}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => toggle(rule)} className="min-h-11 rounded-[8px] bg-white font-bold text-slate-800 ring-1 ring-slate-200"><Power className="mr-1 inline" size={16} />启停</button>
                <button onClick={() => remove(rule.id)} className="min-h-11 rounded-[8px] bg-red-50 font-bold text-red-700"><Trash2 className="mr-1 inline" size={16} />删除</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
