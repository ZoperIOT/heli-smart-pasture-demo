const toneMap = {
  健康: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  关注: "bg-amber-50 text-amber-700 ring-amber-200",
  生病: "bg-red-50 text-red-700 ring-red-200",
  腿伤: "bg-red-50 text-red-700 ring-red-200",
  产奶下降: "bg-amber-50 text-amber-700 ring-amber-200",
  待兽医查看: "bg-red-50 text-red-700 ring-red-200",
  已合格: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  合格: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  质检合格: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  可追溯: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  已刷新: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  已生成: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  已入库: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  已安排: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  正常: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  已签收: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  配送中: "bg-sky-50 text-sky-700 ring-sky-200",
  待质检: "bg-amber-50 text-amber-700 ring-amber-200",
  待装车: "bg-amber-50 text-amber-700 ring-amber-200",
  待签收: "bg-amber-50 text-amber-700 ring-amber-200",
  待配送: "bg-amber-50 text-amber-700 ring-amber-200",
  已到达: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  空闲: "bg-slate-100 text-slate-700 ring-slate-200",
  维修中: "bg-red-50 text-red-700 ring-red-200",
  停用: "bg-red-50 text-red-700 ring-red-200",
  观察: "bg-amber-50 text-amber-700 ring-amber-200",
  待配种: "bg-violet-50 text-violet-700 ring-violet-200",
  育肥中: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  偏低: "bg-orange-50 text-orange-700 ring-orange-200",
  即将过期: "bg-red-50 text-red-700 ring-red-200",
  治疗: "bg-red-50 text-red-700 ring-red-200",
  异常: "bg-red-50 text-red-700 ring-red-200",
  异常锁定: "bg-red-50 text-red-700 ring-red-200",
  已出库: "bg-slate-100 text-slate-700 ring-slate-200"
};

export default function StatusBadge({ children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-base font-bold ring-1 ${
        toneMap[children] || "bg-slate-100 text-slate-700 ring-slate-200"
      }`}
    >
      {children}
    </span>
  );
}
