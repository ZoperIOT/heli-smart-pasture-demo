import { useRef, useState } from "react";
import { Download, RotateCcw, Save, Upload } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { roleOptions } from "../data/platformModules.js";
import { workModes } from "../services/roleViewService.js";

export default function Settings() {
  const demo = useDemo();
  const [form, setForm] = useState(demo.data.settings);
  const fileRef = useRef(null);

  function saveSettings() {
    if (!form.farmName.trim()) return alert("系统名称不能为空");
    demo.updateSettings(form);
    alert("设置已保存");
  }

  function exportJson() {
    const blob = new Blob([demo.exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `heli-farm-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        if (window.confirm("确定导入这个数据文件吗？当前本机数据会被覆盖。")) {
          demo.importData(parsed);
          alert("导入完成");
        }
      } catch {
        alert("导入失败，请选择正确的 JSON 文件");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file, "utf-8");
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-3xl font-bold text-slate-950">系统设置</h1>
        <p className="mt-2 text-lg leading-8 text-slate-600">当前数据保存在本机浏览器 localStorage，适合静态部署和公司内部演示。</p>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="基础设置" />
        <div className="space-y-4">
          <Label text="系统名称"><input value={form.farmName} onChange={(e) => setForm({ ...form, farmName: e.target.value })} className="input-lg" /></Label>
          <Label text="负责人"><input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} className="input-lg" /></Label>
          <Label text="联系电话"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-lg" /></Label>
          <Label text="默认奶价（元/kg）"><input type="number" value={form.defaultMilkPrice} onChange={(e) => setForm({ ...form, defaultMilkPrice: Number(e.target.value) })} className="input-lg" /></Label>
          <Label text="默认配送类型"><input value={form.defaultDeliveryType} onChange={(e) => setForm({ ...form, defaultDeliveryType: e.target.value })} className="input-lg" /></Label>
          <Label text="默认产奶记录人"><input value={form.defaultRecorder} onChange={(e) => setForm({ ...form, defaultRecorder: e.target.value })} className="input-lg" /></Label>
          <Label text="默认库存预警阈值"><input type="number" value={form.defaultInventoryWarning} onChange={(e) => setForm({ ...form, defaultInventoryWarning: Number(e.target.value) })} className="input-lg" /></Label>
          <Label text="当前角色视图">
            <select value={form.currentRole || demo.currentRole} onChange={(e) => setForm({ ...form, currentRole: e.target.value })} className="input-lg">
              {roleOptions.map((role) => <option key={role}>{role}</option>)}
            </select>
          </Label>
          <Label text="当前工作模式">
            <select value={form.currentWorkMode || demo.currentWorkMode} onChange={(e) => setForm({ ...form, currentWorkMode: e.target.value })} className="input-lg">
              {workModes.map((mode) => <option key={mode}>{mode}</option>)}
            </select>
          </Label>
          <button onClick={saveSettings} className="btn-primary"><Save size={22} /> 保存设置</button>
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="数据管理" />
        <div className="space-y-3">
          <button onClick={exportJson} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-slate-900 text-xl font-bold text-white">
            <Download size={22} /> 导出 JSON 备份
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-slate-100 text-xl font-bold text-slate-800">
            <Upload size={22} /> 导入 JSON 数据
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={importJson} className="hidden" />
          <button onClick={() => window.confirm("确定重置为示例数据吗？") && demo.resetDemo()} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-amber-50 text-xl font-bold text-amber-800">
            <RotateCcw size={22} /> 重置示例数据
          </button>
          <button onClick={() => window.confirm("确定清空并恢复初始数据吗？") && demo.clearAllData()} className="btn-danger">
            清空本机数据
          </button>
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="最近操作日志" />
        <div className="space-y-2">
          {(demo.data.operationLogs || []).slice(0, 6).map((log) => (
            <p key={log.id} className="rounded-[8px] bg-slate-50 p-3 text-base font-bold text-slate-700">
              {log.operatedAt} · {log.operator} · {log.module} · {log.summary}
            </p>
          ))}
        </div>
        <p className="mt-3 rounded-[8px] bg-amber-50 p-3 text-base font-bold text-amber-800">
          当前为前端模拟审计日志，正式上线后应由后端服务记录并限制删除、修改和导出权限。
        </p>
      </section>
    </div>
  );
}

function Label({ text, children }) {
  return <label className="block text-lg font-bold text-slate-700">{text}<div className="mt-2">{children}</div></label>;
}
