import { Link } from "react-router-dom";
import { QrCode, ShieldCheck } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { milkBatches, traceSteps } from "../data/mockData.js";
import { useDemo } from "../context/DemoContext.jsx";
import { demoBatches, traceChain } from "../data/demoFlow.js";

export default function Trace() {
  const demo = useDemo();
  const batches = demo.qualityDone
    ? demoBatches.map((batch) => ({
        id: batch.id,
        time: "今日早班",
        tank: batch.tank,
        status: batch.status,
        fat: batch.fat,
        protein: batch.protein,
        somatic: batch.somatic,
        bacteria: batch.bacteria,
        antibiotic: batch.antibiotic,
        temperature: batch.temperature
      }))
    : milkBatches;
  const steps = demo.traceReady ? traceChain : traceSteps;

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pasture-50 text-pasture-700">
            <ShieldCheck size={24} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-950">生产到配送全链路追溯</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              每个批次关联奶罐、质检指标、冷链温度、车辆司机和签收记录。老板演示时可直接说明质量管控价值。
            </p>
            <Link
              to="/consumer-trace"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <QrCode size={17} /> 查看消费者扫码页面
            </Link>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="批次质检" eyebrow="quality batches" />
        <div className="grid gap-3 md:grid-cols-2">
          {batches.map((batch) => (
            <article key={batch.id} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-950">{batch.id}</p>
                  <p className="mt-1 text-xs text-slate-500">生产时间 {batch.time} · {batch.tank}</p>
                </div>
                <StatusBadge>{batch.status === "异常锁定" ? "异常" : batch.status === "待质检" ? "待质检" : batch.status === "质检合格" ? "质检合格" : "合格"}</StatusBadge>
              </div>
              {demo.traceReady && (
                <div className="mt-4 grid grid-cols-[76px_1fr] gap-3 rounded-[8px] bg-slate-50 p-3">
                  <div className="grid aspect-square place-items-center rounded bg-white">
                    <QrCode size={38} className="text-slate-900" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">模拟批次二维码</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">扫码查看从早班挤奶到冷链签收的完整链路。</p>
                  </div>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Field label="脂肪" value={batch.fat} />
                <Field label="蛋白" value={batch.protein} />
                <Field label="体细胞数" value={batch.somatic} />
                <Field label="菌落总数" value={batch.bacteria} />
                <Field label="抗生素残留" value={batch.antibiotic} />
                <Field label="温度" value={batch.temperature} />
              </div>
              <ol className="mt-5 space-y-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      index < 5 ? "bg-pasture-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-[8px] bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}
