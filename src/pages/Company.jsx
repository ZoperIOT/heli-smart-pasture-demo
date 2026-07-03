import { Link } from "react-router-dom";
import { ArrowRight, Leaf, MapPin, Phone, ShieldCheck } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";

const sections = [
  ["公司介绍", "山东合力牧业有限公司以奶牛、肉牛养殖和鲜奶配送为核心，建设标准化牧场、冷链配送和自有门店协同体系。"],
  ["牧场环境", "牧场分区管理牛舍、饲草仓、挤奶厅、质检室和冷链装车区，强调清洁、通风、自动化与可追溯。"],
  ["奶牛养殖", "围绕耳标档案、健康监测、繁殖管理、饲喂记录和产奶批次建立数字化闭环。"],
  ["鲜奶产品", "鲜牛奶、酸奶及门店生态产品按批次入库、出库和销售，支持消费者扫码追溯。"],
  ["肉牛养殖", "肉牛育肥、称重、健康观察和出栏计划可纳入同一经营平台。"],
  ["生态循环", "粪污资源化、饲草种植和农牧循环形成可展示、可记录、可审计的绿色经营体系。"],
  ["观光研学", "面向亲子、学校和社区团体开放牧场参观、奶源科普和生态教育体验。"],
  ["联系方式", "山东省内智慧牧场示范基地，服务热线：400-000-2026，演示邮箱：demo@heli-farm.example"]
];

export default function Company() {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[8px] bg-white shadow-soft ring-1 ring-slate-100 md:grid md:grid-cols-[1.05fr_0.95fr]">
        <div className="p-5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pasture-600">
            brand + operation
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-950">
            企业展示连接真实经营管理
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            这个页面既能展示牧场品牌、产品和生态价值，也能自然引导老板进入牛只档案、产奶质检、配送协同和经营大屏。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-pasture-700 px-4 py-2.5 text-sm font-semibold text-white">
              进入经营大屏 <ArrowRight size={16} />
            </Link>
            <Link to="/delivery" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800">
              查看配送计划
            </Link>
          </div>
        </div>
        <img
          src="/images/milking-parlour.jpg"
          alt="挤奶厅"
          className="h-64 w-full object-cover md:h-full"
        />
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          [ShieldCheck, "全程质检", "批次、奶罐、温度、指标可追溯"],
          [Leaf, "生态循环", "养殖、饲草、粪污资源化闭环"],
          [MapPin, "冷链协同", "乳企客户、自有门店、团购团餐统一调度"]
        ].map(([Icon, title, desc]) => (
          <div key={title} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <Icon className="text-pasture-700" size={24} />
            <h3 className="mt-3 font-bold text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
          </div>
        ))}
      </div>

      <section>
        <SectionTitle title="企业概况模块" eyebrow="company" />
        <div className="grid gap-3 md:grid-cols-2">
          {sections.map(([title, desc]) => (
            <article key={title} className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <h3 className="font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="rounded-[8px] bg-slate-950 p-5 text-white">
        <Phone size={22} />
        <p className="mt-3 text-lg font-bold">演示声明</p>
        <p className="mt-2 text-sm leading-7 text-white/76">
          本页面为智慧牧场 demo，所有经营数据均为模拟数据。客户名称仅用于业务场景示例，不代表真实合作数据。
        </p>
      </div>
    </div>
  );
}
