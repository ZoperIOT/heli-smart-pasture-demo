import { useState } from "react";
import { Check, Plus, RotateCcw, X } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { summarizeApprovals } from "../services/platformServices.js";

const all = "全部";

export default function Approvals() {
  const demo = useDemo();
  const [type, setType] = useState(all);
  const [status, setStatus] = useState(all);
  const [unit, setUnit] = useState(all);
  const summary = summarizeApprovals(demo.data.approvalRequests || []);
  const list = (demo.data.approvalRequests || []).filter((item) =>
    (type === all || item.type === type) &&
    (status === all || item.status === status) &&
    (unit === all || item.businessUnit === unit)
  );
  const types = [all, ...new Set((demo.data.approvalRequests || []).map((item) => item.type))];
  const units = [all, ...new Set((demo.data.approvalRequests || []).map((item) => item.businessUnit))];

  function addApproval() {
    demo.upsertApproval({
      type: "异常处理确认",
      businessUnit: "集团",
      applicant: demo.currentRole,
      approver: "集团管理员",
      amount: 0,
      reason: "新增一条平台演示审批申请",
      relatedType: "手工新增",
      relatedId: "manual"
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-pasture-700">权限流 / 业务状态流转</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">审批中心</h1>
            <p className="mt-2 text-base leading-7 text-slate-600">模拟采购、入库、调拨、出栏、销售、维修和大额支出确认，审批通过后可用于联动业务状态。</p>
          </div>
          <button onClick={addApproval} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 新增审批</button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="待审批" value={summary.pending} unit="条" tone={summary.pending ? "amber" : "green"} />
        <MetricCard label="已通过" value={summary.passed} unit="条" tone="green" />
        <MetricCard label="已驳回" value={summary.rejected} unit="条" tone="red" />
        <MetricCard label="已撤回" value={summary.withdrawn} unit="条" tone="blue" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="grid gap-3 md:grid-cols-3">
          <Select label="审批类型" value={type} setValue={setType} items={types} />
          <Select label="审批状态" value={status} setValue={setStatus} items={[all, "待审批", "已通过", "已驳回", "已撤回"]} />
          <Select label="业务板块" value={unit} setValue={setUnit} items={units} />
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="审批列表" />
        <div className="space-y-3">
          {list.map((item) => (
            <article key={item.id} className="rounded-[8px] bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-pasture-700">{item.no} · {item.businessUnit}</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-950">{item.type}</h3>
                  <p className="mt-2 text-lg leading-8 text-slate-700">{item.reason}</p>
                  <p className="mt-2 text-sm font-bold text-slate-500">申请人：{item.applicant} · 审批人：{item.approver} · 金额：{Number(item.amount || 0).toLocaleString()} 元 · 状态：{item.status}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button onClick={() => demo.setApprovalStatus(item.id, "已通过", "演示审批通过")} className="min-h-11 rounded-[8px] bg-pasture-700 font-bold text-white"><Check className="mr-1 inline" size={16} />通过</button>
                <button onClick={() => demo.setApprovalStatus(item.id, "已驳回", "演示审批驳回")} className="min-h-11 rounded-[8px] bg-red-50 font-bold text-red-700"><X className="mr-1 inline" size={16} />驳回</button>
                <button onClick={() => demo.setApprovalStatus(item.id, "已撤回", "申请人撤回")} className="min-h-11 rounded-[8px] bg-slate-200 font-bold text-slate-800"><RotateCcw className="mr-1 inline" size={16} />撤回</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Select({ label, value, setValue, items }) {
  return <label className="block text-sm font-black text-slate-500">{label}<select value={value} onChange={(event) => setValue(event.target.value)} className="input-lg mt-2">{items.map((item) => <option key={item}>{item}</option>)}</select></label>;
}
