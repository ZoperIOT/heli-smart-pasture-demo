import { ShieldCheck } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { isReadonlyRole, summarizeRoleScope } from "../services/roleViewService.js";
import { roleOptions } from "../data/platformModules.js";

export default function RoleSimulation() {
  const demo = useDemo();
  const role = demo.currentRole;

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p className="text-sm font-black text-pasture-700">权限流 / 多组织模拟</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">角色与组织模拟</h1>
        <p className="mt-2 text-base leading-7 text-slate-600">当前不做真实登录和安全控制，但用前端角色视图展示未来“角色 + 数据范围 + 菜单权限”的产品能力。</p>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="当前角色" value={role} unit="" tone="blue" />
        <MetricCard label="只读模式" value={isReadonlyRole(role) ? "是" : "否"} unit="" tone={isReadonlyRole(role) ? "amber" : "green"} />
        <MetricCard label="组织板块" value={(demo.data.roleViews || []).length} unit="个" tone="green" />
        <MetricCard label="模拟角色" value={roleOptions.length} unit="类" tone="sky" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="切换当前角色视图" />
        <div className="grid gap-3 md:grid-cols-5">
          {roleOptions.map((item) => (
            <button key={item} onClick={() => demo.setCurrentRole(item)} className={`min-h-14 rounded-[8px] px-3 text-base font-bold ring-1 ${role === item ? "bg-pasture-700 text-white ring-pasture-700" : "bg-slate-50 text-slate-700 ring-slate-100"}`}>
              {item}
            </button>
          ))}
        </div>
        <p className="mt-4 rounded-[8px] bg-emerald-50 p-4 text-lg font-bold text-pasture-800"><ShieldCheck className="mr-2 inline" />{summarizeRoleScope(role)}</p>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="角色数据范围" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-y-2 text-left">
            <thead className="text-sm text-slate-500"><tr>{["角色", "组织", "数据范围", "可编辑", "默认页", "说明"].map((head) => <th key={head} className="px-3 py-2 font-black">{head}</th>)}</tr></thead>
            <tbody>
              {(demo.data.roleViews || []).map((item) => (
                <tr key={item.id} className="bg-slate-50 text-base">
                  <td className="px-3 py-3 font-bold">{item.role}</td>
                  <td className="px-3 py-3">{item.organization}</td>
                  <td className="px-3 py-3">{item.dataScope}</td>
                  <td className="px-3 py-3">{item.canEdit ? "是" : "否"}</td>
                  <td className="px-3 py-3">{item.defaultPage}</td>
                  <td className="px-3 py-3">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
