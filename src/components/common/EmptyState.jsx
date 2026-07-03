export default function EmptyState({ text = "暂无数据。" }) {
  return <p className="rounded-[8px] bg-slate-50 p-5 text-lg font-bold text-slate-600">{text}</p>;
}
