import { Link } from "react-router-dom";
import { AlertTriangle, BookOpen, Boxes, ClipboardList, FileText, HeartHandshake, HeartPulse, Milk, PackageCheck, Search, Wheat } from "lucide-react";
import { useMemo, useState } from "react";
import { useDemo } from "../../context/DemoContext.jsx";
import {
  AdminBadge,
  Field,
  GuardButton,
  DraftBox,
  EmployeeStatsCard,
  EmptyState,
  MessageCard,
  MiniStat,
  OperationManualCard,
  PageTitle,
  QuickActionGrid,
  ReadOnlyNotice,
  SectionCard,
  SelectInput,
  SmartWorkOrderCard,
  StatusTag,
  SubmitBar,
  TaskCard,
  TextArea,
  TextInput,
  WorkOrderCard
} from "../../components/mobile/MobileComponents.jsx";

const today = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toLocaleString("zh-CN", { hour12: false });

function useSubmit(action) {
  return (...args) => {
    try {
      action(...args);
      window.alert("已提交，系统已写入记录并触发相关联动。");
    } catch (error) {
      window.alert(error.message || "提交失败");
    }
  };
}

function calcFeeding(form) {
  const planned = Number(form.plannedAmount || 0);
  const actual = Number(form.actualAmount || 0);
  const leftover = Number(form.leftoverAmount || 0);
  const dry = Number(form.dryMatterRatio || 0);
  const deviationAmount = actual - planned;
  const deviationRate = planned ? (deviationAmount / planned) * 100 : 0;
  const leftoverRate = actual ? (leftover / actual) * 100 : 0;
  const dryMatterIntake = (actual - leftover) * dry;
  return {
    deviationAmount: deviationAmount.toFixed(2),
    deviationRate: deviationRate.toFixed(1),
    leftoverRate: leftoverRate.toFixed(1),
    dryMatterIntake: dryMatterIntake.toFixed(2)
  };
}

function calcMilk(form) {
  const total = Number(form.totalMilk || 0);
  const count = Number(form.milkingCowCount || 0);
  const abnormal = Number(form.abnormalMilk || 0);
  return {
    avgMilkPerCow: count ? (total / count).toFixed(2) : "0.00",
    abnormalMilkRate: total ? ((abnormal / total) * 100).toFixed(1) : "0.0"
  };
}

function QuickLink({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to} className="rounded-[8px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700">
        <Icon size={23} />
      </span>
      <p className="mt-3 text-lg font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{desc}</p>
    </Link>
  );
}

function visibleForUser(list, demo, ownerKeys = ["assignee", "owner", "handler", "createdBy", "receiver"]) {
  if (demo.mobileRole === "管理员" || demo.mobileRole === "只读访客") return list || [];
  const name = demo.currentUser?.name;
  return (list || []).filter((item) => ownerKeys.some((key) => item[key] === name || String(item[key] || "").includes(name)));
}

