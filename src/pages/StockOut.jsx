import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const categories = ["全部", "饲料", "兽药", "疫苗", "消毒用品", "车辆用品", "工具耗材", "其他"];

export default function StockOut() {
  const demo = useDemo();
  const [form, setForm] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("全部");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");

  const records = useMemo(() => demo.data.stockOutRecords.filter((item) => {
    const matchKeyword = !keyword.trim() || item.materialName.includes(keyword.trim()) || item.receiver.includes(keyword.trim());
    const matchCategory = category === "全部" || item.category === category;
    const matchPurpose = !purpose.trim() || item.purpose.includes(purpose.trim());
    const matchDate = !date.trim() || item.date.includes(date.trim());
    return matchKeyword && matchCategory && matchPurpose && matchDate;
  }), [category, date, demo.data.stockOutRecords, keyword, purpose]);

  function emptyRecord() {
    const material = demo.data.materials[0];
    return { date: new Date().toISOString().slice(0, 10), materialId: material?.id || "", materialName: material?.name || "", category: material?.category || "饲料", quantity: 1, unit: material?.unit || "吨", purpose: "日常使用", receiver: "", operator: demo.data.settings.manager, note: "" };
  }

  function materialChanged(materialId) {
    const material = demo.data.materials.find((item) => item.id === materialId);
    setForm({ ...form, materialId, materialName: material?.name || "", category: material?.category || "", unit: material?.unit || "" });
  }

  function saveRecord() {
    if (!form.materialId) return alert("请选择物资");
    if (Number(form.quantity) <= 0) return alert("出库数量必须大于 0");
    try {
      demo.upsertStockOut({ ...form, quantity: Number(form.quantity) });
      alert("出库记录已保存，库存已同步");
      setForm(null);
    } catch (error) {
      alert(error.message || "出库失败");
    }
  }

  function removeRecord(id) {
    if (window.confirm("确定删除这条出库记录吗？库存会自动回退。")) demo.deleteStockOut(id);
  }

  const totalQty = records.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">出库记录</h1>
            <p className="mt-2 text-base text-slate-600">出库后自动减少库存，系统会阻止库存出现负数。</p>
          </div>
          <button onClick={() => setForm(emptyRecord())} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 新增出库</button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MetricCard label="记录数量" value={records.length} unit="条" />
        <MetricCard label="出库合计" value={totalQty.toFixed(1)} unit="单位" tone="blue" />
        <MetricCard label="用途数量" value={new Set(records.map((item) => item.purpose)).size} unit="类" tone="amber" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="筛选查询" />
        <div className="grid gap-3 md:grid-cols-4">
          <div className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3">
            <Search size={20} className="text-slate-500" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="min-h-12 min-w-0 flex-1 bg-transparent font-semibold outline-none" placeholder="物资 / 领取人" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-lg">{categories.map((item) => <option key={item}>{item}</option>)}</select>
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} className="input-lg" placeholder="用途" />
          <input value={date} onChange={(e) => setDate(e.target.value)} className="input-lg" placeholder="日期" />
        </div>
      </section>

      <section className="space-y-3">
        {records.map((item) => (
          <article key={item.id} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">{item.materialName}</h2>
                <p className="mt-1 font-semibold text-slate-500">{item.date} · {item.category} · {item.purpose}</p>
              </div>
              <p className="text-2xl font-bold text-pasture-700">{item.quantity}{item.unit}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Info label="领取人" value={item.receiver || "未填写"} />
              <Info label="经办人" value={item.operator || "未填写"} />
            </div>
            <p className="mt-3 rounded-[8px] bg-slate-50 p-3 text-slate-700">备注：{item.note || "无"}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setForm(item)} className="min-h-11 rounded-[8px] bg-slate-100 font-bold text-slate-800">编辑</button>
              <button onClick={() => removeRecord(item.id)} className="min-h-11 rounded-[8px] bg-red-50 font-bold text-red-700">删除</button>
            </div>
          </article>
        ))}
        {!records.length && <p className="rounded-[8px] bg-white p-5 text-lg font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">暂无出库记录。</p>}
      </section>

      {form && (
        <Modal title="出库记录" onClose={() => setForm(null)}>
          <Label text="出库日期"><input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-lg" /></Label>
          <Label text="物资名称"><select value={form.materialId} onChange={(e) => materialChanged(e.target.value)} className="input-lg">{demo.data.materials.map((item) => <option key={item.id} value={item.id}>{item.name}（库存 {item.stock}{item.unit}）</option>)}</select></Label>
          <div className="grid gap-3 md:grid-cols-2">
            <Label text="分类"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-lg" /></Label>
            <Label text="单位"><input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-lg" /></Label>
            <Label text="出库数量"><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input-lg" /></Label>
            <Label text="用途"><input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="input-lg" /></Label>
          </div>
          <Label text="领取人"><input value={form.receiver} onChange={(e) => setForm({ ...form, receiver: e.target.value })} className="input-lg" /></Label>
          <Label text="经办人"><input value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })} className="input-lg" /></Label>
          <Label text="备注"><input value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-lg" /></Label>
          <button onClick={saveRecord} className="btn-primary"><Save size={22} /> 保存</button>
          {form.id && <button onClick={() => removeRecord(form.id)} className="btn-danger"><Trash2 size={22} /> 删除</button>}
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
