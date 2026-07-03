import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { BarRankChart, SharePie, TrendChart } from "../components/ChartCard.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const chartColors = ["#0f766e", "#0ea5e9", "#f59e0b", "#6366f1", "#ef4444", "#14b8a6"];

export default function Reports() {
  const demo = useDemo();
  const [range, setRange] = useState("本月");

  const milkTrend = demo.data.milkRecords.slice(0, range === "今日" ? 1 : range === "本周" ? 7 : 30).reverse().map((item) => ({ day: item.date.slice(5) || item.date, milk: Number(item.total || 0) }));
  const barnMilk = groupSum(demo.data.milkRecords, "barn", "total").map((item) => ({ name: item.name || "未分配", sales: item.value }));
  const deliveryShare = groupSum(demo.data.deliveries, "name", "amount");
  const truckStatus = groupCount(demo.data.trucks, "status");
  const inventoryShare = groupSum(demo.data.materials.map((item) => ({ ...item, value: Number(item.stock || 0) * Number(item.price || 0) })), "category", "value");
  const incomeExpenseTrend = useMemo(() => {
    const map = {};
    demo.data.ledgerRecords.forEach((item) => {
      const key = item.date;
      map[key] ||= { day: key.slice(5) || key, income: 0, expense: 0, milk: 0 };
      if (item.type === "收入") map[key].income += Number(item.amount || 0) / 10000;
      else map[key].expense += Number(item.amount || 0) / 10000;
    });
    return Object.values(map).slice(0, 7).reverse().map((item) => ({ ...item, milk: item.income - item.expense }));
  }, [demo.data.ledgerRecords]);
  const ledgerShare = groupSum(demo.data.ledgerRecords, "category", "amount");
  const workOrderShare = groupCount(demo.data.workOrders || [], "status");
  const deviceShare = groupCount(demo.data.devices || [], "alarm");
  const environmentShare = groupCount(demo.data.environmentRecords || [], "heatStressRisk");
  const assetByBatch = groupSum(demo.data.biologicalAssets || [], "batch", "estimatedValue");
  const messageTypeShare = groupCount(demo.data.messages || [], "type");
  const employeeWorkload = (demo.data.employees || []).map((item) => ({ name: item.name, value: Number(item.todayWorkOrders || 0), sales: Number(item.todayWorkOrders || 0) }));
  const interfaceStatusShare = groupCount(demo.data.externalInterfaces || [], "status");
  const dataQualityTrend = [
    { day: "规则", milk: demo.metrics.ruleTriggeredCount },
    { day: "接口", milk: demo.metrics.interfaceAbnormalCount },
    { day: "消息", milk: demo.metrics.urgentAlerts },
    { day: "审批", milk: demo.metrics.pendingApprovals },
    { day: "设备", milk: demo.metrics.deviceAlerts }
  ];
  const unitIncome = (demo.metrics.businessUnitStats || []).filter((item) => item.name !== "集团").map((item) => ({ name: item.name, value: item.income, sales: item.income }));
  const unitExpense = (demo.metrics.businessUnitStats || []).filter((item) => item.name !== "集团").map((item) => ({ name: item.name, value: item.expense, sales: item.expense }));
  const unitProfit = (demo.metrics.businessUnitStats || []).filter((item) => item.name !== "集团").map((item) => ({ name: item.name, value: item.profit, sales: item.profit }));

  function exportCsv() {
    const rows = [
      ["指标", "值"],
      ["今日产奶", demo.metrics.milkAmount],
      ["本周产奶", demo.metrics.weekMilkAmount],
      ["本月产奶", demo.metrics.monthMilkAmount],
      ["本月收入", demo.metrics.monthIncome],
      ["本月支出", demo.metrics.monthExpense],
      ["本月结余", demo.metrics.monthBalance],
      ["库存预警", demo.metrics.inventoryWarningCount],
      ["今日工单", demo.metrics.todayWorkOrders],
      ["超时工单", demo.metrics.overdueWorkOrders],
      ["设备告警", demo.metrics.deviceAlerts],
      ["环境风险", demo.metrics.environmentAlerts],
      ["肉牛生物资产估值", demo.metrics.biologicalAssetValue]
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `heli-report-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">集团经营报表</h1>
            <p className="mt-2 text-base text-slate-600">按合力牧业奶牛场、欧力菲德肉牛场、欧力菲德饲料厂、欧力菲德乳品厂展示生产、库存、配送和财务分析。</p>
          </div>
          <button onClick={exportCsv} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-slate-900 px-4 font-bold text-white"><Download size={20} /> 导出 CSV</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["今日", "本周", "本月"].map((item) => <button key={item} onClick={() => setRange(item)} className={`rounded-[8px] px-4 py-2 font-bold ${range === item ? "bg-pasture-700 text-white" : "bg-slate-100 text-slate-700"}`}>{item}</button>)}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <MetricCard label="本周产奶" value={demo.metrics.weekMilkAmount.toFixed(1)} unit="吨" />
        <MetricCard label="本月产奶" value={demo.metrics.monthMilkAmount.toFixed(1)} unit="吨" tone="blue" />
        <MetricCard label="配送任务" value={demo.metrics.destinationCount} unit="单" tone="sky" />
        <MetricCard label="库存预警" value={demo.metrics.inventoryWarningCount} unit="项" tone={demo.metrics.inventoryWarningCount ? "red" : "green"} />
        <MetricCard label="本月结余" value={(demo.metrics.monthBalance / 10000).toFixed(1)} unit="万元" tone={demo.metrics.monthBalance >= 0 ? "green" : "red"} />
        <MetricCard label="今日工单" value={demo.metrics.todayWorkOrders} unit="个" tone="blue" />
        <MetricCard label="超时工单" value={demo.metrics.overdueWorkOrders} unit="个" tone={demo.metrics.overdueWorkOrders ? "red" : "green"} />
        <MetricCard label="设备告警" value={demo.metrics.deviceAlerts} unit="台" tone={demo.metrics.deviceAlerts ? "red" : "green"} />
        <MetricCard label="环境风险" value={demo.metrics.environmentAlerts} unit="处" tone={demo.metrics.environmentAlerts ? "amber" : "green"} />
        <MetricCard label="资产估值" value={(demo.metrics.biologicalAssetValue / 10000).toFixed(1)} unit="万元" tone="amber" />
        <MetricCard label="工单完成率" value={demo.metrics.workOrderCompletionRate.toFixed(0)} unit="%" tone="green" />
        <MetricCard label="设备在线率" value={demo.metrics.deviceOnlineRate.toFixed(0)} unit="%" tone="blue" />
        <MetricCard label="规则触发" value={demo.metrics.ruleTriggeredCount} unit="次" tone="amber" />
        <MetricCard label="待审批" value={demo.metrics.pendingApprovals} unit="条" tone={demo.metrics.pendingApprovals ? "amber" : "green"} />
        <MetricCard label="接口异常" value={demo.metrics.interfaceAbnormalCount} unit="个" tone={demo.metrics.interfaceAbnormalCount ? "red" : "green"} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel title="产奶趋势">{milkTrend.length ? <TrendChart data={milkTrend} /> : <Empty />}</ChartPanel>
        <ChartPanel title="分板块收入对比">{unitIncome.length ? <BarRankChart data={unitIncome} /> : <Empty />}</ChartPanel>
        <ChartPanel title="分板块成本对比">{unitExpense.length ? <BarRankChart data={unitExpense} /> : <Empty />}</ChartPanel>
        <ChartPanel title="分板块利润分析">{unitProfit.length ? <BarRankChart data={unitProfit} /> : <Empty />}</ChartPanel>
        <ChartPanel title="牛舍产奶对比">{barnMilk.length ? <BarRankChart data={barnMilk} /> : <Empty />}</ChartPanel>
        <ChartPanel title="配送目的地占比">{deliveryShare.length ? <><SharePie data={deliveryShare} /><Legend items={deliveryShare} unit="吨" /></> : <Empty />}</ChartPanel>
        <ChartPanel title="货车状态统计">{truckStatus.length ? <><SharePie data={truckStatus} /><Legend items={truckStatus} unit="辆" /></> : <Empty />}</ChartPanel>
        <ChartPanel title="库存分类价值">{inventoryShare.length ? <><SharePie data={inventoryShare} /><Legend items={inventoryShare} unit="元" /></> : <Empty />}</ChartPanel>
        <ChartPanel title="收支趋势">{incomeExpenseTrend.length ? <TrendChart data={incomeExpenseTrend} /> : <Empty />}</ChartPanel>
        <ChartPanel title="收支分类占比">{ledgerShare.length ? <><SharePie data={ledgerShare} /><Legend items={ledgerShare} unit="元" /></> : <Empty />}</ChartPanel>
        <ChartPanel title="工单状态统计">{workOrderShare.length ? <><SharePie data={workOrderShare} /><Legend items={workOrderShare} unit="个" /></> : <Empty />}</ChartPanel>
        <ChartPanel title="设备告警分布">{deviceShare.length ? <><SharePie data={deviceShare} /><Legend items={deviceShare} unit="台" /></> : <Empty />}</ChartPanel>
        <ChartPanel title="环境风险分布">{environmentShare.length ? <><SharePie data={environmentShare} /><Legend items={environmentShare} unit="处" /></> : <Empty />}</ChartPanel>
        <ChartPanel title="肉牛生物资产估值">{assetByBatch.length ? <BarRankChart data={assetByBatch} /> : <Empty />}</ChartPanel>
        <ChartPanel title="预警类型分布">{messageTypeShare.length ? <><SharePie data={messageTypeShare} /><Legend items={messageTypeShare} unit="条" /></> : <Empty />}</ChartPanel>
        <ChartPanel title="接口状态分布">{interfaceStatusShare.length ? <><SharePie data={interfaceStatusShare} /><Legend items={interfaceStatusShare} unit="个" /></> : <Empty />}</ChartPanel>
        <ChartPanel title="分角色工作量统计">{employeeWorkload.length ? <BarRankChart data={employeeWorkload} /> : <Empty />}</ChartPanel>
        <ChartPanel title="数据质量趋势">{dataQualityTrend.length ? <TrendChart data={dataQualityTrend} /> : <Empty />}</ChartPanel>
        <ChartPanel title="四流合一链路">
          <FlowList items={[
            `业务流：今日工单 ${demo.metrics.todayWorkOrders} 个，原奶接收 ${demo.metrics.rawMilkReceivedToday.toFixed(1)} 吨，乳品销售 ${(demo.metrics.dairySalesToday / 10000).toFixed(1)} 万元`,
            `物流流：配送任务 ${demo.metrics.destinationCount} 单，今日过磅 ${demo.metrics.weighbridgeToday} 单`,
            `资金流：本月收入 ${(demo.metrics.monthIncome / 10000).toFixed(1)} 万元，支出 ${(demo.metrics.monthExpense / 10000).toFixed(1)} 万元`,
            `数据流：设备 ${(demo.data.devices || []).length} 台，追溯完整链路 ${demo.metrics.traceabilityComplete} 条`
          ]} />
        </ChartPanel>
        <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="库存预警列表" />
          {demo.metrics.inventoryWarnings.length ? demo.metrics.inventoryWarnings.map((item) => <p key={item.id} className="mb-2 rounded-[8px] bg-red-50 p-3 font-bold text-red-700">{item.name}：库存 {item.stock}{item.unit}，预警 {item.warningStock}{item.unit}</p>) : <Empty />}
        </section>
      </div>
    </div>
  );
}

function FlowList({ items }) {
  return <div className="space-y-2">{items.map((item) => <p key={item} className="rounded-[8px] bg-slate-50 p-3 text-lg font-bold text-slate-700">{item}</p>)}</div>;
}

function groupSum(list, key, valueKey) {
  const map = {};
  list.forEach((item) => {
    const name = item[key] || "未分配";
    map[name] = (map[name] || 0) + Number(item[valueKey] || 0);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value, sales: value }));
}
function groupCount(list, key) {
  const map = {};
  list.forEach((item) => { map[item[key] || "未分配"] = (map[item[key] || "未分配"] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}
function ChartPanel({ title, children }) {
  return <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100"><SectionTitle title={title} />{children}</section>;
}
function Legend({ items, unit }) {
  const total = items.reduce((sum, item) => sum + Number(item.value || 0), 0);
  return <div className="mt-3 space-y-2">{items.map((item, index) => <div key={item.name} className="flex items-center justify-between gap-3 rounded-[8px] bg-slate-50 p-3 text-base"><div className="flex min-w-0 items-center gap-2"><span className="h-4 w-4 shrink-0 rounded-full" style={{ background: chartColors[index % chartColors.length] }} /><span className="truncate font-bold text-slate-800">{item.name}</span></div><span className="shrink-0 font-bold text-slate-600">{Number(item.value).toFixed(unit === "元" ? 0 : 1)} {unit}，{total ? ((item.value / total) * 100).toFixed(1) : "0.0"}%</span></div>)}</div>;
}
function Empty() {
  return <p className="rounded-[8px] bg-slate-50 p-5 text-lg font-bold text-slate-600">暂无数据。</p>;
}
