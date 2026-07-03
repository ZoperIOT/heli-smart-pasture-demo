import { useState } from "react";
import { Pin, Plus, Save, Trash2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";

export default function Announcements() {
  const demo = useDemo();
  const [form, setForm] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("全部");
  const notices = [...demo.data.notices]
    .filter((item) => (type === "全部" || item.type === type) && (!keyword.trim() || `${item.title}${item.content}${item.author}`.includes(keyword.trim())))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  function saveNotice() {
    if (!form.title.trim()) return alert("标题不能为空");
    if (!form.content.trim()) return alert("内容不能为空");
    if (!form.author.trim()) return alert("发布人不能为空");
    demo.upsertNotice(form);
    alert("公告已保存");
    setForm(null);
  }

  function deleteNotice(id) {
    if (window.confirm("确定删除这条公告吗？")) {
      demo.deleteNotice(id);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-3xl font-bold text-slate-950">通知公告</h1>
        <p className="mt-2 text-lg leading-8 text-slate-600">给场长、饲养员、司机看的日常通知，置顶公告会显示在首页。</p>
        <button onClick={() => setForm({ title: "", content: "", author: demo.data.settings.manager || "场长", pinned: false, type: "普通通知", status: "显示" })} className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-pasture-700 text-xl font-bold text-white">
          <Plus size={22} /> 发布通知
        </button>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="筛选查询" />
        <div className="grid gap-3 md:grid-cols-2">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input-lg" placeholder="按标题、内容、发布人搜索" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-lg">
            {["全部", "普通通知", "生产提醒", "配送提醒", "库存提醒", "其他"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section>
        <SectionTitle title="全部公告" />
        {notices.length ? (
          <div className="space-y-3">
            {notices.map((notice) => (
              <article key={notice.id} className={`rounded-[8px] p-4 shadow-soft ring-1 ${notice.pinned ? "bg-amber-50 ring-amber-200" : "bg-white ring-slate-100"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  {notice.pinned && <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-3 py-1 text-base font-bold text-amber-900"><Pin size={16} /> 置顶</span>}
                  <h2 className="text-2xl font-bold text-slate-950">{notice.title}</h2>
                </div>
                <p className="mt-2 text-lg leading-8 text-slate-700">{notice.content}</p>
                <p className="mt-2 text-base font-bold text-slate-500">{notice.author} · {notice.createdAt} · {notice.type || "普通通知"} · {notice.status || "显示"}</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button onClick={() => setForm(notice)} className="min-h-12 rounded-[8px] bg-slate-100 text-lg font-bold text-slate-800">编辑</button>
                  <button onClick={() => demo.upsertNotice({ ...notice, pinned: true })} className="min-h-12 rounded-[8px] bg-amber-100 text-lg font-bold text-amber-800">置顶</button>
                  <button onClick={() => deleteNotice(notice.id)} className="min-h-12 rounded-[8px] bg-red-50 text-lg font-bold text-red-700">删除</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-[8px] bg-white p-5 text-xl font-bold text-slate-600 shadow-soft ring-1 ring-slate-100">暂无公告，点击上方按钮发布第一条通知。</p>
        )}
      </section>

      {form && (
        <Modal title="通知公告" onClose={() => setForm(null)}>
          <Label text="标题"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-lg" /></Label>
          <Label text="内容"><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-lg min-h-32 py-3" /></Label>
          <Label text="发布人"><input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input-lg" /></Label>
          <Label text="公告类型"><select value={form.type || "普通通知"} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-lg">{["普通通知", "生产提醒", "配送提醒", "库存提醒", "其他"].map((item) => <option key={item}>{item}</option>)}</select></Label>
          <Label text="状态"><select value={form.status || "显示"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-lg"><option>显示</option><option>隐藏</option></select></Label>
          <label className="flex min-h-14 items-center gap-3 rounded-[8px] bg-amber-50 px-4 text-lg font-bold text-amber-900">
            <input type="checkbox" checked={Boolean(form.pinned)} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="h-5 w-5" />
            置顶这条公告
          </label>
          <button onClick={saveNotice} className="btn-primary"><Save size={22} /> 保存</button>
          {form.id && <button onClick={() => { if (window.confirm("确定删除这条公告吗？")) { demo.deleteNotice(form.id); setForm(null); } }} className="btn-danger"><Trash2 size={22} /> 删除</button>}
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
