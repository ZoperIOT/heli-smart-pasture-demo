import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const statuses = ["空闲", "配送中", "维修中", "停用"];

export default function Driver() {
  const demo = useDemo();
  const [form, setForm] = useState(null);

  function saveTruck() {
    if (!form.plate.trim()) return alert("车牌号不能为空");
    if (!form.driver.trim()) return alert("司机姓名不能为空");
    if (Number.isNaN(Number(form.load))) return alert("当前载重必须是数字");
    if (Number(form.load) < 0) return alert("当前载重不能为负数");
    demo.upsertTruck({ ...form, load: Number(form.load) });
    setForm(null);
  }

  function removeTruck(id) {
    if (window.confirm("确定删除这辆货车吗？相关配送任务会取消车辆绑定。")) {
      demo.deleteTruck(id);
      setForm(null);
    }
  }

  function emptyTruck() {
    return { plate: "", driver: "", phone: "", status: "空闲", currentTask: "", location: "牧场", cargo: "空车", load: 0, note: "" };
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-3xl font-bold text-slate-950">货车管理</h1>
        <p className="mt-2 text-lg leading-8 text-slate-600">看哪辆车空闲、哪辆车配送中、哪辆车不能安排。</p>
        <button onClick={() => setForm(emptyTruck())} className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-pasture-700 text-xl font-bold text-white">
          <Plus size={22} /> 新增货车
        </button>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="货车总数" value={demo.metrics.truckCount} unit="辆" />
        <MetricCard label="空闲" value={demo.metrics.idleTrucks} unit="辆" tone="green" />
        <MetricCard label="配送中" value={demo.metrics.runningTrucks} unit="辆" tone="sky" />
        <MetricCard label="维修/停用" value={demo.metrics.repairTrucks + demo.metrics.disabledTrucks} unit="辆" tone={demo.metrics.repairTrucks + demo.metrics.disabledTrucks ? "red" : "green"} />
      </div>

      <div className="grid gap-3">
        {demo.data.trucks.map((truck) => (
          <article key={truck.id} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">{truck.plate}</h2>
                <p className="mt-2 text-xl font-bold text-slate-700">{truck.driver}</p>
                <p className="mt-1 text-base font-bold text-slate-500">{truck.phone || "未填写电话"}</p>
              </div>
              <StatusBadge>{truck.status}</StatusBadge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-lg">
              <Info label="当前位置" value={truck.location || "牧场"} />
              <Info label="当前任务" value={truck.currentTask || "无"} />
              <Info label="内容" value={truck.cargo || "空车"} />
              <Info label="载重" value={`${Number(truck.load || 0).toFixed(1)} 吨`} />
              <Info label="备注" value={truck.note || "无"} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
              <button onClick={() => setForm(truck)} className="min-h-12 rounded-[8px] bg-slate-100 text-lg font-bold">编辑</button>
              <button onClick={() => demo.setTruckStatus(truck.id, "配送中")} className="min-h-12 rounded-[8px] bg-sky-50 text-lg font-bold text-sky-700">配送中</button>
              <button onClick={() => demo.setTruckStatus(truck.id, "空闲")} className="min-h-12 rounded-[8px] bg-emerald-50 text-lg font-bold text-pasture-700">设为空闲</button>
              <button onClick={() => demo.setTruckStatus(truck.id, "维修中")} className="min-h-12 rounded-[8px] bg-red-50 text-lg font-bold text-red-700">维修中</button>
              <button onClick={() => demo.setTruckStatus(truck.id, "停用")} className="min-h-12 rounded-[8px] bg-slate-50 text-lg font-bold text-slate-700">停用</button>
            </div>
          </article>
        ))}
        {!demo.data.trucks.length && <p className="rounded-[8px] bg-white p-5 text-xl font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">暂无货车，请先新增一辆。</p>}
      </div>

      {form && (
        <Modal title="货车信息" onClose={() => setForm(null)}>
          <Label text="车牌号"><input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} className="input-lg" /></Label>
          <Label text="司机姓名"><input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} className="input-lg" /></Label>
          <Label text="司机电话"><input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-lg" /></Label>
          <Label text="状态"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-lg">{statuses.map((s) => <option key={s}>{s}</option>)}</select></Label>
          <Label text="当前任务"><input value={form.currentTask || ""} onChange={(e) => setForm({ ...form, currentTask: e.target.value })} className="input-lg" /></Label>
          <Label text="当前位置"><input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-lg" /></Label>
          <Label text="配送内容"><input value={form.cargo || ""} onChange={(e) => setForm({ ...form, cargo: e.target.value })} className="input-lg" /></Label>
          <Label text="当前载重（吨）"><input type="number" value={form.load} onChange={(e) => setForm({ ...form, load: e.target.value })} className="input-lg" /></Label>
          <Label text="备注"><input value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-lg" /></Label>
          <button onClick={saveTruck} className="btn-primary"><Save size={22} /> 保存</button>
          {form.id && <button onClick={() => removeTruck(form.id)} className="btn-danger"><Trash2 size={22} /> 删除货车</button>}
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/50 p-4 pt-[max(36px,env(safe-area-inset-top))]">
      <div className="mx-auto max-w-lg rounded-[8px] bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="h-12 rounded-[8px] bg-slate-100 px-4 text-lg font-bold">关闭</button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-[8px] bg-slate-50 p-3">
      <p className="text-base font-bold text-slate-500">{label}</p>
      <p className="mt-1 break-words font-bold text-slate-800">{value}</p>
    </div>
  );
}

function Label({ text, children }) {
  return <label className="block text-lg font-bold text-slate-700">{text}<div className="mt-2">{children}</div></label>;
}
