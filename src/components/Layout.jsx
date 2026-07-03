import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cpu,
  FileText,
  HeartPulse,
  Home,
  Menu,
  MessageSquareWarning,
  Milk,
  PackageMinus,
  PackagePlus,
  PlugZap,
  ReceiptText,
  Route,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Sprout,
  Truck,
  UserCog,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDemo } from "../context/DemoContext.jsx";
import { filterMenuGroups, roleDefaultMode, roleDefaultPath, summarizeRoleScope, workModes } from "../services/roleViewService.js";
import { roleOptions } from "../data/platformModules.js";

const menuGroups = [
  {
    title: "集团驾驶舱",
    modes: ["经营总览"],
    items: [
      { to: "/", label: "首页驾驶舱", icon: Home },
      { to: "/dashboard", label: "数据大屏", icon: BarChart3 },
      { to: "/reports", label: "经营报表", icon: BarChart3 },
      { to: "/ai", label: "AI经营助手", icon: Bot },
      { to: "/platform-overview", label: "平台能力总览", icon: FileText }
    ]
  },
  {
    title: "四大板块工作台",
    modes: ["经营总览"],
    items: [
      { to: "/dairy-workbench", label: "合力牧业奶牛场工作台", icon: Milk },
      { to: "/beef-workbench", label: "欧力菲德肉牛场工作台", icon: Sprout },
      { to: "/feed-workbench", label: "欧力菲德饲料厂工作台", icon: PackagePlus },
      { to: "/dairy-plant-workbench", label: "欧力菲德乳品厂工作台", icon: Building2 }
    ]
  },
  {
    title: "风险与待办",
    modes: ["经营总览"],
    items: [
      { to: "/messages", label: "消息预警", icon: MessageSquareWarning },
      { to: "/work-orders", label: "工单中心", icon: ClipboardList },
      { to: "/approvals", label: "审批中心", icon: ShieldCheck }
    ]
  },
  {
    title: "今日工作",
    modes: ["业务操作"],
    items: [
      { to: "/mobile-workbench", label: "员工工作台", icon: Smartphone },
      { to: "/work-orders", label: "工单中心", icon: ClipboardList },
      { to: "/messages", label: "消息预警", icon: MessageSquareWarning }
    ]
  },
  {
    title: "生产操作",
    modes: ["业务操作"],
    items: [
      { to: "/milk", label: "产奶记录", icon: Milk },
      { to: "/feeding-records", label: "饲喂执行", icon: PackageMinus },
      { to: "/breeding", label: "繁育记录", icon: HeartPulse },
      { to: "/health-events", label: "健康防疫", icon: HeartPulse },
      { to: "/milk-quality", label: "质检记录", icon: ClipboardList },
      { to: "/cow-events", label: "异常上报 / 牛只事件", icon: Route }
    ]
  },
  {
    title: "库存物流",
    modes: ["业务操作"],
    items: [
      { to: "/stock-in", label: "入库记录", icon: PackagePlus },
      { to: "/stock-out", label: "出库记录", icon: PackageMinus },
      { to: "/delivery", label: "配送任务", icon: Route },
      { to: "/trucks", label: "货车管理", icon: Truck },
      { to: "/weighbridge", label: "过磅管理", icon: Scale }
    ]
  },
  {
    title: "平台能力",
    modes: ["平台配置"],
    items: [
      { to: "/platform-overview", label: "平台能力总览", icon: FileText },
      { to: "/system-plan", label: "系统建设方案", icon: FileText },
      { to: "/external-interfaces", label: "接口管理中心", icon: PlugZap },
      { to: "/rules", label: "规则中心", icon: ShieldCheck },
      { to: "/analysis", label: "自定义分析", icon: BarChart3 },
      { to: "/traceability-center", label: "质量追溯", icon: Route }
    ]
  },
  {
    title: "基础资料",
    modes: ["平台配置"],
    items: [
      { to: "/partners", label: "客户供应商", icon: Building2 },
      { to: "/employees", label: "员工岗位", icon: ClipboardList },
      { to: "/knowledge-base", label: "知识库", icon: BookOpen },
      { to: "/announcements", label: "公告通知", icon: Bell }
    ]
  },
  {
    title: "系统维护",
    modes: ["平台配置"],
    items: [
      { to: "/role-simulation", label: "角色组织模拟", icon: UserCog },
      { to: "/operation-logs", label: "操作日志", icon: FileText },
      { to: "/settings", label: "系统设置", icon: Settings },
      { to: "/data-tools", label: "数据导入导出", icon: PackageMinus }
    ]
  },
  {
    title: "二级明细入口",
    modes: ["经营总览", "业务操作", "平台配置"],
    secondary: true,
    items: [
      { to: "/cow-search", label: "牛只查询中心", icon: Search },
      { to: "/dairy-cows", label: "奶牛档案", icon: Sprout },
      { to: "/beef-cows", label: "肉牛档案", icon: Sprout },
      { to: "/barns", label: "牛舍管理", icon: Boxes },
      { to: "/beef-batches", label: "育肥批次", icon: ClipboardList },
      { to: "/weight-records", label: "体重记录", icon: BarChart3 },
      { to: "/feed-raw-materials", label: "原料库存", icon: Boxes },
      { to: "/feed-products", label: "饲料成品", icon: PackagePlus },
      { to: "/feed-production", label: "饲料生产", icon: BarChart3 },
      { to: "/feed-transfers", label: "内部调拨", icon: Route },
      { to: "/milk-receiving", label: "原奶接收", icon: Milk },
      { to: "/dairy-production-plans", label: "生产计划", icon: ClipboardList },
      { to: "/dairy-production", label: "生产批次", icon: BarChart3 },
      { to: "/dairy-product-inventory", label: "成品库存", icon: Boxes },
      { to: "/dairy-sales-orders", label: "销售订单", icon: ReceiptText },
      { to: "/ledger", label: "收支账本", icon: ReceiptText }
    ]
  }
];

