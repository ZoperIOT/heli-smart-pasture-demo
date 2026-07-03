import { Plus, Trash2 } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { extendedSectionConfigs } from "../data/extendedSectionConfigs.js";
import { isReadonlyRole } from "../services/roleViewService.js";

const configs = {
  dairyCows: { unit: "合力牧业奶牛场", title: "奶牛档案", desc: "合力牧业奶牛场奶牛耳标、牛舍、品种、月龄、状态和重点关注信息。", fields: ["code", "barn", "breed", "monthAge", "status", "personInCharge"], labels: ["耳标", "牛舍", "品种", "月龄", "状态", "负责人"], sample: { code: "HL-N-NEW", barn: "A区泌乳牛舍", breed: "荷斯坦", monthAge: 30, status: "健康", watch: false, personInCharge: "刘师傅", note: "新增示例奶牛" } },
  beefCows: { unit: "欧力菲德肉牛场", title: "肉牛档案", desc: "欧力菲德肉牛场肉牛耳标、圈舍、品种、体重、育肥批次和负责人。", fields: ["code", "pen", "breed", "monthAge", "weight", "status", "batch"], labels: ["耳标", "圈舍", "品种", "月龄", "体重", "状态", "批次"], sample: { code: "OLF-R-NEW", pen: "欧力菲德肉牛育肥一区", breed: "西门塔尔", monthAge: 18, weight: 480, status: "育肥中", batch: "2026春季育肥批次", personInCharge: "周师傅", note: "新增示例肉牛" } },
  beefBatches: { unit: "欧力菲德肉牛场", title: "育肥批次", desc: "展示欧力菲德肉牛场育肥批次、入栏数量、当前数量、平均体重、成本和预计收入。", fields: ["name", "entryDate", "entryCount", "currentCount", "avgWeight", "feedCost", "expectedIncome"], labels: ["批次", "入栏日期", "入栏数", "当前数", "均重", "饲料成本", "预计收入"], sample: { name: "新增育肥批次", entryDate: new Date().toISOString().slice(0, 10), entryCount: 60, currentCount: 60, avgWeight: 420, targetOutDate: "2026-11-30", feedCost: 0, expectedIncome: 360000, note: "新增示例批次" } },
  weightRecords: { unit: "欧力菲德肉牛场", title: "体重记录", desc: "记录肉牛耳标或育肥批次的体重变化和增重情况。", fields: ["date", "target", "weight", "gain", "recorder"], labels: ["日期", "对象", "体重", "增重", "记录人"], sample: { date: new Date().toISOString().slice(0, 10), target: "2026春季育肥批次", weight: 520, gain: 12, recorder: "周师傅", note: "新增称重记录" } },
  beefSales: { unit: "欧力菲德肉牛场", title: "出栏销售", desc: "欧力菲德肉牛场出栏销售记录，可同步生成肉牛销售收入。", fields: ["date", "target", "count", "avgWeight", "unitPrice", "total", "customer"], labels: ["日期", "批次/耳标", "出栏数", "均重", "单价", "总额", "客户"], sample: { date: new Date().toISOString().slice(0, 10), target: "2026春季育肥批次", count: 10, avgWeight: 640, unitPrice: 16, total: 102400, customer: "本地肉联厂", syncLedger: true, note: "新增出栏销售" } },
  dairyFarmInventory: { unit: "合力牧业奶牛场", title: "奶牛场库存", desc: "合力牧业奶牛场饲料、兽药等库存，可来自欧力菲德饲料厂内部调拨。", fields: ["name", "category", "stock", "unit", "warningStock", "source"], labels: ["物资", "分类", "库存", "单位", "预警", "来源"], sample: { name: "奶牛精补料", category: "饲料", stock: 10, unit: "吨", warningStock: 20, source: "欧力菲德饲料厂内部调拨", note: "新增库存" } },
  beefFarmInventory: { unit: "欧力菲德肉牛场", title: "肉牛场库存", desc: "欧力菲德肉牛场饲料和物资库存，调拨来源为欧力菲德饲料厂。", fields: ["name", "category", "stock", "unit", "warningStock", "source"], labels: ["物资", "分类", "库存", "单位", "预警", "来源"], sample: { name: "育肥牛饲料", category: "饲料", stock: 18, unit: "吨", warningStock: 30, source: "欧力菲德饲料厂内部调拨", note: "新增库存" } },
  feedRawMaterials: { unit: "欧力菲德饲料厂", title: "原料库存", desc: "欧力菲德饲料厂玉米、豆粕等原料库存和预警。", fields: ["name", "category", "stock", "unit", "price", "warningStock", "supplier"], labels: ["原料", "分类", "库存", "单位", "单价", "预警", "供应商"], sample: { name: "麸皮", category: "纤维原料", stock: 40, unit: "吨", price: 1800, warningStock: 30, supplier: "本地粮贸", note: "新增原料" } },
  feedProducts: { unit: "欧力菲德饲料厂", title: "饲料成品", desc: "欧力菲德饲料厂奶牛、肉牛和通用饲料成品库存。", fields: ["name", "target", "stock", "unit", "costPrice", "warningStock", "lastProductionAt"], labels: ["饲料", "对象", "库存", "单位", "成本", "预警", "最近生产"], sample: { name: "通用精补料", target: "通用", stock: 30, unit: "吨", costPrice: 3000, warningStock: 20, lastProductionAt: new Date().toISOString().slice(0, 10), note: "新增成品" } },
  feedProductionRecords: { unit: "欧力菲德饲料厂", title: "饲料生产", desc: "欧力菲德饲料厂生产记录，体现原料消耗和成品增加的业务能力。", fields: ["date", "feedName", "quantity", "unit", "materials", "manager"], labels: ["日期", "饲料", "数量", "单位", "使用原料", "负责人"], sample: { date: new Date().toISOString().slice(0, 10), feedName: "奶牛精补料", quantity: 20, unit: "吨", materials: "玉米、豆粕、预混料", manager: "饲料厂班长", note: "新增生产记录" } },
  feedTransfers: { unit: "欧力菲德饲料厂", title: "内部调拨", desc: "欧力菲德饲料厂向合力牧业奶牛场或欧力菲德肉牛场调拨饲料。", fields: ["date", "feedName", "quantity", "unit", "from", "to", "operator"], labels: ["日期", "饲料", "数量", "单位", "调出方", "调入方", "经办人"], sample: { date: new Date().toISOString().slice(0, 10), feedName: "育肥牛饲料", quantity: 8, unit: "吨", from: "欧力菲德饲料厂", to: "欧力菲德肉牛场", operator: "陈师傅", note: "新增内部调拨" } },
  milkReceivingRecords: { unit: "欧力菲德乳品厂", title: "原奶接收", desc: "欧力菲德乳品厂接收来自合力牧业奶牛场的原奶。", fields: ["date", "sourceFarm", "amount", "truck", "receiver", "qualityChecked"], labels: ["日期", "来源牧场", "数量", "车辆", "接收人", "是否质检"], sample: { date: new Date().toISOString().slice(0, 10), sourceFarm: "合力牧业奶牛场", amount: 5, truck: "鲁G·HL004", receiver: "乳品厂接收员", qualityChecked: false, note: "新增原奶接收" } },
  milkQualityRecords: { unit: "欧力菲德乳品厂", title: "质检记录", desc: "欧力菲德乳品厂原奶质检记录，展示温度、脂肪、蛋白、菌落和合格情况。", fields: ["date", "batch", "temperature", "fat", "protein", "colony", "passed", "inspector"], labels: ["日期", "批次", "温度", "脂肪", "蛋白", "菌落", "合格", "质检员"], sample: { date: new Date().toISOString().slice(0, 10), batch: "milk-rec-1", temperature: 3.9, fat: 3.6, protein: 3.2, colony: "合格", passed: true, inspector: "质检员", note: "新增质检" } },
  dairyProductionBatches: { unit: "欧力菲德乳品厂", title: "生产批次", desc: "欧力菲德乳品厂巴氏鲜奶、酸奶等生产批次。", fields: ["date", "productName", "rawMilkUsed", "quantity", "unit", "manager"], labels: ["日期", "产品", "使用原奶", "产量", "单位", "负责人"], sample: { date: new Date().toISOString().slice(0, 10), productName: "巴氏鲜奶", rawMilkUsed: 3, quantity: 3000, unit: "瓶", manager: "乳品厂生产负责人", note: "新增生产批次" } },
  dairyProductInventory: { unit: "欧力菲德乳品厂", title: "成品库存", desc: "欧力菲德乳品厂成品库存，包含巴氏鲜奶、酸奶等。", fields: ["name", "type", "stock", "unit", "costPrice", "salePrice", "warningStock"], labels: ["产品", "类型", "库存", "单位", "成本", "售价", "预警"], sample: { name: "酸奶", type: "酸奶", stock: 800, unit: "杯", costPrice: 2.2, salePrice: 5, warningStock: 500, lastProductionAt: new Date().toISOString().slice(0, 10), note: "新增成品库存" } },
  dairySalesOrders: { unit: "欧力菲德乳品厂", title: "销售订单", desc: "欧力菲德乳品厂成品销售订单，可同步生成乳品销售收入并预留配送联动。", fields: ["date", "customer", "productName", "quantity", "unitPrice", "total", "needDelivery", "syncLedger"], labels: ["日期", "客户", "产品", "数量", "单价", "总额", "配送", "同步账本"], sample: { date: new Date().toISOString().slice(0, 10), customer: "城区自有门店", productName: "巴氏鲜奶", quantity: 500, unitPrice: 6.5, total: 3250, needDelivery: true, syncLedger: true, note: "新增销售订单" } },
  ...extendedSectionConfigs
};

