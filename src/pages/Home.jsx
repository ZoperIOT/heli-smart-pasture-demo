import { Link } from "react-router-dom";
import { Bot, Building2, Milk, PackagePlus, RotateCcw, Sprout } from "lucide-react";
import { SharePie, TrendChart } from "../components/ChartCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import PageShell from "../components/common/PageShell.jsx";
import StatGrid from "../components/common/StatGrid.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { buildSimpleReport } from "../data/demoFlow.js";
import { getRoleOrganization } from "../services/roleViewService.js";

export default function Home() {
  const demo = useDemo();
  const { metrics, data } = demo;
  const currentOrganization = getRoleOrganization(metrics.currentRole);
  const milkTrend = data.milkRecords.slice(0, 7).reverse().map((item) => ({ day: item.date.slice(5), milk: Number(item.total || 0) }));
  const unitIncome = (metrics.businessUnitStats || []).filter((item) => item.name !== "集团").map((item) => ({ name: item.name, value: item.income }));

  const businessCards = [
    {
      name: "合力牧业奶牛场",
      icon: Milk,
      to: "/dairy-workbench",
      stats: [`今日产奶 ${metrics.milkAmount.toFixed(1)} 吨`, `牛舍 ${metrics.barnCount} 个`, `异常提醒 ${metrics.breedingReminders + metrics.healthReminders} 条`],
      tone: "green"
    },
    {
      name: "欧力菲德肉牛场",
      icon: Sprout,
      to: "/beef-workbench",
      stats: [`肉牛存栏 ${metrics.beefCowCount} 头`, `日增重 ${(data.beefBatches?.[0]?.avgDailyGain || 0).toFixed(2)} kg`, `可出栏 ${metrics.readyForSaleAssets} 头/批`],
      tone: "amber"
    },
    {
      name: "欧力菲德饲料厂",
      icon: PackagePlus,
      to: "/feed-workbench",
      stats: [`今日生产 ${metrics.feedTodayOutput.toFixed(1)} 吨`, `库存预警 ${metrics.feedWarnings.length} 项`, `调拨任务 ${(data.feedTransfers || []).length} 单`],
      tone: "blue"
    },
    {
      name: "欧力菲德乳品厂",
      icon: Building2,
      to: "/dairy-plant-workbench",
      stats: [`原奶接收 ${metrics.rawMilkReceivedToday.toFixed(1)} 吨`, `生产批次 ${(data.dairyProductionBatches || []).length} 批`, `销售订单 ${(data.dairySalesOrders || []).length} 单`],
      tone: "sky"
    }
  ];

  return (
    <PageShell>
      <PageHeader
        dark
        eyebrow={data.settings.farmName}
        title="集团经营驾驶舱"
        description={`当前角色：${metrics.currentRole}，当前组织：${currentOrganization}。首页聚焦生产、异常、任务和四大板块运行状态，具体台账从各工作台进入。`}
        action={
          <button onClick={() => window.confirm("确定重置为示例数据吗？") && demo.resetDemo()} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-white px-4 font-bold text-slate-950">
            <RotateCcw size={20} /> 重置示例数据
          </button>
        }
      />

      <section>
        <SectionTitle title="四大板块运行状态" eyebrow="今天生产怎么样" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {businessCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.name} to={card.to} className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:ring-pasture-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-pasture-700">进入工作台</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-950">{card.name}</h2>
                  </div>
                  <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-pasture-50 text-pasture-700">
                    <Icon size={26} />
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {card.stats.map((item) => <p key={item} className="rounded-[8px] bg-slate-50 p-3 text-base font-bold text-slate-700">{item}</p>)}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title="今日执行" eyebrow="有没有异常，谁需要处理任务" />
        <StatGrid
          items={[
            { label: "今日工单", value: metrics.todayWorkOrders, unit: "个", tone: "blue" },
            { label: "已完成率", value: metrics.workOrderCompletionRate.toFixed(0), unit: "%", tone: "green" },
            { label: "超时工单", value: metrics.overdueWorkOrders, unit: "个", tone: metrics.overdueWorkOrders ? "red" : "green" },
            { label: "待审批", value: metrics.pendingApprovals, unit: "条", tone: metrics.pendingApprovals ? "amber" : "green" },
            { label: "紧急消息", value: metrics.urgentAlerts, unit: "条", tone: metrics.urgentAlerts ? "red" : "green" },
            { label: "配送中", value: metrics.runningDeliveries, unit: "单", tone: "sky" }
          ]}
          columns="md:grid-cols-6"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="经营概况" eyebrow="本月收入、支出、结余" />
          <StatGrid
            items={[
              { label: "本月收入", value: (metrics.monthIncome / 10000).toFixed(1), unit: "万元", tone: "green" },
              { label: "本月支出", value: (metrics.monthExpense / 10000).toFixed(1), unit: "万元", tone: "red" },
              { label: "本月结余", value: (metrics.monthBalance / 10000).toFixed(1), unit: "万元", tone: metrics.monthBalance >= 0 ? "green" : "red" },
              { label: "设备在线率", value: metrics.deviceOnlineRate.toFixed(0), unit: "%", tone: "blue" }
            ]}
            columns="md:grid-cols-4"
          />
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-base font-black text-slate-500">近 7 天产奶趋势</p>
              <TrendChart data={milkTrend} />
            </div>
            <div>
              <p className="mb-2 text-base font-black text-slate-500">分板块收入占比</p>
              <SharePie data={unitIncome} />
            </div>
          </div>
        </div>

        <div className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="AI 今日简报" eyebrow="重点、风险、建议动作" action={<Link to="/ai" className="rounded-[8px] bg-slate-900 px-4 py-2 font-bold text-white"><Bot className="mr-1 inline" size={18} />进入 AI</Link>} />
          <p className="text-lg leading-8 text-slate-700">{buildSimpleReport(demo)}</p>
          <div className="mt-4 space-y-2">
            {metrics.alerts.slice(0, 4).map((alert) => <p key={alert} className="rounded-[8px] bg-red-50 p-3 text-base font-bold text-red-700">{alert}</p>)}
            {!metrics.alerts.length && <p className="rounded-[8px] bg-emerald-50 p-3 text-base font-bold text-pasture-800">当前无明显异常。</p>}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
