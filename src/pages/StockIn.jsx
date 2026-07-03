import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const categories = ["全部", "饲料", "兽药", "疫苗", "消毒用品", "车辆用品", "工具耗材", "其他"];

export default function StockIn() {
  const demo = useDemo();
  const [form, setForm] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("全部");
  const [date, setDate] = useState("");

  const records = useMemo(() => demo.data.stockInRecords.filter((item) => {
    const matchKeyword = !keyword.trim() || item.materialName.includes(keyword.trim()) || item.supplier.includes(keyword.trim());
    const matchCategory = category === "全部" || item.category === category;
    const matchDate = !date.trim() || item.date.includes(date.trim());
    return matchKeyword && matchCategory && matchDate;
  }), [category, date, demo.data.stockInRecords, keyword]);

  const totalAmount = records.reduce((sum, item) => sum + Number(item.total || 0), 0);

  function materialChanged(materialId) {
    const material = demo.data.materials.find((item) => item.id === materialId);
    setForm({ ...form, materialId, materialName: material?.name || "", category: material?.category || "", unit: material?.unit || "", price: material?.price || 0, supplier: material?.supplier || "", total: Number(form.quantity || 0) * Number(material?.price || 0) });
  }

  function emptyRecord() {
    const material = demo.data.materials[0];
    return { date: new Date().toISOString().slice(0, 10), materialId: material?.id || "", materialName: material?.name || "", category: material?.category || "饲料", quantity: 1, unit: material?.unit || "吨", price: material?.price || 0, total: material?.price || 0, supplier: material?.supplier || "", operator: demo.data.settings.manager, syncLedger: true, note: "" };
  }

  function saveRecord() {
    if (!form.materialId) return alert("请选择物资");
    if (Number(form.quantity) <= 0) return alert("入库数量必须大于 0");
    demo.upsertStockIn({ ...form, quantity: Number(form.quantity), price: Number(form.price), total: Number(form.total || Number(form.quantity) * Number(form.price)) });
    alert("入库记录已保存，库存已同步");
    setForm(null);
  }

  function removeRecord(id) {
    if (window.confirm("确定删除这条入库记录吗？库存和账本同步记录会回退。")) demo.deleteStockIn(id);
  }

  return (
    <div className="space-y-5">
      <Header title="入库记录" desc="新增入库后自动增加库存，可同步生成物资采购支出。" onAdd={() => setForm(emptyRecord())} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MetricCard label="记录数量" value={records.length} unit="条" />
        <MetricCard label="入库金额" value={(totalAmount / 10000).toFixed(1)} unit="万元" tone="blue" />
        <MetricCard label="同步账本" value={records.filter((item) => item.syncLedger).length} unit="条" tone="amber" />
      </div>
      <Filters keyword={keyword} setKeyword={setKeyword} category={category} setCategory={setCategory} date={date} setDate={setDate} />
      <RecordList records={records} onEdit={setForm} onDelete={removeRecord} />
      {form && <Modal title="入库记录" onClose={() => setForm(null)}>
        <Label text="入库日期"><input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-lg" /></Label>
        <Label text="物资名称"><select value={form.materialId} onChange={(e) => materialChanged(e.target.value)} className="input-lg">{demo.data.materials.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Label>
        <div className="grid gap-3 md:grid-cols-2">
          <Label text="分类"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-lg" /></Label>
          <Label text="单位"><input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-lg" /></Label>
          <Label text="入库数量"><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value, total: Number(e.target.value || 0) * Number(form.price || 0) })} className="input-lg" /></Label>
          <Label text="单价"><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value, total: Number(form.quantity || 0) * Number(e.target.value || 0) })} className="input-lg" /></Label>
        </div>
        <Label text="总金额"><input type="number" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} className="input-lg" /></Label>
        <Label text="供应商"><input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input-lg" /></Label>
        <Label text="经办人"><input value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })} className="input-lg" /></Label>
        <label className="flex min-h-14 items-center gap-3 rounded-[8px] bg-sky-50 px-4 text-lg font-bold text-sky-900"><input type="checkbox" checked={Boolean(form.syncLedger)} onChange={(e) => setForm({ ...form, syncLedger: e.target.checked })} className="h-5 w-5" /> 同步到账本支出</label>
        <Label text="备注"><input value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-lg" /></Label>
        <button onClick={saveRecord} className="btn-primary"><Save size={22} /> 保存</button>
        {form.id && <button onClick={() => removeRecord(form.id)} className="btn-danger"><Trash2 size={22} /> 删除</button>}
      </Modal>}
    </div>
  );
}

function Header({ title, desc, onAdd }) {
  return <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold text-slate-950">{title}</h1><p className="mt-2 text-base text-slate-600">{desc}</p></div><button onClick={onAdd} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 新增</button></div></section>;
}
function Filters({ keyword, setKeyword, category, setCategory, date, setDate }) {
  return <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100"><SectionTitle title="筛选查询" /><div className="grid gap-3 md:grid-cols-3"><div className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3"><Search size={20} className="text-slate-500" /><input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="min-h-12 min-w-0 flex-1 bg-transparent font-semibold outline-none" placeholder="物资 / 供应商" /></div><select value={category} onChange={(e) => setCategory(e.target.value)} className="input-lg">{categories.map((item) => <option key={item}>{item}</option>)}</select><input value={date} onChange={(e) => setDate(e.target.value)} className="input-lg" placeholder="日期" /></div></section>;
}
function RecordList({ records, onEdit, onDelete }) {
  return <section className="space-y-3">{records.map((item) => <article key={item.id} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100"><div className="flex items-start justify-between gap-3"><div><h2 className="text-2xl font-bold text-slate-950">{item.materialName}</h2><p className="mt-1 font-semibold text-slate-500">{item.date} · {item.category} · {item.supplier}</p></div><p className="text-2xl font-bold text-pasture-700">{item.quantity}{item.unit}</p></div><div className="mt-3 grid grid-cols-2 gap-2"><Info label="单价" value={`${item.price} 元`} /><Info label="总金额" value={`${item.total} 元`} /><Info label="经办人" value={item.operator || "未填写"} /><Info label="同步账本" value={item.syncLedger ? "是" : "否"} /></div><p className="mt-3 rounded-[8px] bg-slate-50 p-3 text-slate-700">备注：{item.note || "无"}</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => onEdit(item)} className="min-h-11 rounded-[8px] bg-slate-100 font-bold text-slate-800">编辑</button><button onClick={() => onDelete(item.id)} className="min-h-11 rounded-[8px] bg-red-50 font-bold text-red-700">删除</button></div></article>)}{!records.length && <p className="rounded-[8px] bg-white p-5 text-lg font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">暂无入库记录。</p>}</section>;
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