export default function BusinessSection({ dataKey }) {
  const demo = useDemo();
  const config = configs[dataKey];
  const records = demo.data[dataKey] || [];
  const readonly = isReadonlyRole(demo.currentRole);

  if (!config) {
    return (
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-2xl font-bold text-slate-950">模块未配置</h1>
        <p className="mt-2 text-lg text-slate-600">当前数据键：{dataKey}</p>
      </section>
    );
  }

  function addSample() {
    const next = [{ ...config.sample, id: `${dataKey}-${Date.now()}` }, ...records];
    demo.updateCollection(dataKey, next);
    alert("已新增一条示例记录");
  }

  function removeRecord(id) {
    if (window.confirm("确定删除这条记录吗？")) {
      demo.updateCollection(dataKey, records.filter((item) => item.id !== id));
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-pasture-700">{config.unit} / 二级台账明细</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">{config.title}</h1>
            <p className="mt-2 text-base leading-7 text-slate-600">{config.desc}</p>
          </div>
          {!readonly && (
            <button onClick={addSample} className="flex min-h-11 items-center gap-2 rounded-[8px] bg-pasture-700 px-4 font-bold text-white">
              <Plus size={20} /> 新增示例
            </button>
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="记录数量" value={records.length} unit="条" />
        <MetricCard label="所属板块" value={config.unit.includes("欧力菲德") ? "欧力菲德" : "合力"} unit="" tone="blue" />
        <MetricCard label="今日记录" value={records.filter((item) => String(item.date || item.lastProductionAt || "").startsWith(new Date().toISOString().slice(0, 10))).length} unit="条" tone="amber" />
        <MetricCard label="数据来源" value="mock" unit="" tone="sky" />
      </div>

      <section className="rounded-[8px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <SectionTitle title={`${config.title}列表`} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                {config.labels.map((label) => <th key={label} className="px-3 py-2 font-black">{label}</th>)}
                <th className="px-3 py-2 font-black">备注</th>
                <th className="px-3 py-2 font-black">操作</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="bg-slate-50 text-base">
                  {config.fields.map((field) => <td key={field} className="px-3 py-3 font-bold text-slate-800">{formatValue(record[field])}</td>)}
                  <td className="px-3 py-3 text-slate-600">{record.note || "无"}</td>
                  <td className="px-3 py-3">
                    {readonly ? <span className="font-bold text-slate-400">只读</span> : (
                      <button onClick={() => removeRecord(record.id)} className="inline-flex min-h-10 items-center gap-1 rounded-[8px] bg-red-50 px-3 font-bold text-red-700">
                        <Trash2 size={16} /> 删除
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!records.length && <p className="rounded-[8px] bg-slate-50 p-5 text-lg font-bold text-slate-600">暂无数据。</p>}
      </section>
    </div>
  );
}

function formatValue(value) {
  if (typeof value === "boolean") return value ? "是" : "否";
  if (value === undefined || value === null || value === "") return "-";
  return value;
}
