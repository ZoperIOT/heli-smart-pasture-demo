import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const incomeCategories = ["原奶销售", "肉牛销售", "饲料外销", "乳品销售", "其他收入"];
const expenseCategories = ["饲料原料采购", "兽药疫苗", "人工工资", "车辆油费", "设备维修", "生产加工", "其他支出"];
const businessUnits = ["全部", "合力牧业奶牛场", "欧力菲德肉牛场", "欧力菲德饲料厂", "欧力菲德乳品厂", "集团"];

export default function Ledger() {
  const demo = useDemo();
  const [form, setForm] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("全部");
  const [category, setCategory] = useState("全部");
  const [date, setDate] = useState("");
  const [businessUnit, setBusinessUnit] = useState("全部");

  const records = useMemo(() => demo.data.ledgerRecords.filter((item) => {
    const matchKeyword = !keyword.trim() || `${item.operator}${item.note}${item.relatedBusiness}`.includes(keyword.trim());
    const matchType = type === "全部" || item.type === type;
    const matchUnit = businessUnit === "全部" || (item.businessUnit || "集团") === businessUnit;
    const matchCategory = category === "全部" || item.category === category;
    const matchDate = !date.trim() || item.date.includes(date.trim());
    return matchKeyword && matchType && matchUnit && matchCategory && matchDate;
  }), [businessUnit, category, date, demo.data.ledgerRecords, keyword, type]);

  function emptyRecord(nextType = "收入") {
    return { date: new Date().toISOString().slice(0, 10), businessUnit: "集团", type: nextType, category: nextType === "收入" ? "原奶销售" : "饲料原料采购", amount: 0, operator: demo.data.settings.manager, relatedBusiness: "手工录入", relatedId: "", note: "" };
  }

  function saveRecord() {
    if (!form.date.trim()) return alert("日期不能为空");
    if (Number(form.amount) <= 0) return alert("金额必须大于 0");
    demo.upsertLedger({ ...form, amount: Number(form.amount) });
    alert("账本记录已保存");
    setForm(null);
  }

  function removeRecord(id) {
    if (window.confirm("确定删除这条账本记录吗？")) demo.deleteLedger(id);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">收支账本</h1>
            <p className="mt-2 text-base text-slate-600">轻量记录收入支出，可由产奶、配送、入库自动同步。</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setForm(emptyRecord("收入"))} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 收入</button>
            <button onClick={() => setForm(emptyRecord("支出"))} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-slate-900 px-4 font-bold text-white"><Plus size={20} /> 支出</button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <MetricCard label="今日收入" value={(demo.metrics.todayIncome / 10000).toFixed(1)} unit="万元" />
        <MetricCard label="今日支出" value={(demo.metrics.todayExpense / 10000).toFixed(1)} unit="万元" tone="amber" />
        <MetricCard label="本月收入" value={(demo.metrics.monthIncome / 10000).toFixed(1)} unit="万元" tone="blue" />
        <MetricCard label="本月支出" value={(demo.metrics.monthExpense / 10000).toFixed(1)} unit="万元" tone="red" />
        <MetricCard label="本月结余" value={(demo.metrics.monthBalance / 10000).toFixed(1)} unit="万元" tone={demo.metrics.monthBalance >= 0 ? "green" : "red"} />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="筛选查询" />
        <div className="grid gap-3 md:grid-cols-4">
          <div className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3">
            <Search size={20} className="text-slate-500" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="min-h-12 min-w-0 flex-1 bg-transparent font-semibold outline-none" placeholder="经办人 / 备注" />
          </div>
          <select value={businessUnit} onChange={(e) => setBusinessUnit(e.target.value)} className="input-lg">{businessUnits.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={type} onChange={(e) => { setType(e.target.value); setCategory("全部"); }} className="input-lg"><option>全部</option><option>收入</option><option>支出</option></select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-lg"><option>全部</option>{(type === "支出" ? expenseCategories : type === "收入" ? incomeCategories : [...incomeCategories, ...expenseCategories]).map((item) => <option key={item}>{item}</option>)}</select>
          <input value={date} onChange={(e) => setDate(e.target.value)} className="input-lg" placeholder="日期" />
        </div>
      </section>

      <section className="space-y-3">
        {records.map((item) => (
          <article key={item.id} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">{item.category}</h2>
                <p className="mt-1 font-semibold text-slate-500">{item.date} · {item.businessUnit || "集团"} · {item.relatedBusiness || "手工录入"} · {item.operator || "未填写"}</p>
              </div>
              <p className={`text-2xl font-bold ${item.type === "收入" ? "text-pasture-700" : "text-red-600"}`}>{item.type === "收入" ? "+" : "-"}{Number(item.amount).toFixed(0)} 元</p>
            </div>
            <p className="mt-3 rounded-[8px] bg-slate-50 p-3 text-slate-700">备注：{item.note || "无"}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setForm(item)} className="min-h-11 rounded-[8px] bg-slate-100 font-bold text-slate-800">编辑</button>
              <button onClick={() => removeRecord(item.id)} className="min-h-11 rounded-[8px] bg-red-50 font-bold text-red-700">删除</button>
            </div>
          </article>
        ))}
        {!records.length && <p className="rounded-[8px] bg-white p-5 text-lg font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">暂无账本记录。</p>}
      </section>

      {form && (
        <Modal title="账本记录" onClose={() => setForm(null)}>
          <Label text="日期"><input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-lg" /></Label>
          <Label text="业务板块"><select value={form.businessUnit || "集团"} onChange={(e) => setForm({ ...form, businessUnit: e.target.value })} className="input-lg">{businessUnits.filter((item) => item !== "全部").map((item) => <option key={item}>{item}</option>)}</select></Label>
          <Label text="类型"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category: e.target.value === "收入" ? "原奶销售" : "饲料原料采购" })} className="input-lg"><option>收入</option><option>支出</option></select></Label>
          <Label text="分类"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-lg">{(form.type === "收入" ? incomeCategories : expenseCategories).map((item) => <option key={item}>{item}</option>)}</select></Label>
          <Label text="金额"><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-lg" /></Label>
          <Label text="经办人"><input value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })} className="input-lg" /></Label>
          <Label text="关联业务"><input value={form.relatedBusiness} onChange={(e) => setForm({ ...form, relatedBusiness: e.target.value })} className="input-lg" /></Label>
          <Label text="备注"><textarea value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-lg min-h-24 py-3" /></Label>
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
function Label({ text, children }) {
  return <label className="block text-base font-bold text-slate-700">{text}<div className="mt-2">{children}</div></label>;
}
