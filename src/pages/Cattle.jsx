import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const cowStatuses = ["观察", "生病", "腿伤", "发烧", "产奶下降", "待兽医查看", "已恢复"];
const barnStatusHints = ["正常", "观察", "异常", "维修", "隔离"];

export default function Cattle() {
  const demo = useDemo();
  const [barnForm, setBarnForm] = useState(null);
  const [cowForm, setCowForm] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [barnFilter, setBarnFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredCows = useMemo(() => {
    return demo.data.focusCows.filter((cow) => {
      const matchKeyword = !keyword.trim() || `${cow.code}${cow.issue}${cow.note}`.includes(keyword.trim());
      const matchBarn = barnFilter === "全部" || cow.barn === barnFilter;
      const matchStatus = !statusFilter.trim() || cow.status.includes(statusFilter.trim());
      return matchKeyword && matchBarn && matchStatus;
    });
  }, [barnFilter, demo.data.focusCows, keyword, statusFilter]);

  function saveBarn() {
    if (!barnForm.name.trim()) return alert("牛舍名称不能为空");
    if (Number.isNaN(Number(barnForm.count))) return alert("牛只数量必须是数字");
    if (Number(barnForm.count) < 0) return alert("牛只数量不能为负数");
    demo.upsertBarn({ ...barnForm, count: Number(barnForm.count) });
    setBarnForm(null);
  }

  function saveCow() {
    if (!cowForm.code.trim()) return alert("牛只编号不能为空");
    if (!cowForm.issue.trim()) return alert("情况说明不能为空");
    demo.upsertFocusCow(cowForm);
    setCowForm(null);
  }

  function removeBarn(id) {
    if (window.confirm("确定删除这个牛舍吗？")) {
      demo.deleteBarn(id);
      setBarnForm(null);
    }
  }

  function removeCow(id) {
    if (window.confirm("确定删除这头关注牛只吗？")) {
      demo.deleteFocusCow(id);
      setCowForm(null);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-3xl font-bold text-slate-950">牛舍管理</h1>
        <p className="mt-2 text-lg leading-8 text-slate-600">看每个牛舍有多少头牛，哪些牛今天要特别关注。</p>
      </section>

      <section>
        <SectionTitle title="牛舍情况" action={
          <button onClick={() => setBarnForm({ name: "", count: 0, status: "正常", personInCharge: demo.data.settings.manager, note: "" })} className="rounded-full bg-pasture-700 px-4 py-3 text-lg font-bold text-white">
            新增
          </button>
        } />
        <div className="grid gap-3 md:grid-cols-2">
          {demo.data.barns.map((barn) => (
            <article key={barn.id} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-950">{barn.name}</h2>
                <StatusBadge>{barn.status}</StatusBadge>
              </div>
              <p className="mt-4 text-4xl font-bold text-pasture-700">{barn.count}<span className="ml-1 text-lg">头</span></p>
              <p className="mt-2 text-lg font-bold text-slate-700">负责人：{barn.personInCharge || "未填写"}</p>
              <p className="mt-2 text-lg leading-7 text-slate-600">{barn.note || "暂无备注"}</p>
              <button onClick={() => setBarnForm(barn)} className="mt-4 min-h-12 w-full rounded-[8px] bg-slate-100 text-lg font-bold text-slate-800">
                编辑牛舍
              </button>
            </article>
          ))}
          {!demo.data.barns.length && <p className="rounded-[8px] bg-white p-5 text-xl font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">暂无牛舍，请先新增牛舍。</p>}
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="查找关注牛只" />
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3">
            <Search size={22} className="text-slate-500" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="min-h-14 min-w-0 flex-1 bg-transparent text-lg font-bold outline-none" placeholder="按耳标号或情况搜索" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={barnFilter} onChange={(e) => setBarnFilter(e.target.value)} className="input-lg">
              <option>全部</option>
              {demo.data.barns.map((barn) => <option key={barn.id}>{barn.name}</option>)}
            </select>
            <input value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-lg" placeholder="状态关键字" />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="特别关注牛只" action={
          <button onClick={() => setCowForm({ code: "", barn: demo.data.barns[0]?.name || "", status: "观察", issue: "", personInCharge: demo.data.settings.manager, note: "" })} className="rounded-full bg-pasture-700 px-4 py-3 text-lg font-bold text-white">
            <Plus size={20} className="inline" /> 新增
          </button>
        } />
        <div className="space-y-3">
          {filteredCows.map((cow) => (
            <article key={cow.id} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-slate-950">{cow.code}</h3>
                  <p className="mt-2 text-lg leading-7 text-slate-600">{cow.issue}</p>
                  <p className="mt-1 text-base font-bold text-slate-500">{cow.barn} · {cow.personInCharge || "未填写负责人"}</p>
                </div>
                <StatusBadge>{cow.status}</StatusBadge>
              </div>
              <p className="mt-3 rounded-[8px] bg-slate-50 p-3 text-lg text-slate-700">备注：{cow.note || "无"}；更新时间：{cow.updatedAt || "未记录"}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => setCowForm(cow)} className="min-h-12 rounded-[8px] bg-slate-100 text-lg font-bold text-slate-800">编辑</button>
                <button onClick={() => removeCow(cow.id)} className="min-h-12 rounded-[8px] bg-red-50 text-lg font-bold text-red-700">删除</button>
              </div>
            </article>
          ))}
          {!filteredCows.length && <p className="rounded-[8px] bg-white p-5 text-xl font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">没有符合条件的关注牛只。</p>}
        </div>
      </section>

      {barnForm && (
        <Modal title="编辑牛舍" onClose={() => setBarnForm(null)}>
          <Label text="牛舍名称"><input value={barnForm.name} onChange={(e) => setBarnForm({ ...barnForm, name: e.target.value })} className="input-lg" /></Label>
          <Label text="牛只数量"><input type="number" value={barnForm.count} onChange={(e) => setBarnForm({ ...barnForm, count: e.target.value })} className="input-lg" /></Label>
          <Label text="状态"><input value={barnForm.status} onChange={(e) => setBarnForm({ ...barnForm, status: e.target.value })} className="input-lg" placeholder="可填正常、观察、异常、维修、隔离" /></Label>
          <div className="flex flex-wrap gap-2">{barnStatusHints.map((status) => <button key={status} type="button" onClick={() => setBarnForm({ ...barnForm, status })} className="rounded-full bg-slate-100 px-3 py-2 text-base font-bold text-slate-700">{status}</button>)}</div>
          <Label text="负责人"><input value={barnForm.personInCharge || ""} onChange={(e) => setBarnForm({ ...barnForm, personInCharge: e.target.value })} className="input-lg" /></Label>
          <Label text="备注"><input value={barnForm.note || ""} onChange={(e) => setBarnForm({ ...barnForm, note: e.target.value })} className="input-lg" /></Label>
          <button onClick={saveBarn} className="btn-primary"><Save size={22} /> 保存</button>
          {barnForm.id && <button onClick={() => removeBarn(barnForm.id)} className="btn-danger"><Trash2 size={22} /> 删除牛舍</button>}
        </Modal>
      )}

      {cowForm && (
        <Modal title="关注牛只" onClose={() => setCowForm(null)}>
          <Label text="编号"><input value={cowForm.code} onChange={(e) => setCowForm({ ...cowForm, code: e.target.value })} className="input-lg" /></Label>
          <Label text="所在牛舍"><select value={cowForm.barn} onChange={(e) => setCowForm({ ...cowForm, barn: e.target.value })} className="input-lg">{demo.data.barns.map((b) => <option key={b.id}>{b.name}</option>)}</select></Label>
          <Label text="状态"><input value={cowForm.status} onChange={(e) => setCowForm({ ...cowForm, status: e.target.value })} className="input-lg" placeholder="可自由填写，如观察、发烧、已恢复" /></Label>
          <div className="flex flex-wrap gap-2">{cowStatuses.map((status) => <button key={status} type="button" onClick={() => setCowForm({ ...cowForm, status })} className="rounded-full bg-slate-100 px-3 py-2 text-base font-bold text-slate-700">{status}</button>)}</div>
          <Label text="情况"><input value={cowForm.issue} onChange={(e) => setCowForm({ ...cowForm, issue: e.target.value })} className="input-lg" /></Label>
          <Label text="负责人"><input value={cowForm.personInCharge || ""} onChange={(e) => setCowForm({ ...cowForm, personInCharge: e.target.value })} className="input-lg" /></Label>
          <Label text="备注"><input value={cowForm.note || ""} onChange={(e) => setCowForm({ ...cowForm, note: e.target.value })} className="input-lg" /></Label>
          <button onClick={saveCow} className="btn-primary"><Save size={22} /> 保存</button>
          {cowForm.id && <button onClick={() => removeCow(cowForm.id)} className="btn-danger"><Trash2 size={22} /> 删除</button>}
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
          <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
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
