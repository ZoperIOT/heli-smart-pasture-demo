import { Link } from "react-router-dom";
import { AlertTriangle, Bell, BookOpen, Boxes, CheckCircle2, ClipboardList, Database, FileCheck2, FileText, HeartHandshake, HeartPulse, Milk, PackageCheck, Search, Send, UserRound, UsersRound, Wheat } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDemo } from "../../context/DemoContext.jsx";
import {
  Field,
  GuardButton,
  DraftBox,
  EmployeeStatsCard,
  EmptyState,
  MessageCard,
  MiniStat,
  MobileFormSheet,
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

function QuickLink({ to, onClick, icon: Icon, title, desc, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    sky: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
    slate: "bg-slate-100 text-slate-700"
  };
  const className = "min-h-24 rounded-[8px] border border-slate-300 bg-white p-3 text-left shadow-md ring-1 ring-slate-200 active:scale-[0.99]";
  const content = (
    <>
      <span className={`grid h-12 w-12 place-items-center rounded-[8px] ${tones[tone] || tones.emerald}`}>
        <Icon size={24} />
      </span>
      <p className="mt-2 text-base font-black text-slate-950">{title}</p>
    </>
  );
  if (onClick) return <button type="button" onClick={onClick} className={className}>{content}</button>;
  return <Link to={to} className={className}>{content}</Link>;
}

function visibleForUser(list, demo, ownerKeys = ["assignee", "owner", "handler", "createdBy", "receiver"]) {
  if (demo.mobileRole === "管理员" || demo.mobileRole === "只读访客") return list || [];
  const name = demo.currentUser?.name;
  return (list || []).filter((item) => ownerKeys.some((key) => item[key] === name || String(item[key] || "").includes(name)));
}

export function MobileHomePage() {
  const demo = useDemo();
  const data = demo.data;
  const user = demo.currentUser || {};
  const tasks = visibleForUser(data.mobileTasks, demo);
  const openStatuses = ["待派发", "待处理", "处理中", "已驳回", "已超时", "未开始", "进行中"];
  const smartOrders = visibleForUser(data.smartWorkOrders, demo).filter((item) => openStatuses.includes(item.status));
  const workOrders = visibleForUser(data.workOrders, demo).filter((item) => openStatuses.includes(item.status));
  const messages = visibleForUser(data.messages, demo, ["receiver", "createdBy"]).slice(0, 3);
  const myRecords = demo.mobileRole === "管理员" ? (data.myRecords || []).slice(0, 3) : (data.myRecords || []).filter((item) => item.createdBy === demo.currentUser?.name).slice(0, 3);
  const urgentOrders = [...smartOrders, ...workOrders].filter((item) => item.priority === "紧急");
  const importantOrders = [...smartOrders, ...workOrders]
    .sort((a, b) => {
      const score = (item) => item.priority === "紧急" ? 3 : item.priority === "重要" ? 2 : 1;
      return score(b) - score(a);
    })
    .slice(0, 3);
  const doneToday = (data.myRecords || []).filter((item) => String(item.createdAt || "").startsWith(today()) && (demo.mobileRole === "管理员" || item.createdBy === user.name)).length;
  const abnormalCount = [
    ...(data.exceptionReports || []),
    ...workOrders.filter((item) => item.source === "exception" || item.source === "quality" || String(item.type || "").includes("异常"))
  ].filter((item) => demo.mobileRole === "管理员" || item.handler === user.name || item.createdBy === user.name || item.reporter === user.name).length;
  const profileMine = (data.myRecords || []).filter((item) => item.createdBy === user.name);
  const profileDrafts = demo.mobileRole === "管理员" ? data.drafts || [] : (data.drafts || []).filter((item) => item.createdBy === user.name);
  const profileStats = demo.mobileRole === "管理员" ? (data.employeeStats || []) : (data.employeeStats || []).filter((item) => item.employee === user.name);
  const profileExceptionCount = (data.exceptionReports || []).filter((item) => demo.mobileRole === "管理员" || item.createdBy === user.name).length;
  const profileRejected = (data.workOrders || []).filter((item) => item.status === "已驳回" && (demo.mobileRole === "管理员" || item.handler === user.name || item.initiator === user.name)).length;
  const todayLabel = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "long" });

  return (
    <div className="space-y-4">
      <section className="rounded-[8px] bg-emerald-800 p-4 text-white shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-white/12"><UserRound size={25} /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-black">农牧业 IoT 环境监测预警与管理平台</p>
            <p className="mt-1 truncate text-sm font-bold text-emerald-50">{user.name || "刘师傅"} · {user.role || "员工"} · {user.organizationName || "安丘农牧示范园"}</p>
            <p className="mt-1 text-sm font-semibold text-emerald-100">{todayLabel}</p>
          </div>
          <Link to="/messages" className="relative grid h-11 w-11 place-items-center rounded-[8px] bg-white/12">
            <Bell size={22} />
            {messages.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs font-black">{messages.length}</span>}
          </Link>
        </div>
      </section>
      <ReadOnlyNotice />

      <SectionCard title="个人信息">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-[8px] bg-emerald-700 text-xl font-black text-white">{(user.name || "刘").slice(0, 1)}</div>
          <div className="min-w-0 flex-1"><p className="text-xl font-black">{user.name}</p><p className="text-sm font-bold text-slate-500">{user.role} · {user.organizationName}</p></div>
          <StatusTag status={demo.isReadonly ? "只读" : "可操作"} />
        </div>
      </SectionCard>

      <SectionCard title="我的统计">
        <div className="grid grid-cols-2 gap-3">
          <MiniStat label="我的提交" value={profileMine.length} />
          <MiniStat label="待办工单" value={(data.workOrders || []).filter((item) => item.handler === user.name && item.status !== "已完成").length} tone="amber" />
          <MiniStat label="异常上报" value={profileExceptionCount} tone="red" />
          <MiniStat label="被驳回" value={profileRejected} tone="amber" />
        </div>
      </SectionCard>

      <SectionCard title={demo.mobileRole === "管理员" ? "员工任务统计" : "我的任务统计"}>
        <div className="space-y-3">
          {profileStats.map((stat) => <EmployeeStatsCard key={stat.id} stat={stat} />)}
          {!profileStats.length && <EmptyState title="暂无统计" />}
        </div>
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

export function WorkbenchPage() {
  const demo = useDemo();
  const data = demo.data;
  const user = demo.currentUser || {};
  const [activeAction, setActiveAction] = useState(null);
  const [contracts, setContracts] = useState(() => {
    try {
      const saved = localStorage.getItem("heli_contracts");
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.warn("读取合同缓存失败", error);
    }

    return [
      {
        id: "HT-2026-001",
        name: "青贮饲料采购合同",
        type: "采购合同",
        party: "青岛某饲料供应商",
        amount: "120000",
        signDate: today(),
        deadline: "2026-08-31",
        status: "履约中",
        owner: user.name || "刘师傅",
        remark: "7月批次饲料采购合同"
      },
      {
        id: "HT-2026-002",
        name: "设备维保服务合同",
        type: "服务合同",
        party: "自动饲喂设备服务商",
        amount: "36000",
        signDate: today(),
        deadline: "2026-07-30",
        status: "即将到期",
        owner: user.name || "刘师傅",
        remark: "饲喂设备年度维保"
      }
    ];
  });

  const [contractForm, setContractForm] = useState({
    name: "",
    type: "采购合同",
    party: "",
    amount: "",
    signDate: today(),
    deadline: today(),
    status: "待审核",
    remark: ""
  });

  useEffect(() => {
    localStorage.setItem("heli_contracts", JSON.stringify(contracts));
  }, [contracts]);

  const myContracts = contracts.filter((item) => {
    if (demo.mobileRole === "管理员") return true;
    return item.owner === user.name;
  });

  const submitContract = () => {
    if (demo.isReadonly) {
      window.alert("当前为只读演示模式，不能执行该操作。");
      return;
    }

    if (!contractForm.name.trim()) {
      window.alert("请输入合同名称");
      return;
    }

    if (!contractForm.party.trim()) {
      window.alert("请输入合同相对方");
      return;
    }

    const newContract = {
      ...contractForm,
      id: `HT-${Date.now()}`,
      owner: user.name || "刘师傅"
    };

    setContracts((prev) => [newContract, ...prev]);

    setContractForm({
      name: "",
      type: "采购合同",
      party: "",
      amount: "",
      signDate: today(),
      deadline: today(),
      status: "待审核",
      remark: ""
    });

    window.alert("合同已添加。");
  };

  const updateContractStatus = (id, status) => {
    if (demo.isReadonly) {
      window.alert("当前为只读演示模式，不能执行该操作。");
      return;
    }

    setContracts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteContract = (id) => {
    if (demo.isReadonly) {
      window.alert("当前为只读演示模式，不能执行该操作。");
      return;
    }

    if (!window.confirm("确定删除这份合同吗？")) return;

    setContracts((prev) => prev.filter((item) => item.id !== id));
  };
  const [feedingForm, setFeedingForm] = useState({ date: today(), shift: "早", barn: "A区泌乳牛舍", herd: "泌乳高峰群", formula: "泌乳高峰日粮", feedBatch: "FD-N-20260704", plannedAmount: 8.5, actualAmount: 8.5, leftoverAmount: 0.4, dryMatterRatio: 0.52, intakeStatus: "正常", autoDeduct: true, abnormalNote: "", remark: "" });
  const [milkForm, setMilkForm] = useState({ date: today(), shift: "早班", barn: "A区泌乳牛舍", herd: "泌乳高峰群", milkingCowCount: 260, totalMilk: 8.6, qualifiedMilk: 8.4, abnormalMilk: 0.2, tankNo: "1号奶罐", temperature: 3.8, protein: 3.2, fat: 3.7, somaticCell: "18万/ml", colony: "3800 CFU/ml", sendInspection: true, abnormalNote: "", remark: "" });
  const [breedingForm, setBreedingForm] = useState({ recordType: "发情观察", cattleCode: "HL-N-1028", barn: "A区泌乳牛舍", observedAt: nowTime(), symptom: "爬跨、鸣叫", pregnancyResult: "待复查", nextReminderDate: today(), owner: user.name || "刘师傅", remark: "" });
  const [cattleForm, setCattleForm] = useState({ cattleCode: "HL-N-1028", type: "疾病", currentBarn: "A区泌乳牛舍", targetBarn: "", method: "现场复查并记录处理结果", affectMilk: true, withdrawalDays: 3, remark: "" });
  const [inventoryForm, setInventoryForm] = useState({ actionType: "领料申请", materialType: "饲料", materialName: "奶牛精补料", batch: "FD-N-20260704", quantity: 2, unit: "吨", purpose: "晚班饲喂备用", urgent: false, remark: "" });
  const [qualityForm, setQualityForm] = useState({ sampleType: "原奶", batch: "HL-MILK-AM", sampledAt: nowTime(), testItems: "温度、蛋白、脂肪、体细胞、菌落", result: "合格", passed: true, reason: "", handleMethod: "隔离", remark: "" });
  const [exceptionForm, setExceptionForm] = useState({ exceptionType: "牛只异常", location: "A区泌乳牛舍", relatedObject: "HL-N-1028", urgency: "重要", description: "采食下降，需要现场检查。", photo: "图片上传占位", remark: "" });
  const [handoverForm, setHandoverForm] = useState({ fromUser: user.name || "刘师傅", toUser: "赵师傅", shift: "早班", unfinishedItems: "A区泌乳牛舍剩料检查", abnormalCattle: "HL-N-1028 继续观察", abnormalInventory: "无", focusCattle: "HL-N-1028", confirmed: true, remark: "" });
  const [cattleArchives, setCattleArchives] = useState(() => {
    try {
      const saved = localStorage.getItem("heli_cattle_archives");
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.warn("读取牛只档案缓存失败", error);
    }
    return [
      { id: "CA-1028", cattleCode: "HL-N-1028", breed: "荷斯坦", barn: "A区泌乳牛舍", bornDate: "2024-03-18", growth: "泌乳高峰群，体况 3.25，近 7 天采食稳定。", estrus: "2026-06-18 发情观察，建议继续跟踪。", pregnancy: "2026-06-28 妊检待复查。", delivery: "暂无分娩记录。", health: "轻度采食下降，已生成观察工单。", owner: user.name || "刘师傅", updatedAt: nowTime() }
    ];
  });
  const [cattleArchiveForm, setCattleArchiveForm] = useState({ cattleCode: "HL-N-1028", breed: "荷斯坦", barn: "A区泌乳牛舍", bornDate: "2024-03-18", growth: "", estrus: "", pregnancy: "", delivery: "", health: "" });
  const barnSensorData = [
    { area: "A区泌乳牛舍", status: "正常", metrics: { 温度: "24.8℃", 湿度: "68%", 氨气: "12 ppm", 二氧化碳: "820 ppm", 风速: "1.8 m/s", 光照: "320 lx" } },
    { area: "犊牛舍", status: "关注", metrics: { 温度: "21.5℃", 湿度: "74%", 氨气: "16 ppm", 二氧化碳: "760 ppm", 风速: "1.2 m/s", 光照: "280 lx" } },
    { area: "育肥牛舍", status: "预警", metrics: { 温度: "29.6℃", 湿度: "79%", 氨气: "23 ppm", 二氧化碳: "980 ppm", 风速: "0.9 m/s", 光照: "260 lx" } }
  ];
  const greenhouseSensorData = [
    { area: "1号番茄大棚", status: "正常", metrics: { 温度: "27.2℃", 湿度: "71%", 二氧化碳: "930 ppm", 土壤湿度: "42%", 光照: "36 klx", 水肥EC: "1.8" } },
    { area: "2号黄瓜大棚", status: "关注", metrics: { 温度: "31.4℃", 湿度: "66%", 二氧化碳: "780 ppm", 土壤湿度: "34%", 光照: "41 klx", 水肥EC: "1.6" } },
    { area: "育苗棚", status: "预警", metrics: { 温度: "18.9℃", 湿度: "82%", 二氧化碳: "690 ppm", 土壤湿度: "57%", 光照: "22 klx", 水肥EC: "1.2" } }
  ];
  const [aiFeedForm, setAiFeedForm] = useState({ group: "A区泌乳牛舍", target: "高产稳产", constraint: "青贮、精补料库存充足，控制剩料率" });
  const [aiDiagForm, setAiDiagForm] = useState({ cattleCode: "HL-N-1028", symptom: "采食下降、精神偏弱、体温略高", duration: "1天", note: "近期处于泌乳高峰" });
  const [warningForm, setWarningForm] = useState({ slaughter: true, delivery: true, vaccine: true, estrus: true, inventory: true, quality: true, daysBefore: 7 });
  useEffect(() => {
    localStorage.setItem("heli_cattle_archives", JSON.stringify(cattleArchives));
  }, [cattleArchives]);
  const submitCattleArchive = () => {
    if (demo.isReadonly) {
      window.alert("当前为只读演示模式，不能执行该操作。");
      return;
    }
    if (!cattleArchiveForm.cattleCode.trim()) {
      window.alert("请输入牛号");
      return;
    }
    const record = { ...cattleArchiveForm, id: `CA-${Date.now()}`, owner: user.name || "刘师傅", updatedAt: nowTime() };
    setCattleArchives((prev) => [record, ...prev]);
    window.alert("牛只档案已保存。");
  };
  const aiFeedPlans = [
    { barn: aiFeedForm.group, formula: "高产泌乳日粮", focus: "提高能量密度，控制剩料率，优先保障高峰泌乳牛。" },
    { barn: "后备牛舍", formula: "生长发育日粮", focus: "保证蛋白和矿物质，避免过肥，维持稳定增重。" },
    { barn: "围产牛舍", formula: "围产过渡日粮", focus: "控制钙磷比例，降低产后代谢风险。" }
  ];
  const matingRecommendations = [
    { cattle: "HL-N-1028", advice: "继续观察 24 小时，确认发情强度后再安排配种。" },
    { cattle: "HL-N-0916", advice: "体况稳定，建议进入本周配种候选。" },
    { cattle: "HL-N-0833", advice: "健康评分偏低，暂缓配种并补充复查。" }
  ];
  const managementRecommendations = [
    "A区泌乳牛舍优先检查剩料率和异常采食牛。",
    "库存预警集中在育肥牛饲料，建议今天完成盘点。",
    "牛舍和大棚传感器预警集中时，优先检查通风、温湿度和水肥系统。",
    "分娩预警、疫苗提醒和大棚温湿度预警建议统一推送到工作台消息。"
  ];
  const tasks = visibleForUser(data.mobileTasks, demo);
  const openStatuses = ["待派发", "待处理", "处理中", "已驳回", "已超时", "未开始", "进行中"];
  const smartOrders = visibleForUser(data.smartWorkOrders, demo).filter((item) => openStatuses.includes(item.status));
  const workOrders = visibleForUser(data.workOrders, demo).filter((item) => openStatuses.includes(item.status));
  const messages = visibleForUser(data.messages, demo, ["receiver", "createdBy"]).slice(0, 3);
  const myRecords = demo.mobileRole === "管理员" ? (data.myRecords || []).slice(0, 3) : (data.myRecords || []).filter((item) => item.createdBy === demo.currentUser?.name).slice(0, 3);
  const urgentOrders = [...smartOrders, ...workOrders].filter((item) => item.priority === "紧急");
  const importantOrders = [...smartOrders, ...workOrders]
    .sort((a, b) => {
      const score = (item) => item.priority === "紧急" ? 3 : item.priority === "重要" ? 2 : 1;
      return score(b) - score(a);
    })
    .slice(0, 3);
  const doneToday = (data.myRecords || []).filter((item) => String(item.createdAt || "").startsWith(today()) && (demo.mobileRole === "管理员" || item.createdBy === user.name)).length;
  const abnormalCount = [
    ...(data.exceptionReports || []),
    ...workOrders.filter((item) => item.source === "exception" || item.source === "quality" || String(item.type || "").includes("异常"))
  ].filter((item) => demo.mobileRole === "管理员" || item.handler === user.name || item.createdBy === user.name || item.reporter === user.name).length;
  const actionItems = [
    { action: "feeding", icon: Wheat, title: "饲喂记录", tone: "emerald" },
    { action: "milk", icon: Milk, title: "产奶记录", tone: "sky" },
    { action: "breeding", icon: HeartPulse, title: "繁育记录", tone: "rose" },
    { action: "cattle", icon: Search, title: "牛只管理", tone: "amber" },
    { action: "cattleArchive", icon: BookOpen, title: "牛只档案", tone: "amber" },
    { action: "barnSensors", icon: Database, title: "牛舍数据", tone: "sky" },
    { action: "greenhouseSensors", icon: Boxes, title: "大棚数据", tone: "emerald" },
    { action: "inventory", icon: Boxes, title: "库存申请", tone: "violet" },
    { action: "contract", icon: FileText, title: "合同管理", tone: "violet" },
    { action: "quality", icon: PackageCheck, title: "质检记录", tone: "emerald" },
    { action: "exception", icon: AlertTriangle, title: "异常上报", tone: "rose" },
    { action: "handover", icon: HeartHandshake, title: "交接班", tone: "sky" }
  ];
  const adminItems = [
    { to: "/work-orders", icon: Send, title: "工单派发", tone: "emerald" },
    { to: "/records", icon: UsersRound, title: "员工记录", tone: "sky" }
  ];
  const aiItems = [
    { action: "aiFeed", icon: Wheat, title: "饲喂配方", tone: "emerald" },
    { action: "aiMating", icon: HeartPulse, title: "配种推荐", tone: "rose" },
    { action: "aiManage", icon: CheckCircle2, title: "管理推荐", tone: "sky" },
    { action: "aiDiagnosis", icon: Search, title: "AI诊断", tone: "amber" },
    { action: "aiWarning", icon: Bell, title: "预警管理", tone: "violet" }
  ];
  const todayLabel = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "long" });
  const feedCalc = calcFeeding(feedingForm);
  const milkCalc = calcMilk(milkForm);
  const submitSheet = (action) => {
    try {
      if (action === "feeding") demo.submitFeedingRecord({ ...feedingForm, executor: user.name, abnormalNote: feedingForm.abnormalNote });
      if (action === "milk") demo.submitMilkRecord({ ...milkForm, milker: user.name, abnormalDescription: milkForm.abnormalNote });
      if (action === "breeding") demo.submitBreedingRecord({ ...breedingForm, recordTime: breedingForm.observedAt, pregnancyCheckDate: breedingForm.nextReminderDate });
      if (action === "cattle") demo.submitCattleEvent({ ...cattleForm, eventTime: nowTime(), handler: user.name, affectMilk: cattleForm.affectMilk });
      if (action === "inventory") {
        const kindMap = { 领料申请: "request", 入库登记: "in", 出库登记: "out", 盘点记录: "count" };
        demo.submitInventoryAction(kindMap[inventoryForm.actionType] || "request", { ...inventoryForm, applicant: user.name, handler: user.name });
      }
      if (action === "quality") demo.submitQualityInspection({ ...qualityForm, inspectionType: `${qualityForm.sampleType}质检`, taskId: "quality-task-1", inspector: user.name });
      if (action === "exception") demo.submitExceptionReport({ ...exceptionForm, reporter: user.name });
      if (action === "handover") demo.submitShiftHandover({ ...handoverForm, handoverAt: nowTime(), abnormalQuality: "", notes: handoverForm.remark });
      setActiveAction(null);
      window.alert("已提交，系统已写入记录并触发相关联动。");
    } catch (error) {
      window.alert(error.message || "提交失败");
    }
  };
  const saveSheetDraft = (module, title, payload) => {
    try {
      demo.saveDraft(module, title, payload);
      setActiveAction(null);
      window.alert("已保存到草稿箱。");
    } catch (error) {
      window.alert(error.message || "保存失败");
    }
  };


  return (
    <div className="space-y-4">
      <ReadOnlyNotice />

      <SectionCard title="农牧业务">
        <QuickActionGrid>
          {actionItems.map((item) => <QuickLink key={item.title} {...item} onClick={() => setActiveAction(item.action)} />)}
          {demo.mobileRole === "管理员" && adminItems.map((item) => <QuickLink key={item.title} {...item} />)}
        </QuickActionGrid>
      </SectionCard>

      <SectionCard title="AI助手">
        <QuickActionGrid>
          {aiItems.map((item) => <QuickLink key={item.title} {...item} onClick={() => setActiveAction(item.action)} />)}
        </QuickActionGrid>
      </SectionCard>

      <MobileFormSheet open={activeAction === "barnSensors"} title="牛舍数据" onClose={() => setActiveAction(null)} onSubmit={() => window.alert("已刷新牛舍传感器数据。") } submitText="刷新" onSaveDraft={() => setActiveAction(null)} draftText="关闭">
        <div className="space-y-3">
          {barnSensorData.map((item) => (
            <SectionCard key={item.area} title={item.area} action={<StatusTag status={item.status} />}>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(item.metrics).map(([label, value]) => <MiniStat key={label} label={label} value={value} tone={item.status === "预警" ? "red" : item.status === "关注" ? "amber" : "emerald"} />)}
              </div>
            </SectionCard>
          ))}
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "greenhouseSensors"} title="大棚数据" onClose={() => setActiveAction(null)} onSubmit={() => window.alert("已刷新大棚传感器数据。") } submitText="刷新" onSaveDraft={() => setActiveAction(null)} draftText="关闭">
        <div className="space-y-3">
          {greenhouseSensorData.map((item) => (
            <SectionCard key={item.area} title={item.area} action={<StatusTag status={item.status} />}>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(item.metrics).map(([label, value]) => <MiniStat key={label} label={label} value={value} tone={item.status === "预警" ? "red" : item.status === "关注" ? "amber" : "emerald"} />)}
              </div>
            </SectionCard>
          ))}
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "cattleArchive"} title="牛只档案" onClose={() => setActiveAction(null)} onSubmit={submitCattleArchive} submitText="保存档案" onSaveDraft={() => setActiveAction(null)} draftText="关闭">
        <div className="space-y-4">
          <SectionCard title="新增档案">
            <div className="grid gap-3">
              <Field label="牛号"><TextInput value={cattleArchiveForm.cattleCode} onChange={(e) => setCattleArchiveForm({ ...cattleArchiveForm, cattleCode: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="品种"><TextInput value={cattleArchiveForm.breed} onChange={(e) => setCattleArchiveForm({ ...cattleArchiveForm, breed: e.target.value })} /></Field>
                <Field label="牛舍"><TextInput value={cattleArchiveForm.barn} onChange={(e) => setCattleArchiveForm({ ...cattleArchiveForm, barn: e.target.value })} /></Field>
              </div>
              <Field label="出生日期"><TextInput type="date" value={cattleArchiveForm.bornDate} onChange={(e) => setCattleArchiveForm({ ...cattleArchiveForm, bornDate: e.target.value })} /></Field>
              <Field label="生长档案"><TextArea value={cattleArchiveForm.growth} onChange={(e) => setCattleArchiveForm({ ...cattleArchiveForm, growth: e.target.value })} /></Field>
              <Field label="发情数据"><TextArea value={cattleArchiveForm.estrus} onChange={(e) => setCattleArchiveForm({ ...cattleArchiveForm, estrus: e.target.value })} /></Field>
              <Field label="妊娠数据"><TextArea value={cattleArchiveForm.pregnancy} onChange={(e) => setCattleArchiveForm({ ...cattleArchiveForm, pregnancy: e.target.value })} /></Field>
              <Field label="分娩数据"><TextArea value={cattleArchiveForm.delivery} onChange={(e) => setCattleArchiveForm({ ...cattleArchiveForm, delivery: e.target.value })} /></Field>
              <Field label="健康数据"><TextArea value={cattleArchiveForm.health} onChange={(e) => setCattleArchiveForm({ ...cattleArchiveForm, health: e.target.value })} /></Field>
            </div>
          </SectionCard>
          <SectionCard title="档案列表">
            <div className="space-y-3">
              {cattleArchives.map((item) => (
                <div key={item.id} className="rounded-[8px] border border-slate-300 bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-base font-black text-slate-950">{item.cattleCode}</p><p className="text-sm font-bold text-slate-500">{item.breed} · {item.barn}</p></div><StatusTag status="档案" /></div>
                  <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600">
                    <p>生长：{item.growth || "-"}</p><p>发情：{item.estrus || "-"}</p><p>妊娠：{item.pregnancy || "-"}</p><p>分娩：{item.delivery || "-"}</p><p>健康：{item.health || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "aiFeed"} title="饲喂配方" onClose={() => setActiveAction(null)} onSubmit={() => window.alert("已生成饲喂配方。")} submitText="生成配方" onSaveDraft={() => setActiveAction(null)} draftText="关闭">
        <div className="space-y-4">
          <SectionCard title="生成条件"><div className="grid gap-3"><Field label="牛舍分群"><TextInput value={aiFeedForm.group} onChange={(e) => setAiFeedForm({ ...aiFeedForm, group: e.target.value })} /></Field><Field label="目标"><TextInput value={aiFeedForm.target} onChange={(e) => setAiFeedForm({ ...aiFeedForm, target: e.target.value })} /></Field><Field label="约束"><TextArea value={aiFeedForm.constraint} onChange={(e) => setAiFeedForm({ ...aiFeedForm, constraint: e.target.value })} /></Field></div></SectionCard>
          <SectionCard title="推荐配方"><div className="space-y-2">{aiFeedPlans.map((item) => <div key={item.barn} className="rounded-[8px] border border-slate-300 bg-white p-3 shadow-sm"><p className="text-base font-black">{item.barn} · {item.formula}</p><p className="mt-1 text-sm font-semibold text-slate-600">{item.focus}</p></div>)}</div></SectionCard>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "aiMating"} title="配种推荐" onClose={() => setActiveAction(null)} onSubmit={() => window.alert("已生成配种推荐。")} submitText="生成推荐" onSaveDraft={() => setActiveAction(null)} draftText="关闭">
        <SectionCard title="推荐结果"><div className="space-y-2">{matingRecommendations.map((item) => <div key={item.cattle} className="rounded-[8px] border border-slate-300 bg-white p-3 shadow-sm"><p className="text-base font-black">{item.cattle}</p><p className="mt-1 text-sm font-semibold text-slate-600">{item.advice}</p></div>)}</div></SectionCard>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "aiManage"} title="管理推荐" onClose={() => setActiveAction(null)} onSubmit={() => window.alert("已生成管理推荐。")} submitText="刷新推荐" onSaveDraft={() => setActiveAction(null)} draftText="关闭">
        <SectionCard title="推荐动作"><div className="space-y-2">{managementRecommendations.map((item) => <div key={item} className="rounded-[8px] border border-slate-300 bg-white p-3 text-sm font-bold text-slate-700 shadow-sm">{item}</div>)}</div></SectionCard>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "aiDiagnosis"} title="AI诊断" onClose={() => setActiveAction(null)} onSubmit={() => window.alert("已生成诊断建议。")} submitText="生成诊断" onSaveDraft={() => setActiveAction(null)} draftText="关闭">
        <div className="space-y-4"><SectionCard title="病牛特征"><div className="grid gap-3"><Field label="牛号"><TextInput value={aiDiagForm.cattleCode} onChange={(e) => setAiDiagForm({ ...aiDiagForm, cattleCode: e.target.value })} /></Field><Field label="症状"><TextArea value={aiDiagForm.symptom} onChange={(e) => setAiDiagForm({ ...aiDiagForm, symptom: e.target.value })} /></Field><Field label="持续时间"><TextInput value={aiDiagForm.duration} onChange={(e) => setAiDiagForm({ ...aiDiagForm, duration: e.target.value })} /></Field><Field label="补充说明"><TextArea value={aiDiagForm.note} onChange={(e) => setAiDiagForm({ ...aiDiagForm, note: e.target.value })} /></Field></div></SectionCard><SectionCard title="诊断建议"><div className="rounded-[8px] border border-slate-300 bg-white p-3 text-sm font-semibold leading-6 text-slate-700 shadow-sm">疑似采食异常或早期炎症反应，建议测体温、检查反刍、检查乳房和粪便状态，并生成健康观察工单。</div></SectionCard></div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "aiWarning"} title="预警管理" onClose={() => setActiveAction(null)} onSubmit={() => window.alert("预警设置已保存。") } submitText="保存设置" onSaveDraft={() => setActiveAction(null)} draftText="关闭">
        <SectionCard title="提醒设置">
          <div className="grid gap-3">
            {[ ["slaughter", "出栏提醒"], ["delivery", "分娩预警"], ["vaccine", "疫苗接种"], ["estrus", "发情复查"], ["inventory", "库存预警"], ["quality", "质检异常"] ].map(([key, label]) => <label key={key} className="flex min-h-12 items-center gap-3 rounded-[8px] border border-slate-300 bg-white px-3 text-base font-black text-slate-700 shadow-sm"><input type="checkbox" checked={warningForm[key]} onChange={(e) => setWarningForm({ ...warningForm, [key]: e.target.checked })} />{label}</label>)}
            <Field label="提前天数"><TextInput type="number" value={warningForm.daysBefore} onChange={(e) => setWarningForm({ ...warningForm, daysBefore: e.target.value })} /></Field>
          </div>
        </SectionCard>
      </MobileFormSheet>

      <MobileFormSheet
        open={activeAction === "contract"}
        title="合同管理"
        onClose={() => setActiveAction(null)}
        onSubmit={submitContract}
        submitText="添加合同"
        draftText="关闭"
        onSaveDraft={() => setActiveAction(null)}
      >
        <div className="space-y-4">
          <SectionCard title="新增合同">
            <div className="space-y-3">
              <Field label="合同名称">
                <TextInput
                  value={contractForm.name}
                  onChange={(e) => setContractForm({ ...contractForm, name: e.target.value })}
                  placeholder="例如：青贮饲料采购合同"
                />
              </Field>

              <Field label="合同类型">
                <SelectInput
                  value={contractForm.type}
                  onChange={(e) => setContractForm({ ...contractForm, type: e.target.value })}
                >
                  {["采购合同", "销售合同", "服务合同", "租赁合同", "其他合同"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="合同相对方">
                <TextInput
                  value={contractForm.party}
                  onChange={(e) => setContractForm({ ...contractForm, party: e.target.value })}
                  placeholder="例如：某饲料供应商 / 某乳品客户"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="合同金额">
                  <TextInput
                    type="number"
                    value={contractForm.amount}
                    onChange={(e) => setContractForm({ ...contractForm, amount: e.target.value })}
                    placeholder="金额"
                  />
                </Field>

                <Field label="合同状态">
                  <SelectInput
                    value={contractForm.status}
                    onChange={(e) => setContractForm({ ...contractForm, status: e.target.value })}
                  >
                    {["待审核", "履约中", "即将到期", "已完成", "已终止"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </SelectInput>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="签订日期">
                  <TextInput
                    type="date"
                    value={contractForm.signDate}
                    onChange={(e) => setContractForm({ ...contractForm, signDate: e.target.value })}
                  />
                </Field>

                <Field label="到期日期">
                  <TextInput
                    type="date"
                    value={contractForm.deadline}
                    onChange={(e) => setContractForm({ ...contractForm, deadline: e.target.value })}
                  />
                </Field>
              </div>

              <Field label="备注">
                <TextArea
                  value={contractForm.remark}
                  onChange={(e) => setContractForm({ ...contractForm, remark: e.target.value })}
                  placeholder="例如：付款节点、供货周期、注意事项等"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="我的合同">
            <div className="space-y-3">
              {myContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="rounded-[8px] border border-slate-300 bg-white p-3 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {contract.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {contract.type} · {contract.party}
                      </p>
                    </div>
                    <StatusTag status={contract.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <p>金额：¥{contract.amount || "0"}</p>
                    <p>负责人：{contract.owner}</p>
                    <p>签订：{contract.signDate}</p>
                    <p>到期：{contract.deadline}</p>
                  </div>

                  {contract.remark && (
                    <p className="mt-2 rounded-[8px] border border-slate-200 bg-white p-2 text-xs leading-5 text-slate-500">
                      {contract.remark}
                    </p>
                  )}

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => updateContractStatus(contract.id, "履约中")}
                      className="min-h-10 rounded-[8px] bg-emerald-50 text-xs font-black text-emerald-700"
                    >
                      履约中
                    </button>

                    <button
                      type="button"
                      onClick={() => updateContractStatus(contract.id, "已完成")}
                      className="min-h-10 rounded-[8px] bg-sky-50 text-xs font-black text-sky-700"
                    >
                      已完成
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteContract(contract.id)}
                      className="min-h-10 rounded-[8px] bg-red-50 text-xs font-black text-red-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}

              {!myContracts.length && (
                <EmptyState
                  title="暂无合同"
                />
              )}
            </div>
          </SectionCard>
        </div>
      </MobileFormSheet>
      <MobileFormSheet open={activeAction === "feeding"} title="饲喂记录" onClose={() => setActiveAction(null)} onSaveDraft={() => saveSheetDraft("饲喂管理", `${feedingForm.barn}${feedingForm.shift}班饲喂`, feedingForm)} onSubmit={() => submitSheet("feeding")} submitText="提交饲喂记录">
        <div className="grid gap-3">
          <Field label="日期"><TextInput value={feedingForm.date} onChange={(e) => setFeedingForm({ ...feedingForm, date: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="班次"><SelectInput value={feedingForm.shift} onChange={(e) => setFeedingForm({ ...feedingForm, shift: e.target.value })}>{["早", "中", "晚", "夜"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
            <Field label="采食情况"><SelectInput value={feedingForm.intakeStatus} onChange={(e) => setFeedingForm({ ...feedingForm, intakeStatus: e.target.value })}>{["正常", "偏低", "拒食", "异常"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          </div>
          <Field label="牛舍"><TextInput value={feedingForm.barn} onChange={(e) => setFeedingForm({ ...feedingForm, barn: e.target.value })} /></Field>
          <Field label="牛群"><TextInput value={feedingForm.herd} onChange={(e) => setFeedingForm({ ...feedingForm, herd: e.target.value })} /></Field>
          <Field label="饲喂配方"><TextInput value={feedingForm.formula} onChange={(e) => setFeedingForm({ ...feedingForm, formula: e.target.value })} /></Field>
          <Field label="饲料批次"><TextInput value={feedingForm.feedBatch} onChange={(e) => setFeedingForm({ ...feedingForm, feedBatch: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="计划投喂量"><TextInput value={feedingForm.plannedAmount} onChange={(e) => setFeedingForm({ ...feedingForm, plannedAmount: e.target.value })} /></Field>
            <Field label="实际投喂量"><TextInput value={feedingForm.actualAmount} onChange={(e) => setFeedingForm({ ...feedingForm, actualAmount: e.target.value })} /></Field>
            <Field label="剩料量"><TextInput value={feedingForm.leftoverAmount} onChange={(e) => setFeedingForm({ ...feedingForm, leftoverAmount: e.target.value })} /></Field>
            <Field label="干物质比例"><TextInput value={feedingForm.dryMatterRatio} onChange={(e) => setFeedingForm({ ...feedingForm, dryMatterRatio: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="偏差率" value={`${feedCalc.deviationRate}%`} tone="amber" />
            <MiniStat label="剩料率" value={`${feedCalc.leftoverRate}%`} tone="amber" />
            <MiniStat label="干物质采食" value={feedCalc.dryMatterIntake} />
          </div>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black text-slate-700"><input type="checkbox" checked={feedingForm.autoDeduct} onChange={(e) => setFeedingForm({ ...feedingForm, autoDeduct: e.target.checked })} />自动扣减库存</label>
          <Field label="异常说明"><TextArea value={feedingForm.abnormalNote} onChange={(e) => setFeedingForm({ ...feedingForm, abnormalNote: e.target.value })} /></Field>
          <Field label="备注"><TextArea value={feedingForm.remark} onChange={(e) => setFeedingForm({ ...feedingForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "milk"} title="产奶记录" onClose={() => setActiveAction(null)} onSaveDraft={() => saveSheetDraft("产奶管理", `${milkForm.barn}${milkForm.shift}产奶`, milkForm)} onSubmit={() => submitSheet("milk")} submitText="提交产奶记录">
        <div className="grid gap-3">
          <Field label="日期"><TextInput value={milkForm.date} onChange={(e) => setMilkForm({ ...milkForm, date: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="班次"><SelectInput value={milkForm.shift} onChange={(e) => setMilkForm({ ...milkForm, shift: e.target.value })}>{["早班", "中班", "晚班"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
            <Field label="泌乳牛头数"><TextInput value={milkForm.milkingCowCount} onChange={(e) => setMilkForm({ ...milkForm, milkingCowCount: e.target.value })} /></Field>
          </div>
          <Field label="牛舍"><TextInput value={milkForm.barn} onChange={(e) => setMilkForm({ ...milkForm, barn: e.target.value })} /></Field>
          <Field label="牛群"><TextInput value={milkForm.herd} onChange={(e) => setMilkForm({ ...milkForm, herd: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="总产奶量"><TextInput value={milkForm.totalMilk} onChange={(e) => setMilkForm({ ...milkForm, totalMilk: e.target.value })} /></Field>
            <Field label="合格奶量"><TextInput value={milkForm.qualifiedMilk} onChange={(e) => setMilkForm({ ...milkForm, qualifiedMilk: e.target.value })} /></Field>
            <Field label="异常奶量"><TextInput value={milkForm.abnormalMilk} onChange={(e) => setMilkForm({ ...milkForm, abnormalMilk: e.target.value })} /></Field>
            <Field label="入罐编号"><TextInput value={milkForm.tankNo} onChange={(e) => setMilkForm({ ...milkForm, tankNo: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2"><MiniStat label="单牛平均" value={milkCalc.avgMilkPerCow} /><MiniStat label="异常奶比例" value={`${milkCalc.abnormalMilkRate}%`} tone="amber" /></div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="原奶温度"><TextInput value={milkForm.temperature} onChange={(e) => setMilkForm({ ...milkForm, temperature: e.target.value })} /></Field>
            <Field label="蛋白"><TextInput value={milkForm.protein} onChange={(e) => setMilkForm({ ...milkForm, protein: e.target.value })} /></Field>
            <Field label="脂肪"><TextInput value={milkForm.fat} onChange={(e) => setMilkForm({ ...milkForm, fat: e.target.value })} /></Field>
            <Field label="体细胞"><TextInput value={milkForm.somaticCell} onChange={(e) => setMilkForm({ ...milkForm, somaticCell: e.target.value })} /></Field>
          </div>
          <Field label="菌落总数"><TextInput value={milkForm.colony} onChange={(e) => setMilkForm({ ...milkForm, colony: e.target.value })} /></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black text-slate-700"><input type="checkbox" checked={milkForm.sendInspection} onChange={(e) => setMilkForm({ ...milkForm, sendInspection: e.target.checked })} />是否送检</label>
          <Field label="异常说明"><TextArea value={milkForm.abnormalNote} onChange={(e) => setMilkForm({ ...milkForm, abnormalNote: e.target.value })} /></Field>
          <Field label="备注"><TextArea value={milkForm.remark} onChange={(e) => setMilkForm({ ...milkForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "breeding"} title="繁育记录" onClose={() => setActiveAction(null)} onSaveDraft={() => saveSheetDraft("繁育管理", `${breedingForm.cattleCode}${breedingForm.recordType}`, breedingForm)} onSubmit={() => submitSheet("breeding")} submitText="提交繁育记录">
        <div className="grid gap-3">
          <Field label="记录类型"><SelectInput value={breedingForm.recordType} onChange={(e) => setBreedingForm({ ...breedingForm, recordType: e.target.value })}>{["发情观察", "配种", "妊检", "产犊"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <Field label="牛号"><TextInput value={breedingForm.cattleCode} onChange={(e) => setBreedingForm({ ...breedingForm, cattleCode: e.target.value })} /></Field>
          <Field label="牛舍"><TextInput value={breedingForm.barn} onChange={(e) => setBreedingForm({ ...breedingForm, barn: e.target.value })} /></Field>
          <Field label="记录时间"><TextInput value={breedingForm.observedAt} onChange={(e) => setBreedingForm({ ...breedingForm, observedAt: e.target.value })} /></Field>
          <Field label="相关结果"><TextArea value={breedingForm.symptom} onChange={(e) => setBreedingForm({ ...breedingForm, symptom: e.target.value })} /></Field>
          <Field label="下次提醒日期"><TextInput value={breedingForm.nextReminderDate} onChange={(e) => setBreedingForm({ ...breedingForm, nextReminderDate: e.target.value })} /></Field>
          <Field label="操作人"><TextInput value={breedingForm.owner} onChange={(e) => setBreedingForm({ ...breedingForm, owner: e.target.value })} /></Field>
          <Field label="备注"><TextArea value={breedingForm.remark} onChange={(e) => setBreedingForm({ ...breedingForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "cattle"} title="牛只事件" onClose={() => setActiveAction(null)} onSaveDraft={() => saveSheetDraft("牛只管理", `${cattleForm.cattleCode}${cattleForm.type}`, cattleForm)} onSubmit={() => submitSheet("cattle")} submitText="提交牛只事件">
        <div className="grid gap-3">
          <Field label="牛号"><TextInput value={cattleForm.cattleCode} onChange={(e) => setCattleForm({ ...cattleForm, cattleCode: e.target.value })} /></Field>
          <Field label="事件类型"><SelectInput value={cattleForm.type} onChange={(e) => setCattleForm({ ...cattleForm, type: e.target.value })}>{["转群", "疾病", "用药", "防疫", "淘汰", "死亡", "异常行为", "其他"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <Field label="当前牛舍"><TextInput value={cattleForm.currentBarn} onChange={(e) => setCattleForm({ ...cattleForm, currentBarn: e.target.value })} /></Field>
          {cattleForm.type === "转群" && <Field label="目标牛舍"><TextInput value={cattleForm.targetBarn} onChange={(e) => setCattleForm({ ...cattleForm, targetBarn: e.target.value })} /></Field>}
          <Field label="处理方式"><TextArea value={cattleForm.method} onChange={(e) => setCattleForm({ ...cattleForm, method: e.target.value })} /></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black text-slate-700"><input type="checkbox" checked={cattleForm.affectMilk} onChange={(e) => setCattleForm({ ...cattleForm, affectMilk: e.target.checked })} />是否影响产奶</label>
          {cattleForm.type === "用药" && <Field label="休药期天数"><TextInput value={cattleForm.withdrawalDays} onChange={(e) => setCattleForm({ ...cattleForm, withdrawalDays: e.target.value })} /></Field>}
          <Field label="备注"><TextArea value={cattleForm.remark} onChange={(e) => setCattleForm({ ...cattleForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "inventory"} title="库存申请" onClose={() => setActiveAction(null)} onSaveDraft={() => saveSheetDraft("库存管理", `${inventoryForm.materialName}${inventoryForm.actionType}`, inventoryForm)} onSubmit={() => submitSheet("inventory")} submitText="提交库存记录">
        <div className="grid gap-3">
          <Field label="类型"><SelectInput value={inventoryForm.actionType} onChange={(e) => setInventoryForm({ ...inventoryForm, actionType: e.target.value })}>{["领料申请", "入库登记", "出库登记", "盘点记录"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="物料类型"><TextInput value={inventoryForm.materialType} onChange={(e) => setInventoryForm({ ...inventoryForm, materialType: e.target.value })} /></Field>
            <Field label="单位"><TextInput value={inventoryForm.unit} onChange={(e) => setInventoryForm({ ...inventoryForm, unit: e.target.value })} /></Field>
          </div>
          <Field label="物料名称"><TextInput value={inventoryForm.materialName} onChange={(e) => setInventoryForm({ ...inventoryForm, materialName: e.target.value })} /></Field>
          <Field label="批次号"><TextInput value={inventoryForm.batch} onChange={(e) => setInventoryForm({ ...inventoryForm, batch: e.target.value })} /></Field>
          <Field label="数量"><TextInput value={inventoryForm.quantity} onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: e.target.value })} /></Field>
          <Field label="用途"><TextArea value={inventoryForm.purpose} onChange={(e) => setInventoryForm({ ...inventoryForm, purpose: e.target.value })} /></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black text-slate-700"><input type="checkbox" checked={inventoryForm.urgent} onChange={(e) => setInventoryForm({ ...inventoryForm, urgent: e.target.checked })} />是否紧急</label>
          <Field label="备注"><TextArea value={inventoryForm.remark} onChange={(e) => setInventoryForm({ ...inventoryForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "quality"} title="质检记录" onClose={() => setActiveAction(null)} onSaveDraft={() => saveSheetDraft("质检管理", `${qualityForm.batch}${qualityForm.sampleType}质检`, qualityForm)} onSubmit={() => submitSheet("quality")} submitText="提交质检记录">
        <div className="grid gap-3">
          <Field label="样品类型"><SelectInput value={qualityForm.sampleType} onChange={(e) => setQualityForm({ ...qualityForm, sampleType: e.target.value })}>{["原奶", "饲料", "成品"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <Field label="关联批次"><TextInput value={qualityForm.batch} onChange={(e) => setQualityForm({ ...qualityForm, batch: e.target.value })} /></Field>
          <Field label="采样时间"><TextInput value={qualityForm.sampledAt} onChange={(e) => setQualityForm({ ...qualityForm, sampledAt: e.target.value })} /></Field>
          <Field label="检测项目"><TextArea value={qualityForm.testItems} onChange={(e) => setQualityForm({ ...qualityForm, testItems: e.target.value })} /></Field>
          <Field label="检测结果"><SelectInput value={qualityForm.result} onChange={(e) => setQualityForm({ ...qualityForm, result: e.target.value, passed: e.target.value === "合格" })}>{["合格", "不合格"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black text-slate-700"><input type="checkbox" checked={qualityForm.passed} onChange={(e) => setQualityForm({ ...qualityForm, passed: e.target.checked, result: e.target.checked ? "合格" : "不合格" })} />是否合格</label>
          <Field label="不合格原因"><TextArea value={qualityForm.reason} onChange={(e) => setQualityForm({ ...qualityForm, reason: e.target.value })} /></Field>
          <Field label="处理方式"><SelectInput value={qualityForm.handleMethod} onChange={(e) => setQualityForm({ ...qualityForm, handleMethod: e.target.value })}>{["隔离", "退回", "报废", "复检", "降级使用"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <Field label="备注"><TextArea value={qualityForm.remark} onChange={(e) => setQualityForm({ ...qualityForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "exception"} title="异常上报" onClose={() => setActiveAction(null)} onSaveDraft={() => saveSheetDraft("异常上报", `${exceptionForm.exceptionType}${exceptionForm.location}`, exceptionForm)} onSubmit={() => submitSheet("exception")} submitText="提交异常">
        <div className="grid gap-3">
          <Field label="异常类型"><SelectInput value={exceptionForm.exceptionType} onChange={(e) => setExceptionForm({ ...exceptionForm, exceptionType: e.target.value })}>{["牛只异常", "饲喂异常", "产奶异常", "质检异常", "库存异常", "设备异常", "安全隐患", "其他"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <Field label="所属位置"><TextInput value={exceptionForm.location} onChange={(e) => setExceptionForm({ ...exceptionForm, location: e.target.value })} /></Field>
          <Field label="关联对象"><TextInput value={exceptionForm.relatedObject} onChange={(e) => setExceptionForm({ ...exceptionForm, relatedObject: e.target.value })} /></Field>
          <Field label="紧急程度"><SelectInput value={exceptionForm.urgency} onChange={(e) => setExceptionForm({ ...exceptionForm, urgency: e.target.value })}>{["普通", "重要", "紧急"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <Field label="异常描述"><TextArea value={exceptionForm.description} onChange={(e) => setExceptionForm({ ...exceptionForm, description: e.target.value })} /></Field>
          <Field label="图片上传占位"><TextInput value={exceptionForm.photo} onChange={(e) => setExceptionForm({ ...exceptionForm, photo: e.target.value })} /></Field>
          <Field label="备注"><TextArea value={exceptionForm.remark} onChange={(e) => setExceptionForm({ ...exceptionForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeAction === "handover"} title="交接班" onClose={() => setActiveAction(null)} onSaveDraft={() => saveSheetDraft("交接班", `${handoverForm.shift}交接班`, handoverForm)} onSubmit={() => submitSheet("handover")} submitText="提交交接班">
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="交班人"><TextInput value={handoverForm.fromUser} onChange={(e) => setHandoverForm({ ...handoverForm, fromUser: e.target.value })} /></Field>
            <Field label="接班人"><TextInput value={handoverForm.toUser} onChange={(e) => setHandoverForm({ ...handoverForm, toUser: e.target.value })} /></Field>
          </div>
          <Field label="班次"><SelectInput value={handoverForm.shift} onChange={(e) => setHandoverForm({ ...handoverForm, shift: e.target.value })}>{["早班", "中班", "晚班", "夜班"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <Field label="未完成事项"><TextArea value={handoverForm.unfinishedItems} onChange={(e) => setHandoverForm({ ...handoverForm, unfinishedItems: e.target.value })} /></Field>
          <Field label="异常牛只"><TextArea value={handoverForm.abnormalCattle} onChange={(e) => setHandoverForm({ ...handoverForm, abnormalCattle: e.target.value })} /></Field>
          <Field label="异常库存"><TextArea value={handoverForm.abnormalInventory} onChange={(e) => setHandoverForm({ ...handoverForm, abnormalInventory: e.target.value })} /></Field>
          <Field label="重点观察事项"><TextArea value={handoverForm.focusCattle} onChange={(e) => setHandoverForm({ ...handoverForm, focusCattle: e.target.value })} /></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black text-slate-700"><input type="checkbox" checked={handoverForm.confirmed} onChange={(e) => setHandoverForm({ ...handoverForm, confirmed: e.target.checked })} />接班确认</label>
          <Field label="备注"><TextArea value={handoverForm.remark} onChange={(e) => setHandoverForm({ ...handoverForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

    </div>
  );
}

export function TasksPage() {
  const demo = useDemo();
  const tasks = visibleForUser(demo.data.mobileTasks, demo);
  const smartOrders = visibleForUser(demo.data.smartWorkOrders, demo);
  const jobs = [
    { to: "/feeding", title: "饲喂管理" },
    { to: "/milk", title: "产奶管理" },
    { to: "/breeding", title: "繁育管理" },
    { to: "/cattle", title: "牛只管理" },
    { to: "/inventory", title: "库存管理" },
    { to: "/quality", title: "质检管理" },
    { to: "/reports", title: "异常上报" },
    { to: "/handover", title: "交接班" },
    { to: "/manuals", title: "操作手册" }
  ];
  return (
    <div>
      <PageTitle title="今日智能工单" />
      <SectionCard title="智能工单">
        <div className="space-y-3">{smartOrders.map((order) => <SmartWorkOrderCard key={order.id} order={order} onStatus={(status) => demo.updateMobileWorkOrder(order.id, status)} />)}</div>
      </SectionCard>
      <SectionCard title="今日待办">
        <div className="space-y-3">{tasks.map((task) => <TaskCard key={task.id} task={task} />)}</div>
      </SectionCard>
      <SectionCard title="作业入口">
        <div className="space-y-2">
          {jobs.map((job) => (
            <Link key={job.to} to={job.to} className="block rounded-[8px] border border-slate-300 bg-white p-4 shadow-sm">
              <p className="text-lg font-black">{job.title}</p>
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
      <PageTitle title="饲喂管理" />
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
      <PageTitle title="产奶管理" />
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
          <div className="rounded-[8px] border border-slate-300 bg-white p-3 shadow-sm">
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
      <PageTitle title="繁育管理" />
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
      <PageTitle title="牛只管理" />
      <ReadOnlyNotice />
      <SectionCard title="快速查询" action={<button className="rounded-[8px] bg-slate-100 px-3 py-2 text-sm font-black">扫码占位</button>}>
        <TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="输入牛号、牛舍、牛群或状态" />
      </SectionCard>
      <SectionCard title="牛只档案">
        <div className="space-y-3">
          {list.map((cow) => (
            <div key={cow.id} className="rounded-[8px] border border-slate-300 bg-white p-4 shadow-sm">
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
            <div className="grid gap-3 rounded-[8px] border border-slate-300 bg-white p-3 shadow-sm">
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
      <PageTitle title="库存管理" />
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
            <div key={item.id} className="rounded-[8px] border border-slate-300 bg-white p-4 shadow-sm">
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
  const [form, setForm] = useState({ taskId: "quality-task-1", inspectionType: "原奶质检", sampleType: "原奶", batch: "HL-MILK-AM", sourceFarm: "安丘农牧示范园", sampledAt: nowTime(), temperature: 3.8, protein: 3.2, fat: 3.7, somaticCell: "18万/ml", colony: "3800 CFU/ml", acidity: "正常", drugResidue: "未检出", moisture: "12%", mildew: "无", impurity: "少量", smell: "正常", appearance: "正常", productName: "巴氏鲜奶", testItems: "感官、菌落、留样", result: "合格", sampleNo: "LY-001", inspector: demo.currentUser?.name || "质检员", reason: "", handleMethod: "隔离", handleAdvice: "" });
  const submit = useSubmit(() => demo.submitQualityInspection(form));
  return (
    <div>
      <PageTitle title="质检管理" />
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
  const [form, setForm] = useState({ exceptionType: "牛只异常", location: "A区泌乳牛舍", relatedObject: "HL-N-1028", description: "采食下降，需要现场检查。", urgency: "重要", photo: "图片上传占位", reporter: demo.currentUser?.name || "刘师傅" });
  const submit = useSubmit(() => demo.submitExceptionReport(form));
  return (
    <div>
      <PageTitle title="异常上报" />
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
    notes: "晚班先检查剩料，再检查1号奶罐温度。",
    attachment: "图片上传占位",
    confirmed: true,
    remark: ""
  });
  const submit = useSubmit(() => demo.submitShiftHandover(form));
  return (
    <div>
      <PageTitle title="交接班" />
      <ReadOnlyNotice />
      <SectionCard title="最近交接班">
        <div className="space-y-3">
          {(demo.data.shiftHandovers || []).map((item) => (
            <div key={item.id} className="rounded-[8px] border border-slate-300 bg-white p-4 shadow-sm">
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
      <PageTitle title="操作手册" />
      <div className="space-y-3">
        {(demo.data.operationManuals || []).map((manual) => <OperationManualCard key={manual.id} manual={manual} />)}
      </div>
    </div>
  );
}

export function WorkOrdersPage() {
  const demo = useDemo();
  const user = demo.currentUser || {};
  const employeeNames = Array.from(new Set(["刘师傅", "赵师傅", "周师傅", ...(demo.data.employeeStats || []).map((item) => item.employee).filter(Boolean)]));
  const organizations = (demo.data.organizations || []).map((item) => item.name);
  const [showDispatch, setShowDispatch] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeOrderForm, setActiveOrderForm] = useState(null);
  const [filters, setFilters] = useState({ employee: "全部", status: "全部", type: "全部", priority: "全部" });
  const [dispatchForm, setDispatchForm] = useState({
    title: "A区泌乳牛舍采食检查",
    type: "牛只观察工单",
    organizationName: organizations[0] || "安丘农牧示范园",
    relatedObjectType: "牛舍",
    relatedObject: "A区泌乳牛舍",
    handler: employeeNames[0] || "刘师傅",
    priority: "重要",
    deadline: `${today()} 18:00`,
    content: "现场检查采食、饮水和剩料情况，异常及时备注。",
    operationRequirement: "填写处理结果，必要时上传现场照片占位。",
    requirePhoto: true,
    remark: ""
  });
  const [resultForm, setResultForm] = useState({ result: "已完成现场处理，未发现新增异常。", finishedAt: nowTime(), photo: "现场照片上传占位", exceptionNote: "", remark: "" });
  const [orderFeedingForm, setOrderFeedingForm] = useState({ date: today(), shift: "早", barn: "A区泌乳牛舍", herd: "泌乳高峰群", formula: "泌乳高峰日粮", feedBatch: "FD-N-20260704", plannedAmount: 8.5, actualAmount: 8.5, leftoverAmount: 0.4, dryMatterRatio: 0.52, intakeStatus: "正常", autoDeduct: true, abnormalNote: "", remark: "" });
  const sourceText = { manual: "管理员派发", system: "系统规则", quality: "质检", inventory: "库存预警", breeding: "繁育提醒", sensor: "IoT预警" };
  const allOrders = demo.mobileRole === "只读访客"
    ? (demo.data.workOrders || [])
    : demo.mobileRole === "管理员"
      ? (demo.data.workOrders || [])
      : (demo.data.workOrders || []).filter((item) => item.handler === demo.currentUser?.name || item.createdBy === demo.currentUser?.name || item.initiator === demo.currentUser?.name);
  const simplifiedOrders = allOrders
    .filter((item) => item.status !== "待" + "复核")
    .filter((item) => !(item.source === "exception" || String(item.type || "").includes("异常")));
  const filteredOrders = simplifiedOrders.filter((item) =>
    (filters.employee === "全部" || item.handler === filters.employee) &&
    (filters.status === "全部" || item.status === filters.status) &&
    (filters.type === "全部" || item.type === filters.type) &&
    (filters.priority === "全部" || item.priority === filters.priority)
  );
  const isOverdue = (item) => !["已完成", "已取消"].includes(item.status) && item.deadline && new Date(String(item.deadline).replace(/-/g, "/")).getTime() < Date.now();
  const manualToday = (demo.data.workOrders || []).filter((item) => item.source === "manual" && String(item.createdAt || "").startsWith(today())).length;
  const pending = filteredOrders.filter((item) => ["待派发", "待处理", "处理中", "已驳回"].includes(item.status));
  const done = filteredOrders.filter((item) => item.status === "已完成");
  const urgent = filteredOrders.filter((item) => item.priority === "紧急");
  const overdue = filteredOrders.filter((item) => item.status === "已超时" || isOverdue(item));
  const completionRate = filteredOrders.length ? Math.round((done.length / filteredOrders.length) * 100) : 0;
  const submitDispatch = useSubmit(() => {
    demo.dispatchWorkOrder(dispatchForm);
    setShowDispatch(false);
  });
  const submitResult = useSubmit(() => {
    if (!selectedOrder) return;
    demo.submitWorkOrderResult(selectedOrder.id, resultForm);
    setSelectedOrder(null);
    setActiveOrderForm(null);
    setResultForm({ result: "已完成现场处理，未发现新增异常。", finishedAt: nowTime(), photo: "现场照片上传占位", exceptionNote: "", remark: "" });
  });
  const submitOrderFeeding = useSubmit(() => {
    if (!selectedOrder) return;
    const calc = calcFeeding(orderFeedingForm);
    demo.submitFeedingRecord({ ...orderFeedingForm, executor: user.name, abnormalNote: orderFeedingForm.abnormalNote });
    demo.submitWorkOrderResult(selectedOrder.id, {
      result: `已提交饲喂记录：实际${orderFeedingForm.actualAmount}吨，剩料${orderFeedingForm.leftoverAmount}吨，偏差率${calc.deviationRate}%。`,
      finishedAt: nowTime(),
      photo: "现场照片上传占位",
      exceptionNote: orderFeedingForm.abnormalNote,
      remark: orderFeedingForm.remark
    });
    setSelectedOrder(null);
    setActiveOrderForm(null);
  });
  const saveDispatchDraft = () => {
    try {
      demo.saveDraft("工单派发", dispatchForm.title, dispatchForm);
      setShowDispatch(false);
      window.alert("已保存到草稿箱。");
    } catch (error) {
      window.alert(error.message || "保存失败");
    }
  };
  const saveOrderFeedingDraft = () => {
    try {
      demo.saveDraft("饲喂工单处理", selectedOrder?.title || "饲喂工单", orderFeedingForm);
      setSelectedOrder(null);
      setActiveOrderForm(null);
      window.alert("已保存到草稿箱。");
    } catch (error) {
      window.alert(error.message || "保存失败");
    }
  };
  const readonlyAlert = () => window.alert("当前为只读演示模式，不能执行该操作。");
  const startOrder = (order) => demo.isReadonly ? readonlyAlert() : demo.updateMobileWorkOrder(order.id, "处理中");
  const cancelOrder = (order) => demo.isReadonly ? readonlyAlert() : demo.updateMobileWorkOrder(order.id, "已取消");
  const openOrderProcess = (order) => {
    setSelectedOrder(order);
    if (String(order.type || "").includes("饲喂")) {
      setOrderFeedingForm((current) => ({
        ...current,
        barn: String(order.relatedObject || "").split("/")[0]?.trim() || current.barn,
        herd: String(order.relatedObject || "").split("/")[1]?.trim() || current.herd,
        remark: order.operationRequirement || order.content || ""
      }));
      setActiveOrderForm("feeding");
    } else {
      setActiveOrderForm("result");
    }
  };
  const renderOrderList = (list, emptyText, options = {}) => (
    <div className="space-y-3">
      {list.map((order) => (
        <WorkOrderCard
          key={order.id}
          order={{ ...order, source: sourceText[order.source] ? order.source : order.source }}
          canSubmit={options.employeeActions && ["待处理", "处理中", "已驳回"].includes(order.status)}
          canCancel={options.adminCancel && !["已完成", "已取消"].includes(order.status)}
          onStart={() => startOrder(order)}
          onSubmitResult={() => openOrderProcess(order)}
          onCancel={() => cancelOrder(order)}
        />
      ))}
      {!list.length && <EmptyState title={emptyText} />}
    </div>
  );

  return (
    <div>
      <PageTitle
        title={demo.mobileRole === "管理员" ? "管理员工单" : "工单处理"}
        action={demo.mobileRole === "管理员" ? <button onClick={() => setShowDispatch((value) => !value)} className="min-h-11 rounded-[8px] bg-emerald-700 px-4 text-base font-black text-white">派发工单</button> : null}
      />
      <ReadOnlyNotice />
      {demo.mobileRole === "管理员" && (
        <>
          <SectionCard title="工单看板">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="今日派发" value={manualToday} />
              <MiniStat label="待处理" value={pending.length} tone="amber" />
              <MiniStat label="紧急工单" value={urgent.length} tone="red" />
            </div>
          </SectionCard>

          <SectionCard title="筛选">
            <div className="grid grid-cols-2 gap-3">
              <Field label="员工"><SelectInput value={filters.employee} onChange={(e) => setFilters({ ...filters, employee: e.target.value })}>{["全部", ...employeeNames].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="状态"><SelectInput value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>{["全部", "待派发", "待处理", "处理中", "已完成", "已驳回", "已取消", "已超时"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="类型"><SelectInput value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>{["全部", ...Array.from(new Set((demo.data.workOrders || []).map((item) => item.type))).filter(Boolean)].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="优先级"><SelectInput value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>{["全部", "普通", "重要", "紧急"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
            </div>
          </SectionCard>
          <SectionCard title="待处理工单">{renderOrderList(pending, "暂无待处理工单", { adminCancel: true })}</SectionCard>
          <SectionCard title="已完成工单">{renderOrderList(done, "暂无已完成工单")}</SectionCard>
          <SectionCard title="工单统计">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="已完成" value={done.length} />
              <MiniStat label="已超时" value={overdue.length} tone="red" />
              <MiniStat label="员工完成率" value={`${completionRate}%`} />
              <MiniStat label="全部工单" value={filteredOrders.length} tone="blue" />
            </div>
          </SectionCard>
        </>
      )}

      {demo.mobileRole !== "管理员" && (
        <>
          {renderOrderList(filteredOrders, "暂无我的工单", { employeeActions: !demo.isReadonly })}
        </>
      )}

      <MobileFormSheet open={showDispatch} title="派发工单" onClose={() => setShowDispatch(false)} onSaveDraft={saveDispatchDraft} onSubmit={submitDispatch} submitText="确认派发">
        <div className="grid gap-3">
          <Field label="工单标题"><TextInput value={dispatchForm.title} onChange={(e) => setDispatchForm({ ...dispatchForm, title: e.target.value })} /></Field>
          <Field label="工单类型"><SelectInput value={dispatchForm.type} onChange={(e) => setDispatchForm({ ...dispatchForm, type: e.target.value })}>{["饲喂工单", "产奶工单", "繁育工单", "牛只观察工单", "库存盘点工单", "领料处理工单", "入库工单", "出库工单", "质检工单", "交接班工单", "其他工单"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <Field label="所属组织"><SelectInput value={dispatchForm.organizationName} onChange={(e) => setDispatchForm({ ...dispatchForm, organizationName: e.target.value })}>{organizations.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="关联对象"><SelectInput value={dispatchForm.relatedObjectType} onChange={(e) => setDispatchForm({ ...dispatchForm, relatedObjectType: e.target.value })}>{["牛舍", "牛群", "牛号", "物料", "批次", "质检样品", "库存物料", "其他"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
            <Field label="对象名称"><TextInput value={dispatchForm.relatedObject} onChange={(e) => setDispatchForm({ ...dispatchForm, relatedObject: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="派发给"><SelectInput value={dispatchForm.handler} onChange={(e) => setDispatchForm({ ...dispatchForm, handler: e.target.value })}>{employeeNames.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
            <Field label="优先级"><SelectInput value={dispatchForm.priority} onChange={(e) => setDispatchForm({ ...dispatchForm, priority: e.target.value })}>{["普通", "重要", "紧急"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          </div>
          <Field label="截止时间"><TextInput value={dispatchForm.deadline} onChange={(e) => setDispatchForm({ ...dispatchForm, deadline: e.target.value })} /></Field>
          <Field label="工单说明"><TextArea value={dispatchForm.content} onChange={(e) => setDispatchForm({ ...dispatchForm, content: e.target.value })} /></Field>
          <Field label="操作要求"><TextArea value={dispatchForm.operationRequirement} onChange={(e) => setDispatchForm({ ...dispatchForm, operationRequirement: e.target.value })} /></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black text-slate-700"><input type="checkbox" checked={dispatchForm.requirePhoto} onChange={(e) => setDispatchForm({ ...dispatchForm, requirePhoto: e.target.checked })} />需要员工上传照片</label>
          <Field label="备注"><TextArea value={dispatchForm.remark} onChange={(e) => setDispatchForm({ ...dispatchForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeOrderForm === "result"} title="提交处理结果" onClose={() => { setSelectedOrder(null); setActiveOrderForm(null); }} onSaveDraft={() => demo.isReadonly ? readonlyAlert() : demo.saveDraft("工单处理", selectedOrder?.title || "工单处理", resultForm)} onSubmit={submitResult} submitText="提交结果">
        <div className="grid gap-3">
          <Field label="处理结果"><TextArea value={resultForm.result} onChange={(e) => setResultForm({ ...resultForm, result: e.target.value })} /></Field>
          <Field label="完成时间"><TextInput value={resultForm.finishedAt} onChange={(e) => setResultForm({ ...resultForm, finishedAt: e.target.value })} /></Field>
          <Field label="现场照片"><TextInput value={resultForm.photo} onChange={(e) => setResultForm({ ...resultForm, photo: e.target.value })} /></Field>
          <Field label="异常说明"><TextArea value={resultForm.exceptionNote} onChange={(e) => setResultForm({ ...resultForm, exceptionNote: e.target.value })} /></Field>
          <Field label="备注"><TextArea value={resultForm.remark} onChange={(e) => setResultForm({ ...resultForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>

      <MobileFormSheet open={activeOrderForm === "feeding"} title="处理饲喂工单" onClose={() => { setSelectedOrder(null); setActiveOrderForm(null); }} onSaveDraft={saveOrderFeedingDraft} onSubmit={submitOrderFeeding} submitText="提交饲喂并完成工单">
        <div className="grid gap-3">
          <Field label="日期"><TextInput value={orderFeedingForm.date} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, date: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="班次"><SelectInput value={orderFeedingForm.shift} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, shift: e.target.value })}>{["早", "中", "晚", "夜"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
            <Field label="采食情况"><SelectInput value={orderFeedingForm.intakeStatus} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, intakeStatus: e.target.value })}>{["正常", "偏低", "拒食", "异常"].map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
          </div>
          <Field label="牛舍"><TextInput value={orderFeedingForm.barn} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, barn: e.target.value })} /></Field>
          <Field label="牛群"><TextInput value={orderFeedingForm.herd} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, herd: e.target.value })} /></Field>
          <Field label="饲喂配方"><TextInput value={orderFeedingForm.formula} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, formula: e.target.value })} /></Field>
          <Field label="饲料批次"><TextInput value={orderFeedingForm.feedBatch} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, feedBatch: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="计划投喂量"><TextInput value={orderFeedingForm.plannedAmount} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, plannedAmount: e.target.value })} /></Field>
            <Field label="实际投喂量"><TextInput value={orderFeedingForm.actualAmount} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, actualAmount: e.target.value })} /></Field>
            <Field label="剩料量"><TextInput value={orderFeedingForm.leftoverAmount} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, leftoverAmount: e.target.value })} /></Field>
            <Field label="干物质比例"><TextInput value={orderFeedingForm.dryMatterRatio} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, dryMatterRatio: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="偏差率" value={`${calcFeeding(orderFeedingForm).deviationRate}%`} tone="amber" />
            <MiniStat label="剩料率" value={`${calcFeeding(orderFeedingForm).leftoverRate}%`} tone="amber" />
            <MiniStat label="干物质采食" value={calcFeeding(orderFeedingForm).dryMatterIntake} />
          </div>
          <label className="flex min-h-12 items-center gap-3 rounded-[8px] bg-slate-50 px-3 text-base font-black text-slate-700"><input type="checkbox" checked={orderFeedingForm.autoDeduct} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, autoDeduct: e.target.checked })} />自动扣减库存</label>
          <Field label="异常说明"><TextArea value={orderFeedingForm.abnormalNote} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, abnormalNote: e.target.value })} /></Field>
          <Field label="备注"><TextArea value={orderFeedingForm.remark} onChange={(e) => setOrderFeedingForm({ ...orderFeedingForm, remark: e.target.value })} /></Field>
        </div>
      </MobileFormSheet>
    </div>
  );
}

export function MessagesPage() {
  const demo = useDemo();
  const messages = visibleForUser(demo.data.messages, demo, ["receiver", "createdBy"]);
  return (
    <div>
      <PageTitle title="消息通知" />
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
      <PageTitle title={demo.mobileRole === "管理员" ? "员工记录" : "我的记录"} />
      <SectionCard title="草稿箱">
        <DraftBox drafts={drafts} onDelete={(id) => demo.deleteDraft(id)} />
      </SectionCard>
      <div className="space-y-3">
        {records.map((item) => (
          <div key={item.id} className="rounded-[8px] border border-slate-300 bg-white p-4 shadow-sm ring-1 ring-slate-200">
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
      <PageTitle title="个人中心" />
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
          {!stats.length && <EmptyState title="暂无统计" />}
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
