import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Building2,
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
import { useState } from "react";
import { useDemo } from "../context/DemoContext.jsx";
import { filterMenuGroupsByRole, summarizeRoleScope } from "../services/roleViewService.js";
import { roleOptions } from "../data/platformModules.js";

const menuGroups = [
  { title: "集团总览", items: [
    { to: "/", label: "首页驾驶舱", icon: Home },
    { to: "/dashboard", label: "数据大屏", icon: BarChart3 },
    { to: "/reports", label: "经营报表", icon: BarChart3 },
    { to: "/ai", label: "AI经营助手", icon: Bot },
    { to: "/messages", label: "消息预警中心", icon: MessageSquareWarning },
    { to: "/approvals", label: "审批中心", icon: ShieldCheck },
    { to: "/role-simulation", label: "角色组织模拟", icon: UserCog },
    { to: "/work-orders", label: "工单中心", icon: ClipboardList },
    { to: "/cow-search", label: "牛只查询中心", icon: Search },
    { to: "/cow-events", label: "牛只事件时间线", icon: Route },
    { to: "/analysis", label: "自定义分析", icon: BarChart3 },
    { to: "/traceability-center", label: "质量追溯中心", icon: Route }
  ] },
  {
    title: "合力牧业奶牛场",
    items: [
      { to: "/dairy-cows", label: "奶牛档案", icon: Sprout },
      { to: "/barns", label: "牛舍管理", icon: Building2 },
      { to: "/herd-groups", label: "智能分群", icon: ClipboardList },
      { to: "/feeding-plans", label: "饲喂计划", icon: PackageMinus },
      { to: "/feeding-records", label: "饲喂记录", icon: PackagePlus },
      { to: "/breeding", label: "繁育管理", icon: HeartPulse },
      { to: "/health-events", label: "健康防疫", icon: HeartPulse },
      { to: "/milk", label: "产奶记录", icon: Milk },
      { to: "/raw-milk-delivery", label: "原奶配送", icon: Route },
      { to: "/dairy-farm-inventory", label: "奶牛场库存", icon: Boxes }
    ]
  },
  {
    title: "欧力菲德肉牛场",
    items: [
      { to: "/beef-cows", label: "肉牛档案", icon: Sprout },
      { to: "/beef-batches", label: "育肥批次", icon: ClipboardList },
      { to: "/weight-records", label: "体重记录", icon: BarChart3 },
      { to: "/feeding-formulas", label: "日粮配方", icon: PackageMinus },
      { to: "/feeding-records", label: "饲喂执行", icon: PackagePlus },
      { to: "/beef-sales", label: "出栏销售", icon: ReceiptText },
      { to: "/biological-assets", label: "生物资产台账", icon: ReceiptText },
      { to: "/beef-farm-inventory", label: "肉牛场库存", icon: Boxes }
    ]
  },
  {
    title: "欧力菲德饲料厂",
    items: [
      { to: "/feed-raw-materials", label: "原料库存", icon: Boxes },
      { to: "/feed-products", label: "饲料成品", icon: PackagePlus },
      { to: "/feed-production", label: "饲料生产", icon: BarChart3 },
      { to: "/feed-transfers", label: "内部调拨", icon: Route },
      { to: "/feed-purchases", label: "采购记录", icon: PackagePlus }
    ]
  },
  {
    title: "欧力菲德乳品厂",
    items: [
      { to: "/milk-receiving", label: "原奶接收", icon: Milk },
      { to: "/milk-quality", label: "质检记录", icon: ClipboardList },
      { to: "/dairy-production-plans", label: "生产计划", icon: ClipboardList },
      { to: "/dairy-production", label: "生产批次", icon: BarChart3 },
      { to: "/filling-records", label: "灌装记录", icon: PackagePlus },
      { to: "/finished-quality", label: "成品质检", icon: ClipboardList },
      { to: "/finished-in", label: "成品入库", icon: PackagePlus },
      { to: "/finished-out", label: "成品出库", icon: PackageMinus },
      { to: "/return-records", label: "退货记录", icon: PackageMinus },
      { to: "/dairy-product-inventory", label: "成品库存", icon: Boxes },
      { to: "/dairy-sales-orders", label: "销售订单", icon: ReceiptText }
    ]
  },
  {
    title: "物流车辆",
    items: [
      { to: "/delivery", label: "配送任务", icon: Route },
      { to: "/trucks", label: "货车管理", icon: Truck },
      { to: "/weighbridge", label: "地磅过磅", icon: Scale }
    ]
  },
  {
    title: "设备数据",
    items: [
      { to: "/devices", label: "设备状态中心", icon: Cpu },
      { to: "/environment", label: "牛舍环境监控", icon: BarChart3 },
      { to: "/external-interfaces", label: "接口管理中心", icon: PlugZap },
      { to: "/rules", label: "规则中心", icon: ShieldCheck }
    ]
  },
  {
    title: "客商员工",
    items: [
      { to: "/partners", label: "客户供应商", icon: Building2 },
      { to: "/employees", label: "员工岗位", icon: ClipboardList },
      { to: "/mobile-workbench", label: "员工工作台", icon: Smartphone },
      { to: "/knowledge-base", label: "知识库手册", icon: BookOpen }
    ]
  },
  {
    title: "财务经营",
    items: [
      { to: "/ledger", label: "收支账本", icon: ReceiptText },
      { to: "/cost-stats", label: "成本统计", icon: BarChart3 },
      { to: "/profit-analysis", label: "利润分析", icon: BarChart3 }
    ]
  },
  {
    title: "系统管理",
    items: [
      { to: "/announcements", label: "公告通知", icon: Bell },
      { to: "/operation-logs", label: "操作日志", icon: FileText },
      { to: "/system-plan", label: "系统建设方案", icon: FileText },
      { to: "/settings", label: "基础设置", icon: Settings },
      { to: "/data-tools", label: "数据导入导出", icon: PackageMinus }
    ]
  }
];

