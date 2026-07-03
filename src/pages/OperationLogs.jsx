import { useMemo, useState } from "react";
import SectionTitle from "../components/SectionTitle.jsx";
import MetricCard from "../components/MetricCard.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const all = "全部";

export default function OperationLogs() {
  const demo = useDemo();
  const [operator, setOperator] = useState(all);
  const [module, setModule] = useState(all);
  const [action, setAction] = useState(all);
  const logs = demo.data.operationLogs || [];
  const options = useMemo(() => ({
    operators: [all, ...new Set(logs.map((item) => item.operator))],
    modules: [all, ...new Set(logs.map((item) => item.module))],
    actions: [all, ...new Set(logs.map((item) => item.action))]
  }), [logs]);
  const filtered = logs.filter((item) => (operator === all || item.operator === operator) && (module === all || item.module === module) && (action === all || item.action === action));

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p className="text-sm font-black text-pasture-700">审计留痕 / 前端模拟</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">操作日志</h1>
        <p className="mt-2 text-base leading-7 text-slate-600">记录新增、编辑、删除、导入、重置、审批和状态变更等操作。正式系统应由后端统一写入不可篡改审计日志。</p>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="日志总数" value={logs.length} unit="条" />
        <MetricCard label="审批日志" value={logs.filter((item) => item.action === "审批").length} unit="条" tone="blue" />
        <MetricCard label="状态变更" value={logs.filter((item) => item.action === "状态变更").length} unit="条" tone="amber" />
        <MetricCard label="当前角色" value={demo.currentRole} unit="" tone="green" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="grid gap-3 md:grid-cols-3">
          <Select label="操作人" value={operator} setValue={setOperator} items={options.operators} />
          <Select label="模块" value={module} setValue={setModule} items={options.modules} />
          <Select label="操作类型" value={action} setValue={setAction} items={options.actions} />
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="日志列表" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-left">
            <thead className="text-sm text-slate-500"><tr>{["时间", "操作人", "模块", "类型", "对象", "摘要", "角色视图"].map((head) => <th key={head} className="px-3 py-2 font-black">{head}</th>)}</tr></thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="bg-slate-50 text-base">
                  <td className="px-3 py-3 font-bold">{log.operatedAt}</td>
                  <td className="px-3 py-3">{log.operator}</td>
                  <td className="px-3 py-3">{log.module}</td>
                  <td className="px-3 py-3">{log.action}</td>
                  <td className="px-3 py-3">{log.objectName}</td>
                  <td className="px-3 py-3">{log.summary}</td>
                  <td className="px-3 py-3">{log.roleView}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Select({ label, value, setValue, items }) {
  return <label className="block text-sm font-black text-slate-500">{label}<select value={value} onChange={(event) => setValue(event.target.value)} className="input-lg mt-2">{items.map((item) => <option key={item}>{item}</option>)}</select></label>;
}
