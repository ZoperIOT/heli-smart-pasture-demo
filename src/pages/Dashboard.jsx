import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { BarRankChart, SharePie, TrendChart } from "../components/ChartCard.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const chartColors = ["#0f766e", "#0ea5e9", "#f59e0b", "#6366f1", "#ef4444"];

export default function Dashboard() {
  const demo = useDemo();
  const milkTrend = demo.data.milkRecords.slice(0, 7).reverse().map((item) => ({
    day: item.date.slice(5) || item.date,
    milk: Number(item.total || 0)
  }));
  const barnBars = demo.data.barns.map((barn) => ({ name: barn.name.replace("牛舍", ""), sales: Number(barn.count || 0) }));
  const deliveryShare = demo.data.deliveries.reduce((list, item) => {
    const found = list.find((entry) => entry.name === item.name);
    if (found) found.value += Number(item.amount || 0);
    else list.push({ name: item.name, value: Number(item.amount || 0) });
    return list;
  }, []);
  const truckStatus = ["空闲", "配送中", "维修中", "停用"].map((status) => ({
    name: status,
    value: demo.data.trucks.filter((truck) => truck.status === status).length
  }));
  const truckTotal = truckStatus.reduce((sum, item) => sum + item.value, 0);
  const unitIncome = (demo.metrics.businessUnitStats || []).filter((item) => item.name !== "集团").map((item) => ({ name: item.name, value: item.income }));

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-slate-950 p-5 text-white shadow-soft">
        <h1 className="text-3xl font-bold">集团数据大屏</h1>
        <p className="mt-2 text-lg leading-8 text-white/75">展示合力牧业奶牛场、欧力菲德肉牛场、欧力菲德饲料厂、欧力菲德乳品厂的一体化经营状态。</p>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="今日产奶" value={demo.metrics.milkAmount.toFixed(1)} unit="吨" />
        <MetricCard label="肉牛存栏" value={demo.metrics.beefCowCount} unit="头" tone="amber" />
        <MetricCard label="饲料厂产量" value={demo.metrics.feedTodayOutput.toFixed(1)} unit="吨" tone="blue" />
        <MetricCard label="乳品销售额" value={(demo.metrics.dairySalesToday / 10000).toFixed(1)} unit="万元" tone="green" />
        <MetricCard label="原奶入厂" value={demo.metrics.rawMilkReceivedToday.toFixed(1)} unit="吨" tone="sky" />
        <MetricCard label="成品库存" value={demo.metrics.dairyProductStock} unit="件" tone="green" />
        <MetricCard label="空闲货车" value={demo.metrics.idleTrucks} unit="辆" tone="green" />
        <MetricCard label="配送中车" value={demo.metrics.runningTrucks} unit="辆" tone="sky" />
        <MetricCard label="异常提醒" value={demo.metrics.alerts.length} unit="条" tone={demo.metrics.alerts.length ? "red" : "green"} />
        <MetricCard label="今日工单" value={demo.metrics.todayWorkOrders} unit="个" tone="blue" />
        <MetricCard label="未完成工单" value={demo.metrics.openWorkOrders} unit="个" tone="amber" />
        <MetricCard label="设备告警" value={demo.metrics.deviceAlerts} unit="台" tone={demo.metrics.deviceAlerts ? "red" : "green"} />
        <MetricCard label="环境风险" value={demo.metrics.environmentAlerts} unit="处" tone={demo.metrics.environmentAlerts ? "amber" : "green"} />
        <MetricCard label="今日过磅" value={demo.metrics.weighbridgeToday} unit="单" tone="sky" />
        <MetricCard label="追溯完整链路" value={demo.metrics.traceabilityComplete} unit="条" tone="green" />
        <MetricCard label="肉牛资产估值" value={(demo.metrics.biologicalAssetValue / 10000).toFixed(1)} unit="万元" tone="amber" />
        <MetricCard label="未读消息" value={demo.metrics.unreadMessages} unit="条" tone={demo.metrics.unreadMessages ? "amber" : "green"} />
        <MetricCard label="紧急预警" value={demo.metrics.urgentAlerts} unit="条" tone={demo.metrics.urgentAlerts ? "red" : "green"} />
        <MetricCard label="审批待办" value={demo.metrics.pendingApprovals} unit="条" tone={demo.metrics.pendingApprovals ? "amber" : "green"} />
        <MetricCard label="接口异常" value={demo.metrics.interfaceAbnormalCount} unit="个" tone={demo.metrics.interfaceAbnormalCount ? "red" : "green"} />
        <MetricCard label="规则触发" value={demo.metrics.ruleTriggeredCount} unit="次" tone="amber" />
        <MetricCard label="设备在线率" value={demo.metrics.deviceOnlineRate.toFixed(0)} unit="%" tone="blue" />
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        {demo.metrics.businessUnitStats?.filter((item) => item.name !== "集团").map((item) => (
          <article key={item.name} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <p className="text-sm font-black text-slate-500">板块运行状态</p>
            <h3 className="mt-1 text-xl font-bold text-slate-950">{item.name}</h3>
            <p className="mt-3 text-2xl font-black text-pasture-700">{(item.profit / 10000).toFixed(1)} 万</p>
            <p className="text-sm font-bold text-slate-500">本月利润</p>
          </article>
        ))}
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="异常事项" />
        {demo.metrics.alerts.length ? (
          <div className="space-y-2">
            {demo.metrics.alerts.map((alert) => <p key={alert} className="rounded-[8px] bg-red-50 p-3 text-lg font-bold text-red-700">{alert}</p>)}
          </div>
        ) : (
          <p className="rounded-[8px] bg-emerald-50 p-3 text-lg font-bold text-pasture-800">暂无异常事项。</p>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Panel title="今日工单" items={(demo.data.workOrders || []).filter((item) => String(item.plannedAt || "").startsWith(new Date().toISOString().slice(0, 10))).map((item) => `${item.type}｜${item.businessUnit}｜${item.status}`)} empty="暂无今日工单" />
        <Panel title="设备与环境" items={[...(demo.metrics.deviceAlertList || []).map((item) => `${item.name}：${item.alarm || item.online}`), ...(demo.metrics.environmentAlertList || []).map((item) => `${item.barn}：${item.heatStressRisk}风险，舒适度 ${item.comfortIndex}`)]} empty="设备与环境正常" />
        <Panel title="追溯与过磅" items={[`完整追溯链路 ${demo.metrics.traceabilityComplete} 条`, `今日过磅 ${demo.metrics.weighbridgeToday} 单`, `成品出库 ${(demo.data.finishedOutRecords || []).length} 条`, `退货记录 ${(demo.data.returnRecords || []).length} 条`]} empty="暂无数据" />
        <Panel title="消息预警滚动列表" items={(demo.data.messages || []).filter((item) => item.status !== "已处理").slice(0, 5).map((item) => `${item.priority}｜${item.type}｜${item.title}`)} empty="暂无待处理消息" />
        <Panel title="接口连接状态" items={(demo.data.externalInterfaces || []).map((item) => `${item.name}：${item.status}，今日同步 ${item.todaySyncCount} 条`)} empty="暂无接口配置" />
        <Panel title="规则与审批" items={[`规则触发 ${demo.metrics.ruleTriggeredCount} 次`, `数据质量异常 ${demo.metrics.dataQualityIssues} 项`, `审批待办 ${demo.metrics.pendingApprovals} 条`, `工单完成率 ${demo.metrics.workOrderCompletionRate.toFixed(0)}%`]} empty="暂无数据" />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="分板块收入占比" />
          {unitIncome.length ? (
            <>
              <SharePie data={unitIncome} />
              <Legend items={unitIncome} total={unitIncome.reduce((sum, item) => sum + item.value, 0)} unit="元" />
            </>
          ) : (
            <p className="rounded-[8px] bg-slate-50 p-4 text-lg font-bold text-slate-600">暂无收入数据。</p>
          )}
        </section>
        <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="近 7 天产奶" />
          {milkTrend.length ? <TrendChart data={milkTrend} /> : <p className="rounded-[8px] bg-slate-50 p-4 text-lg font-bold text-slate-600">暂无产奶数据。</p>}
        </section>
        <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="各牛舍数量" />
          {barnBars.length ? <BarRankChart data={barnBars} /> : <p className="rounded-[8px] bg-slate-50 p-4 text-lg font-bold text-slate-600">暂无牛舍数据。</p>}
        </section>
        <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="配送去向" />
          <p className="mb-2 text-lg font-bold text-slate-700">总配送量：{demo.metrics.deliveryAmount.toFixed(1)} 吨</p>
          {deliveryShare.length ? (
            <>
              <SharePie data={deliveryShare} />
              <Legend items={deliveryShare} total={demo.metrics.deliveryAmount} unit="吨" />
            </>
          ) : (
            <p className="rounded-[8px] bg-slate-50 p-4 text-lg font-bold text-slate-600">暂无配送数据，请先新增配送目的地。</p>
          )}
        </section>
        <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <SectionTitle title="货车状态" />
          {truckTotal ? (
            <>
              <SharePie data={truckStatus.filter((item) => item.value > 0)} />
              <Legend items={truckStatus} total={truckTotal} unit="辆" />
            </>
          ) : (
            <p className="rounded-[8px] bg-slate-50 p-4 text-lg font-bold text-slate-600">暂无货车数据。</p>
          )}
        </section>
      </div>
    </div>
  );
}

function Panel({ title, items, empty }) {
  return (
    <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <SectionTitle title={title} />
      {items.length ? (
        <div className="space-y-2">
          {items.slice(0, 5).map((item) => <p key={item} className="rounded-[8px] bg-slate-50 p-3 text-lg font-bold text-slate-700">{item}</p>)}
        </div>
      ) : (
        <p className="rounded-[8px] bg-emerald-50 p-3 text-lg font-bold text-pasture-800">{empty}</p>
      )}
    </section>
  );
}

function Legend({ items, total, unit = "" }) {
  return (
    <div className="mt-3 space-y-2">
      {items.map((item, index) => {
        const percent = total ? (Number(item.value) / total) * 100 : 0;
        return (
          <div key={item.name} className="flex items-center justify-between gap-3 rounded-[8px] bg-slate-50 p-3 text-lg">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: chartColors[index % chartColors.length] }} />
              <span className="truncate font-bold text-slate-800">{item.name}</span>
            </div>
            <span className="shrink-0 font-bold text-slate-600">
              {Number(item.value).toFixed(1)} {unit}，{percent.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
