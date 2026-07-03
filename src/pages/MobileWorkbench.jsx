import { AlertTriangle, Camera, CheckCircle2, ClipboardList, Milk, QrCode, Truck } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";

export default function MobileWorkbench() {
  const demo = useDemo();
  const tasks = demo.data.mobileTasks || [];
  const messages = (demo.data.messages || []).filter((item) => item.status === "未读").slice(0, 3);
  const guides = (demo.data.knowledgeBase || []).filter((item) => item.pinned).slice(0, 3);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-soft">
        <p className="text-sm font-bold text-emerald-100">移动端员工工作台</p>
        <h1 className="mt-1 text-3xl font-bold">今日任务</h1>
        <p className="mt-2 text-base text-white/75">{demo.currentRole} · 未来小程序 / APP 能力占位</p>
      </section>

      <section className="grid grid-cols-4 gap-2">
        <Quick icon={Milk} label="产奶录入" />
        <Quick icon={ClipboardList} label="饲喂执行" />
        <Quick icon={AlertTriangle} label="异常上报" />
        <Quick icon={QrCode} label="扫一扫" />
      </section>

      <section className="rounded-[18px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="我的任务" />
        <div className="space-y-3">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-[14px] bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-pasture-700">{task.type} · {task.businessUnit}</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">{task.title}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-500">{task.owner} · {task.plannedAt}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${task.status === "已完成" ? "bg-emerald-100 text-pasture-800" : "bg-amber-100 text-amber-800"}`}>{task.status}</span>
              </div>
              <button className="mt-3 min-h-11 w-full rounded-[12px] bg-pasture-700 font-bold text-white">{task.quickAction}</button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[18px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="消息提醒" />
        {messages.map((item) => <p key={item.id} className="mb-2 rounded-[12px] bg-amber-50 p-3 text-base font-bold text-amber-800">{item.title}</p>)}
        {!messages.length && <p className="rounded-[12px] bg-emerald-50 p-3 font-bold text-pasture-800">暂无未读消息。</p>}
      </section>

      <section className="rounded-[18px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="常用指南" />
        {guides.map((item) => <p key={item.id} className="mb-2 rounded-[12px] bg-slate-50 p-3 text-base font-bold text-slate-700">{item.title}</p>)}
      </section>

      <section className="grid grid-cols-2 gap-2 pb-[max(20px,env(safe-area-inset-bottom))]">
        <button className="min-h-14 rounded-[14px] bg-slate-900 font-bold text-white"><Truck className="mr-1 inline" />配送确认</button>
        <button className="min-h-14 rounded-[14px] bg-slate-100 font-bold text-slate-800"><Camera className="mr-1 inline" />上传照片</button>
      </section>
    </div>
  );
}

function Quick({ icon: Icon, label }) {
  return (
    <button className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-[16px] bg-white text-sm font-black text-slate-700 shadow-soft ring-1 ring-slate-100">
      <Icon size={24} className="text-pasture-700" />
      {label}
    </button>
  );
}
