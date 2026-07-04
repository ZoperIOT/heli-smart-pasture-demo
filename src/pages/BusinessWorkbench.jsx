import {
  BarChart3,
  Boxes,
  ClipboardList,
  HeartPulse,
  Milk,
  PackageMinus,
  PackagePlus,
  ReceiptText,
  Route,
  Scale,
  Sprout,
  Truck
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BarRankChart, TrendChart } from "../components/ChartCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import PageShell from "../components/common/PageShell.jsx";
import QuickActionGrid from "../components/common/QuickActionGrid.jsx";
import StatGrid from "../components/common/StatGrid.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const workspaceConfig = {
  dairy: {
    eyebrow: "合力牧业奶牛场",
    title: "合力牧业奶牛场工作台",
    description: "聚合产奶、牛舍、繁育、防疫、饲喂、原奶配送和奶牛场库存预警。",
    actions: [
      { to: "/dairy-cows", label: "奶牛档案", icon: Sprout },
      { to: "/barns", label: "牛舍管理", icon: Boxes },
      { to: "/milk", label: "产奶记录", icon: Milk },
      { to: "/breeding", label: "繁育管理", icon: HeartPulse },
      { to: "/health-events", label: "健康防疫", icon: HeartPulse },
      { to: "/feeding-plans", label: "饲喂管理", icon: PackageMinus },
      { to: "/raw-milk-delivery", label: "原奶配送", icon: Route },
      { to: "/dairy-farm-inventory", label: "奶牛场库存", icon: Boxes },
      { to: "/cow-events", label: "牛只事件时间线", icon: ClipboardList }
    ]
  },
  beef: {
    eyebrow: "欧力菲德肉牛场",
    title: "欧力菲德肉牛场工作台",
    description: "聚合育肥批次、体重增重、出栏计划、生物资产、饲喂消耗和肉牛场库存。",
    actions: [
      { to: "/beef-cows", label: "肉牛档案", icon: Sprout },
      { to: "/beef-batches", label: "育肥批次", icon: ClipboardList },
      { to: "/weight-records", label: "体重记录", icon: BarChart3 },
      { to: "/herd-groups", label: "智能分群", icon: ClipboardList },
      { to: "/beef-sales", label: "出栏销售", icon: ReceiptText },
      { to: "/biological-assets", label: "生物资产台账", icon: ReceiptText },
      { to: "/beef-farm-inventory", label: "肉牛场库存", icon: Boxes },
      { to: "/health-events", label: "健康防疫", icon: HeartPulse }
    ]
  },
  feed: {
    eyebrow: "欧力菲德饲料厂",
    title: "欧力菲德饲料厂工作台",
    description: "聚合原料库存、饲料成品、生产记录、内部调拨、采购供应商和过磅记录。",
    actions: [
      { to: "/feed-raw-materials", label: "原料库存", icon: Boxes },
      { to: "/feed-products", label: "饲料成品", icon: PackagePlus },
      { to: "/feed-production", label: "饲料生产", icon: BarChart3 },
      { to: "/feed-transfers", label: "内部调拨", icon: Route },
      { to: "/feed-purchases", label: "采购记录", icon: PackagePlus },
      { to: "/partners", label: "供应商管理", icon: ReceiptText },
      { to: "/weighbridge", label: "过磅管理", icon: Scale },
      { to: "/inventory-warnings", label: "库存预警", icon: Boxes }
    ]
  },
  dairyPlant: {
    eyebrow: "欧力菲德乳品厂",
    title: "欧力菲德乳品厂工作台",
    description: "聚合原奶接收、质检、生产计划、灌装、成品库存、销售订单和退货记录。",
    actions: [
      { to: "/milk-receiving", label: "原奶接收", icon: Milk },
      { to: "/milk-quality", label: "质检记录", icon: ClipboardList },
      { to: "/dairy-production-plans", label: "生产计划", icon: ClipboardList },
      { to: "/dairy-production", label: "生产批次", icon: BarChart3 },
      { to: "/filling-records", label: "灌装记录", icon: PackagePlus },
      { to: "/finished-quality", label: "成品质检", icon: ClipboardList },
      { to: "/dairy-product-inventory", label: "成品库存", icon: Boxes },
      { to: "/dairy-sales-orders", label: "销售订单", icon: ReceiptText },
      { to: "/return-records", label: "退货记录", icon: PackageMinus }
    ]
  }
};

