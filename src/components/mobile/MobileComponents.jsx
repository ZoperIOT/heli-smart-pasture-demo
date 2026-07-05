import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Bell, BookOpen, ClipboardList, FileText, Home, MessageCircle, ShieldCheck, UserRound } from "lucide-react";
import { useDemo } from "../../context/DemoContext.jsx";

export function StatusTag({ status = "待处理", tone }) {
  const color = tone || (String(status).includes("异常") || String(status).includes("不合格") || status === "紧急"
    ? "red"
    : String(status).includes("完成") || String(status).includes("合格")
      ? "green"
      : String(status).includes("中") || String(status).includes("待")
        ? "amber"
        : "slate");
  const classes = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    red: "bg-red-50 text-red-700 ring-red-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  };
  return <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-sm font-black ring-1 ${classes[color]}`}>{status}</span>;
}

export function MobileShell() {
  return (
    <div className="min-h-screen bg-[#f5f8f6] text-slate-950">
      <MobileTopBar />
      <main className="mx-auto w-full max-w-[520px] px-4 pb-[calc(92px+env(safe-area-inset-bottom))] pt-4">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}

export function MobileTopBar() {
  const demo = useDemo();
  const user = demo.currentUser || {};
  const unread = (demo.data.messages || []).filter((item) => item.status === "未读").length;
  const today = new Date().toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit", weekday: "short" });

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 pt-[max(10px,env(safe-area-inset-top))] backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[520px] items-center gap-3 py-2">
        <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-emerald-700 text-white">
          <UserRound size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-black">{user.name || "刘师傅"} · {user.role || "员工"}</p>
          <p className="truncate text-sm font-bold text-slate-500">{user.organizationName || "合力牧业奶牛场"} · {today}</p>
        </div>
        <select
          value={user.role || "员工"}
          onChange={(event) => demo.setMobileRole(event.target.value)}
          className="h-10 rounded-[8px] border border-slate-200 bg-white px-2 text-sm font-black text-slate-700"
          aria-label="切换身份"
        >
          {(demo.data.roles || ["员工", "管理员", "只读访客"]).map((role) => <option key={role}>{role}</option>)}
        </select>
        <NavLink to="/messages" className="relative grid h-11 w-11 place-items-center rounded-[8px] bg-slate-100 text-slate-700" aria-label="消息">
          <Bell size={22} />
          {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-xs font-black text-white">{unread}</span>}
        </NavLink>
      </div>
    </header>
  );
}

export function BottomTabBar() {
  const tabs = [
    { to: "/app", label: "首页", icon: Home },
    { to: "/tasks", label: "工单", icon: ClipboardList },
    { to: "/messages", label: "消息", icon: MessageCircle },
    { to: "/profile", label: "我的", icon: UserRound }
  ];
  const location = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="mx-auto grid max-w-[520px] grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname === tab.to || (tab.to === "/app" && location.pathname === "/");
          return (
            <NavLink key={tab.to} to={tab.to} className={`flex min-h-14 flex-col items-center justify-center rounded-[8px] text-xs font-black ${active ? "bg-emerald-700 text-white" : "text-slate-500"}`}>
              <Icon size={21} />
              <span className="mt-1">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export function SmartWorkOrderCard({ order, onStatus }) {
  return (
    <div className="rounded-[8px] border border-slate-100 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-black text-slate-950">{order.title}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">{order.type} · {order.organizationName}</p>
        </div>
        <StatusTag status={order.priority || "普通"} />
      </div>
      <div className="mt-3 grid gap-1 text-sm font-bold text-slate-600">
        <p>关联：{order.relatedObject || order.relatedBusiness || "-"}</p>
        <p>处理人：{order.handler || "-"} · 截止：{order.deadline || order.plannedAt || "-"}</p>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <StatusTag status={order.status} />
        {onStatus && <button onClick={() => onStatus("处理中")} className="ml-auto min-h-10 rounded-[8px] bg-emerald-700 px-3 text-sm font-black text-white">去处理</button>}
      </div>
    </div>
  );
}

export function QuickActionGrid({ children }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

export function PageTitle({ title, desc, action }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-black text-slate-950">{title}</h1>
        {desc && <p className="mt-1 text-base font-semibold leading-6 text-slate-500">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function SectionCard({ title, desc, children, action }) {
  return (
    <section className="mb-4 rounded-[8px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
      {(title || action) && (
        <div className="mb-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            {title && <h2 className="text-lg font-black text-slate-950">{title}</h2>}
            {desc && <p className="text-sm font-semibold text-slate-500">{desc}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function TaskCard({ task, action }) {
  return (
    <div className="rounded-[8px] border border-slate-100 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-black text-slate-950">{task.title || task.content}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">{task.location || task.barn || task.organizationName} · {task.plannedTime || task.plannedAt || task.shift}</p>
        </div>
        <StatusTag status={task.status} />
      </div>
      {task.remark && <p className="mt-3 rounded-[8px] bg-slate-50 p-3 text-sm font-semibold text-slate-600">{task.remark}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function MessageCard({ message, onRead }) {
  return (
    <div className="rounded-[8px] border border-slate-100 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-black text-slate-950">{message.title}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">{message.type} · {message.createdAt}</p>
        </div>
        <StatusTag status={message.priority || "普通"} />
      </div>
      <p className="mt-3 text-base font-semibold leading-6 text-slate-700">{message.content}</p>
      <button onClick={onRead} className="mt-3 min-h-11 w-full rounded-[8px] bg-slate-100 px-4 text-base font-black text-slate-700">
        {message.status === "未读" ? "标记已读" : "查看详情"}
      </button>
    </div>
  );
}

const sourceLabels = {
  manual: "管理员派发",
  exception: "异常上报",
  system: "系统规则",
  quality: "质检异常",
  inventory: "库存预警",
  breeding: "繁育提醒"
};

export function WorkOrderCard({ order, onStatus, onStart, onSubmitResult, onApprove, onReject, onCancel, canSubmit, canReview, canCancel }) {
  return (
    <div className="rounded-[8px] border border-slate-100 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-black text-slate-950">{order.title || order.content}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">{order.type} · {order.organizationName || order.businessUnit}</p>
        </div>
        <StatusTag status={order.status} />
      </div>
      <p className="mt-3 text-base font-semibold leading-6 text-slate-700">{order.content}</p>
      <div className="mt-3 grid gap-1 rounded-[8px] bg-slate-50 p-3 text-sm font-bold text-slate-600">
        <p>来源：{sourceLabels[order.source] || order.source || "系统规则"} · 优先级：{order.priority || "普通"}</p>
        <p>处理人：{order.handler || order.owner || "未分配"} · 截止：{order.deadline || order.plannedAt || "-"}</p>
        <p>关联：{order.relatedObject || order.relatedBusiness || "-"}</p>
        {order.operationRequirement && <p>要求：{order.operationRequirement}</p>}
        {(order.requirePhoto || order.requireReview) && <p>要求：{order.requirePhoto ? "需照片" : ""}{order.requirePhoto && order.requireReview ? "，" : ""}{order.requireReview ? "需复核" : ""}</p>}
      </div>
      {order.result && (
        <div className="mt-3 rounded-[8px] bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          <p className="font-black">处理结果</p>
          <p className="mt-1">{order.result}</p>
          {order.resultSubmittedAt && <p className="mt-1 text-emerald-700">完成时间：{order.resultSubmittedAt}</p>}
          {order.resultException && <p className="mt-1 text-amber-700">异常说明：{order.resultException}</p>}
          {order.reviewOpinion && <p className="mt-1 text-red-700">复核意见：{order.reviewOpinion}</p>}
        </div>
      )}
      {canSubmit && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={onStart} className="min-h-11 rounded-[8px] bg-emerald-700 text-sm font-black text-white">开始处理</button>
          <button onClick={onSubmitResult} className="min-h-11 rounded-[8px] bg-sky-50 text-sm font-black text-sky-700">提交结果</button>
        </div>
      )}
      {canReview && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={onApprove} className="min-h-11 rounded-[8px] bg-emerald-700 text-sm font-black text-white">复核通过</button>
          <button onClick={onReject} className="min-h-11 rounded-[8px] bg-red-50 text-sm font-black text-red-700">驳回</button>
        </div>
      )}
      {canCancel && <button onClick={onCancel} className="mt-2 min-h-11 w-full rounded-[8px] bg-slate-100 text-sm font-black text-slate-700">取消工单</button>}
      {onStatus && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["处理中", "待复核", "已完成"].map((status) => (
            <button key={status} onClick={() => onStatus(status)} className="min-h-11 rounded-[8px] bg-emerald-50 text-sm font-black text-emerald-700">
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function OperationManualCard({ manual }) {
  return (
    <div className="rounded-[8px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700"><BookOpen size={20} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-black">{manual.title}</p>
          <p className="text-sm font-bold text-slate-500">{manual.scene}</p>
        </div>
      </div>
      <div className="mt-3 rounded-[8px] bg-slate-50 p-3">
        <p className="text-sm font-black text-slate-500">步骤</p>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm font-semibold text-slate-700">
          {(manual.steps || []).map((step) => <li key={step}>{step}</li>)}
        </ol>
      </div>
      <p className="mt-3 text-sm font-bold text-amber-700">注意：{(manual.cautions || []).join("；")}</p>
    </div>
  );
}

export function EmployeeStatsCard({ stat }) {
  return (
    <div className="rounded-[8px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-black">{stat.employee}</p>
          <p className="text-sm font-bold text-slate-500">{stat.organizationName}</p>
        </div>
        <StatusTag status={stat.status} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <MiniStat label="今日完成" value={stat.todayDone} />
        <MiniStat label="待处理" value={stat.pending} tone="amber" />
        <MiniStat label="准确率" value={`${stat.feedingAccuracy}%`} />
      </div>
    </div>
  );
}

export function DraftBox({ drafts = [], onDelete }) {
  if (!drafts.length) {
    return <div className="rounded-[8px] bg-slate-50 p-4 text-base font-bold text-slate-500">暂无草稿。表单里的“保存草稿”会模拟离线暂存。</div>;
  }
  return (
    <div className="space-y-3">
      {drafts.map((draft) => (
        <div key={draft.id} className="rounded-[8px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-slate-100 text-slate-600"><FileText size={20} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-black">{draft.title}</p>
              <p className="text-sm font-bold text-slate-500">{draft.module} · {draft.updatedAt}</p>
            </div>
            <StatusTag status="草稿" />
          </div>
          {onDelete && <button onClick={() => onDelete(draft.id)} className="mt-3 min-h-10 w-full rounded-[8px] bg-slate-100 text-sm font-black text-slate-700">删除草稿</button>}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title = "暂无数据", desc = "完成提交后会显示在这里。" }) {
  return <div className="rounded-[8px] bg-slate-50 p-5 text-center"><p className="text-lg font-black text-slate-700">{title}</p><p className="mt-1 text-sm font-bold text-slate-500">{desc}</p></div>;
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return <input {...props} className={`min-h-12 w-full rounded-[8px] border border-slate-200 bg-white px-3 text-base font-bold outline-none focus:border-emerald-600 ${props.className || ""}`} />;
}

export function SelectInput({ children, ...props }) {
  return <select {...props} className={`min-h-12 w-full rounded-[8px] border border-slate-200 bg-white px-3 text-base font-bold outline-none focus:border-emerald-600 ${props.className || ""}`}>{children}</select>;
}

export function TextArea(props) {
  return <textarea {...props} className={`min-h-24 w-full rounded-[8px] border border-slate-200 bg-white px-3 py-3 text-base font-bold outline-none focus:border-emerald-600 ${props.className || ""}`} />;
}

export function SubmitBar({ children, onClick, disabled }) {
  return (
    <div className="sticky bottom-[76px] z-20 -mx-4 mt-4 border-t border-slate-100 bg-white/95 p-4 backdrop-blur">
      <button disabled={disabled} onClick={onClick} className={`min-h-13 w-full rounded-[8px] px-4 text-lg font-black text-white ${disabled ? "bg-slate-300" : "bg-emerald-700"}`}>
        {children}
      </button>
    </div>
  );
}

export function ReadOnlyNotice() {
  const demo = useDemo();
  if (!demo.isReadonly) return null;
  return (
    <div className="mb-4 rounded-[8px] bg-amber-50 p-4 text-base font-bold leading-6 text-amber-800 ring-1 ring-amber-100">
      当前为只读演示模式，不能执行提交、处理或修改操作。
    </div>
  );
}

export function GuardButton({ children, onClick, className = "" }) {
  const demo = useDemo();
  return (
    <button
      onClick={() => {
        if (demo.isReadonly) {
          window.alert("当前为只读演示模式，不能执行该操作。");
          return;
        }
        onClick?.();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

export function MiniStat({ label, value, tone = "emerald" }) {
  const toneClass = tone === "red" ? "text-red-700 bg-red-50" : tone === "amber" ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50";
  return (
    <div className={`rounded-[8px] p-3 ${toneClass}`}>
      <p className="text-sm font-black opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

export function AdminBadge() {
  const demo = useDemo();
  if (demo.mobileRole !== "管理员") return null;
  return <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-sm font-black text-sky-700"><ShieldCheck size={15} /> 管理员</span>;
}
