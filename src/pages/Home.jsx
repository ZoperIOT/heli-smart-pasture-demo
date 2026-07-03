import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BookOpen, Bot, Boxes, ClipboardList, Cpu, FileText, Gauge, MessageSquareWarning, Milk, PackageMinus, PackagePlus, Pin, PlugZap, ReceiptText, RotateCcw, Route, Save, Search, Settings, ShieldCheck, Smartphone, Sprout, Truck, UserCog } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { BarRankChart, SharePie, TrendChart } from "../components/ChartCard.jsx";
import { buildSimpleReport } from "../data/demoFlow.js";

const quickLinks = [
  { to: "/dairy-cows", label: "奶牛档案", icon: Sprout },
  { to: "/beef-cows", label: "肉牛档案", icon: Sprout },
  { to: "/work-orders", label: "工单中心", icon: ClipboardList },
  { to: "/messages", label: "消息预警", icon: MessageSquareWarning },
  { to: "/approvals", label: "审批中心", icon: ShieldCheck },
  { to: "/role-simulation", label: "角色模拟", icon: UserCog },
  { to: "/cow-search", label: "快速找牛", icon: Search },
  { to: "/cow-events", label: "牛只事件", icon: Route },
  { to: "/analysis", label: "自定义分析", icon: Gauge },
  { to: "/feeding-plans", label: "饲喂计划", icon: PackageMinus },
  { to: "/health-events", label: "健康防疫", icon: ClipboardList },
  { to: "/devices", label: "设备状态", icon: Cpu },
  { to: "/external-interfaces", label: "接口管理", icon: PlugZap },
  { to: "/rules", label: "规则中心", icon: ShieldCheck },
  { to: "/mobile-workbench", label: "员工工作台", icon: Smartphone },
  { to: "/knowledge-base", label: "知识库", icon: BookOpen },
  { to: "/system-plan", label: "建设方案", icon: FileText },
  { to: "/traceability-center", label: "质量追溯", icon: Route },
  { to: "/milk", label: "产奶记录", icon: Milk },
  { to: "/raw-milk-delivery", label: "原奶配送", icon: Route },
  { to: "/feed-production", label: "饲料生产", icon: PackagePlus },
  { to: "/feed-transfers", label: "内部调拨", icon: PackageMinus },
  { to: "/milk-receiving", label: "原奶接收", icon: Milk },
  { to: "/dairy-sales-orders", label: "销售订单", icon: ReceiptText },
  { to: "/ledger", label: "收支账本", icon: ReceiptText },
  { to: "/reports", label: "经营报表", icon: Gauge },
  { to: "/dashboard", label: "数据大屏", icon: Gauge },
  { to: "/ai", label: "AI助手", icon: Bot },
  { to: "/announcements", label: "通知公告", icon: Bell },
  { to: "/settings", label: "系统设置", icon: Settings }
];

const chartColors = ["#0f766e", "#0ea5e9", "#f59e0b", "#6366f1", "#ef4444"];

