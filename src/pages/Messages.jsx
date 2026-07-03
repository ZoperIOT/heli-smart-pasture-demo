import { useMemo, useState } from "react";
import { CheckCheck, Eye, Link as LinkIcon, ShieldAlert, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { summarizeMessages } from "../services/platformServices.js";

const all = "全部";

export default function Messages() {
  const demo = useDemo();
  const [type, setType] = useState(all);
  const [priority, setPriority] = useState(all);
  const [status, setStatus] = useState(all);
  const [unit, setUnit] = useState(all);
  const summary = summarizeMessages(demo.data.messages || []);
  const options = useMemo(() => ({
    types: [all, ...new Set((demo.data.messages || []).map((item) => item.type))],
    priorities: [all, "紧急", "高", "中", "低"],
    statuses: [all, "未读", "已读", "已处理", "已忽略"],
    units: [all, ...new Set((demo.data.messages || []).map((item) => item.businessUnit))]
  }), [demo.data.messages]);
  const messages = (demo.data.messages || []).filter((item) =>
    (type === all || item.type === type) &&
    (priority === all || item.priority === priority) &&
    (status === all || item.status === status) &&
    (unit === all || item.businessUnit === unit)
  );

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-pasture-700">消息流 / 预警中心</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">消息中心</h1>
            <p className="mt-2 text-base leading-7 text-slate-600">统一承接公告、工单、库存、设备、环境、防疫、繁育、审批等提醒，展示未来消息推送能力。</p>
          </div>
          <button onClick={demo.markAllMessagesRead} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white">
            <CheckCheck size={20} /> 一键已读
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="未读消息" value={summary.unread} unit="条" tone={summary.unread ? "amber" : "green"} />
        <MetricCard label="紧急预警" value={summary.urgent} unit="条" tone={summary.urgent ? "red" : "green"} />
        <MetricCard label="待处理" value={summary.pending} unit="条" tone="blue" />
        <MetricCard label="已处理" value={summary.handled} unit="条" tone="green" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="grid gap-3 md:grid-cols-4">
          <Select label="类型" value={type} setValue={setType} items={options.types} />
          <Select label="优先级" value={priority} setValue={setPriority} items={options.priorities} />
          <Select label="状态" value={status} setValue={setStatus} items={options.statuses} />
          <Select label="业务板块" value={unit} setValue={setUnit} items={options.units} />
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="预警消息列表" />
        <div className="space-y-3">
          {messages.map((message) => (
            <article key={message.id} className={`rounded-[8px] p-4 ring-1 ${message.priority === "紧急" ? "bg-red-50 ring-red-100" : message.status === "未读" ? "bg-amber-50 ring-amber-100" : "bg-slate-50 ring-slate-100"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-600 ring-1 ring-slate-200">{message.type}</span>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-black text-white">{message.priority}</span>
                    <span className="rounded-full bg-pasture-100 px-3 py-1 text-sm font-black text-pasture-800">{message.status}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-slate-950">{message.title}</h3>
                  <p className="mt-2 text-lg leading-8 text-slate-700">{message.content}</p>
                  <p className="mt-2 text-sm font-bold text-slate-500">{message.businessUnit} · 接收人：{message.receiver} · {message.createdAt}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                <button onClick={() => demo.updateMessageStatus(message.id, "已读")} className="min-h-11 rounded-[8px] bg-white px-3 font-bold text-slate-700 ring-1 ring-slate-200"><Eye className="mr-1 inline" size={16} />已读</button>
                <button onClick={() => demo.updateMessageStatus(message.id, "已处理", "已在演示系统中处理")} className="min-h-11 rounded-[8px] bg-pasture-700 px-3 font-bold text-white"><ShieldAlert className="mr-1 inline" size={16} />处理</button>
                <button onClick={() => demo.updateMessageStatus(message.id, "已忽略", "演示中忽略")} className="min-h-11 rounded-[8px] bg-slate-200 px-3 font-bold text-slate-800"><Trash2 className="mr-1 inline" size={16} />忽略</button>
                <button onClick={() => alert(`关联业务：${message.relatedType}\n记录ID：${message.relatedId}`)} className="min-h-11 rounded-[8px] bg-sky-50 px-3 font-bold text-sky-700"><LinkIcon className="mr-1 inline" size={16} />关联业务</button>
              </div>
            </article>
          ))}
          {!messages.length && <p className="rounded-[8px] bg-slate-50 p-5 text-lg font-bold text-slate-600">暂无匹配消息。</p>}
        </div>
      </section>
    </div>
  );
}

function Select({ label, value, setValue, items }) {
  return (
    <label className="block text-sm font-black text-slate-500">
      {label}
      <select value={value} onChange={(event) => setValue(event.target.value)} className="input-lg mt-2">
        {items.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}
