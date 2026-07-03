import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2, Truck } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { isOverdueDelivery } from "../services/farmStorage.js";

const types = ["原奶配送", "饲料调拨", "乳品配送", "其他配送"];
const statuses = ["待配送", "配送中", "已到达", "异常"];

export default function Delivery() {
  const demo = useDemo();
  const [form, setForm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [truckFilter, setTruckFilter] = useState("全部");

  const trucks = useMemo(
    () => [...demo.data.trucks].sort((a, b) => Number(b.status === "空闲") - Number(a.status === "空闲")),
    [demo.data.trucks]
  );
  const deliveries = useMemo(() => {
    return demo.data.deliveries.filter((item) => {
      const matchStatus = statusFilter === "全部" || item.status === statusFilter;
      const matchTruck = truckFilter === "全部" || item.truckId === truckFilter;
      const matchKeyword = !keyword.trim() || `${item.name}${item.type}${item.businessType}${item.startPoint}${item.endPoint}${item.goodsName}${item.driver}${item.note}`.includes(keyword.trim());
      return matchStatus && matchTruck && matchKeyword;
    });
  }, [demo.data.deliveries, keyword, statusFilter, truckFilter]);

  function emptyForm() {
    const truck = trucks.find((item) => item.status === "空闲") || trucks[0];
    return {
      name: "",
      type: "原奶配送",
      businessType: "原奶配送",
      startPoint: "合力牧业奶牛场",
      endPoint: "欧力菲德乳品厂",
      goodsName: "原奶",
      amount: 1,
      unit: "吨",
      status: "待配送",
      truckId: truck?.id || "",
      driver: truck?.driver || "",
      plannedAt: "",
      fee: 0,
      syncExpense: false,
      note: "",
      createdAt: ""
    };
  }

  function saveDelivery() {
    if (!form.name.trim()) return alert("任务名称不能为空");
    if (Number.isNaN(Number(form.amount))) return alert("配送量必须是数字");
    if (Number(form.amount) <= 0) return alert("配送量必须大于 0");
    demo.upsertDelivery({ ...form, amount: Number(form.amount), fee: Number(form.fee || 0) });
    alert("配送任务已保存");
    setForm(null);
  }

  function updateTruck(truckId) {
    const truck = demo.data.trucks.find((item) => item.id === truckId);
    setForm({ ...form, truckId, driver: truck?.driver || form.driver });
  }

  function truckName(id) {
    const truck = demo.data.trucks.find((item) => item.id === id);
    return truck ? `${truck.plate}（${truck.status}）` : "未选择";
  }

  function removeDelivery(id) {
    if (window.confirm("确定删除这个配送任务吗？")) {
      demo.deleteDelivery(id);
      setForm(null);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-3xl font-bold text-slate-950">配送任务</h1>
        <p className="mt-2 text-lg leading-8 text-slate-600">服务原奶配送、饲料调拨和乳品配送。任务到达后，对应货车会自动变为空闲。</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => setForm(emptyForm())} className="flex min-h-14 items-center justify-center gap-2 rounded-[8px] bg-pasture-700 text-xl font-bold text-white">
            <Plus size={22} /> 新增任务
          </button>
          <Link to="/trucks" className="flex min-h-14 items-center justify-center gap-2 rounded-[8px] bg-slate-900 text-xl font-bold text-white">
            <Truck size={22} /> 管理货车
          </Link>
        </div>
        {!demo.data.trucks.length && <p className="mt-3 rounded-[8px] bg-amber-50 p-3 text-lg font-bold text-amber-800">还没有货车，请先到货车管理添加车辆。</p>}
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <MetricCard label="总配送量" value={demo.metrics.deliveryAmount.toFixed(1)} unit="吨" tone="blue" />
        <MetricCard label="待配送" value={demo.metrics.waitingDeliveries} unit="单" tone="amber" />
        <MetricCard label="配送中" value={demo.metrics.runningDeliveries} unit="单" tone="sky" />
        <MetricCard label="已到达" value={demo.metrics.arrivedDeliveries} unit="单" tone="green" />
        <MetricCard label="异常" value={demo.metrics.abnormalDeliveries} unit="单" tone={demo.metrics.abnormalDeliveries ? "red" : "green"} />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="筛选任务" />
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3">
            <Search size={22} className="text-slate-500" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="min-h-14 min-w-0 flex-1 bg-transparent text-lg font-bold outline-none" placeholder="搜索客户、司机、备注" />
          </div>
          <select value={truckFilter} onChange={(e) => setTruckFilter(e.target.value)} className="input-lg">
            <option value="全部">全部货车</option>
            {demo.data.trucks.map((truck) => <option key={truck.id} value={truck.id}>{truck.plate}</option>)}
          </select>
          <div className="grid grid-cols-5 gap-2">
            {["全部", ...statuses].map((status) => (
              <button key={status} onClick={() => setStatusFilter(status)} className={`min-h-12 rounded-[8px] text-base font-bold ${statusFilter === status ? "bg-pasture-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="今日配送列表" />
        <div className="space-y-3">
          {deliveries.map((item) => (
            <article key={item.id} className={`rounded-[8px] bg-white p-4 shadow-soft ring-1 ${isOverdueDelivery(item) ? "ring-red-200" : "ring-slate-100"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">{item.name}</h2>
                  <p className="mt-2 text-lg text-slate-600">{item.taskNo || "未编号"} · {item.businessType || item.type} · {item.goodsName || "货物"} · {Number(item.amount || 0).toFixed(1)} {item.unit || "吨"}</p>
                </div>
                <StatusBadge>{item.status}</StatusBadge>
              </div>
              {isOverdueDelivery(item) && <p className="mt-3 rounded-[8px] bg-red-50 p-3 text-lg font-bold text-red-700">已超过计划时间 30 分钟以上，请电话确认。</p>}
              <div className="mt-3 grid gap-2 text-lg md:grid-cols-2">
                <Info label="货车" value={truckName(item.truckId)} />
                <Info label="起点" value={item.startPoint || "未填写"} />
                <Info label="终点" value={item.endPoint || item.name || "未填写"} />
                <Info label="司机" value={item.driver || "未填写"} />
                <Info label="计划时间" value={item.plannedAt || "未填写"} />
                <Info label="创建时间" value={item.createdAt || "未记录"} />
                <Info label="开始时间" value={item.startedAt || "未开始"} />
                <Info label="到达时间" value={item.arrivedAt || "未到达"} />
                <Info label="配送费用" value={`${Number(item.fee || 0).toFixed(0)} 元`} />
                <Info label="备注" value={item.note || "无"} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
                <button onClick={() => setForm(item)} className="min-h-12 rounded-[8px] bg-slate-100 text-lg font-bold">编辑</button>
                <button onClick={() => demo.setDeliveryStatus(item.id, "配送中")} className="min-h-12 rounded-[8px] bg-sky-50 text-lg font-bold text-sky-700">配送中</button>
                <button onClick={() => demo.setDeliveryStatus(item.id, "已到达")} className="min-h-12 rounded-[8px] bg-emerald-50 text-lg font-bold text-pasture-700">已到达</button>
                <button onClick={() => demo.setDeliveryStatus(item.id, "异常")} className="min-h-12 rounded-[8px] bg-red-50 text-lg font-bold text-red-700">异常</button>
                <button onClick={() => removeDelivery(item.id)} className="min-h-12 rounded-[8px] bg-slate-50 text-lg font-bold text-slate-700">删除</button>
              </div>
            </article>
          ))}
          {!deliveries.length && <p className="rounded-[8px] bg-white p-5 text-xl font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">没有符合条件的配送任务。</p>}
        </div>
      </section>

      {form && (
        <Modal title="配送任务" onClose={() => setForm(null)}>
          <Label text="任务名称"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-lg" /></Label>
          <Label text="业务类型"><select value={form.businessType || form.type} onChange={(e) => setForm({ ...form, businessType: e.target.value, type: e.target.value })} className="input-lg">{types.map((type) => <option key={type}>{type}</option>)}</select></Label>
          <Label text="任务编号"><input value={form.taskNo || ""} onChange={(e) => setForm({ ...form, taskNo: e.target.value })} className="input-lg" /></Label>
          <Label text="起点"><input value={form.startPoint || ""} onChange={(e) => setForm({ ...form, startPoint: e.target.value })} className="input-lg" /></Label>
          <Label text="终点"><input value={form.endPoint || ""} onChange={(e) => setForm({ ...form, endPoint: e.target.value })} className="input-lg" /></Label>
          <Label text="货物名称"><input value={form.goodsName || ""} onChange={(e) => setForm({ ...form, goodsName: e.target.value })} className="input-lg" /></Label>
          <Label text="数量"><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-lg" /></Label>
          <Label text="单位"><input value={form.unit || "吨"} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-lg" /></Label>
          <Label text="选择货车"><select value={form.truckId} onChange={(e) => updateTruck(e.target.value)} className="input-lg"><option value="">未选择</option>{trucks.map((truck) => <option key={truck.id} value={truck.id}>{truck.plate}（{truck.driver}，{truck.status}）</option>)}</select></Label>
          <Label text="司机"><input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} className="input-lg" /></Label>
          <Label text="计划配送时间"><input value={form.plannedAt} onChange={(e) => setForm({ ...form, plannedAt: e.target.value })} className="input-lg" placeholder="例如：今天 15:00" /></Label>
          <Label text="状态"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-lg">{statuses.map((status) => <option key={status}>{status}</option>)}</select></Label>
          <Label text="配送费用"><input type="number" value={form.fee || 0} onChange={(e) => setForm({ ...form, fee: e.target.value })} className="input-lg" /></Label>
          <label className="flex min-h-14 items-center gap-3 rounded-[8px] bg-amber-50 px-4 text-lg font-bold text-amber-900">
            <input type="checkbox" checked={Boolean(form.syncExpense)} onChange={(e) => setForm({ ...form, syncExpense: e.target.checked })} className="h-5 w-5" />
            同步到账本支出
          </label>
          <Label text="备注"><input value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-lg" /></Label>
          <button onClick={saveDelivery} className="btn-primary"><Save size={22} /> 保存</button>
          {form.id && <button onClick={() => removeDelivery(form.id)} className="btn-danger"><Trash2 size={22} /> 删除</button>}
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
