import { ArrowRight, CheckCircle2, Cloud, Database, MonitorSmartphone, Server, ShieldCheck } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";

const stages = [
  { title: "当前版本：前端演示版", desc: "React + Vite + Tailwind，所有业务数据保存在 localStorage，用于演示产品架构、业务流程和页面体验。", icon: MonitorSmartphone },
  { title: "下一阶段：后端数据库版", desc: "建设 Java/Spring Boot 或 Node 服务，接入 MySQL / PostgreSQL，统一组织、权限、业务表和审计日志。", icon: Database },
  { title: "移动端扩展：小程序 / APP", desc: "面向场长、饲养员、司机、质检员提供移动工单、扫码、拍照、异常上报和消息提醒。", icon: MonitorSmartphone },
  { title: "IoT 设备接入", desc: "接入奶厅、TMR、地磅、电子耳标、智能项圈、环境传感器、摄像头和乳品厂 MES。", icon: Server },
  { title: "AI 大模型助手", desc: "接入真实大模型后，可进行自然语言查询、日报生成、风险解释、知识库问答和经营建议。", icon: ShieldCheck },
  { title: "领导驾驶舱和数据大屏", desc: "沉淀集团指标体系，形成经营总览、生产效率、成本利润、追溯质量和异常闭环看板。", icon: Cloud }
];

const plan = [
  "第一阶段：梳理业务字典、组织角色、核心表结构和演示流程，确认企业真实字段。",
  "第二阶段：建设后端 API、数据库、权限体系、操作日志和基础主数据。",
  "第三阶段：接入牧场生产、饲料厂、乳品厂、物流、财务等核心业务流程。",
  "第四阶段：接入地磅、TMR、奶厅、环境传感器、电子耳标和乳品厂 MES。",
  "第五阶段：建设 AI 经营助手、数据质量规则、报表中心和领导驾驶舱。"
];

export default function SystemPlan() {
  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-slate-950 p-6 text-white shadow-soft">
        <p className="text-sm font-black text-emerald-100">真实上线建设路线</p>
        <h1 className="mt-2 text-3xl font-bold">合力牧业农牧乳一体化平台建设方案</h1>
        <p className="mt-3 max-w-4xl text-lg leading-8 text-white/78">本页用于向企业负责人和厂商说明：当前版本是纯前端演示，但产品结构已经预留后端数据库、权限、设备接口、AI、移动端和大屏扩展路径。</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stages.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
              <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-pasture-50 text-pasture-700"><Icon size={24} /></span>
              <h3 className="mt-4 text-xl font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-600">{item.desc}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="推荐技术架构" />
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "推荐部署：腾讯云服务器 / 云数据库 / 对象存储 / CDN",
            "数据库：MySQL 或 PostgreSQL，核心业务表按组织和数据范围设计",
            "权限体系：角色 + 菜单权限 + 数据范围 + 操作审计",
            "接口体系：奶厅、TMR、地磅、乳品厂 MES、财务系统、小程序和 AI 服务",
            "设备接入：网关采集、接口同步、异常规则、消息推送",
            "数据治理：主数据、质量规则、指标口径、报表模板"
          ].map((item) => <p key={item} className="rounded-[8px] bg-slate-50 p-4 text-lg font-bold text-slate-700"><CheckCircle2 className="mr-2 inline text-pasture-700" />{item}</p>)}
        </div>
      </section>

      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title="分阶段建设计划" />
        <div className="space-y-3">
          {plan.map((item, index) => (
            <div key={item} className="flex gap-3 rounded-[8px] bg-slate-50 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pasture-700 font-black text-white">{index + 1}</span>
              <p className="text-lg font-bold leading-8 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[8px] bg-emerald-50 p-5 ring-1 ring-emerald-100">
        <SectionTitle title="预期价值" />
        <div className="grid gap-3 md:grid-cols-5">
          {["降本", "提效", "可追溯", "可分析", "可决策"].map((item) => <p key={item} className="flex min-h-16 items-center justify-center rounded-[8px] bg-white text-2xl font-black text-pasture-800">{item}<ArrowRight className="ml-2" size={20} /></p>)}
        </div>
      </section>
    </div>
  );
}