const titles = Object.fromEntries(menuGroups.flatMap((group) => group.items.map((item) => [item.to, item.label])));
titles["/"] = "首页驾驶舱";
titles["/cattle"] = "牛舍管理";
titles["/driver"] = "货车管理";
titles["/inventory"] = "库存管理";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const demo = useDemo();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentMode = demo.currentWorkMode || "经营总览";
  const visibleGroups = useMemo(() => filterMenuGroups(menuGroups, demo.currentRole, currentMode), [demo.currentRole, currentMode]);

  function handleRoleChange(role) {
    demo.setCurrentRole(role);
    const nextMode = roleDefaultMode[role] || "经营总览";
    demo.setCurrentWorkMode(nextMode);
    navigate(roleDefaultPath[role] || "/");
  }

  function handleModeChange(mode) {
    demo.setCurrentWorkMode(mode);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 hidden border-r border-slate-200 bg-white shadow-sm transition-all duration-200 lg:block ${collapsed ? "w-20" : "w-72"}`}>
        <Sidebar key={`desktop-${currentMode}-${location.pathname}`} collapsed={collapsed} onNavigate={() => {}} groups={visibleGroups} mode={currentMode} onModeChange={handleModeChange} locationPath={location.pathname} />
        <button
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-4 top-6 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow"
          aria-label="展开或收起侧边栏"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/45" onClick={() => setMobileOpen(false)} aria-label="关闭导航遮罩" />
          <aside className="relative h-full w-[88vw] max-w-80 overflow-y-auto bg-white shadow-xl">
            <Sidebar key={`mobile-${currentMode}-${location.pathname}`} collapsed={false} onNavigate={() => setMobileOpen(false)} groups={visibleGroups.filter((group) => !group.secondary)} mode={currentMode} onModeChange={handleModeChange} locationPath={location.pathname} />
          </aside>
        </div>
      )}

      <div className={`min-h-screen transition-all duration-200 ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 pt-[max(10px,env(safe-area-inset-top))] backdrop-blur-xl">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 py-2">
            <button onClick={() => setMobileOpen(true)} className="grid h-11 w-11 place-items-center rounded-[8px] bg-slate-100 text-slate-800 lg:hidden" aria-label="打开导航">
              <Menu size={22} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-2xl font-bold text-slate-950">{titles[location.pathname] || "合力牧业农牧乳一体化经营管理平台"}</p>
              <p className="truncate text-sm font-semibold text-slate-500">{currentMode} · {demo.currentRole} · {summarizeRoleScope(demo.currentRole)}</p>
            </div>
            <div className="hidden gap-2 xl:flex">
              {workModes.map((mode) => (
                <button key={mode} onClick={() => handleModeChange(mode)} className={`min-h-10 rounded-[8px] px-3 text-sm font-black ${currentMode === mode ? "bg-pasture-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                  {mode}
                </button>
              ))}
            </div>
            <select value={demo.currentRole} onChange={(event) => handleRoleChange(event.target.value)} className="hidden min-h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 xl:block" aria-label="当前角色视图">
              {roleOptions.map((role) => <option key={role}>{role}</option>)}
            </select>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-5 pb-[max(28px,env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar({ collapsed, onNavigate, groups, mode, onModeChange, locationPath }) {
  const currentGroup = groups.find((group) => group.items.some((item) => item.to === locationPath))?.title || groups[0]?.title;
  const [openGroups, setOpenGroups] = useState(() => new Set(currentGroup ? [currentGroup] : []));

  function toggleGroup(title) {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-pasture-700 text-white">
          <Sprout size={24} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-slate-950">合力牧业</p>
            <p className="truncate text-xs font-bold text-slate-500">农牧乳一体化平台</p>
          </div>
        )}
        <button onClick={onNavigate} className="ml-auto grid h-9 w-9 place-items-center rounded-[8px] bg-slate-100 text-slate-600 lg:hidden" aria-label="关闭导航">
          <X size={18} />
        </button>
      </div>

      {!collapsed && (
        <div className="border-b border-slate-100 p-3">
          <div className="grid gap-2">
            {workModes.map((item) => (
              <button key={item} onClick={() => onModeChange(item)} className={`min-h-10 rounded-[8px] text-sm font-black ${mode === item ? "bg-pasture-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => {
          const isOpen = collapsed || openGroups.has(group.title);
          return (
            <div key={group.title} className="mb-2">
              {!collapsed && (
                <button onClick={() => toggleGroup(group.title)} className="mb-1 flex min-h-10 w-full items-center justify-between rounded-[8px] px-3 text-left text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-slate-50">
                  {group.title}
                  <ChevronDown size={16} className={`transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
              )}
              {isOpen && (
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onNavigate}
                        title={item.label}
                        className={({ isActive }) =>
                          `flex min-h-11 items-center gap-3 rounded-[8px] px-3 text-base font-bold transition ${
                            isActive ? "bg-pasture-50 text-pasture-800 ring-1 ring-pasture-100" : group.secondary ? "text-slate-500 hover:bg-slate-100 hover:text-slate-950" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                          } ${collapsed ? "justify-center" : ""}`
                        }
                      >
                        <Icon size={21} className="shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