export default function Home() {
  const demo = useDemo();
  const { metrics, data } = demo;
  const [noticeForm, setNoticeForm] = useState(null);
  const [scope, setScope] = useState("集团总览");
  const milkTrend = data.milkRecords.slice(0, 7).reverse().map((item) => ({
    day: item.date.slice(5) || item.date,
    milk: Number(item.total || 0),
    delivery: metrics.deliveryAmount
  }));
  const barnBars = data.barns.map((barn) => ({ name: barn.name.replace("牛舍", ""), sales: Number(barn.count || 0) }));
  const deliveryItems = data.deliveries.map((item) => ({
    name: item.name,
    value: Number(item.amount || 0),
    type: item.type
  }));
  const totalDelivery = deliveryItems.reduce((sum, item) => sum + item.value, 0);
  const truckStatus = ["空闲", "配送中", "维修中", "停用"].map((status) => ({
    name: status,
    value: data.trucks.filter((truck) => truck.status === status).length
  }));
  const visibleNotices = useMemo(
    () => [...data.notices].filter((item) => item.status !== "隐藏").sort((a, b) => Number(b.pinned) - Number(a.pinned)).slice(0, 3),
    [data.notices]
  );

  function saveNotice() {
    if (!noticeForm.title.trim()) return alert("标题不能为空");
    if (!noticeForm.content.trim()) return alert("内容不能为空");
    if (!noticeForm.author.trim()) return alert("发布人不能为空");
    demo.upsertNotice(noticeForm);
    setNoticeForm(null);
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[8px] bg-white shadow-soft ring-1 ring-slate-100">
        <div className="relative h-44 bg-slate-950">
          <img src="/images/pasture-cows.jpg" alt="牧场奶牛" className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-900/20" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-lg font-bold text-emerald-100">{data.settings.farmName}</p>
            <h1 className="mt-1 text-3xl font-bold">农牧乳一体化集团经营驾驶舱</h1>
            <p className="mt-2 text-lg text-white/80">今日日期：{new Date().toLocaleDateString("zh-CN")}</p>
          </div>
        </div>
        <div className="p-4">
          <button onClick={() => window.confirm("确定重置为示例数据吗？") && demo.resetDemo()} className="flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[8px] bg-slate-100 px-5 text-lg font-bold text-slate-800">
            <RotateCcw size={22} /> 重置为示例数据
          </button>
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="今日公告" action={<Link to="/announcements" className="rounded-full bg-pasture-700 px-5 py-3 text-lg font-bold text-white">查看全部</Link>} />
        <div className="space-y-3">
          {visibleNotices.map((notice) => (
            <article key={notice.id} className={`rounded-[8px] p-4 ring-1 ${notice.pinned ? "bg-amber-50 ring-amber-200" : "bg-slate-50 ring-slate-100"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.pinned && <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-3 py-1 text-base font-bold text-amber-900"><Pin size={16} /> 置顶</span>}
                    <h3 className="text-2xl font-bold text-slate-950">{notice.title}</h3>
                  </div>
                  <p className="mt-2 text-lg leading-8 text-slate-700">{notice.content}</p>
                  <p className="mt-2 text-base font-semibold text-slate-500">{notice.author} · {notice.createdAt}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button onClick={() => setNoticeForm(notice)} className="min-h-12 rounded-[8px] bg-white text-lg font-bold text-slate-800">编辑</button>
                <button onClick={() => demo.upsertNotice({ ...notice, pinned: true })} className="min-h-12 rounded-[8px] bg-amber-100 text-lg font-bold text-amber-800">置顶</button>
                <button onClick={() => window.confirm("确定删除这条公告吗？") && demo.deleteNotice(notice.id)} className="min-h-12 rounded-[8px] bg-red-50 text-lg font-bold text-red-700">删除</button>
              </div>
            </article>
          ))}
          {!visibleNotices.length && <p className="rounded-[8px] bg-slate-50 p-4 text-lg font-bold text-slate-600">暂无公告。</p>}
        </div>
      </section>

      <section>
        <SectionTitle title="集团经营概况" eyebrow={scope} />
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {["集团总览", "合力牧业奶牛场", "欧力菲德肉牛场", "欧力菲德饲料厂", "欧力菲德乳品厂"].map((item) => (
            <button key={item} onClick={() => setScope(item)} className={`shrink-0 rounded-[8px] px-4 py-2 text-base font-bold ${scope === item ? "bg-pasture-700 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>{item}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard label="奶牛存栏" value={metrics.dairyCowCount} unit="头" tone="green" />
          <MetricCard label="肉牛存栏" value={metrics.beefCowCount} unit="头" tone="amber" />
          <MetricCard label="今日产奶" value={metrics.milkAmount.toFixed(1)} unit="吨" tone="green" />
          <MetricCard label="原奶入厂" value={metrics.rawMilkReceivedToday.toFixed(1)} unit="吨" tone="sky" />
          <MetricCard label="饲料厂产量" value={metrics.feedTodayOutput.toFixed(1)} unit="吨" tone="blue" />
          <MetricCard label="成品库存" value={metrics.dairyProductStock} unit="件" tone="green" />
          <MetricCard label="早班产奶" value={metrics.morningMilk.toFixed(1)} unit="吨" tone="blue" />
          <MetricCard label="晚班产奶" value={metrics.eveningMilk.toFixed(1)} unit="吨" tone="amber" />
          <MetricCard label="今日配送" value={metrics.deliveryAmount.toFixed(1)} unit="吨" tone="blue" />
          <MetricCard label="牛舍数量" value={metrics.barnCount} unit="个" tone="green" />
          <MetricCard label="关注牛只" value={metrics.focusCount} unit="头" tone={metrics.focusCount ? "amber" : "green"} />
          <MetricCard label="货车总数" value={metrics.truckCount} unit="辆" tone="green" />
          <MetricCard label="空闲货车" value={metrics.idleTrucks} unit="辆" tone="green" />
          <MetricCard label="配送中车" value={metrics.runningTrucks} unit="辆" tone="sky" />
          <MetricCard label="维修货车" value={metrics.repairTrucks} unit="辆" tone={metrics.repairTrucks ? "red" : "green"} />
          <MetricCard label="库存预警" value={metrics.inventoryWarningCount} unit="项" tone={metrics.inventoryWarningCount ? "red" : "green"} />
          <MetricCard label="今日收入" value={(metrics.todayIncome / 10000).toFixed(1)} unit="万元" tone="green" />
          <MetricCard label="今日支出" value={(metrics.todayExpense / 10000).toFixed(1)} unit="万元" tone="amber" />
          <MetricCard label="本月收入" value={(metrics.monthIncome / 10000).toFixed(1)} unit="万元" tone="blue" />
          <MetricCard label="本月支出" value={(metrics.monthExpense / 10000).toFixed(1)} unit="万元" tone="red" />
          <MetricCard label="本月结余" value={(metrics.monthBalance / 10000).toFixed(1)} unit="万元" tone={metrics.monthBalance >= 0 ? "green" : "red"} />
          <MetricCard label="今日工单" value={metrics.todayWorkOrders} unit="个" tone="blue" />
          <MetricCard label="超时工单" value={metrics.overdueWorkOrders} unit="个" tone={metrics.overdueWorkOrders ? "red" : "green"} />
          <MetricCard label="设备告警" value={metrics.deviceAlerts} unit="台" tone={metrics.deviceAlerts ? "red" : "green"} />
          <MetricCard label="环境风险" value={metrics.environmentAlerts} unit="处" tone={metrics.environmentAlerts ? "amber" : "green"} />
          <MetricCard label="今日过磅" value={metrics.weighbridgeToday} unit="单" tone="sky" />
          <MetricCard label="追溯链路" value={metrics.traceabilityComplete} unit="条" tone="green" />
          <MetricCard label="肉牛资产估值" value={(metrics.biologicalAssetValue / 10000).toFixed(1)} unit="万元" tone="amber" />
          <MetricCard label="未读消息" value={metrics.unreadMessages} unit="条" tone={metrics.unreadMessages ? "amber" : "green"} />
          <MetricCard label="紧急预警" value={metrics.urgentAlerts} unit="条" tone={metrics.urgentAlerts ? "red" : "green"} />
          <MetricCard label="待审批" value={metrics.pendingApprovals} unit="条" tone={metrics.pendingApprovals ? "amber" : "green"} />
          <MetricCard label="工单完成率" value={metrics.workOrderCompletionRate.toFixed(0)} unit="%" tone="green" />
          <MetricCard label="接口异常" value={metrics.interfaceAbnormalCount} unit="个" tone={metrics.interfaceAbnormalCount ? "red" : "green"} />
          <MetricCard label="规则触发" value={metrics.ruleTriggeredCount} unit="次" tone={metrics.ruleTriggeredCount ? "amber" : "green"} />
          <MetricCard label="设备在线率" value={metrics.deviceOnlineRate.toFixed(0)} unit="%" tone="blue" />
          <MetricCard label="角色视图" value={metrics.currentRole} unit="" tone="sky" />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {metrics.businessUnitStats?.filter((item) => item.name !== "集团").map((item) => (
          <article key={item.name} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <p className="text-sm font-black text-pasture-700">运行状态</p>
            <h3 className="mt-1 text-xl font-bold text-slate-950">{item.name}</h3>
            <p className="mt-3 text-sm font-bold text-slate-500">本月收入 / 支出 / 利润</p>
            <p className="mt-1 text-lg font-black text-slate-800">{(item.income / 10000).toFixed(1)}万 / {(item.expense / 10000).toFixed(1)}万 / {(item.profit / 10000).toFixed(1)}万</p>
          </article>
        ))}
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="今日提醒" />
        {metrics.alerts.length ? (
          <div className="space-y-2">
            {metrics.alerts.slice(0, 5).map((alert) => (
              <p key={alert} className="rounded-[8px] bg-red-50 p-3 text-lg font-bold leading-7 text-red-700">{alert}</p>
            ))}
          </div>
        ) : (
          <p className="rounded-[8px] bg-emerald-50 p-3 text-lg font-bold text-pasture-800">今日暂无明显异常，重点关注正常工作提醒即可。</p>
        )}
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <Todo text={`待配送 ${metrics.waitingDeliveries} 单，配送中 ${metrics.runningDeliveries} 单`} />
          <Todo text={`重点关注牛只 ${metrics.focusCount} 头`} />
          <Todo text={`库存预警 ${metrics.inventoryWarningCount} 项，空闲货车 ${metrics.idleTrucks} 辆`} />
          <Todo text={`今日工单 ${metrics.todayWorkOrders} 个，超时 ${metrics.overdueWorkOrders} 个`} />
          <Todo text={`设备告警 ${metrics.deviceAlerts} 台，环境风险 ${metrics.environmentAlerts} 处`} />
          <Todo text={`繁育提醒 ${metrics.breedingReminders} 条，休药/防疫提醒 ${metrics.healthReminders} 条`} />
          <Todo text={`未读消息 ${metrics.unreadMessages} 条，紧急预警 ${metrics.urgentAlerts} 条，待审批 ${metrics.pendingApprovals} 条`} />
          <Todo text={`接口异常 ${metrics.interfaceAbnormalCount} 个，规则触发 ${metrics.ruleTriggeredCount} 次，数据质量异常 ${metrics.dataQualityIssues} 项`} />
          <Todo text={`当前角色视图：${metrics.currentRole}`} />
        </div>
      </section>

      <section>
        <SectionTitle title="常用功能" eyebrow="entry" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className="flex min-h-[86px] flex-col items-center justify-center gap-2 rounded-[8px] bg-white p-4 text-xl font-bold text-slate-800 shadow-soft ring-1 ring-slate-100">
                <Icon size={30} className="text-pasture-700" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="近 7 天产奶" />
          <TrendChart data={milkTrend} />
        </div>
        <div className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="配送去向" />
          <p className="mb-2 text-lg font-bold text-slate-700">总配送量：{totalDelivery.toFixed(1)} 吨</p>
          {deliveryItems.length ? (
            <>
              <SharePie data={deliveryItems} />
              <DeliveryLegend items={deliveryItems} total={totalDelivery} />
            </>
          ) : (
            <p className="rounded-[8px] bg-slate-50 p-4 text-lg font-bold text-slate-600">暂无配送数据，请先新增配送目的地。</p>
          )}
        </div>
        <div className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="各牛舍数量" />
          <BarRankChart data={barnBars} />
        </div>
        <div className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="货车状态" />
          <DeliveryLegend items={truckStatus} total={truckStatus.reduce((sum, item) => sum + item.value, 0)} />
        </div>
        <div className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="库存预警" />
          {metrics.inventoryWarnings.length ? metrics.inventoryWarnings.slice(0, 5).map((item) => (
            <p key={item.id} className="mb-2 rounded-[8px] bg-red-50 p-3 text-lg font-bold text-red-700">{item.name}：{item.stock}{item.unit} / 预警 {item.warningStock}{item.unit}</p>
          )) : <p className="rounded-[8px] bg-emerald-50 p-3 text-lg font-bold text-pasture-800">暂无库存预警。</p>}
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="今日简报" />
        <p className="text-xl leading-9 text-slate-700">{buildSimpleReport(demo)}</p>
        <p className="mt-3 rounded-[8px] bg-emerald-50 p-3 text-lg font-bold text-pasture-800">
          今日备注：{data.milkRecords[0]?.note || "暂无备注"}
        </p>
      </section>

      {noticeForm && (
        <div className="fixed inset-0 z-[60] bg-slate-950/50 p-4 pt-[max(36px,env(safe-area-inset-top))]">
          <div className="mx-auto max-w-lg rounded-[8px] bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">发布通知</h2>
              <button onClick={() => setNoticeForm(null)} className="h-12 rounded-[8px] bg-slate-100 px-4 text-lg font-bold">关闭</button>
            </div>
            <div className="space-y-4">
              <Label text="标题"><input value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} className="input-lg" /></Label>
              <Label text="内容"><textarea value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} className="input-lg min-h-28 py-3" /></Label>
              <Label text="发布人"><input value={noticeForm.author} onChange={(e) => setNoticeForm({ ...noticeForm, author: e.target.value })} className="input-lg" /></Label>
              <label className="flex min-h-14 items-center gap-3 rounded-[8px] bg-amber-50 px-4 text-lg font-bold text-amber-900">
                <input type="checkbox" checked={Boolean(noticeForm.pinned)} onChange={(e) => setNoticeForm({ ...noticeForm, pinned: e.target.checked })} className="h-5 w-5" />
                置顶这条公告
              </label>
              <button onClick={saveNotice} className="btn-primary"><Save size={22} /> 保存通知</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeliveryLegend({ items, total }) {
  return (
    <div className="mt-3 space-y-2">
      {items.map((item, index) => {
        const percent = total ? (item.value / total) * 100 : 0;
        return (
          <div key={item.name} className="flex items-center justify-between gap-3 rounded-[8px] bg-slate-50 p-3 text-lg">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: chartColors[index % chartColors.length] }} />
              <span className="truncate font-bold text-slate-800">{item.name}</span>
            </div>
            <span className="shrink-0 font-bold text-slate-600">
              {Number(item.value).toFixed(1)}{total > 5 ? " 吨" : ""}，{percent.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Label({ text, children }) {
  return <label className="block text-lg font-bold text-slate-700">{text}<div className="mt-2">{children}</div></label>;
}

function Todo({ text }) {
  return <p className="rounded-[8px] bg-slate-50 p-3 text-lg font-bold text-slate-700">{text}</p>;
}
