import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";

const all = "全部";

export default function KnowledgeBase() {
  const demo = useDemo();
  const [category, setCategory] = useState(all);
  const [keyword, setKeyword] = useState("");
  const categories = useMemo(() => [all, ...new Set((demo.data.knowledgeBase || []).map((item) => item.category))], [demo.data.knowledgeBase]);
  const articles = (demo.data.knowledgeBase || []).filter((item) => {
    const text = `${item.title}${item.summary}${item.tags}${item.roles}${item.content}`.toLowerCase();
    return (category === all || item.category === category) && (!keyword.trim() || text.includes(keyword.trim().toLowerCase()));
  });

  function addArticle() {
    demo.updateCollection("knowledgeBase", [
      { id: `kb-${Date.now()}`, title: "新增操作手册", category: "系统操作指南", summary: "新增一条演示知识库文章。", tags: "演示,操作", roles: demo.currentRole, updatedAt: new Date().toISOString().slice(0, 10), pinned: false, content: "这里可以维护企业内部标准操作流程。" },
      ...(demo.data.knowledgeBase || [])
    ]);
  }

  function remove(id) {
    if (window.confirm("确定删除该文章吗？")) demo.updateCollection("knowledgeBase", demo.data.knowledgeBase.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-pasture-700">知识库 / 操作手册</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">行业知识库</h1>
            <p className="mt-2 text-base leading-7 text-slate-600">沉淀系统操作、奶牛管理、肉牛育肥、饲料生产、乳品厂、防疫、设备和安全生产知识。</p>
          </div>
          <button onClick={addArticle} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white"><Plus size={20} /> 新增文章</button>
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="grid gap-3 md:grid-cols-[220px_1fr]">
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="input-lg">{categories.map((item) => <option key={item}>{item}</option>)}</select>
          <label className="flex min-h-12 items-center gap-2 rounded-[8px] bg-slate-50 px-3 ring-1 ring-slate-100">
            <Search size={20} className="text-slate-500" />
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none" placeholder="搜索标题、标签、岗位..." />
          </label>
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="文章列表" />
        <div className="grid gap-3 md:grid-cols-2">
          {articles.map((item) => (
            <article key={item.id} className={`rounded-[8px] p-4 ring-1 ${item.pinned ? "bg-amber-50 ring-amber-100" : "bg-slate-50 ring-slate-100"}`}>
              <p className="text-sm font-black text-pasture-700">{item.category} · {item.updatedAt}</p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-700">{item.summary}</p>
              <p className="mt-2 text-sm font-bold text-slate-500">标签：{item.tags} · 适用岗位：{item.roles}</p>
              <button onClick={() => remove(item.id)} className="mt-3 min-h-10 rounded-[8px] bg-red-50 px-3 font-bold text-red-700"><Trash2 className="mr-1 inline" size={16} />删除</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