export function MobileHomePage() {
  const demo = useDemo();
  const data = demo.data;
  const tasks = visibleForUser(data.mobileTasks, demo);
  const smartOrders = visibleForUser(data.smartWorkOrders, demo).filter((item) => !["已完成", "已驳回"].includes(item.status));
  const workOrders = visibleForUser(data.workOrders, demo).filter((item) => !["已完成", "已驳回"].includes(item.status));
  const messages = visibleForUser(data.messages, demo, ["receiver", "createdBy"]).slice(0, 3);
  const myRecords = demo.mobileRole === "管理员" ? (data.myRecords || []).slice(0, 4) : (data.myRecords || []).filter((item) => item.createdBy === demo.currentUser?.name).slice(0, 4);
  const urgent = [...tasks, ...smartOrders, ...workOrders, ...(data.messages || [])].filter((item) => ["紧急", "重要"].includes(item.priority) || item.urgency === "紧急").length;
  const doneToday = (data.myRecords || []).filter((item) => String(item.createdAt || "").startsWith(today())).length;
  const pendingApprovals = (data.materialRequests || []).filter((item) => item.status === "待审核").length;
  const qualityFails = (data.qualityInspections || []).filter((item) => item.result === "不合格").length;
  const feedingDeviation = (data.feedingRecords || []).filter((item) => Math.abs(Number(item.deviationRate || 0)) > 10).length;

  return (
    <div>
      <PageTitle title={demo.mobileRole === "管理员" ? "管理员工作台" : "今日工作台"} desc="先看待办，再处理工单，现场业务随手提交。" action={<AdminBadge />} />
      <ReadOnlyNotice />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <MiniStat label="今日待办" value={tasks.filter((item) => item.status !== "已完成").length + smartOrders.length} />
        <MiniStat label="紧急任务" value={urgent} tone="red" />
        <MiniStat label="待处理工单" value={smartOrders.length + workOrders.length} tone="amber" />
        <MiniStat label="今日已提交" value={doneToday} />
      </div>
      {demo.mobileRole === "管理员" && (
        <SectionCard title="管理员提醒">
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="待审核" value={pendingApprovals} tone="amber" />
            <MiniStat label="异常工单" value={workOrders.filter((item) => item.status !== "已完成").length} tone="red" />
            <MiniStat label="饲喂偏差" value={feedingDeviation} tone="amber" />
            <MiniStat label="质检不合格" value={qualityFails} tone="red" />
          </div>
        </SectionCard>
      )}

      <SectionCard title="今日智能工单" desc="按紧急程度和截止时间优先处理">
        <div className="space-y-3">
          {smartOrders.slice(0, 5).map((order) => <SmartWorkOrderCard key={order.id} order={order} onStatus={(status) => demo.updateMobileWorkOrder(order.id, status)} />)}
          {!smartOrders.length && <EmptyState title="今日智能工单已清空" desc="新的异常、质检和库存提醒会自动生成工单。" />}
        </div>
      </SectionCard>

      <SectionCard title="快捷操作">
        <QuickActionGrid>
          <QuickLink to="/feeding" icon={Wheat} title="饲喂记录" desc="投料、剩料、采食" />
          <QuickLink to="/milk" icon={Milk} title="产奶记录" desc="班次、奶量、送检" />
          <QuickLink to="/breeding" icon={HeartPulse} title="繁育记录" desc="发情、配种、妊检" />
          <QuickLink to="/cattle" icon={Search} title="牛只事件" desc="查牛、转群、用药" />
          <QuickLink to="/inventory" icon={Boxes} title="库存申请" desc="领料、入库、盘点" />
          <QuickLink to="/quality" icon={PackageCheck} title="质检记录" desc="原奶、饲料、成品" />
          <QuickLink to="/reports" icon={AlertTriangle} title="异常上报" desc="异常自动成工单" />
          <QuickLink to="/handover" icon={HeartHandshake} title="交接班" desc="未完成和异常交接" />
          <QuickLink to="/manuals" icon={BookOpen} title="操作手册" desc="现场规范快速看" />
          <QuickLink to="/records" icon={FileText} title="我的记录" desc="我提交和处理的事" />
        </QuickActionGrid>
      </SectionCard>

      <SectionCard title={demo.mobileRole === "管理员" ? "今日任务" : "我的待办"}>
        <div className="space-y-3">
          {tasks.slice(0, 3).map((task) => <TaskCard key={task.id} task={task} />)}
          {!tasks.length && <p className="text-base font-bold text-slate-500">今天暂无待办。</p>}
        </div>
      </SectionCard>

      <SectionCard title="待处理工单">
        <div className="space-y-3">
          {workOrders.slice(0, 2).map((order) => <WorkOrderCard key={order.id} order={order} />)}
          {!workOrders.length && <p className="text-base font-bold text-slate-500">暂无待处理工单。</p>}
        </div>
      </SectionCard>

      <SectionCard title="最近消息">
        <div className="space-y-3">
          {messages.map((message) => <MessageCard key={message.id} message={message} onRead={() => demo.markMobileMessageRead(message.id)} />)}
          {!messages.length && <p className="text-base font-bold text-slate-500">暂无新消息。</p>}
        </div>
      </SectionCard>

      <SectionCard title={demo.mobileRole === "管理员" ? "员工提交记录" : "我的提交记录"}>
        <div className="space-y-2">
          {myRecords.map((item) => (
            <Link key={item.id} to="/records" className="flex items-center gap-3 rounded-[8px] bg-slate-50 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-black">{item.title}</p>
                <p className="text-sm font-bold text-slate-500">{item.type} · {item.createdAt}</p>
              </div>
              <StatusTag status={item.status} />
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function TasksPage() {
  const demo = useDemo();
  const tasks = visibleForUser(demo.data.mobileTasks, demo);
  const smartOrders = visibleForUser(demo.data.smartWorkOrders, demo);
  const jobs = [
    { to: "/feeding", title: "饲喂管理", desc: "今日饲喂任务、执行记录、剩料和异常" },
    { to: "/milk", title: "产奶管理", desc: "挤奶任务、入罐、异常奶和送检" },
    { to: "/breeding", title: "繁育管理", desc: "发情、配种、妊检、产犊" },
    { to: "/cattle", title: "牛只管理", desc: "快速查牛、事件上报、健康防疫" },
    { to: "/inventory", title: "库存管理", desc: "领料、入库、出库、盘点" },
    { to: "/quality", title: "质检管理", desc: "原奶、饲料、成品质检" },
    { to: "/reports", title: "异常上报", desc: "牛只、饲喂、产奶、库存等异常" },
    { to: "/handover", title: "交接班", desc: "未完成事项、重点牛只和异常交接" },
    { to: "/manuals", title: "操作手册", desc: "现场规范和注意事项" }
  ];
  return (
    <div>
      <PageTitle title="今日智能工单" desc="先处理紧急、超时和异常工单。" />
      <SectionCard title="智能工单">
        <div className="space-y-3">{smartOrders.map((order) => <SmartWorkOrderCard key={order.id} order={order} onStatus={(status) => demo.updateMobileWorkOrder(order.id, status)} />)}</div>
      </SectionCard>
      <SectionCard title="今日待办">
        <div className="space-y-3">{tasks.map((task) => <TaskCard key={task.id} task={task} />)}</div>
      </SectionCard>
      <SectionCard title="作业入口">
        <div className="space-y-2">
          {jobs.map((job) => (
            <Link key={job.to} to={job.to} className="block rounded-[8px] bg-slate-50 p-4">
              <p className="text-lg font-black">{job.title}</p>
              <p className="text-sm font-semibold text-slate-500">{job.desc}</p>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function FeedingPage() {
  const demo = useDemo();
  const task = (demo.data.feedingTasks || [])[0] || {};
  const [form, setForm] = useState({
    taskId: task.id,
    date: today(),
    shift: task.shift || "早",
    barn: task.barn || "A区泌乳牛舍",
    herd: task.herd || "泌乳高峰群",
    formula: task.formula || "泌乳高峰日粮",
    feedBatch: task.feedBatch || "FD-N-20260704",
    plannedAmount: task.plannedAmount || 8.5,
    actualAmount: task.plannedAmount || 8.5,
    leftoverAmount: 0.4,
    dryMatterRatio: 0.52,
    waterStatus: "正常",
    intakeStatus: "正常",
    abnormalType: "无",
    executor: demo.currentUser?.name || "刘师傅",
    startedAt: nowTime(),
    finishedAt: nowTime(),
    autoDeduct: true,
    abnormalNote: "",
    photo: "现场照片占位",
    remark: ""
  });
  const submit = useSubmit(() => demo.submitFeedingRecord(form));
  const feedingCalc = calcFeeding(form);

  return (
    <div>
      <PageTitle title="饲喂管理" desc="记录投料、剩料、采食和库存扣减。" />
      <ReadOnlyNotice />
      <SectionCard title="今日饲喂任务">
        <div className="space-y-3">{(demo.data.feedingTasks || []).map((item) => <TaskCard key={item.id} task={{ ...item, title: `${item.barn} ${item.shift}班饲喂`, location: item.herd }} action={<button onClick={() => setForm({ ...form, taskId: item.id, shift: item.shift, barn: item.barn, herd: item.herd, formula: item.formula, feedBatch: item.feedBatch, plannedAmount: item.plannedAmount, actualAmount: item.plannedAmount })} className="min-h-11 w-full rounded-[8px] bg-emerald-700 text-base font-black text-white">开始饲喂</button>} />)}</div>
      </SectionCard>
      <SectionCard title="饲喂执行表单">
        <div className="grid gap-3">
          <Field label="日期"><TextInput value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="班次"><SelectInput value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })}><option>早</option><option>中</option><option>晚</option><option>夜</option></SelectInput></Field>
          <Field label="牛舍"><TextInput value={form.barn} onChange={(e) => setForm({ ...form, barn: e.target.value })} /></Field>
          <Field label="牛群"><TextInput value={form.herd} onChange={(e) => setForm({ ...form, herd: e.target.value })} /></Field>
          <Field label="饲喂配方"><TextInput value={form.formula} onChange={(e) => setForm({ ...form, formula: e.target.value })} /></Field>
          <Field label="饲料批次"><TextInput value={form.feedBatch} onChange={(e) => setForm({ ...form, feedBatch: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="计划投喂量(吨)"><TextInput type="number" value={form.plannedAmount} onChange={(e) => setForm({ ...form, plannedAmount: e.target.value })} /></Field>
            <Field label="实际投喂量(吨)"><TextInput type="number" value={form.actualAmount} onChange={(e) => setForm({ ...form, actualAmount: e.target.value })} /></Field>
          </div>
          <Field label="剩料量(吨)"><TextInput type="number" value={form.leftoverAmount} onChange={(e) => setForm({ ...form, leftoverAmount: e.target.value })} /></Field>
          <Field label="饲料干物质比例"><TextInput type="number" step="0.01" value={form.dryMatterRatio} onChange={(e) => setForm({ ...form, dryMatterRatio: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3 rounded-[8px] bg-emerald-50 p-3">
            <MiniStat label="偏差量(吨)" value={feedingCalc.deviationAmount} />
            <MiniStat label="偏差率" value={`${feedingCalc.deviationRate}%`} tone={Math.abs(Number(feedingCalc.deviationRate)) > 10 ? "red" : "emerald"} />
            <MiniStat label="剩料率" value={`${feedingCalc.leftoverRate}%`} tone={Number(feedingCalc.leftoverRate) > 12 ? "red" : "emerald"} />
            <MiniStat label="干物质采食" value={`${feedingCalc.dryMatterIntake}吨`} />
          </div>
          <Field label="饮水情况"><SelectInput value={form.waterStatus} onChange={(e) => setForm({ ...form, waterStatus: e.target.value })}><option>正常</option><option>偏少</option><option>停水</option><option>异常</option></SelectInput></Field>
          <Field label="采食情况"><SelectInput value={form.intakeStatus} onChange={(e) => setForm({ ...form, intakeStatus: e.target.value })}><option>正常</option><option>偏低</option><option>拒食</option><option>异常</option></SelectInput></Field>
          <Field label="饲喂异常类型"><SelectInput value={form.abnormalType} onChange={(e) => setForm({ ...form, abnormalType: e.target.value })}><option>无</option><option>饲料不足</option><option>饲料霉变</option><option>投喂偏差过大</option><option>剩料过多</option><option>牛群采食异常</option><option>配方错误</option><option>其他</option></SelectInput></Field>
          <Field label="执行人"><TextInput value={form.executor} onChange={(e) => setForm({ ...form, executor: e.target.value })} /></Field>
          <Field label="开始时间"><TextInput value={form.startedAt} onChange={(e) => setForm({ ...form, startedAt: e.target.value })} /></Field>
          <Field label="完成时间"><TextInput value={form.finishedAt} onChange={(e) => setForm({ ...form, finishedAt: e.target.value })} /></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black"><input type="checkbox" checked={form.autoDeduct} onChange={(e) => setForm({ ...form, autoDeduct: e.target.checked })} /> 自动扣减库存</label>
          <Field label="异常说明"><TextArea value={form.abnormalNote} onChange={(e) => setForm({ ...form, abnormalNote: e.target.value })} placeholder="饲料不足、霉变、采食异常、配方错误、设备异常等" /></Field>
          <Field label="现场照片"><TextInput value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} /></Field>
          <Field label="备注"><TextArea value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} /></Field>
        </div>
        <GuardButton onClick={() => demo.saveDraft("饲喂管理", `${form.barn}${form.shift}班饲喂`, form)} className="mt-4 min-h-12 w-full rounded-[8px] bg-slate-100 text-base font-black text-slate-700">保存草稿</GuardButton>
        <SubmitBar disabled={demo.isReadonly} onClick={submit}>提交饲喂记录</SubmitBar>
      </SectionCard>
    </div>
  );
}

export function MilkPage() {
  const demo = useDemo();
  const task = (demo.data.milkTasks || [])[0] || {};
  const [form, setForm] = useState({
    taskId: task.id,
    date: today(),
    shift: task.shift || "早班",
    barn: task.barn || "A区泌乳牛舍",
    herd: task.herd || "泌乳高峰群",
    milkingCowCount: 286,
    milker: demo.currentUser?.name || "刘师傅",
    totalMilk: 8.2,
    qualifiedMilk: 8.0,
    abnormalMilk: 0.2,
    abnormalCowNo: "HL-N-1028",
    abnormalCowType: "乳房炎",
    abnormalMilkHandle: "隔离",
    notifyAdmin: true,
    generateHealthOrder: true,
    tankNo: "1号奶罐",
    temperature: 3.8,
    protein: 3.2,
    fat: 3.7,
    somaticCell: "18万/ml",
    colony: "3800 CFU/ml",
    sendInspection: true,
    generateDelivery: true,
    abnormalNote: "",
    remark: ""
  });
  const submit = useSubmit(() => demo.submitMilkRecord(form));
  const milkCalc = calcMilk(form);
  return (
    <div>
      <PageTitle title="产奶管理" desc="录入班次奶量、异常奶、入罐和送检。" />
      <ReadOnlyNotice />
      <SectionCard title="今日挤奶任务">
        <div className="space-y-3">{(demo.data.milkTasks || []).map((item) => <TaskCard key={item.id} task={{ ...item, title: `${item.barn} ${item.shift}挤奶`, location: item.herd }} />)}</div>
      </SectionCard>
      <SectionCard title="产奶录入">
        <div className="grid gap-3">
          <Field label="日期"><TextInput value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="班次"><SelectInput value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })}><option>早班</option><option>中班</option><option>晚班</option></SelectInput></Field>
          <Field label="牛舍"><TextInput value={form.barn} onChange={(e) => setForm({ ...form, barn: e.target.value })} /></Field>
          <Field label="牛群"><TextInput value={form.herd} onChange={(e) => setForm({ ...form, herd: e.target.value })} /></Field>
          <Field label="泌乳牛头数"><TextInput type="number" value={form.milkingCowCount} onChange={(e) => setForm({ ...form, milkingCowCount: e.target.value })} /></Field>
          <Field label="执行人"><TextInput value={form.milker} onChange={(e) => setForm({ ...form, milker: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3 rounded-[8px] bg-emerald-50 p-3">
            <MiniStat label="单牛平均产奶" value={`${milkCalc.avgMilkPerCow}吨`} />
            <MiniStat label="异常奶比例" value={`${milkCalc.abnormalMilkRate}%`} tone={Number(milkCalc.abnormalMilkRate) > 5 ? "red" : "emerald"} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Field label="总奶量"><TextInput type="number" value={form.totalMilk} onChange={(e) => setForm({ ...form, totalMilk: e.target.value })} /></Field>
            <Field label="合格奶"><TextInput type="number" value={form.qualifiedMilk} onChange={(e) => setForm({ ...form, qualifiedMilk: e.target.value })} /></Field>
            <Field label="异常奶"><TextInput type="number" value={form.abnormalMilk} onChange={(e) => setForm({ ...form, abnormalMilk: e.target.value })} /></Field>
          </div>
          <Field label="入罐编号"><TextInput value={form.tankNo} onChange={(e) => setForm({ ...form, tankNo: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="原奶温度"><TextInput type="number" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} /></Field>
            <Field label="蛋白"><TextInput type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} /></Field>
            <Field label="脂肪"><TextInput type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} /></Field>
            <Field label="体细胞"><TextInput value={form.somaticCell} onChange={(e) => setForm({ ...form, somaticCell: e.target.value })} /></Field>
          </div>
          <Field label="菌落总数"><TextInput value={form.colony} onChange={(e) => setForm({ ...form, colony: e.target.value })} /></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black"><input type="checkbox" checked={form.sendInspection} onChange={(e) => setForm({ ...form, sendInspection: e.target.checked })} /> 是否送检</label>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black"><input type="checkbox" checked={form.sendInspection} onChange={(e) => setForm({ ...form, sendInspection: e.target.checked })} /> 是否生成质检工单</label>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black"><input type="checkbox" checked={form.generateDelivery} onChange={(e) => setForm({ ...form, generateDelivery: e.target.checked })} /> 生成原奶配送任务</label>
          <div className="rounded-[8px] bg-slate-50 p-3">
            <p className="mb-3 text-base font-black text-slate-800">异常奶登记</p>
            <div className="grid gap-3">
              <Field label="牛号"><TextInput value={form.abnormalCowNo} onChange={(e) => setForm({ ...form, abnormalCowNo: e.target.value })} /></Field>
              <Field label="异常类型"><SelectInput value={form.abnormalCowType} onChange={(e) => setForm({ ...form, abnormalCowType: e.target.value })}><option>乳房炎</option><option>血奶</option><option>药残风险</option><option>初乳</option><option>其他</option></SelectInput></Field>
              <Field label="处理方式"><SelectInput value={form.abnormalMilkHandle} onChange={(e) => setForm({ ...form, abnormalMilkHandle: e.target.value })}><option>隔离</option><option>废弃</option><option>单独存放</option></SelectInput></Field>
              <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black"><input type="checkbox" checked={form.notifyAdmin} onChange={(e) => setForm({ ...form, notifyAdmin: e.target.checked })} /> 是否通知管理员</label>
              <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black"><input type="checkbox" checked={form.generateHealthOrder} onChange={(e) => setForm({ ...form, generateHealthOrder: e.target.checked })} /> 生成牛只健康工单</label>
            </div>
          </div>
          <Field label="异常奶说明"><TextArea value={form.abnormalNote} onChange={(e) => setForm({ ...form, abnormalNote: e.target.value })} placeholder="乳房炎、血奶、药残风险、初乳等" /></Field>
          <Field label="备注"><TextArea value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} /></Field>
        </div>
        <GuardButton onClick={() => demo.saveDraft("产奶管理", `${form.barn}${form.shift}产奶`, form)} className="mt-4 min-h-12 w-full rounded-[8px] bg-slate-100 text-base font-black text-slate-700">保存草稿</GuardButton>
        <SubmitBar disabled={demo.isReadonly} onClick={submit}>提交产奶记录</SubmitBar>
      </SectionCard>
    </div>
  );
}

export function BreedingPage() {
  const demo = useDemo();
  const [form, setForm] = useState({ recordType: "发情观察", cattleCode: "HL-N-1028", barn: "A区泌乳牛舍", observedAt: nowTime(), symptom: "爬跨、鸣叫、活动量增加", score: 4, recommendMating: "是", matingMethod: "人工授精", semenNo: "SEM-260704", bullNo: "", pregnancyResult: "待复查", calvingStatus: "顺产", owner: demo.currentUser?.name || "刘师傅", remark: "" });
  const submit = useSubmit(() => demo.submitBreedingRecord(form));
  return (
    <div>
      <PageTitle title="繁育管理" desc="发情、配种、妊检和产犊记录。" />
      <ReadOnlyNotice />
      <SectionCard title="繁育提醒">
        <div className="grid grid-cols-2 gap-3"><MiniStat label="待妊检" value="3" tone="amber" /><MiniStat label="临产提醒" value="1" /><MiniStat label="空怀牛" value="5" tone="red" /><MiniStat label="久配不孕" value="2" tone="amber" /></div>
      </SectionCard>
      <SectionCard title="提交繁育记录">
        <div className="grid gap-3">
          <Field label="记录类型"><SelectInput value={form.recordType} onChange={(e) => setForm({ ...form, recordType: e.target.value })}><option>发情观察</option><option>配种记录</option><option>妊检记录</option><option>产犊记录</option></SelectInput></Field>
          <Field label="牛号"><TextInput value={form.cattleCode} onChange={(e) => setForm({ ...form, cattleCode: e.target.value })} /></Field>
          <Field label="牛舍"><TextInput value={form.barn} onChange={(e) => setForm({ ...form, barn: e.target.value })} /></Field>
          <Field label="观察/操作时间"><TextInput value={form.observedAt} onChange={(e) => setForm({ ...form, observedAt: e.target.value })} /></Field>
          {form.recordType === "发情观察" && <>
            <Field label="发情表现"><TextArea value={form.symptom} onChange={(e) => setForm({ ...form, symptom: e.target.value })} /></Field>
            <Field label="评分"><TextInput type="number" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} /></Field>
            <Field label="是否建议配种"><SelectInput value={form.recommendMating} onChange={(e) => setForm({ ...form, recommendMating: e.target.value })}><option>是</option><option>否</option></SelectInput></Field>
          </>}
          {form.recordType === "配种记录" && <>
            <Field label="配种方式"><SelectInput value={form.matingMethod} onChange={(e) => setForm({ ...form, matingMethod: e.target.value })}><option>人工授精</option><option>自然交配</option></SelectInput></Field>
            <Field label="冻精编号"><TextInput value={form.semenNo} onChange={(e) => setForm({ ...form, semenNo: e.target.value })} /></Field>
            <Field label="公牛编号"><TextInput value={form.bullNo} onChange={(e) => setForm({ ...form, bullNo: e.target.value })} /></Field>
            <Field label="预计妊检日期"><TextInput value={form.pregnancyCheckDate || "2026-08-04"} onChange={(e) => setForm({ ...form, pregnancyCheckDate: e.target.value })} /></Field>
          </>}
          {form.recordType === "妊检记录" && <>
            <Field label="妊检结果"><SelectInput value={form.pregnancyResult} onChange={(e) => setForm({ ...form, pregnancyResult: e.target.value })}><option>已孕</option><option>未孕</option><option>待复查</option></SelectInput></Field>
            <Field label="孕检方式"><TextInput value={form.checkMethod || "B超"} onChange={(e) => setForm({ ...form, checkMethod: e.target.value })} /></Field>
            <Field label="预计产犊日期"><TextInput value={form.expectedCalvingDate || "2027-04-10"} onChange={(e) => setForm({ ...form, expectedCalvingDate: e.target.value })} /></Field>
          </>}
          {form.recordType === "产犊记录" && <>
            <Field label="犊牛编号"><TextInput value={form.calfCode || "CALF-NEW"} onChange={(e) => setForm({ ...form, calfCode: e.target.value })} /></Field>
            <Field label="犊牛性别"><SelectInput value={form.calfGender || "母"} onChange={(e) => setForm({ ...form, calfGender: e.target.value })}><option>母</option><option>公</option></SelectInput></Field>
            <Field label="分娩情况"><SelectInput value={form.calvingStatus} onChange={(e) => setForm({ ...form, calvingStatus: e.target.value })}><option>顺产</option><option>难产</option><option>助产</option></SelectInput></Field>
            <Field label="初乳喂养情况"><TextInput value={form.colostrum || "已喂初乳"} onChange={(e) => setForm({ ...form, colostrum: e.target.value })} /></Field>
          </>}
          <Field label="操作人/兽医"><TextInput value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></Field>
          <Field label="备注"><TextArea value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} /></Field>
        </div>
        <SubmitBar disabled={demo.isReadonly} onClick={submit}>提交繁育记录</SubmitBar>
      </SectionCard>
    </div>
  );
}

export function CattlePage() {
  const demo = useDemo();
  const [keyword, setKeyword] = useState("");
  const [event, setEvent] = useState({ cattleCode: "HL-N-1028", type: "疾病", eventTime: nowTime(), handler: demo.currentUser?.name || "刘师傅", method: "现场复查并通知兽医", photo: "图片上传占位", remark: "" });
  const list = (demo.data.cattleRecords || []).filter((cow) => !keyword || `${cow.code}${cow.barn}${cow.herd}${cow.currentStatus}`.includes(keyword));
  const submit = useSubmit(() => demo.submitCattleEvent(event));
  return (
    <div>
      <PageTitle title="牛只管理" desc="快速查牛、事件上报、转群和健康记录。" />
      <ReadOnlyNotice />
      <SectionCard title="快速查询" action={<button className="rounded-[8px] bg-slate-100 px-3 py-2 text-sm font-black">扫码占位</button>}>
        <TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="输入牛号、牛舍、牛群或状态" />
      </SectionCard>
      <SectionCard title="牛只档案">
        <div className="space-y-3">
          {list.map((cow) => (
            <div key={cow.id} className="rounded-[8px] bg-slate-50 p-4">
              <div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="text-lg font-black">{cow.code}</p><p className="text-sm font-bold text-slate-500">{cow.breed} · {cow.gender} · {cow.monthAge}月龄</p></div><StatusTag status={cow.status || cow.currentStatus} /></div>
              <div className="mt-3 grid gap-1 text-sm font-bold text-slate-600">
                <p>位置：{cow.barn} / {cow.herd}</p><p>状态：{cow.currentStatus}，健康：{cow.healthStatus}</p><p>最近饲喂：{cow.recentFeeding}</p><p>最近产奶：{cow.recentMilk}</p><p>最近繁育：{cow.recentBreeding}</p><p>最近防疫：{cow.recentVaccine}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="牛只事件上报">
        <div className="grid gap-3">
          <Field label="牛号"><TextInput value={event.cattleCode} onChange={(e) => setEvent({ ...event, cattleCode: e.target.value })} /></Field>
          <Field label="事件类型"><SelectInput value={event.type} onChange={(e) => setEvent({ ...event, type: e.target.value })}><option>转群</option><option>疾病</option><option>用药</option><option>防疫</option><option>淘汰</option><option>死亡</option><option>异常行为</option><option>其他</option></SelectInput></Field>
          <Field label="事件时间"><TextInput value={event.eventTime} onChange={(e) => setEvent({ ...event, eventTime: e.target.value })} /></Field>
          <Field label="处理人"><TextInput value={event.handler} onChange={(e) => setEvent({ ...event, handler: e.target.value })} /></Field>
          {event.type === "用药" && (
            <div className="grid gap-3 rounded-[8px] bg-slate-50 p-3">
              <p className="text-base font-black text-slate-800">用药与休药期</p>
              <Field label="药品名称"><TextInput value={event.medicineName || "乳房炎用药"} onChange={(e) => setEvent({ ...event, medicineName: e.target.value })} /></Field>
              <Field label="剂量"><TextInput value={event.dose || "20ml"} onChange={(e) => setEvent({ ...event, dose: e.target.value })} /></Field>
              <Field label="休药期天数"><TextInput type="number" value={event.withdrawalDays || 3} onChange={(e) => setEvent({ ...event, withdrawalDays: e.target.value })} /></Field>
              <Field label="预计解除日期"><TextInput value={event.releaseDate || "2026-07-08"} onChange={(e) => setEvent({ ...event, releaseDate: e.target.value })} /></Field>
              <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-white px-3 text-base font-black"><input type="checkbox" checked={event.affectMilk !== false} onChange={(e) => setEvent({ ...event, affectMilk: e.target.checked })} /> 是否影响产奶</label>
            </div>
          )}
          <Field label="处理方式"><TextArea value={event.method} onChange={(e) => setEvent({ ...event, method: e.target.value })} /></Field>
          <Field label="图片上传"><TextInput value={event.photo} onChange={(e) => setEvent({ ...event, photo: e.target.value })} /></Field>
          <Field label="备注"><TextArea value={event.remark} onChange={(e) => setEvent({ ...event, remark: e.target.value })} /></Field>
        </div>
        <SubmitBar disabled={demo.isReadonly} onClick={submit}>提交牛只事件</SubmitBar>
      </SectionCard>
    </div>
  );
}

export function InventoryPage() {
  const demo = useDemo();
  const [kind, setKind] = useState("request");
  const [form, setForm] = useState({ applicant: demo.currentUser?.name || "刘师傅", materialType: "饲料", materialName: "奶牛精补料", quantity: 2, unit: "吨", purpose: "晚班饲喂", expectedAt: `${today()} 16:00`, urgent: false, supplier: "山东粮贸公司", batch: "FD-N-20260704", handler: demo.currentUser?.name || "刘师傅", warehouse: "奶牛场饲料库", actualStock: 28, reason: "" });
  const submit = useSubmit(() => demo.submitInventoryAction(kind, form));
  const low = (demo.data.inventoryItems || []).filter((item) => Number(item.stock || 0) <= Number(item.safeStock || 0));
  return (
    <div>
      <PageTitle title="库存管理" desc="领料、入库、出库、盘点和低库存预警。" />
      <ReadOnlyNotice />
      <SectionCard title="库存总览">
        <div className="grid grid-cols-2 gap-3">
          {["饲料库存", "药品库存", "原奶库存", "成品库存"].map((type) => <MiniStat key={type} label={type} value={(demo.data.inventoryItems || []).filter((item) => item.type === type).length} tone={type === "饲料库存" ? "amber" : "emerald"} />)}
        </div>
        {low.length > 0 && <div className="mt-3 rounded-[8px] bg-red-50 p-3 text-sm font-black text-red-700">低库存预警：{low.map((item) => item.name).join("、")}</div>}
      </SectionCard>
      <SectionCard title="库存批次">
        <div className="space-y-3">
          {(demo.data.inventoryItems || []).map((item) => (
            <div key={item.id} className="rounded-[8px] bg-slate-50 p-4">
              <div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="text-lg font-black">{item.name}</p><p className="text-sm font-bold text-slate-500">{item.type} · {item.batch}</p></div><StatusTag status={item.status} /></div>
              <div className="mt-3 grid gap-1 text-sm font-bold text-slate-600">
                <p>库存：{item.stock}{item.unit} / 安全库存：{item.safeStock}{item.unit}</p>
                <p>供应商：{item.supplier || "-"} · 仓库：{item.warehouse}</p>
                <p>入库：{item.inboundAt || "-"} · 到期：{item.expireAt || "-"}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="库存操作">
        <div className="mb-3 grid grid-cols-4 gap-2">{[["request", "领料"], ["in", "入库"], ["out", "出库"], ["count", "盘点"]].map(([value, label]) => <button key={value} onClick={() => setKind(value)} className={`min-h-11 rounded-[8px] text-sm font-black ${kind === value ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"}`}>{label}</button>)}</div>
        <div className="grid gap-3">
          <Field label="物料类型"><SelectInput value={form.materialType} onChange={(e) => setForm({ ...form, materialType: e.target.value })}><option>饲料</option><option>原料</option><option>药品</option><option>耗材</option><option>原奶</option><option>成品</option></SelectInput></Field>
          <Field label="物料名称"><TextInput value={form.materialName} onChange={(e) => setForm({ ...form, materialName: e.target.value })} /></Field>
          <Field label="批次号"><TextInput value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="数量"><TextInput type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></Field><Field label="单位"><TextInput value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></Field></div>
          {kind === "request" && <><Field label="申请人"><TextInput value={form.applicant} onChange={(e) => setForm({ ...form, applicant: e.target.value })} /></Field><Field label="用途"><TextInput value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></Field><Field label="期望领取时间"><TextInput value={form.expectedAt} onChange={(e) => setForm({ ...form, expectedAt: e.target.value })} /></Field><label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black"><input type="checkbox" checked={form.urgent} onChange={(e) => setForm({ ...form, urgent: e.target.checked })} /> 是否紧急</label></>}
          {kind === "in" && <><Field label="供应商"><TextInput value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></Field><Field label="保质期"><TextInput value={form.expireAt || "2026-12-31"} onChange={(e) => setForm({ ...form, expireAt: e.target.value })} /></Field><Field label="验收状态"><SelectInput value={form.acceptStatus || "合格"} onChange={(e) => setForm({ ...form, acceptStatus: e.target.value })}><option>合格</option><option>待检</option><option>不合格</option></SelectInput></Field></>}
          {kind === "out" && <><Field label="关联业务"><SelectInput value={form.relatedBusiness || "饲喂"} onChange={(e) => setForm({ ...form, relatedBusiness: e.target.value })}><option>饲喂</option><option>生产</option><option>防疫</option><option>维修</option><option>其他</option></SelectInput></Field><Field label="领用人"><TextInput value={form.receiver || "刘师傅"} onChange={(e) => setForm({ ...form, receiver: e.target.value })} /></Field></>}
          {kind === "count" && <><Field label="仓库"><TextInput value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })} /></Field><Field label="实盘数量"><TextInput type="number" value={form.actualStock} onChange={(e) => setForm({ ...form, actualStock: e.target.value })} /></Field><Field label="差异原因"><TextArea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field></>}
          <Field label="经办人"><TextInput value={form.handler} onChange={(e) => setForm({ ...form, handler: e.target.value })} /></Field>
        </div>
        <GuardButton onClick={() => demo.saveDraft("库存管理", `${form.materialName}${kind === "request" ? "领料申请" : "库存操作"}`, { ...form, kind })} className="mt-4 min-h-12 w-full rounded-[8px] bg-slate-100 text-base font-black text-slate-700">保存草稿</GuardButton>
        <SubmitBar disabled={demo.isReadonly} onClick={submit}>{kind === "request" ? "提交领料申请" : kind === "in" ? "提交入库登记" : kind === "out" ? "提交出库登记" : "提交盘点记录"}</SubmitBar>
      </SectionCard>
    </div>
  );
}

export function QualityPage() {
  const demo = useDemo();
  const [form, setForm] = useState({ taskId: "quality-task-1", inspectionType: "原奶质检", sampleType: "原奶", batch: "HL-MILK-AM", sourceFarm: "合力牧业奶牛场", sampledAt: nowTime(), temperature: 3.8, protein: 3.2, fat: 3.7, somaticCell: "18万/ml", colony: "3800 CFU/ml", acidity: "正常", drugResidue: "未检出", moisture: "12%", mildew: "无", impurity: "少量", smell: "正常", appearance: "正常", productName: "巴氏鲜奶", testItems: "感官、菌落、留样", result: "合格", sampleNo: "LY-001", inspector: demo.currentUser?.name || "质检员", reason: "", handleMethod: "隔离", handleAdvice: "" });
  const submit = useSubmit(() => demo.submitQualityInspection(form));
  return (
    <div>
      <PageTitle title="质检管理" desc="处理待检任务，记录原奶、饲料和成品质检。" />
      <ReadOnlyNotice />
      <SectionCard title="待检任务"><div className="space-y-3">{(demo.data.qualityTasks || []).map((task) => <TaskCard key={task.id} task={{ ...task, title: `${task.sampleType} ${task.relatedBatch}`, location: task.sourceOrganization }} />)}</div></SectionCard>
      <SectionCard title="质检录入">
        <div className="grid gap-3">
          <Field label="质检类型"><SelectInput value={form.inspectionType} onChange={(e) => setForm({ ...form, inspectionType: e.target.value })}><option>原奶质检</option><option>饲料质检</option><option>成品质检</option></SelectInput></Field>
          <Field label="关联批次"><TextInput value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} /></Field>
          {form.inspectionType === "原奶质检" && <><Field label="来源牧场"><TextInput value={form.sourceFarm} onChange={(e) => setForm({ ...form, sourceFarm: e.target.value })} /></Field><div className="grid grid-cols-2 gap-3"><Field label="温度"><TextInput value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} /></Field><Field label="蛋白"><TextInput value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} /></Field><Field label="脂肪"><TextInput value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} /></Field><Field label="酸度"><TextInput value={form.acidity} onChange={(e) => setForm({ ...form, acidity: e.target.value })} /></Field></div><Field label="体细胞"><TextInput value={form.somaticCell} onChange={(e) => setForm({ ...form, somaticCell: e.target.value })} /></Field><Field label="菌落总数"><TextInput value={form.colony} onChange={(e) => setForm({ ...form, colony: e.target.value })} /></Field><Field label="药残检测"><TextInput value={form.drugResidue} onChange={(e) => setForm({ ...form, drugResidue: e.target.value })} /></Field></>}
          {form.inspectionType === "饲料质检" && <><Field label="水分"><TextInput value={form.moisture} onChange={(e) => setForm({ ...form, moisture: e.target.value })} /></Field><Field label="霉变情况"><TextInput value={form.mildew} onChange={(e) => setForm({ ...form, mildew: e.target.value })} /></Field><Field label="杂质"><TextInput value={form.impurity} onChange={(e) => setForm({ ...form, impurity: e.target.value })} /></Field><Field label="气味/外观"><TextInput value={`${form.smell}/${form.appearance}`} onChange={(e) => setForm({ ...form, smell: e.target.value })} /></Field></>}
          {form.inspectionType === "成品质检" && <><Field label="产品名称"><TextInput value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} /></Field><Field label="检测项目"><TextArea value={form.testItems} onChange={(e) => setForm({ ...form, testItems: e.target.value })} /></Field><Field label="留样编号"><TextInput value={form.sampleNo} onChange={(e) => setForm({ ...form, sampleNo: e.target.value })} /></Field></>}
          <Field label="是否合格"><SelectInput value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}><option>合格</option><option>不合格</option></SelectInput></Field>
          <Field label="检测人"><TextInput value={form.inspector} onChange={(e) => setForm({ ...form, inspector: e.target.value })} /></Field>
          <Field label="不合格原因"><TextArea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field>
          <Field label="处理方式"><SelectInput value={form.handleMethod} onChange={(e) => setForm({ ...form, handleMethod: e.target.value })}><option>隔离</option><option>退回</option><option>报废</option><option>复检</option><option>降级使用</option><option>复检合格</option></SelectInput></Field>
          <Field label="处理意见"><TextArea value={form.handleAdvice} onChange={(e) => setForm({ ...form, handleAdvice: e.target.value })} /></Field>
        </div>
        <GuardButton onClick={() => demo.saveDraft("质检管理", `${form.batch}${form.inspectionType}`, form)} className="mt-4 min-h-12 w-full rounded-[8px] bg-slate-100 text-base font-black text-slate-700">保存草稿</GuardButton>
        <SubmitBar disabled={demo.isReadonly} onClick={submit}>提交质检记录</SubmitBar>
      </SectionCard>
    </div>
  );
}

export function ExceptionReportPage() {
  const demo = useDemo();
  const [form, setForm] = useState({ exceptionType: "牛只异常", location: "A区泌乳牛舍", relatedObject: "HL-N-1028", description: "采食下降，需要现场复核。", urgency: "重要", photo: "图片上传占位", reporter: demo.currentUser?.name || "刘师傅" });
  const submit = useSubmit(() => demo.submitExceptionReport(form));
  return (
    <div>
      <PageTitle title="异常上报" desc="提交后自动生成工单和消息提醒。" />
      <ReadOnlyNotice />
      <SectionCard title="异常信息">
        <div className="grid gap-3">
          <Field label="异常类型"><SelectInput value={form.exceptionType} onChange={(e) => setForm({ ...form, exceptionType: e.target.value })}><option>牛只异常</option><option>饲喂异常</option><option>产奶异常</option><option>质检异常</option><option>库存异常</option><option>设备异常</option><option>安全隐患</option><option>其他</option></SelectInput></Field>
          <Field label="所在位置"><TextInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="关联牛号/批次/物料"><TextInput value={form.relatedObject} onChange={(e) => setForm({ ...form, relatedObject: e.target.value })} /></Field>
          <Field label="异常描述"><TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="紧急程度"><SelectInput value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}><option>普通</option><option>重要</option><option>紧急</option></SelectInput></Field>
          <Field label="图片上传"><TextInput value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} /></Field>
          <Field label="上报人"><TextInput value={form.reporter} onChange={(e) => setForm({ ...form, reporter: e.target.value })} /></Field>
        </div>
        <SubmitBar disabled={demo.isReadonly} onClick={submit}>提交异常并生成工单</SubmitBar>
      </SectionCard>
    </div>
  );
}

export function HandoverPage() {
  const demo = useDemo();
  const [form, setForm] = useState({
    fromUser: demo.currentUser?.name || "刘师傅",
    toUser: "赵师傅",
    shift: "早班",
    handoverAt: nowTime(),
    unfinishedItems: "A区泌乳牛舍晚班饲喂待执行",
    abnormalCattle: "HL-N-1028 继续观察休药期",
    abnormalInventory: "育肥牛饲料低库存",
    abnormalQuality: "无",
    focusCattle: "HL-N-1028、HL-N-1160",
    notes: "晚班先复核剩料，再检查1号奶罐温度。",
    attachment: "图片上传占位",
    confirmed: true,
    remark: ""
  });
  const submit = useSubmit(() => demo.submitShiftHandover(form));
  return (
    <div>
      <PageTitle title="交接班" desc="记录未完成事项、重点牛只、异常库存和接班确认。" />
      <ReadOnlyNotice />
      <SectionCard title="最近交接班">
        <div className="space-y-3">
          {(demo.data.shiftHandovers || []).map((item) => (
            <div key={item.id} className="rounded-[8px] bg-slate-50 p-4">
              <div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="text-lg font-black">{item.shift}交接</p><p className="text-sm font-bold text-slate-500">{item.fromUser} 交给 {item.toUser} · {item.handoverAt}</p></div><StatusTag status={item.status} /></div>
              <p className="mt-2 text-sm font-bold text-slate-600">未完成：{item.unfinishedItems || "无"}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">重点：{item.focusCattle || "无"}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="提交交接班">
        <div className="grid gap-3">
          <Field label="交班人"><TextInput value={form.fromUser} onChange={(e) => setForm({ ...form, fromUser: e.target.value })} /></Field>
          <Field label="接班人"><TextInput value={form.toUser} onChange={(e) => setForm({ ...form, toUser: e.target.value })} /></Field>
          <Field label="班次"><SelectInput value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })}><option>早班</option><option>中班</option><option>晚班</option><option>夜班</option></SelectInput></Field>
          <Field label="交接时间"><TextInput value={form.handoverAt} onChange={(e) => setForm({ ...form, handoverAt: e.target.value })} /></Field>
          <Field label="未完成事项"><TextArea value={form.unfinishedItems} onChange={(e) => setForm({ ...form, unfinishedItems: e.target.value })} /></Field>
          <Field label="异常牛只"><TextArea value={form.abnormalCattle} onChange={(e) => setForm({ ...form, abnormalCattle: e.target.value })} /></Field>
          <Field label="异常库存"><TextArea value={form.abnormalInventory} onChange={(e) => setForm({ ...form, abnormalInventory: e.target.value })} /></Field>
          <Field label="异常质检"><TextArea value={form.abnormalQuality} onChange={(e) => setForm({ ...form, abnormalQuality: e.target.value })} /></Field>
          <Field label="重点观察牛只"><TextInput value={form.focusCattle} onChange={(e) => setForm({ ...form, focusCattle: e.target.value })} /></Field>
          <Field label="今日注意事项"><TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <Field label="附件 / 图片"><TextInput value={form.attachment} onChange={(e) => setForm({ ...form, attachment: e.target.value })} /></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black"><input type="checkbox" checked={form.confirmed} onChange={(e) => setForm({ ...form, confirmed: e.target.checked })} /> 接班确认</label>
          <Field label="备注"><TextArea value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} /></Field>
        </div>
        <GuardButton onClick={() => demo.saveDraft("交接班", `${form.shift}交接班`, form)} className="mt-4 min-h-12 w-full rounded-[8px] bg-slate-100 text-base font-black text-slate-700">保存草稿</GuardButton>
        <SubmitBar disabled={demo.isReadonly} onClick={submit}>提交交接班</SubmitBar>
      </SectionCard>
    </div>
  );
}

export function ManualsPage() {
  const demo = useDemo();
  return (
    <div>
      <PageTitle title="操作手册" desc="现场快速查看规范，短文案、少翻页。" />
      <div className="space-y-3">
        {(demo.data.operationManuals || []).map((manual) => <OperationManualCard key={manual.id} manual={manual} />)}
      </div>
    </div>
  );
}

export function WorkOrdersPage() {
  const demo = useDemo();
  const orders = visibleForUser(demo.data.workOrders, demo).filter((item) => demo.mobileRole === "管理员" || item.handler === demo.currentUser?.name || item.createdBy === demo.currentUser?.name || item.initiator === demo.currentUser?.name);
  return (
    <div>
      <PageTitle title="工单处理" desc={demo.mobileRole === "管理员" ? "查看和处理全部工单。" : "查看和处理分配给我的工单。"} />
      <ReadOnlyNotice />
      <div className="space-y-3">
        {orders.map((order) => <WorkOrderCard key={order.id} order={order} onStatus={(status) => demo.isReadonly ? window.alert("当前为只读演示模式，不能执行该操作。") : demo.updateMobileWorkOrder(order.id, status)} />)}
      </div>
    </div>
  );
}

export function MessagesPage() {
  const demo = useDemo();
  const messages = visibleForUser(demo.data.messages, demo, ["receiver", "createdBy"]);
  return (
    <div>
      <PageTitle title="消息通知" desc="消息与任务、工单、质检、库存、繁育提醒绑定。" />
      <div className="space-y-3">{messages.map((message) => <MessageCard key={message.id} message={message} onRead={() => demo.markMobileMessageRead(message.id)} />)}</div>
    </div>
  );
}

export function RecordsPage() {
  const demo = useDemo();
  const records = demo.mobileRole === "管理员" ? demo.data.myRecords || [] : (demo.data.myRecords || []).filter((item) => item.createdBy === demo.currentUser?.name);
  const drafts = demo.mobileRole === "管理员" ? demo.data.drafts || [] : (demo.data.drafts || []).filter((item) => item.createdBy === demo.currentUser?.name);
  return (
    <div>
      <PageTitle title={demo.mobileRole === "管理员" ? "员工记录" : "我的记录"} desc="饲喂、产奶、繁育、质检、库存、异常、交接班、工单和草稿。" />
      <SectionCard title="草稿箱" desc="当前为前端演示，模拟离线暂存能力。">
        <DraftBox drafts={drafts} onDelete={(id) => demo.deleteDraft(id)} />
      </SectionCard>
      <div className="space-y-3">
        {records.map((item) => (
          <div key={item.id} className="rounded-[8px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="text-lg font-black">{item.title}</p><p className="mt-1 text-sm font-bold text-slate-500">{item.type} · {item.createdAt}</p></div><StatusTag status={item.status} /></div>
            <p className="mt-2 text-sm font-bold text-slate-500">{item.organizationName} · 提交人：{item.createdBy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const demo = useDemo();
  const user = demo.currentUser || {};
  const mine = (demo.data.myRecords || []).filter((item) => item.createdBy === user.name);
  const drafts = demo.mobileRole === "管理员" ? demo.data.drafts || [] : (demo.data.drafts || []).filter((item) => item.createdBy === user.name);
  const stats = demo.mobileRole === "管理员" ? (demo.data.employeeStats || []) : (demo.data.employeeStats || []).filter((item) => item.employee === user.name);
  const exceptionCount = (demo.data.exceptionReports || []).filter((item) => demo.mobileRole === "管理员" || item.createdBy === user.name).length;
  const rejected = (demo.data.workOrders || []).filter((item) => item.status === "已驳回" && (demo.mobileRole === "管理员" || item.handler === user.name || item.initiator === user.name)).length;
  return (
    <div>
      <PageTitle title="个人中心" desc="身份、组织、记录和本机数据。" />
      <SectionCard>
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-[8px] bg-emerald-700 text-xl font-black text-white">{(user.name || "刘").slice(0, 1)}</div>
          <div className="min-w-0 flex-1"><p className="text-xl font-black">{user.name}</p><p className="text-sm font-bold text-slate-500">{user.role} · {user.organizationName}</p></div>
          <StatusTag status={demo.isReadonly ? "只读" : "可操作"} />
        </div>
      </SectionCard>
      <SectionCard title="我的统计">
        <div className="grid grid-cols-2 gap-3">
          <MiniStat label="我的提交" value={mine.length} />
          <MiniStat label="待办工单" value={(demo.data.workOrders || []).filter((item) => item.handler === user.name && item.status !== "已完成").length} tone="amber" />
          <MiniStat label="异常上报" value={exceptionCount} tone="red" />
          <MiniStat label="被驳回" value={rejected} tone="amber" />
        </div>
      </SectionCard>
      <SectionCard title={demo.mobileRole === "管理员" ? "员工任务统计" : "我的任务统计"}>
        <div className="space-y-3">
          {stats.map((stat) => <EmployeeStatsCard key={stat.id} stat={stat} />)}
          {!stats.length && <EmptyState title="暂无统计" desc="提交任务后会自动累计。" />}
        </div>
      </SectionCard>
      <SectionCard title="草稿箱">
        <DraftBox drafts={drafts} onDelete={(id) => demo.deleteDraft(id)} />
      </SectionCard>
      <SectionCard title="数据工具">
        <div className="grid gap-2">
          <GuardButton onClick={() => demo.resetDemo()} className="min-h-12 rounded-[8px] bg-slate-100 text-base font-black text-slate-700">重置员工端示例数据</GuardButton>
          <button onClick={() => navigator.clipboard?.writeText(demo.exportData())} className="min-h-12 rounded-[8px] bg-slate-100 text-base font-black text-slate-700">复制本机 JSON 数据</button>
        </div>
      </SectionCard>
    </div>
  );
}
