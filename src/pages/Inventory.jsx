import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const categories = ["全部", "饲料", "兽药", "疫苗", "消毒用品", "车辆用品", "工具耗材", "其他"];

export default function Inventory({ warningsOnly = false }) {
  const demo = useDemo();
  const [form, setForm] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("全部");

  const materials = useMemo(() => demo.data.materials.filter((item) => {
    const warning = Number(item.stock || 0) <= Number(item.warningStock || 0);
    const matchWarning = !warningsOnly || warning;
    const matchKeyword = !keyword.trim() || item.name.includes(keyword.trim()) || item.supplier.includes(keyword.trim());
    const matchCategory = category === "全部" || item.category === category;
    return matchWarning && matchKeyword && matchCategory;
  }), [category, demo.data.materials, keyword, warningsOnly]);

  const totalValue = demo.data.materials.reduce((sum, item) => sum + Number(item.stock || 0) * Number(item.price || 0), 0);

  function emptyMaterial() {
    return { name: "", category: "饲料", stock: 0, unit: "吨", warningStock: demo.data.settings.defaultInventoryWarning || 20, price: 0, supplier: "", lastInAt: "", lastOutAt: "", note: "" };
  }

  function saveMaterial() {
    if (!form.name.trim()) return alert("物资名称不能为空");
    if ([form.stock, form.warningStock, form.price].some((value) => Number.isNaN(Number(value)))) return alert("库存、预警和单价必须是数字");
    if (Number(form.stock) < 0) return alert("库存不能为负数");
    demo.upsertMaterial({ ...form, stock: Number(form.stock), warningStock: Number(form.warningStock), price: Number(form.price) });
    alert("物资已保存");
    setForm(null);
  }

  function removeMaterial(id) {
    if (window.confirm("确定删除这个物资档案吗？")) demo.deleteMaterial(id);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">{warningsOnly ? "库存预警" : "物资库存"}</h1>
            <p className="mt-2 text-base text-slate-600">展示饲料、兽药、疫苗、消毒用品、车辆用品等轻量进销存能力。</p>
          </div>
          <button onClick={() => setForm(emptyMaterial())} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 新增物资</button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="物资种类" value={demo.metrics.materialCount} unit="项" />
        <MetricCard label="库存预警" value={demo.metrics.inventoryWarningCount} unit="项" tone={demo.metrics.inventoryWarningCount ? "red" : "green"} />
        <MetricCard label="库存总值" value={(totalValue / 10000).toFixed(1)} unit="万元" tone="blue" />
        <MetricCard label="分类数量" value={new Set(demo.data.materials.map((item) => item.category)).size} unit="类" tone="amber" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="筛选查询" />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3">
            <Search size={20} className="text-slate-500" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="min-h-12 min-w-0 flex-1 bg-transparent font-semibold outline-none" placeholder="物资名称 / 供应商" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-lg">{categories.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        {materials.map((item) => {
          const warning = Number(item.stock || 0) <= Number(item.warningStock || 0);
          return (
            <article key={item.id} className={`rounded-[8px] bg-white p-4 shadow-soft ring-1 ${warning ? "ring-red-200" : "ring-slate-100"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">{item.name}</h2>
                  <p className="mt-1 font-semibold text-slate-500">{item.category} · {item.supplier || "未填写供应商"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${warning ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{warning ? "库存预警" : "正常"}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Info label="当前库存" value={`${item.stock}${item.unit}`} />
                <Info label="预警库存" value={`${item.warningStock}${item.unit}`} />
                <Info label="单价" value={`${item.price} 元/${item.unit}`} />
                <Info label="库存价值" value={`${(Number(item.stock || 0) * Number(item.price || 0)).toFixed(0)} 元`} />
                <Info label="最近入库" value={item.lastInAt || "未记录"} />
                <Info label="最近出库" value={item.lastOutAt || "未记录"} />
              </div>
              <p className="mt-3 rounded-[8px] bg-slate-50 p-3 text-slate-700">备注：{item.note || "无"}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => setForm(item)} className="min-h-11 rounded-[8px] bg-slate-100 font-bold text-slate-800">编辑</button>
                <button onClick={() => removeMaterial(item.id)} className="min-h-11 rounded-[8px] bg-red-50 font-bold text-red-700">删除</button>
              </div>
            </article>
          );
        })}
        {!materials.length && <p className="rounded-[8px] bg-white p-5 text-lg font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">暂无符合条件的物资。</p>}
      </section>

      {form && (
        <Modal title="物资档案" onClose={() => setForm(null)}>
          <Label text="物资名称"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-lg" /></Label>
          <Label text="物资分类"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-lg">{categories.filter((item) => item !== "全部").map((item) => <option key={item}>{item}</option>)}</select></Label>
          <div className="grid gap-3 md:grid-cols-2">
            <Label text="当前库存"><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-lg" /></Label>
            <Label text="单位"><input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-lg" /></Label>
            <Label text="预警库存"><input type="number" value={form.warningStock} onChange={(e) => setForm({ ...form, warningStock: e.target.value })} className="input-lg" /></Label>
            <Label text="单价"><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-lg" /></Label>
          </div>
          <Label text="供应商"><input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input-lg" /></Label>
          <Label text="备注"><textarea value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-lg min-h-24 py-3" /></Label>
          <button onClick={saveMaterial} className="btn-primary"><Save size={22} /> 保存</button>
          {form.id && <button onClick={() => removeMaterial(form.id)} className="btn-danger"><Trash2 size={22} /> 删除</button>}
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/50 p-4 pt-[max(36px,env(safe-area-inset-top))]"><div className="mx-auto max-w-2xl rounded-[8px] bg-white p-5 shadow-soft"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-2xl font-bold text-slate-950">{title}</h2><button onClick={onClose} className="h-11 rounded-[8px] bg-slate-100 px-4 font-bold">关闭</button></div><div className="space-y-4">{children}</div></div></div>;
}
function Info({ label, value }) {
  return <div className="rounded-[8px] bg-slate-50 p-3"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-1 break-words font-bold text-slate-800">{value}</p></div>;
}
function Label({ text, children }) {
  return <label className="block text-base font-bold text-slate-700">{text}<div className="mt-2">{children}</div></label>;
}
