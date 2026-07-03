import { Link } from "react-router-dom";
import { Bot, Boxes, ClipboardList, Database, MessageSquareWarning, MonitorSmartphone, PlugZap, ReceiptText, Route, ShieldCheck, Sprout, Truck } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import PageShell from "../components/common/PageShell.jsx";
import QuickActionGrid from "../components/common/QuickActionGrid.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const businessUnits = [
  { name: "合力牧业奶牛场", desc: "奶牛档案、产奶、繁育、防疫、饲喂、原奶配送", to: "/dairy-workbench" },
  { name: "欧力菲德肉牛场", desc: "育肥批次、称重增重、出栏销售、生物资产", to: "/beef-workbench" },
  { name: "欧力菲德饲料厂", desc: "原料库存、饲料生产、成品库存、内部调拨", to: "/feed-workbench" },
  { name: "欧力菲德乳品厂", desc: "原奶接收、质检、生产计划、成品库存、销售订单", to: "/dairy-plant-workbench" }
];

const flows = [
  ["业务流", "工单、生产、质检、销售、出栏"],
  ["物流", "配送任务、车辆、过磅、签收"],
  ["资金流", "收支账本、成本、利润、生物资产"],
  ["数据流", "报表、大屏、分析模板、质量规则"],
  ["权限流", "角色视图、菜单范围、只读模式"],
  ["消息流", "消息预警、审批待办、异常提醒"],
  ["设备流", "设备状态、环境监控、接口管理"]
];

const capabilities = [
  { to: "/work-orders", label: "工单中心", icon: ClipboardList },
  { to: "/messages", label: "消息预警", icon: MessageSquareWarning },
  { to: "/feeding-records", label: "饲喂管理", icon: Boxes },
  { to: "/cow-events", label: "牛只事件", icon: Sprout },
  { to: "/traceability-center", label: "质量追溯", icon: Route },
  { to: "/stock-in", label: "进销存", icon: Boxes },
  { to: "/ledger", label: "收支账本", icon: ReceiptText },
  { to: "/reports", label: "经营报表", icon: Database },
  { to: "/external-interfaces", label: "设备接口", icon: PlugZap },
  { to: "/ai", label: "AI 助手", icon: Bot },
  { to: "/mobile-workbench", label: "员工工作台", icon: MonitorSmartphone },
  { to: "/system-plan", label: "企业微信 / 小程序预留", icon: Truck }
];

export default function PlatformOverview() {
  return (
    <PageShell>
      <PageHeader
        dark
        eyebrow="平台能力总览"
        title="合力牧业农牧乳一体化经营平台"
        description="从四大业务板块到七流合一能力，用一个页面向企业负责人说明系统边界、价值和后续上线方向。"
        action={<Link to="/system-plan" className="rounded-[8px] bg-white px-4 py-3 font-bold text-slate-950">查看建设方案</Link>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {businessUnits.map((item) => (
          <Link key={item.name} to={item.to} className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:ring-pasture-200">
            <p className="text-sm font-black text-pasture-700">业务板块</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">{item.name}</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">{item.desc}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="七流合一能力" />
        <div className="grid gap-3 md:grid-cols-7">
          {flows.map(([name, desc]) => (
            <article key={name} className="rounded-[8px] bg-slate-50 p-4">
              <p className="text-xl font-black text-slate-950">{name}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="核心能力模块" />
        <QuickActionGrid items={capabilities} columns="sm:grid-cols-3 xl:grid-cols-6" />
      </section>

      <section className="rounded-[8px] bg-emerald-50 p-4 ring-1 ring-emerald-100">
        <SectionTitle title="后续上线路线" />
        <div className="grid gap-3 md:grid-cols-6">
          {["前端演示版", "后端数据库版", "企业微信通知", "小程序员工端", "IoT 设备接入", "AI 经营助手"].map((item, index) => (
            <div key={item} className="rounded-[8px] bg-white p-4 text-center">
              <p className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-pasture-700 font-black text-white">{index + 1}</p>
              <p className="mt-3 text-base font-black text-slate-800">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