const titles = Object.fromEntries(menuGroups.flatMap((group) => group.items.map((item) => [item.to, item.label])));
titles["/cattle"] = "牛舍管理";
titles["/driver"] = "货车管理";

export default function Layout() {
  const location = useLocation();
  const demo = useDemo();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleGroups = filterMenuGroupsByRole(menuGroups, demo.currentRole);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 hidden border-r border-slate-200 bg-white shadow-sm transition-all duration-200 lg:block ${collapsed ? "w-20" : "w-72"}`}>
        <Sidebar collapsed={collapsed} onNavigate={() => {}} groups={visibleGroups} />
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
          <aside className="relative h-full w-[86vw] max-w-80 overflow-y-auto bg-white shadow-xl">
            <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} groups={visibleGroups} />
          </aside>
        </div>
      )}

      <div className={`min-h-screen transition-all duration-200 ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 pt-[max(10px,env(safe-area-inset-top))] backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="grid h-11 w-11 place-items-center rounded-[8px] bg-slate-100 text-slate-800 lg:hidden" aria-label="打开导航">
              <Menu size={22} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-2xl font-bold text-slate-950">{titles[location.pathname] || "合力牧业农牧乳一体化经营管理平台"}</p>
              <p className="truncate text-sm font-semibold text-slate-500">{demo.currentRole} · {summarizeRoleScope(demo.currentRole)}</p>
            </div>
            <select value={demo.currentRole} onChange={(event) => demo.setCurrentRole(event.target.value)} className="hidden min-h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 xl:block" aria-label="当前角色视图">
              {roleOptions.map((role) => <option key={role}>{role}</option>)}
            </select>
            <NavLink to="/settings" className="hidden rounded-[8px] bg-slate-900 px-4 py-3 text-base font-bold text-white sm:block">
              系统设置
            </NavLink>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-5 pb-[max(28px,env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar({ collapsed, onNavigate, groups }) {
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
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.title} className="mb-5">
            {!collapsed && <p className="mb-2 px-3 text-xs font-black uppercase tracking-wider text-slate-400">{group.title}</p>}
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
                        isActive ? "bg-pasture-50 text-pasture-800 ring-1 ring-pasture-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      } ${collapsed ? "justify-center" : ""}`
                    }
                  >
                    <Icon size={21} className="shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
