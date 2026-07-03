import { useMemo, useState } from "react";
import { Eye, Plus, Save, Search, Trash2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useDemo } from "../context/DemoContext.jsx";

export default function Cows() {
  const demo = useDemo();
  const [form, setForm] = useState(null);
  const [detail, setDetail] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [barn, setBarn] = useState("全部");
  const [status, setStatus] = useState("");
  const [watch, setWatch] = useState("全部");

  const cows = useMemo(() => demo.data.cows.filter((cow) => {
    const matchKeyword = !keyword.trim() || cow.code.includes(keyword.trim());
    const matchBarn = barn === "全部" || cow.barn === barn;
    const matchStatus = !status.trim() || cow.status.includes(status.trim());
    const matchWatch = watch === "全部" || (watch === "特别关注" ? cow.watch : !cow.watch);
    return matchKeyword && matchBarn && matchStatus && matchWatch;
  }), [barn, demo.data.cows, keyword, status, watch]);

  function emptyCow() {
    return { code: "", barn: demo.data.barns[0]?.name || "", breed: "荷斯坦", gender: "母", birthDate: "", entryDate: "", status: "健康", weight: 0, source: "自繁", personInCharge: demo.data.settings.manager, watch: false, watchReason: "", note: "" };
  }

  function saveCow() {
    if (!form.code.trim()) return alert("耳标编号不能为空");
    if (Number.isNaN(Number(form.weight))) return alert("体重必须是数字");
    demo.upsertCow({ ...form, weight: Number(form.weight || 0) });
    alert("牛只档案已保存");
    setForm(null);
  }

  function removeCow(id) {
    if (window.confirm("确定删除这头牛的档案吗？")) demo.deleteCow(id);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">牛只管理</h1>
            <p className="mt-2 text-base text-slate-600">管理耳标、牛舍、品种、状态、体重和特别关注信息。</p>
          </div>
          <button onClick={() => setForm(emptyCow())} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 新增牛只</button>
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="筛选查询" />
        <div className="grid gap-3 md:grid-cols-4">
          <div className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3">
            <Search size={20} className="text-slate-500" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="min-h-12 min-w-0 flex-1 bg-transparent font-semibold outline-none" placeholder="耳标编号" />
          </div>
          <select value={barn} onChange={(e) => setBarn(e.target.value)} className="input-lg"><option>全部</option>{demo.data.barns.map((item) => <option key={item.id}>{item.name}</option>)}</select>
          <input value={status} onChange={(e) => setStatus(e.target.value)} className="input-lg" placeholder="状态关键字" />
          <select value={watch} onChange={(e) => setWatch(e.target.value)} className="input-lg"><option>全部</option><option>特别关注</option><option>普通牛只</option></select>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        {cows.map((cow) => (
          <article key={cow.id} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">{cow.code}</h2>
                <p className="mt-1 text-base font-semibold text-slate-600">{cow.barn} · {cow.breed} · {cow.gender}</p>
              </div>
              <StatusBadge>{cow.watch ? "关注" : cow.status}</StatusBadge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-base">
              <Info label="状态" value={cow.status} />
              <Info label="体重" value={`${Number(cow.weight || 0)} kg`} />
              <Info label="来源" value={cow.source || "未填写"} />
              <Info label="负责人" value={cow.personInCharge || "未填写"} />
            </div>
            {cow.watch && <p className="mt-3 rounded-[8px] bg-amber-50 p-3 font-bold text-amber-800">关注原因：{cow.watchReason || "未填写"}</p>}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button onClick={() => setDetail(cow)} className="min-h-11 rounded-[8px] bg-sky-50 font-bold text-sky-700"><Eye size={18} className="inline" /> 详情</button>
              <button onClick={() => setForm(cow)} className="min-h-11 rounded-[8px] bg-slate-100 font-bold text-slate-800">编辑</button>
              <button onClick={() => removeCow(cow.id)} className="min-h-11 rounded-[8px] bg-red-50 font-bold text-red-700">删除</button>
            </div>
          </article>
        ))}
        {!cows.length && <p className="rounded-[8px] bg-white p-5 text-lg font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">暂无符合条件的牛只档案。</p>}
      </section>

      {form && (
        <Modal title="牛只档案" onClose={() => setForm(null)}>
          <Label text="耳标编号"><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-lg" /></Label>
          <Label text="所属牛舍"><select value={form.barn} onChange={(e) => setForm({ ...form, barn: e.target.value })} className="input-lg">{demo.data.barns.map((item) => <option key={item.id}>{item.name}</option>)}</select></Label>
          <div className="grid gap-3 md:grid-cols-2">
            <Label text="品种"><input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="input-lg" /></Label>
            <Label text="性别"><input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-lg" /></Label>
            <Label text="出生日期"><input value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className="input-lg" /></Label>
            <Label text="入场日期"><input value={form.entryDate} onChange={(e) => setForm({ ...form, entryDate: e.target.value })} className="input-lg" /></Label>
            <Label text="当前状态"><input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-lg" /></Label>
            <Label text="体重 kg"><input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="input-lg" /></Label>
          </div>
          <Label text="来源"><input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="input-lg" /></Label>
          <Label text="负责人"><input value={form.personInCharge} onChange={(e) => setForm({ ...form, personInCharge: e.target.value })} className="input-lg" /></Label>
          <label className="flex min-h-14 items-center gap-3 rounded-[8px] bg-amber-50 px-4 text-lg font-bold text-amber-900">
            <input type="checkbox" checked={Boolean(form.watch)} onChange={(e) => setForm({ ...form, watch: e.target.checked })} className="h-5 w-5" /> 设为特别关注
          </label>
          <Label text="关注原因"><input value={form.watchReason || ""} onChange={(e) => setForm({ ...form, watchReason: e.target.value })} className="input-lg" /></Label>
          <Label text="备注"><textarea value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-lg min-h-24 py-3" /></Label>
          <button onClick={saveCow} className="btn-primary"><Save size={22} /> 保存</button>
          {form.id && <button onClick={() => removeCow(form.id)} className="btn-danger"><Trash2 size={22} /> 删除</button>}
        </Modal>
      )}

      {detail && (
        <Modal title={`牛只详情 ${detail.code}`} onClose={() => setDetail(null)}>
          <div className="grid gap-2 md:grid-cols-2">
            <Info label="所属牛舍" value={detail.barn} />
            <Info label="品种" value={detail.breed} />
            <Info label="性别" value={detail.gender} />
            <Info label="出生日期" value={detail.birthDate || "未填写"} />
            <Info label="入场日期" value={detail.entryDate || "未填写"} />
            <Info label="状态" value={detail.status} />
            <Info label="体重" value={`${detail.weight || 0} kg`} />
            <Info label="更新时间" value={detail.updatedAt || "未记录"} />
          </div>
          <p className="rounded-[8px] bg-amber-50 p-3 font-bold text-amber-800">关注原因：{detail.watchReason || "无"}</p>
          <p className="rounded-[8px] bg-slate-50 p-3 text-slate-700">备注：{detail.note || "无"}</p>
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