export default function BusinessWorkbench({ type }) {
  const demo = useDemo();
  const [historyStatus, setHistoryStatus] = useState("全部");
  const config = workspaceConfig[type] || workspaceConfig.dairy;
  const stats = buildStats(type, demo);
  const unitOrders = (demo.data.workOrders || []).filter((item) => item.businessUnit === config.eyebrow);
  const todayOrders = unitOrders.filter((item) => String(item.plannedAt || "").startsWith(new Date().toISOString().slice(0, 10)));
  const runningOrders = unitOrders.filter((item) => ["待处理", "处理中", "待执行", "执行中", "待审批"].includes(item.status));
  const historyOrders = unitOrders.filter((item) => historyStatus === "全部" || item.status === historyStatus).slice(0, 6);
  const recentMessages = (demo.data.messages || []).filter((item) => item.businessUnit === config.eyebrow || item.businessUnit === "集团").slice(0, 4);
  const aiText = buildSuggestion(type, demo);

  return (
    <PageShell>
      <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} action={<Link to="/ai" className="rounded-[8px] bg-slate-900 px-4 py-3 text-base font-bold text-white">问 AI 助手</Link>} />
      <StatGrid items={stats.cards} columns="md:grid-cols-4" />

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <TaskPanel title="今日待办" items={todayOrders} empty="今日暂无待办工单。" />
        <TaskPanel title="进行中工单" items={runningOrders} empty="暂无进行中工单。" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title={stats.chartTitle} />
          {stats.chartData.length ? stats.chartType === "bar" ? <BarRankChart data={stats.chartData} /> : <TrendChart data={stats.chartData} /> : <EmptyState />}
        </div>
        <div className="space-y-4">
          <Panel title="消息预警" items={recentMessages.map((item) => `${item.priority}：${item.title}`)} />
          <Panel title="最近业务动态" items={buildActivities(type, demo)} />
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle title="历史工单" />
          <select value={historyStatus} onChange={(event) => setHistoryStatus(event.target.value)} className="min-h-11 rounded-[8px] border border-slate-200 bg-white px-3 font-bold text-slate-700">
            {["全部", "待处理", "处理中", "待审批", "待执行", "执行中", "已完成", "已驳回", "已取消", "超时"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <TaskTable items={historyOrders} />
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="常用功能入口" />
        <QuickActionGrid items={config.actions} />
      </section>

      <section className="rounded-[8px] bg-emerald-50 p-4 ring-1 ring-emerald-100">
        <SectionTitle title="AI 建议" />
        <p className="text-lg font-bold leading-8 text-pasture-900">{aiText}</p>
      </section>
    </PageShell>
  );
}

function TaskPanel({ title, items, empty }) {
  return (
    <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <SectionTitle title={title} />
      <div className="space-y-3">
        {items.slice(0, 5).map((item) => (
          <Link key={item.id} to="/work-orders" className="block rounded-[8px] bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-pasture-700">{item.no || item.id} · {item.type}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-950">{item.content}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">处理人：{item.owner} · 计划：{item.plannedAt}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>{item.status}</span>
            </div>
          </Link>
        ))}
        {!items.length && <EmptyState text={empty} />}
      </div>
    </section>
  );
}

function TaskTable({ items }) {
  if (!items.length) return <EmptyState text="暂无历史工单。" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left">
        <thead className="text-sm text-slate-500">
          <tr>{["工单", "业务类型", "状态", "发起人", "处理人", "组织", "时间", "备注"].map((head) => <th key={head} className="px-3 py-2 font-black">{head}</th>)}</tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="bg-slate-50 text-base">
              <td className="px-3 py-3 font-bold text-slate-900">{item.no || item.id}</td>
              <td className="px-3 py-3">{item.type}</td>
              <td className="px-3 py-3"><span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>{item.status}</span></td>
              <td className="px-3 py-3">{item.applicant || "系统"}</td>
              <td className="px-3 py-3">{item.owner}</td>
              <td className="px-3 py-3">{item.businessUnit}</td>
              <td className="px-3 py-3">{item.plannedAt}</td>
              <td className="px-3 py-3">{item.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function statusClass(status = "") {
  if (["已完成", "在线", "正常"].includes(status)) return "bg-emerald-100 text-pasture-800";
  if (["处理中", "执行中", "配送中", "待处理"].includes(status)) return "bg-sky-100 text-sky-800";
  if (["待审批", "待执行", "即将到期"].includes(status)) return "bg-amber-100 text-amber-800";
  if (["异常", "超时", "离线", "已驳回"].includes(status)) return "bg-red-100 text-red-700";
  return "bg-slate-200 text-slate-700";
}

function buildActivities(type, demo) {
  if (type === "dairy") return (demo.data.cowEvents || []).filter((item) => item.businessUnit === "合力牧业奶牛场").slice(0, 4).map((item) => `${item.code}：${item.type}，${item.content}`);
  if (type === "beef") return (demo.data.cowEvents || []).filter((item) => item.businessUnit === "欧力菲德肉牛场").slice(0, 4).map((item) => `${item.code}：${item.type}，${item.content}`);
  if (type === "feed") return (demo.data.feedProductionRecords || []).slice(0, 4).map((item) => `${item.feedName} 生产 ${item.quantity}${item.unit}`);
  return (demo.data.dairyProductionBatches || []).slice(0, 4).map((item) => `${item.productName} 生产 ${item.quantity}${item.unit}`);
}

function buildStats(type, demo) {
  const { data, metrics } = demo;
  if (type === "dairy") {
    return {
      cards: [
        { label: "今日产奶", value: metrics.milkAmount.toFixed(1), unit: "吨" },
        { label: "昨日产奶", value: metrics.yesterdayMilkAmount.toFixed(1), unit: "吨", tone: "blue" },
        { label: "奶牛存栏", value: metrics.dairyCowCount, unit: "头" },
        { label: "重点关注", value: metrics.focusCount, unit: "头", tone: metrics.focusCount ? "amber" : "green" },
        { label: "繁育提醒", value: metrics.breedingReminders, unit: "条", tone: "amber" },
        { label: "防疫提醒", value: metrics.healthReminders, unit: "条", tone: "amber" },
        { label: "饲喂完成率", value: metrics.workOrderCompletionRate.toFixed(0), unit: "%" },
        { label: "库存预警", value: metrics.pastureWarnings.length, unit: "项", tone: metrics.pastureWarnings.length ? "red" : "green" }
      ],
      chartTitle: "近 7 天产奶趋势",
      chartType: "line",
      chartData: data.milkRecords.slice(0, 7).reverse().map((item) => ({ day: item.date.slice(5), milk: Number(item.total || 0) }))
    };
  }
  if (type === "beef") {
    const avgWeight = (data.beefBatches || []).reduce((sum, item) => sum + Number(item.avgWeight || 0), 0) / Math.max(1, (data.beefBatches || []).length);
    const avgGain = (data.beefBatches || []).reduce((sum, item) => sum + Number(item.avgDailyGain || 0), 0) / Math.max(1, (data.beefBatches || []).length);
    return {
      cards: [
        { label: "肉牛存栏", value: metrics.beefCowCount, unit: "头" },
        { label: "育肥批次", value: (data.beefBatches || []).length, unit: "个", tone: "blue" },
        { label: "平均体重", value: avgWeight.toFixed(0), unit: "kg" },
        { label: "平均日增重", value: avgGain.toFixed(2), unit: "kg" },
        { label: "可出栏", value: metrics.readyForSaleAssets, unit: "头/批", tone: "amber" },
        { label: "资产估值", value: (metrics.biologicalAssetValue / 10000).toFixed(1), unit: "万元", tone: "amber" },
        { label: "饲料消耗", value: metrics.feedingActualToday.toFixed(1), unit: "吨", tone: "blue" },
        { label: "健康提醒", value: metrics.healthReminders, unit: "条", tone: "amber" }
      ],
      chartTitle: "育肥批次均重",
      chartType: "bar",
      chartData: (data.beefBatches || []).map((item) => ({ name: item.name, sales: Number(item.avgWeight || 0), value: Number(item.avgWeight || 0) }))
    };
  }
  if (type === "feed") {
    return {
      cards: [
        { label: "今日生产", value: metrics.feedTodayOutput.toFixed(1), unit: "吨" },
        { label: "原料预警", value: metrics.feedWarnings.length, unit: "项", tone: metrics.feedWarnings.length ? "red" : "green" },
        { label: "成品库存", value: (data.feedProducts || []).reduce((sum, item) => sum + Number(item.stock || 0), 0), unit: "吨" },
        { label: "今日调拨", value: (data.feedTransfers || []).filter((item) => item.date === new Date().toISOString().slice(0, 10)).length, unit: "单", tone: "blue" },
        { label: "采购记录", value: (data.stockInRecords || []).length, unit: "条" },
        { label: "供应商", value: (data.partners || []).filter((item) => item.role === "供应商").length, unit: "家" },
        { label: "最近过磅", value: metrics.weighbridgeToday, unit: "单", tone: "blue" },
        { label: "接口异常", value: metrics.interfaceAbnormalCount, unit: "个", tone: metrics.interfaceAbnormalCount ? "red" : "green" }
      ],
      chartTitle: "饲料成品库存",
      chartType: "bar",
      chartData: (data.feedProducts || []).map((item) => ({ name: item.name, sales: Number(item.stock || 0), value: Number(item.stock || 0) }))
    };
  }
  return {
    cards: [
      { label: "原奶接收", value: metrics.rawMilkReceivedToday.toFixed(1), unit: "吨" },
      { label: "质检批次", value: (data.milkQualityRecords || []).length, unit: "批", tone: "blue" },
      { label: "合格率", value: "99", unit: "%", tone: "green" },
      { label: "生产批次", value: (data.dairyProductionBatches || []).length, unit: "批" },
      { label: "成品库存", value: metrics.dairyProductStock, unit: "件" },
      { label: "销售订单", value: (data.dairySalesOrders || []).length, unit: "单", tone: "blue" },
      { label: "退货记录", value: (data.returnRecords || []).length, unit: "条", tone: "amber" },
      { label: "生产计划", value: (data.dairyProductionPlans || []).length, unit: "条" }
    ],
    chartTitle: "乳品成品库存",
    chartType: "bar",
    chartData: (data.dairyProductInventory || []).map((item) => ({ name: item.name, sales: Number(item.stock || 0), value: Number(item.stock || 0) }))
  };
}

function buildSuggestion(type, demo) {
  const map = {
    dairy: `今日重点关注产奶 ${demo.metrics.milkAmount.toFixed(1)} 吨、繁育提醒 ${demo.metrics.breedingReminders} 条、防疫/休药提醒 ${demo.metrics.healthReminders} 条。建议先处理重点牛只和环境风险。`,
    beef: `欧力菲德肉牛场当前资产估值 ${(demo.metrics.biologicalAssetValue / 10000).toFixed(1)} 万元，可出栏 ${demo.metrics.readyForSaleAssets} 头/批。建议结合体重记录和出栏审批安排销售。`,
    feed: `欧力菲德饲料厂今日生产 ${demo.metrics.feedTodayOutput.toFixed(1)} 吨，库存预警 ${demo.metrics.feedWarnings.length} 项。建议优先核查豆粕等低库存原料。`,
    dairyPlant: `欧力菲德乳品厂今日接收原奶 ${demo.metrics.rawMilkReceivedToday.toFixed(1)} 吨，成品库存 ${demo.metrics.dairyProductStock} 件。建议关注销售出库和退货记录。`
  };
  return map[type] || map.dairy;
}

function Panel({ title, items }) {
  return (
    <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <SectionTitle title={title} />
      {items.length ? (
        <div className="space-y-2">
          {items.map((item) => <p key={item} className="rounded-[8px] bg-slate-50 p-3 text-base font-bold text-slate-700">{item}</p>)}
        </div>
      ) : <EmptyState text="暂无记录。" />}
    </section>
  );
}
