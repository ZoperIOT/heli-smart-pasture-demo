import { useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { TrendChart } from "../components/ChartCard.jsx";
import { useDemo } from "../context/DemoContext.jsx";

export default function Milk() {
  const demo = useDemo();
  const latest = demo.data.milkRecords[0] || {};
  const yesterday = demo.data.milkRecords[1] || {};
  const [form, setForm] = useState(null);
  const [noteForm, setNoteForm] = useState(null);
  const [dateKeyword, setDateKeyword] = useState("");
  const [barnFilter, setBarnFilter] = useState("全部");

  const trend = demo.data.milkRecords.slice(0, 7).reverse().map((item) => ({
    day: item.date.slice(5) || item.date,
    milk: Number(item.total || 0)
  }));
  const records = useMemo(
    () => demo.data.milkRecords.filter((item) => (!dateKeyword.trim() || item.date.includes(dateKeyword.trim())) && (barnFilter === "全部" || item.barn === barnFilter)),
    [barnFilter, dateKeyword, demo.data.milkRecords]
  );
  const change = Number(latest.total || 0) - Number(yesterday.total || 0);

  function emptyRecord() {
    return {
      date: new Date().toISOString().slice(0, 10),
      barn: demo.data.barns[0]?.name || "",
      morning: 0,
      evening: 0,
      total: 0,
      milkPrice: demo.data.settings.defaultMilkPrice || 4.2,
      recorder: demo.data.settings.defaultRecorder,
      syncIncome: false,
      note: ""
    };
  }

  function saveRecord() {
    if (!form.date.trim()) return alert("日期不能为空");
    if ([form.total, form.morning, form.evening].some((value) => Number.isNaN(Number(value)))) return alert("产奶量必须是数字");
    if ([form.total, form.morning, form.evening].some((value) => Number(value) < 0)) return alert("产奶量不能为负数");
    demo.upsertMilkRecord({ ...form, total: Number(form.total), morning: Number(form.morning), evening: Number(form.evening), milkPrice: Number(form.milkPrice || 0) });
    alert("产奶记录已保存");
    setForm(null);
  }

  function saveNote() {
    demo.upsertMilkRecord({ ...noteForm, note: noteForm.note || "" });
    setNoteForm(null);
  }

  function removeRecord(id) {
    if (window.confirm("确定删除这条产奶记录吗？")) {
      demo.deleteMilkRecord(id);
      setForm(null);
    }
  }

  function updateShift(field, value) {
    const next = { ...form, [field]: value };
    const morning = Number(field === "morning" ? value : next.morning);
    const evening = Number(field === "evening" ? value : next.evening);
    if (!Number.isNaN(morning) && !Number.isNaN(evening)) {
      next.total = Number((morning + evening).toFixed(1));
    }
    setForm(next);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-3xl font-bold text-slate-950">产奶录入</h1>
        <p className="mt-2 text-lg leading-8 text-slate-600">只记录最重要的几项：日期、早班、晚班、总量和备注。</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => setForm(latest.id ? latest : emptyRecord())} className="min-h-14 rounded-[8px] bg-pasture-700 text-xl font-bold text-white">记录今日</button>
          <button onClick={() => setForm(emptyRecord())} className="flex min-h-14 items-center justify-center gap-2 rounded-[8px] bg-slate-900 text-xl font-bold text-white"><Plus size={22} /> 新增</button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <MetricCard label="今日总量" value={Number(latest.total || 0).toFixed(1)} unit="吨" tone="green" />
        <MetricCard label="早班" value={Number(latest.morning || 0).toFixed(1)} unit="吨" tone="blue" />
        <MetricCard label="晚班" value={Number(latest.evening || 0).toFixed(1)} unit="吨" tone="amber" />
        <MetricCard label="昨日总量" value={Number(yesterday.total || 0).toFixed(1)} unit="吨" tone="sky" />
        <MetricCard label="较昨日" value={`${change >= 0 ? "+" : ""}${change.toFixed(1)}`} unit="吨" tone={change < -2 ? "red" : "green"} />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="备注" />
        <p className="text-xl leading-8 text-slate-700">{latest.note || "暂无备注"}</p>
        <p className="mt-2 text-lg font-bold text-slate-500">记录人：{latest.recorder || "未填写"}</p>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="近 7 天产奶趋势" />
        {trend.length ? <TrendChart data={trend} /> : <p className="rounded-[8px] bg-slate-50 p-4 text-lg font-bold text-slate-600">暂无产奶数据。</p>}
      </section>

      <section>
        <SectionTitle title="历史记录" />
        <div className="mb-3 grid gap-3 md:grid-cols-2">
          <input value={dateKeyword} onChange={(e) => setDateKeyword(e.target.value)} className="input-lg" placeholder="按日期筛选，例如 2026-07-02" />
          <select value={barnFilter} onChange={(e) => setBarnFilter(e.target.value)} className="input-lg"><option>全部</option>{demo.data.barns.map((barn) => <option key={barn.id}>{barn.name}</option>)}</select>
        </div>
        <div className="space-y-3">
          {records.map((item) => (
            <article key={item.id} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <button onClick={() => setForm(item)} className="flex w-full items-center justify-between gap-3 text-left">
                <div>
                  <p className="text-xl font-bold text-slate-950">{item.date}</p>
                  <p className="mt-1 text-lg text-slate-600">{item.barn || "未分配牛舍"} · 早 {item.morning} 吨 / 晚 {item.evening} 吨</p>
                  <p className="mt-1 text-base font-bold text-slate-500">记录人：{item.recorder || "未填写"}</p>
                </div>
                <p className="shrink-0 text-3xl font-bold text-pasture-700">{item.total} 吨</p>
              </button>
              <p className="mt-3 rounded-[8px] bg-slate-50 p-3 text-lg text-slate-700">备注：{item.note || "暂无备注"}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setNoteForm(item)} className="min-h-12 rounded-[8px] bg-slate-100 text-lg font-bold text-slate-800">编辑备注</button>
                <button onClick={() => removeRecord(item.id)} className="min-h-12 rounded-[8px] bg-red-50 text-lg font-bold text-red-700">删除</button>
              </div>
            </article>
          ))}
          {!records.length && <p className="rounded-[8px] bg-white p-5 text-xl font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">没有找到产奶记录。</p>}
        </div>
      </section>

      {form && (
        <Modal title="产奶记录" onClose={() => setForm(null)}>
          <Label text="日期"><input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-lg" /></Label>
          <Label text="牛舍"><select value={form.barn || ""} onChange={(e) => setForm({ ...form, barn: e.target.value })} className="input-lg">{demo.data.barns.map((barn) => <option key={barn.id}>{barn.name}</option>)}</select></Label>
          <Label text="早班（吨）"><input type="number" value={form.morning} onChange={(e) => updateShift("morning", e.target.value)} className="input-lg" /></Label>
          <Label text="晚班（吨）"><input type="number" value={form.evening} onChange={(e) => updateShift("evening", e.target.value)} className="input-lg" /></Label>
          <Label text="今日总量（吨）"><input type="number" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} className="input-lg" /></Label>
          <Label text="奶价（元/kg）"><input type="number" value={form.milkPrice || 0} onChange={(e) => setForm({ ...form, milkPrice: e.target.value })} className="input-lg" /></Label>
          <Label text="记录人"><input value={form.recorder || ""} onChange={(e) => setForm({ ...form, recorder: e.target.value })} className="input-lg" /></Label>
          <label className="flex min-h-14 items-center gap-3 rounded-[8px] bg-emerald-50 px-4 text-lg font-bold text-pasture-800">
            <input type="checkbox" checked={Boolean(form.syncIncome)} onChange={(e) => setForm({ ...form, syncIncome: e.target.checked })} className="h-5 w-5" />
            同步生成牛奶销售收入
          </label>
          <Label text="备注"><input value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-lg" /></Label>
          <button onClick={saveRecord} className="btn-primary"><Save size={22} /> 保存</button>
          {form.id && <button onClick={() => removeRecord(form.id)} className="btn-danger"><Trash2 size={22} /> 删除记录</button>}
        </Modal>
      )}

      {noteForm && (
        <Modal title="编辑备注" onClose={() => setNoteForm(null)}>
          <p className="text-lg font-bold text-slate-700">{noteForm.date} · {noteForm.total} 吨</p>
          <textarea value={noteForm.note || ""} onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })} className="input-lg min-h-32 py-3" placeholder="例如：天气较热，注意饮水和通风。" />
          <button onClick={saveNote} className="btn-primary"><Save size={22} /> 保存备注</button>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/50 p-4 pt-[max(36px,env(safe-area-inset-top))]">
      <div className="mx-auto max-w-lg rounded-[8px] bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="h-12 rounded-[8px] bg-slate-100 px-4 text-lg font-bold">关闭</button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

function Label({ text, children }) {
  return <label className="block text-lg font-bold text-slate-700">{text}<div className="mt-2">{children}</div></label>;
}
