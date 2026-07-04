import { PlugZap, Plus, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { summarizeInterfaces } from "../services/platformServices.js";

export default function IntegrationCenter() {
  const demo = useDemo();
  const summary = summarizeInterfaces(demo.data.externalInterfaces || []);

  function addInterface() {
    demo.updateCollection("externalInterfaces", [
      { id: `int-${Date.now()}`, name: "新增接口配置", type: "微信小程序接口", businessUnit: "集团", endpoint: "https://demo.local/new", authType: "Token 占位", status: "未配置", lastSyncAt: "", todaySyncCount: 0, owner: demo.currentRole, note: "不真实请求外部系统" },
      ...(demo.data.externalInterfaces || [])
    ]);
  }

  function remove(id) {
    if (window.confirm("确定删除该接口配置吗？")) demo.updateCollection("externalInterfaces", demo.data.externalInterfaces.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-pasture-700">数据流 / 外部系统集成</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">接口管理中心</h1>
            <p className="mt-2 text-base leading-7 text-slate-600">配置奶厅、TMR、称重、地磅、耳标、环境、ERP、MES、财务、小程序和 AI 接口占位，测试连接只改变前端状态。</p>
          </div>
          <button onClick={addInterface} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 新增接口</button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="接口总数" value={summary.total} unit="个" />
        <MetricCard label="连接正常" value={summary.normal} unit="个" tone="green" />
        <MetricCard label="已配置" value={summary.configured} unit="个" tone="blue" />
        <MetricCard label="异常/未配置" value={summary.abnormal} unit="个" tone={summary.abnormal ? "red" : "green"} />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="接口配置列表" />
        <div className="grid gap-3 lg:grid-cols-2">
          {(demo.data.externalInterfaces || []).map((item) => (
            <article key={item.id} className="rounded-[8px] bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-sm font-black text-pasture-700">{item.type} · {item.businessUnit}</p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">{item.name}</h3>
              <p className="mt-2 break-all text-base font-bold text-slate-600">{item.endpoint}</p>
              <p className="mt-2 text-sm font-bold text-slate-500">鉴权：{item.authType} · 状态：{item.status} · 今日同步：{item.todaySyncCount} 条</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => demo.simulateInterfaceTest(item.id)} className="min-h-11 rounded-[8px] bg-pasture-700 px-3 font-bold text-white"><PlugZap className="mr-1 inline" size={16} />模拟测试</button>
                <button onClick={() => remove(item.id)} className="min-h-11 rounded-[8px] bg-red-50 px-3 font-bold text-red-700"><Trash2 className="mr-1 inline" size={16} />删除</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
