import { createContext, useContext, useState } from "react";
import {
  clearFarmData,
  exportAllData,
  loadFarmData,
  saveFarmData
} from "../services/farmStorage.js";
import { buildMobileModules, mobileModuleKeys } from "../data/mobileData.js";

const todayText = new Date().toISOString().slice(0, 10);
const monthText = todayText.slice(0, 7);
const nowText = () => new Date().toLocaleString("zh-CN", { hour12: false });

function buildAuditLog({ operator = "系统", module = "系统", action = "状态变更", objectName = "", objectId = "", summary = "", roleView = "员工", note = "" }) {
  return {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    operator,
    operatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    module,
    action,
    objectName,
    objectId,
    summary,
    roleView,
    note
  };
}

export const defaultFarmData = {
  settings: {
    farmName: "合力牧业员工端作业系统演示版",
    manager: "场长",
    phone: "13800000000",
    defaultMilkPrice: 4.2,
    defaultDeliveryType: "门店",
    defaultRecorder: "值班员",
    defaultInventoryWarning: 20,
    currentRole: "员工",
    currentWorkMode: "员工端"
  },
  notices: [
    { id: "notice-1", title: "B 区牛舍下午巡检", content: "请 15:00 前完成 B 区牛舍采食、饮水、通风检查。", author: "场长", createdAt: nowText(), pinned: true, type: "生产提醒", status: "显示" },
    { id: "notice-2", title: "欧力菲德饲料厂库存补货提醒", content: "奶牛精补料库存接近预警值，采购员本周内确认原料供应商报价。", author: "库管", createdAt: nowText(), pinned: false, type: "库存提醒", status: "显示" },
    { id: "notice-3", title: "下午配送车辆安排", content: "鲁G·HL004 下午可安排学校食堂配送。", author: "调度", createdAt: nowText(), pinned: false, type: "配送提醒", status: "显示" }
  ],
  barns: [
    { id: "barn-a", code: "HL-B-001", name: "A区泌乳牛舍", count: 320, status: "正常", personInCharge: "刘师傅", location: "牧场东区", environmentNote: "温湿度正常，风机运行正常", lastCheckAt: todayText + " 07:30", note: "泌乳牛为主" },
    { id: "barn-b", code: "HL-B-002", name: "B区泌乳牛舍", count: 285, status: "观察", personInCharge: "赵师傅", location: "牧场南区", environmentNote: "上午温度偏高，注意通风", lastCheckAt: todayText + " 08:10", note: "近期有几头牛需要观察" },
    { id: "barn-c", code: "HL-B-003", name: "C区青年牛舍", count: 198, status: "正常", personInCharge: "孙师傅", location: "牧场西区", environmentNote: "垫料干燥", lastCheckAt: todayText + " 07:45", note: "青年牛" },
    { id: "barn-beef", code: "OLF-B-001", name: "欧力菲德肉牛育肥区", count: 430, status: "正常", personInCharge: "周师傅", location: "欧力菲德肉牛场北区", environmentNote: "采食稳定", lastCheckAt: todayText + " 08:20", note: "育肥中" }
  ],
  cows: [
    { id: "cow-1", code: "A-1028", barn: "A区泌乳牛舍", breed: "荷斯坦", gender: "母", birthDate: "2022-03-11", entryDate: "2022-10-01", status: "生病", weight: 610, source: "自繁", personInCharge: "刘师傅", watch: true, watchReason: "乳房炎观察中", note: "晚班再看一次", updatedAt: nowText() },
    { id: "cow-2", code: "B-0876", barn: "B区泌乳牛舍", breed: "荷斯坦", gender: "母", birthDate: "2021-09-18", entryDate: "2022-02-10", status: "腿伤", weight: 590, source: "外购", personInCharge: "赵师傅", watch: true, watchReason: "腿伤，减少活动", note: "已联系兽医", updatedAt: nowText() },
    { id: "cow-3", code: "C-0312", barn: "C区青年牛舍", breed: "西门塔尔", gender: "母", birthDate: "2024-01-12", entryDate: "2024-06-01", status: "观察", weight: 420, source: "自繁", personInCharge: "孙师傅", watch: true, watchReason: "采食量下降", note: "", updatedAt: nowText() },
    { id: "cow-4", code: "A-1160", barn: "A区泌乳牛舍", breed: "荷斯坦", gender: "母", birthDate: "2020-12-02", entryDate: "2021-06-15", status: "产奶下降", weight: 625, source: "自繁", personInCharge: "刘师傅", watch: true, watchReason: "产奶量明显下降", note: "明早复核", updatedAt: nowText() },
    { id: "cow-5", code: "D-2088", barn: "欧力菲德肉牛育肥区", breed: "西门塔尔", gender: "公", birthDate: "2023-11-20", entryDate: "2024-04-15", status: "育肥中", weight: 530, source: "外购", personInCharge: "周师傅", watch: false, watchReason: "", note: "育肥情况稳定", updatedAt: nowText() }
  ],
  watchCows: [
    { id: "watch-1", code: "A-1028", barn: "A区泌乳牛舍", status: "生病", issue: "乳房炎观察中", personInCharge: "刘师傅", note: "晚班再看一次", updatedAt: nowText() },
    { id: "watch-2", code: "B-0876", barn: "B区泌乳牛舍", status: "腿伤", issue: "腿伤，减少活动", personInCharge: "赵师傅", note: "已联系兽医", updatedAt: nowText() },
    { id: "watch-3", code: "C-0312", barn: "C区青年牛舍", status: "观察", issue: "采食量下降，需要观察", personInCharge: "孙师傅", note: "", updatedAt: nowText() },
    { id: "watch-4", code: "A-1160", barn: "A区泌乳牛舍", status: "产奶下降", issue: "产奶量明显下降", personInCharge: "刘师傅", note: "明早复核", updatedAt: nowText() }
  ],
  milkRecords: [
    { id: "milk-today", date: todayText, barn: "A区泌乳牛舍", total: 18.6, morning: 10.2, evening: 8.4, milkPrice: 4.2, recorder: "值班员", syncIncome: true, ledgerId: "ledger-milk-today", note: "今日产奶稳定" },
    { id: "milk-1", date: "2026-06-28", barn: "A区泌乳牛舍", total: 18.3, morning: 10.0, evening: 8.3, milkPrice: 4.2, recorder: "值班员", syncIncome: false, ledgerId: "", note: "" },
    { id: "milk-2", date: "2026-06-27", barn: "B区泌乳牛舍", total: 18.7, morning: 10.4, evening: 8.3, milkPrice: 4.2, recorder: "值班员", syncIncome: false, ledgerId: "", note: "" },
    { id: "milk-3", date: "2026-06-26", barn: "A区泌乳牛舍", total: 18.0, morning: 9.7, evening: 8.3, milkPrice: 4.2, recorder: "值班员", syncIncome: false, ledgerId: "", note: "" },
    { id: "milk-4", date: "2026-06-25", barn: "B区泌乳牛舍", total: 18.4, morning: 10.0, evening: 8.4, milkPrice: 4.2, recorder: "值班员", syncIncome: false, ledgerId: "", note: "" },
    { id: "milk-5", date: "2026-06-24", barn: "A区泌乳牛舍", total: 18.1, morning: 9.8, evening: 8.3, milkPrice: 4.2, recorder: "值班员", syncIncome: false, ledgerId: "", note: "" },
    { id: "milk-6", date: "2026-06-23", barn: "B区泌乳牛舍", total: 17.8, morning: 9.6, evening: 8.2, milkPrice: 4.2, recorder: "值班员", syncIncome: false, ledgerId: "", note: "" }
  ],
  deliveries: [
    { id: "del-1", taskNo: "YN-001", businessType: "原奶配送", startPoint: "合力牧业奶牛场", endPoint: "欧力菲德乳品厂", goodsName: "原奶", name: "合力牧业奶牛场 -> 欧力菲德乳品厂", type: "原奶配送", amount: 8.0, unit: "吨", status: "配送中", truckId: "truck-1", driver: "王师傅", createdAt: todayText + " 08:10", plannedAt: todayText + " 09:00", arrivedAt: "", fee: 360, syncExpense: false, ledgerId: "", note: "原奶入厂配送" },
    { id: "del-2", taskNo: "PS-002", name: "城区一店", type: "门店", amount: 1.5, unit: "吨", status: "已到达", truckId: "truck-2", driver: "李师傅", createdAt: todayText + " 08:20", plannedAt: todayText + " 09:30", arrivedAt: todayText + " 10:15", fee: 80, syncExpense: true, ledgerId: "ledger-del-2", note: "已到达" },
    { id: "del-3", taskNo: "PS-003", name: "学校食堂", type: "食堂", amount: 1.2, unit: "吨", status: "待配送", truckId: "", driver: "", createdAt: todayText + " 08:25", plannedAt: todayText + " 14:30", arrivedAt: "", fee: 120, syncExpense: false, ledgerId: "", note: "下午配送" },
    { id: "del-4", taskNo: "FD-001", businessType: "饲料调拨", startPoint: "欧力菲德饲料厂", endPoint: "合力牧业奶牛场", goodsName: "奶牛精补料", name: "欧力菲德饲料厂 -> 合力牧业奶牛场", type: "饲料调拨", amount: 12, unit: "吨", status: "配送中", truckId: "truck-3", driver: "张师傅", createdAt: todayText + " 08:40", plannedAt: todayText + " 10:30", arrivedAt: "", fee: 110, syncExpense: false, ledgerId: "", note: "内部调拨奶牛精补料" }
  ],
  trucks: [
    { id: "truck-1", plate: "鲁G·HL001", driver: "王师傅", phone: "13800000001", status: "配送中", currentTask: "雀巢乳品客户", capacity: 10, recentDeliveryAt: todayText + " 09:05", location: "去雀巢路上", cargo: "鲜牛奶", load: 8.0, note: "无异常" },
    { id: "truck-2", plate: "鲁G·HL002", driver: "李师傅", phone: "13800000002", status: "空闲", currentTask: "", capacity: 3, recentDeliveryAt: todayText + " 10:15", location: "牧场", cargo: "空车", load: 0, note: "城区一店已到达" },
    { id: "truck-3", plate: "鲁G·HL003", driver: "张师傅", phone: "13800000003", status: "配送中", currentTask: "社区团购点", capacity: 3, recentDeliveryAt: todayText + " 10:35", location: "去社区团购点", cargo: "鲜牛奶", load: 1.3, note: "无异常" },
    { id: "truck-4", plate: "鲁G·HL004", driver: "陈师傅", phone: "13800000004", status: "空闲", currentTask: "", capacity: 5, recentDeliveryAt: "2026-06-28 16:20", location: "牧场", cargo: "空车", load: 0, note: "等待安排" }
  ],
  materials: [
    { id: "mat-1", name: "全价奶牛料", category: "饲料", stock: 18, unit: "吨", warningStock: 20, price: 3200, supplier: "潍坊饲料厂", lastInAt: todayText, lastOutAt: todayText, note: "低于预警" },
    { id: "mat-2", name: "青贮饲料", category: "饲料", stock: 160, unit: "吨", warningStock: 80, price: 420, supplier: "本地合作社", lastInAt: "2026-06-25", lastOutAt: todayText, note: "" },
    { id: "mat-3", name: "乳房炎用药", category: "兽药", stock: 36, unit: "盒", warningStock: 20, price: 86, supplier: "兽药公司", lastInAt: "2026-06-26", lastOutAt: todayText, note: "" },
    { id: "mat-4", name: "消毒液", category: "消毒用品", stock: 12, unit: "桶", warningStock: 15, price: 120, supplier: "防疫用品商", lastInAt: "2026-06-20", lastOutAt: "2026-06-28", note: "需要补货" },
    { id: "mat-5", name: "车辆机油", category: "车辆用品", stock: 24, unit: "桶", warningStock: 10, price: 180, supplier: "汽配供应商", lastInAt: "2026-06-18", lastOutAt: "2026-06-27", note: "" }
  ],
  stockInRecords: [
    { id: "in-1", date: todayText, materialId: "mat-1", materialName: "全价奶牛料", category: "饲料", quantity: 8, unit: "吨", price: 3200, total: 25600, supplier: "潍坊饲料厂", operator: "库管", syncLedger: true, ledgerId: "ledger-in-1", note: "上午入库" },
    { id: "in-2", date: "2026-06-26", materialId: "mat-3", materialName: "乳房炎用药", category: "兽药", quantity: 20, unit: "盒", price: 86, total: 1720, supplier: "兽药公司", operator: "库管", syncLedger: true, ledgerId: "ledger-in-2", note: "" }
  ],
  stockOutRecords: [
    { id: "out-1", date: todayText, materialId: "mat-1", materialName: "全价奶牛料", category: "饲料", quantity: 6, unit: "吨", purpose: "日常饲喂", receiver: "刘师傅", operator: "库管", note: "" },
    { id: "out-2", date: todayText, materialId: "mat-4", materialName: "消毒液", category: "消毒用品", quantity: 2, unit: "桶", purpose: "挤奶厅消毒", receiver: "赵师傅", operator: "库管", note: "" }
  ],
  ledgerRecords: [
    { id: "ledger-milk-today", date: todayText, businessUnit: "合力牧业奶牛场", type: "收入", category: "原奶销售", amount: 78120, operator: "值班员", relatedBusiness: "产奶记录", relatedId: "milk-today", note: "合力牧业奶牛场原奶销售收入自动同步" },
    { id: "ledger-del-2", date: todayText, businessUnit: "集团", type: "支出", category: "车辆油费", amount: 80, operator: "调度", relatedBusiness: "配送任务", relatedId: "del-2", note: "城区一店配送费用" },
    { id: "ledger-in-1", date: todayText, businessUnit: "欧力菲德饲料厂", type: "支出", category: "饲料原料采购", amount: 25600, operator: "库管", relatedBusiness: "采购记录", relatedId: "in-1", note: "欧力菲德饲料厂玉米豆粕采购" },
    { id: "ledger-in-2", date: "2026-06-26", businessUnit: "合力牧业奶牛场", type: "支出", category: "兽药疫苗", amount: 1720, operator: "库管", relatedBusiness: "入库记录", relatedId: "in-2", note: "合力牧业奶牛场乳房炎用药采购" },
    { id: "ledger-beef-sale-1", date: `${monthText}-20`, businessUnit: "欧力菲德肉牛场", type: "收入", category: "肉牛销售", amount: 186000, operator: "财务", relatedBusiness: "出栏销售", relatedId: "beef-sale-1", note: "欧力菲德肉牛场育肥批次出栏销售" },
    { id: "ledger-dairy-sale-1", date: todayText, businessUnit: "欧力菲德乳品厂", type: "收入", category: "乳品销售", amount: 42800, operator: "销售", relatedBusiness: "销售订单", relatedId: "dairy-order-1", note: "巴氏鲜奶和酸奶销售订单" }
  ],
  dairyCows: [
    { id: "dairy-cow-1", code: "HL-N-1028", barn: "A区泌乳牛舍", breed: "荷斯坦", monthAge: 48, status: "泌乳期", watch: true, personInCharge: "刘师傅", note: "乳房炎观察后恢复中" },
    { id: "dairy-cow-2", code: "HL-N-1160", barn: "B区泌乳牛舍", breed: "荷斯坦", monthAge: 62, status: "产奶下降", watch: true, personInCharge: "赵师傅", note: "明早复核产奶量" },
    { id: "dairy-cow-3", code: "HL-N-1386", barn: "A区泌乳牛舍", breed: "荷斯坦", monthAge: 36, status: "健康", watch: false, personInCharge: "刘师傅", note: "高产牛" }
  ],
  beefCows: [
    { id: "beef-cow-1", code: "OLF-R-2088", pen: "欧力菲德肉牛育肥一区", breed: "西门塔尔", monthAge: 22, weight: 530, status: "育肥中", batch: "2026春季育肥批次", personInCharge: "周师傅", note: "采食稳定" },
    { id: "beef-cow-2", code: "OLF-R-2190", pen: "欧力菲德肉牛育肥二区", breed: "夏洛莱", monthAge: 20, weight: 505, status: "育肥中", batch: "2026春季育肥批次", personInCharge: "周师傅", note: "" }
  ],
  beefBatches: [
    { id: "beef-batch-1", name: "2026春季育肥批次", entryDate: "2026-03-15", entryCount: 220, currentCount: 216, avgWeight: 518, avgDailyGain: 1.18, targetOutDate: "2026-09-30", feedCost: 286000, expectedIncome: 1480000, note: "欧力菲德肉牛场主力育肥批次" }
  ],
  weightRecords: [
    { id: "weight-1", date: todayText, target: "2026春季育肥批次", previousWeight: 500, weight: 518, gain: 18, avgDailyGain: 1.2, recorder: "周师傅", note: "较上次称重稳步增加" }
  ],
  beefSales: [
    { id: "beef-sale-1", date: `${monthText}-20`, target: "2025冬季育肥批次", count: 18, avgWeight: 650, unitPrice: 15.9, total: 186000, customer: "本地肉联厂", syncLedger: true, ledgerId: "ledger-beef-sale-1", note: "欧力菲德肉牛场出栏销售" }
  ],
  dairyFarmInventory: [
    { id: "dairy-inv-1", name: "奶牛精补料", category: "饲料", stock: 28, unit: "吨", warningStock: 20, source: "欧力菲德饲料厂内部调拨", note: "来自 FD-001 调拨" },
    { id: "dairy-inv-2", name: "乳房炎用药", category: "兽药", stock: 36, unit: "盒", warningStock: 20, source: "外购", note: "" }
  ],
  beefFarmInventory: [
    { id: "beef-inv-1", name: "育肥牛饲料", category: "饲料", stock: 46, unit: "吨", warningStock: 30, source: "欧力菲德饲料厂内部调拨", note: "用于春季育肥批次" }
  ],
  feedRawMaterials: [
    { id: "raw-1", name: "玉米", category: "能量原料", stock: 320, unit: "吨", price: 2350, warningStock: 120, supplier: "山东粮贸公司", lastInAt: todayText, note: "" },
    { id: "raw-2", name: "豆粕", category: "蛋白原料", stock: 65, unit: "吨", price: 3880, warningStock: 80, supplier: "港口贸易商", lastInAt: "2026-06-28", note: "低于预警" }
  ],
  feedProducts: [
    { id: "feed-1", name: "奶牛精补料", target: "奶牛", stock: 86, unit: "吨", costPrice: 3180, warningStock: 60, lastProductionAt: todayText, note: "供应合力牧业奶牛场" },
    { id: "feed-2", name: "育肥牛饲料", target: "肉牛", stock: 112, unit: "吨", costPrice: 2860, warningStock: 80, lastProductionAt: todayText, note: "供应欧力菲德肉牛场" }
  ],
  feedProductionRecords: [
    { id: "feed-prod-1", date: todayText, feedName: "奶牛精补料", quantity: 28, unit: "吨", materials: "玉米、豆粕、预混料", manager: "饲料厂班长", note: "欧力菲德饲料厂今日生产" },
    { id: "feed-prod-2", date: todayText, feedName: "育肥牛饲料", quantity: 32, unit: "吨", materials: "玉米、麦麸、豆粕", manager: "饲料厂班长", note: "供应欧力菲德肉牛场" }
  ],
  feedTransfers: [
    { id: "transfer-1", date: todayText, feedName: "奶牛精补料", quantity: 12, unit: "吨", from: "欧力菲德饲料厂", to: "合力牧业奶牛场", operator: "张师傅", note: "欧力菲德饲料厂向合力牧业奶牛场调拨奶牛精补料" },
    { id: "transfer-2", date: todayText, feedName: "育肥牛饲料", quantity: 16, unit: "吨", from: "欧力菲德饲料厂", to: "欧力菲德肉牛场", operator: "陈师傅", note: "欧力菲德饲料厂向欧力菲德肉牛场调拨育肥牛饲料" }
  ],
  milkReceivingRecords: [
    { id: "milk-rec-1", date: todayText, sourceFarm: "合力牧业奶牛场", amount: 8.0, truck: "鲁G·HL001", receiver: "乳品厂接收员", qualityChecked: true, note: "合力牧业奶牛场原奶配送到欧力菲德乳品厂" }
  ],
  milkQualityRecords: [
    { id: "quality-1", date: todayText, batch: "milk-rec-1", temperature: 3.8, fat: 3.7, protein: 3.2, colony: "合格", passed: true, inspector: "质检员", note: "原奶质检合格" }
  ],
  dairyProductionBatches: [
    { id: "dairy-prod-1", date: todayText, productName: "巴氏鲜奶", rawMilkUsed: 5.2, quantity: 5200, unit: "瓶", manager: "乳品厂生产负责人", note: "欧力菲德乳品厂巴氏鲜奶生产批次" },
    { id: "dairy-prod-2", date: todayText, productName: "酸奶", rawMilkUsed: 1.8, quantity: 2600, unit: "杯", manager: "乳品厂生产负责人", note: "欧力菲德乳品厂酸奶生产批次" }
  ],
  dairyProductInventory: [
    { id: "dairy-stock-1", name: "巴氏鲜奶", type: "鲜奶", stock: 4200, unit: "瓶", costPrice: 3.1, salePrice: 6.5, warningStock: 1000, lastProductionAt: todayText, note: "" },
    { id: "dairy-stock-2", name: "酸奶", type: "酸奶", stock: 2100, unit: "杯", costPrice: 2.2, salePrice: 5.0, warningStock: 800, lastProductionAt: todayText, note: "" }
  ],
  dairySalesOrders: [
    { id: "dairy-order-1", date: todayText, customer: "城区自有门店", productName: "巴氏鲜奶", quantity: 1200, unitPrice: 6.5, total: 7800, needDelivery: true, syncLedger: true, ledgerId: "ledger-dairy-sale-1", note: "欧力菲德乳品厂成品销售订单" },
    { id: "dairy-order-2", date: todayText, customer: "社区团购客户", productName: "酸奶", quantity: 900, unitPrice: 5.0, total: 4500, needDelivery: true, syncLedger: false, ledgerId: "", note: "" }
  ],
  ...buildMobileModules()
};

const DemoContext = createContext(null);

function normalizeData(data) {
  const source = data || defaultFarmData;
  const cows = (source.cows || defaultFarmData.cows).map((item) => ({ breed: "", gender: "母", birthDate: "", entryDate: "", weight: 0, source: "", watch: false, watchReason: "", note: "", updatedAt: "", ...item }));
  const watchCows = (source.watchCows || source.focusCows || cows.filter((cow) => cow.watch).map((cow) => ({
    id: `watch-${cow.id}`,
    code: cow.code,
    barn: cow.barn,
    status: cow.status,
    issue: cow.watchReason,
    personInCharge: cow.personInCharge,
    note: cow.note,
    updatedAt: cow.updatedAt
  }))).map((item) => ({ personInCharge: "", note: "", updatedAt: "", ...item }));
  return {
    ...defaultFarmData,
    ...source,
    settings: { ...defaultFarmData.settings, ...(source.settings || {}), farmName: defaultFarmData.settings.farmName },
    notices: (source.notices || source.announcements || defaultFarmData.notices).map((item) => ({ pinned: false, type: "普通通知", status: "显示", ...item })),
    announcements: source.announcements || source.notices || defaultFarmData.notices,
    barns: (source.barns || defaultFarmData.barns).map((item) => ({ code: "", personInCharge: "", location: "", environmentNote: "", lastCheckAt: "", note: "", ...item })),
    cows,
    watchCows,
    focusCows: watchCows,
    milkRecords: (source.milkRecords || defaultFarmData.milkRecords).map((item) => ({ barn: "", milkPrice: Number(source.settings?.defaultMilkPrice || defaultFarmData.settings.defaultMilkPrice), recorder: "", syncIncome: false, ledgerId: "", note: "", ...item })),
    deliveries: (source.deliveries || source.deliveryTasks || defaultFarmData.deliveries).map((item) => ({ taskNo: "", unit: "吨", createdAt: "", plannedAt: "", arrivedAt: "", driver: "", fee: 0, syncExpense: false, ledgerId: "", note: "", ...item })),
    deliveryTasks: source.deliveryTasks || source.deliveries || defaultFarmData.deliveries,
    trucks: (source.trucks || defaultFarmData.trucks).map((item) => ({ phone: "", currentTask: "", capacity: 0, recentDeliveryAt: "", location: "牧场", cargo: "空车", load: 0, note: "", ...item, status: item.status === "已到达" ? "空闲" : item.status })),
    materials: (source.materials || defaultFarmData.materials).map((item) => ({ stock: 0, warningStock: 0, price: 0, supplier: "", lastInAt: "", lastOutAt: "", note: "", ...item })),
    stockInRecords: source.stockInRecords || defaultFarmData.stockInRecords,
    stockOutRecords: source.stockOutRecords || defaultFarmData.stockOutRecords,
    ledgerRecords: (source.ledgerRecords || defaultFarmData.ledgerRecords).map((item) => ({ businessUnit: "集团", ...item })),
    currentUser: { ...defaultFarmData.currentUser, ...(source.currentUser || {}) },
    roles: source.roles || defaultFarmData.roles,
    dairyCows: source.dairyCows || defaultFarmData.dairyCows,
    beefCows: source.beefCows || defaultFarmData.beefCows,
    beefBatches: source.beefBatches || defaultFarmData.beefBatches,
    weightRecords: source.weightRecords || defaultFarmData.weightRecords,
    beefSales: source.beefSales || defaultFarmData.beefSales,
    dairyFarmInventory: source.dairyFarmInventory || defaultFarmData.dairyFarmInventory,
    beefFarmInventory: source.beefFarmInventory || defaultFarmData.beefFarmInventory,
    feedRawMaterials: source.feedRawMaterials || defaultFarmData.feedRawMaterials,
    feedProducts: source.feedProducts || defaultFarmData.feedProducts,
    feedProductionRecords: source.feedProductionRecords || defaultFarmData.feedProductionRecords,
    feedTransfers: source.feedTransfers || defaultFarmData.feedTransfers,
    milkReceivingRecords: source.milkReceivingRecords || defaultFarmData.milkReceivingRecords,
    milkQualityRecords: source.milkQualityRecords || defaultFarmData.milkQualityRecords,
    dairyProductionBatches: source.dairyProductionBatches || defaultFarmData.dairyProductionBatches,
    dairyProductInventory: source.dairyProductInventory || defaultFarmData.dairyProductInventory,
    dairySalesOrders: source.dairySalesOrders || defaultFarmData.dairySalesOrders,
    ...Object.fromEntries(mobileModuleKeys.map((key) => [key, source[key] || defaultFarmData[key] || []])),
    mobileTasks: (source.mobileTasks || []).some((item) => item.type && item.title) ? source.mobileTasks : defaultFarmData.mobileTasks,
    workOrders: (source.workOrders || []).some((item) => item.code || item.no) ? source.workOrders : defaultFarmData.workOrders,
    messages: (source.messages || []).some((item) => item.relatedBusiness || item.receiver) ? source.messages : defaultFarmData.messages
  };
}

function addOrUpdateLedger(records, ledger) {
  return records.some((item) => item.id === ledger.id)
    ? records.map((item) => (item.id === ledger.id ? ledger : item))
    : [ledger, ...records];
}

function removeLedger(records, ledgerId) {
  return ledgerId ? records.filter((item) => item.id !== ledgerId) : records;
}

function adjustMaterial(materials, materialId, delta, patch = {}) {
  return materials.map((item) =>
    item.id === materialId
      ? { ...item, ...patch, stock: Math.max(0, Number(item.stock || 0) + Number(delta || 0)) }
      : item
  );
}

function withAudit(current, log) {
  return {
    ...current,
    operationLogs: [log, ...(current.operationLogs || [])].slice(0, 300)
  };
}

function nextCowStatus(eventType, currentStatus) {
  const map = {
    疾病: "治疗中",
    用药: "治疗中",
    隔离: "隔离中",
    治愈: "正常",
    配种: "待妊检",
    妊检: "怀孕",
    出栏: "已出栏",
    死亡: "死亡",
    淘汰: "已淘汰"
  };
  return map[eventType] || currentStatus;
}

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
}

function nextCode(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

function getActor(data) {
  return data.currentUser || { name: "刘师傅", role: "员工", organizationId: "org-dairy", organizationName: "合力牧业奶牛场" };
}

function assertWritable(data) {
  if (getActor(data).role === "只读访客") {
    throw new Error("当前为只读演示模式，不能执行该操作。");
  }
}

function assertAdmin(data) {
  assertWritable(data);
  if (getActor(data).role !== "管理员") {
    throw new Error("只有管理员可以执行该操作。");
  }
}

function withMobileMeta(current, patch = {}) {
  const actor = getActor(current);
  return {
    id: patch.id || nextId("mobile"),
    code: patch.code || nextCode("M"),
    organizationId: patch.organizationId || actor.organizationId,
    organizationName: patch.organizationName || actor.organizationName,
    status: patch.status || "已提交",
    createdAt: patch.createdAt || nowText(),
    updatedAt: nowText(),
    createdBy: patch.createdBy || actor.name,
    remark: patch.remark || "",
    ...patch
  };
}

function createMyRecord(current, { type, title, status = "已提交", relatedId, organizationName, remark = "" }) {
  const actor = getActor(current);
  return withMobileMeta(current, {
    id: nextId("my"),
    code: nextCode("MY"),
    type,
    title,
    status,
    relatedId,
    organizationId: actor.organizationId,
    organizationName: organizationName || actor.organizationName,
    createdBy: actor.name,
    remark
  });
}

function createMobileMessage(current, { title, type, content, priority = "普通", relatedBusiness, relatedId, receiver = "管理员", organizationName }) {
  const actor = getActor(current);
  return withMobileMeta(current, {
    id: nextId("msg"),
    code: nextCode("MSG"),
    title,
    type,
    content,
    priority,
    relatedBusiness,
    relatedId,
    receiver,
    businessUnit: organizationName || actor.organizationName,
    organizationId: actor.organizationId,
    organizationName: organizationName || actor.organizationName,
    status: "未读",
    createdBy: "系统"
  });
}

function createMobileWorkOrder(current, { type, title, content, source = "system", handler = "管理员", priority = "重要", relatedBusiness, relatedObject, organizationName, organizationId, deadline, operationRequirement = "", requirePhoto = false, requireReview = false, remark = "" }) {
  const actor = getActor(current);
  const id = nextId("wo");
  const createdAt = nowText();
  const finalDeadline = deadline || `${todayText} 18:00`;
  return {
    id,
    code: nextCode("WO"),
    no: nextCode("WO"),
    source,
    type,
    title,
    content,
    status: "待处理",
    priority,
    initiator: actor.name,
    handler,
    businessUnit: organizationName || actor.organizationName,
    organizationId: organizationId || actor.organizationId,
    organizationName: organizationName || actor.organizationName,
    relatedBusiness,
    relatedObject: relatedObject || relatedBusiness || "",
    operationRequirement,
    requirePhoto,
    requireReview,
    createdAt,
    deadline: finalDeadline,
    plannedAt: finalDeadline,
    processLog: `${createdAt} ${actor.name} 提交，系统自动生成工单`,
    result: "",
    resultSubmittedAt: "",
    resultPhoto: "",
    resultException: "",
    reviewer: "",
    updatedAt: createdAt,
    createdBy: actor.name,
    updatedBy: actor.name,
    remark
  };
}

function asSmartWorkOrder(order) {
  return {
    ...order,
    type: order.type?.includes("工单") ? order.type : `${order.type || "业务"}工单`,
    relatedObject: order.relatedBusiness || order.content,
    no: order.no || order.code,
    deadline: order.deadline || order.plannedAt,
    updatedBy: order.updatedBy || order.createdBy
  };
}

function finishTask(list = [], relatedId, patch = {}) {
  return list.map((item) => item.id === relatedId || item.relatedId === relatedId ? { ...item, status: "已完成", updatedAt: nowText(), ...patch } : item);
}

export function DemoProvider({ children }) {
  const [data, setData] = useState(() => normalizeData(loadFarmData(defaultFarmData)));

  function updateData(updater) {
    setData((current) => {
      const next = normalizeData(typeof updater === "function" ? updater(current) : updater);
      saveFarmData(next);
      return next;
    });
  }

  const api = {
    data,
    currentUser: data.currentUser,
    mobileRole: data.currentUser?.role || "员工",
    isReadonly: data.currentUser?.role === "只读访客",
    currentRole: data.settings.currentRole || data.currentUser?.role || "员工",
    currentWorkMode: data.settings.currentWorkMode || "员工端",
    resetDemo: () => updateData({ ...defaultFarmData, operationLogs: [buildAuditLog({ operator: data.currentUser?.name || "员工", module: "系统设置", action: "重置", objectName: "示例数据", objectId: "demo", summary: "重置为最新员工端示例数据", roleView: data.currentUser?.role || "员工" }), ...(defaultFarmData.operationLogs || [])] }),
    clearAllData: () => {
      clearFarmData();
      setData(normalizeData(defaultFarmData));
    },
    exportData: () => exportAllData(data),
    importData: (nextData) => updateData((current) => withAudit({ ...normalizeData(nextData) }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: "系统设置", action: "导入", objectName: "JSON 数据", objectId: "import", summary: "导入本地 JSON 数据", roleView: current.settings.currentRole || "集团管理员" }))),
    updateSettings: (settings) => updateData((current) => withAudit({ ...current, settings: { ...current.settings, ...settings } }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: "系统设置", action: "编辑", objectName: "基础设置", objectId: "settings", summary: "更新系统设置或角色视图", roleView: settings.currentRole || current.settings.currentRole || "集团管理员" }))),
    updateCollection: (key, nextList) => updateData((current) => withAudit({ ...current, [key]: nextList }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: key, action: "编辑", objectName: key, objectId: key, summary: `更新 ${key} 集合，共 ${nextList.length} 条`, roleView: current.settings.currentRole || "集团管理员" }))),
    setCurrentRole: (role) => updateData((current) => withAudit({ ...current, settings: { ...current.settings, currentRole: role } }, buildAuditLog({ operator: role, module: "角色与组织模拟", action: "状态变更", objectName: "当前角色视图", objectId: role, summary: `切换到 ${role} 视图`, roleView: role }))),
    setCurrentWorkMode: (mode) => updateData((current) => withAudit({ ...current, settings: { ...current.settings, currentWorkMode: mode } }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: "工作模式", action: "状态变更", objectName: "当前工作模式", objectId: mode, summary: `切换到 ${mode} 模式`, roleView: current.settings.currentRole || "集团管理员" }))),
    setMobileRole: (role) => updateData((current) => {
      const userMap = {
        员工: { id: "user-employee", name: "刘师傅", role: "员工", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", phone: "13800000001" },
        管理员: { id: "user-admin", name: "王场长", role: "管理员", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", phone: "13800000009" },
        只读访客: { id: "user-visitor", name: "演示访客", role: "只读访客", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", phone: "" }
      };
      const nextUser = userMap[role] || userMap["员工"];
      return withAudit({ ...current, currentUser: nextUser, settings: { ...current.settings, currentRole: role, currentWorkMode: "员工端" } }, buildAuditLog({ operator: nextUser.name, module: "个人中心", action: "状态变更", objectName: "当前身份", objectId: role, summary: `切换为${role}身份`, roleView: role }));
    }),
    saveDraft: (module, title, payload) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const draft = withMobileMeta(current, {
        id: nextId("draft"),
        code: nextCode("DRAFT"),
        module,
        title,
        payload,
        status: "草稿",
        priority: "普通",
        updatedBy: actor.name,
        remark: "当前为前端演示，模拟离线暂存能力。"
      });
      return withAudit({ ...current, drafts: [draft, ...(current.drafts || [])] }, buildAuditLog({ operator: actor.name, module, action: "保存草稿", objectName: title, objectId: draft.id, summary: `保存${title}草稿`, roleView: actor.role }));
    }),
    deleteDraft: (id) => updateData((current) => ({ ...current, drafts: (current.drafts || []).filter((item) => item.id !== id) })),
    submitFeedingRecord: (form) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const planned = Number(form.plannedAmount || 0);
      const actual = Number(form.actualAmount || 0);
      const leftover = Number(form.leftoverAmount || 0);
      const dryMatterRatio = Number(form.dryMatterRatio || 0.52);
      const deviationAmount = Number((actual - planned).toFixed(2));
      const deviationRate = planned ? Number(((deviationAmount / planned) * 100).toFixed(1)) : 0;
      const leftoverRate = actual ? Number(((leftover / actual) * 100).toFixed(1)) : 0;
      const dryMatterIntake = Number(((actual - leftover) * dryMatterRatio).toFixed(2));
      const record = withMobileMeta(current, { ...form, id: nextId("feed-record"), code: nextCode("FR"), actualAmount: actual, plannedAmount: planned, leftoverAmount: leftover, dryMatterRatio, deviationAmount, deviationRate, leftoverRate, dryMatterIntake, executor: form.executor || actor.name, status: "已完成" });
      const feedName = String(form.formula || "").includes("育肥") ? "育肥牛饲料" : "奶牛精补料";
      let inventoryItems = current.inventoryItems || [];
      if (form.autoDeduct) {
        inventoryItems = inventoryItems.map((item) => item.name === feedName ? { ...item, stock: Math.max(0, Number(item.stock || 0) - actual), status: Number(item.stock || 0) - actual <= Number(item.safeStock || 0) ? "低库存" : item.status, updatedAt: nowText() } : item);
      }
      const abnormal = Math.abs(deviationRate) > 10 || leftoverRate > 12 || ["偏低", "拒食", "异常"].includes(form.intakeStatus);
      const workOrder = abnormal ? createMobileWorkOrder(current, { type: leftoverRate > 12 ? "剩料异常" : "饲喂异常", title: `${form.barn || "牛舍"}饲喂复核`, content: `偏差率 ${deviationRate}%，剩料率 ${leftoverRate}%，干物质采食 ${dryMatterIntake} 吨，采食：${form.intakeStatus || "未填"}`, source: "system", relatedBusiness: "饲喂记录", relatedObject: form.barn || form.herd, organizationName: record.organizationName }) : null;
      const lowStocks = inventoryItems.filter((item) => Number(item.stock || 0) <= Number(item.safeStock || 0));
      const messages = [
        ...(abnormal ? [createMobileMessage(current, { title: Math.abs(deviationRate) > 10 ? "饲喂偏差提醒" : "剩料异常提醒", type: Math.abs(deviationRate) > 10 ? "饲喂偏差提醒" : "剩料异常提醒", content: workOrder.content, priority: "重要", relatedBusiness: "工单", relatedId: workOrder.id, organizationName: record.organizationName })] : []),
        ...lowStocks.map((item) => createMobileMessage(current, { title: `${item.name}库存不足`, type: "库存预警", content: `当前库存 ${item.stock}${item.unit}，低于安全库存 ${item.safeStock}${item.unit}。`, priority: "重要", relatedBusiness: "库存", relatedId: item.id, organizationName: item.organizationName }))
      ];
      return withAudit({
        ...current,
        feedingRecords: [record, ...(current.feedingRecords || [])],
        feedingTasks: finishTask(current.feedingTasks, form.taskId),
        mobileTasks: finishTask(current.mobileTasks, form.taskId),
        inventoryItems,
        workOrders: workOrder ? [workOrder, ...(current.workOrders || [])] : current.workOrders,
        smartWorkOrders: workOrder ? [asSmartWorkOrder(workOrder), ...(current.smartWorkOrders || [])] : current.smartWorkOrders,
        messages: [...messages, ...(current.messages || [])],
        myRecords: [createMyRecord(current, { type: "饲喂记录", title: `${record.barn} ${record.shift}班饲喂`, status: "已完成", relatedId: record.id, organizationName: record.organizationName, remark: `偏差率${deviationRate}%，剩料率${leftoverRate}%` }), ...(current.myRecords || [])],
        drafts: (current.drafts || []).filter((item) => item.id !== form.draftId)
      }, buildAuditLog({ operator: actor.name, module: "饲喂管理", action: "新增", objectName: "饲喂记录", objectId: record.id, summary: `提交${record.barn}饲喂记录`, roleView: actor.role }));
    }),
    submitMilkRecord: (form) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const total = Number(form.totalMilk || form.total || 0);
      const abnormalMilk = Number(form.abnormalMilk || 0);
      const milkingCowCount = Number(form.milkingCowCount || 0);
      const avgMilkPerCow = milkingCowCount ? Number((total / milkingCowCount).toFixed(2)) : 0;
      const abnormalMilkRate = total ? Number(((abnormalMilk / total) * 100).toFixed(1)) : 0;
      const record = withMobileMeta(current, { ...form, id: nextId("milk-mobile"), code: nextCode("MR"), total, totalMilk: total, avgMilkPerCow, abnormalMilkRate, qualifiedMilk: Number(form.qualifiedMilk || 0), abnormalMilk, recorder: form.milker || actor.name, status: abnormalMilk > 0 ? "有异常" : "已完成" });
      const legacyMilk = { ...record, date: form.date || todayText, barn: form.barn, morning: form.shift === "早班" ? total : 0, evening: form.shift === "晚班" ? total : 0, milkPrice: current.settings.defaultMilkPrice || 4.2, syncIncome: false, ledgerId: "", note: form.remark || "" };
      const qualityTask = form.sendInspection ? withMobileMeta(current, { id: nextId("quality-task"), code: nextCode("QT"), sampleType: "原奶", relatedBatch: form.tankNo || record.code, sourceOrganization: record.organizationName, sampledAt: nowText(), sender: actor.name, status: "待检", organizationId: "org-plant", organizationName: "欧力菲德乳品厂", createdBy: "系统", remark: "产奶记录自动生成待检任务" }) : null;
      const delivery = form.generateDelivery ? { id: nextId("del"), taskNo: nextCode("YN"), businessType: "原奶配送", startPoint: "合力牧业奶牛场", endPoint: "欧力菲德乳品厂", goodsName: "原奶", name: "合力牧业奶牛场 -> 欧力菲德乳品厂", type: "原奶配送", amount: total, unit: "吨", status: "待配送", truckId: "", driver: "", createdAt: nowText(), plannedAt: `${todayText} 15:00`, arrivedAt: "", fee: 0, syncExpense: false, ledgerId: "", note: "产奶记录自动生成" } : null;
      const abnormal = abnormalMilkRate > 5 || Number(form.temperature || 0) > 6;
      const workOrder = abnormal ? createMobileWorkOrder(current, { type: "产奶异常", title: `${form.barn || "牛舍"}异常奶复核`, content: `单牛均产 ${avgMilkPerCow} 吨，异常奶比例 ${abnormalMilkRate}%，原奶温度 ${form.temperature || "-"}℃。`, source: "system", relatedBusiness: "产奶记录", relatedObject: form.tankNo || form.barn, organizationName: record.organizationName }) : null;
      const cattleEvent = form.abnormalCowNo ? withMobileMeta(current, { id: nextId("cattle-event"), code: nextCode("CE"), cattleCode: form.abnormalCowNo, type: "产奶异常", eventTime: nowText(), handler: actor.name, method: form.abnormalCowType || "异常奶登记", status: "已记录" }) : null;
      return withAudit({
        ...current,
        milkRecords: [legacyMilk, ...(current.milkRecords || [])],
        milkTasks: finishTask(current.milkTasks, form.taskId),
        mobileTasks: finishTask(current.mobileTasks, form.taskId),
        qualityTasks: qualityTask ? [qualityTask, ...(current.qualityTasks || [])] : current.qualityTasks,
        deliveries: delivery ? [delivery, ...(current.deliveries || [])] : current.deliveries,
        workOrders: workOrder ? [workOrder, ...(current.workOrders || [])] : current.workOrders,
        smartWorkOrders: workOrder ? [asSmartWorkOrder(workOrder), ...(current.smartWorkOrders || [])] : current.smartWorkOrders,
        cattleEvents: cattleEvent ? [cattleEvent, ...(current.cattleEvents || [])] : current.cattleEvents,
        messages: [
          ...(qualityTask ? [createMobileMessage(current, { title: "原奶待质检", type: "今日任务提醒", content: `${form.barn} ${form.shift}产奶已送检，请质检员处理。`, priority: "重要", relatedBusiness: "质检", relatedId: qualityTask.id, receiver: "质检员", organizationName: "欧力菲德乳品厂" })] : []),
          ...(workOrder ? [createMobileMessage(current, { title: Number(form.temperature || 0) > 6 ? "原奶温度异常" : "产奶异常提醒", type: "产奶异常提醒", content: workOrder.content, priority: "紧急", relatedBusiness: "工单", relatedId: workOrder.id, organizationName: record.organizationName })] : []),
          ...(current.messages || [])
        ],
        myRecords: [createMyRecord(current, { type: "产奶记录", title: `${form.barn} ${form.shift} ${total}吨`, status: record.status, relatedId: record.id, organizationName: record.organizationName, remark: `单牛均产${avgMilkPerCow}，异常奶${abnormalMilkRate}%` }), ...(current.myRecords || [])],
        drafts: (current.drafts || []).filter((item) => item.id !== form.draftId)
      }, buildAuditLog({ operator: actor.name, module: "产奶管理", action: "新增", objectName: "产奶记录", objectId: record.id, summary: `提交${form.shift}产奶 ${total} 吨`, roleView: actor.role }));
    }),
    submitBreedingRecord: (form) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const record = withMobileMeta(current, { ...form, id: nextId("breed"), code: form.cattleCode || form.code || nextCode("BR"), recordType: form.recordType || "发情观察", status: "已记录" });
      const event = withMobileMeta(current, { id: nextId("cattle-event"), code: nextCode("CE"), cattleCode: record.cattleCode, type: record.recordType, eventTime: nowText(), handler: actor.name, method: form.remark || record.recordType, status: "已记录" });
      const reminder = ["配种记录", "妊检记录"].includes(record.recordType) ? createMobileMessage(current, { title: record.recordType === "配种记录" ? "妊检提醒已生成" : "产犊提醒已生成", type: "繁育提醒", content: `${record.cattleCode} 已记录${record.recordType}，请按计划复查。`, priority: "普通", relatedBusiness: "繁育", relatedId: record.id, organizationName: record.organizationName }) : null;
      const breedReminder = ["配种记录", "妊检记录"].includes(record.recordType) ? withMobileMeta(current, { id: nextId("breed-rem"), code: nextCode("BRR"), cattleCode: record.cattleCode, type: record.recordType === "配种记录" ? "待妊检" : record.pregnancyResult === "未孕" ? "待复查" : "临产提醒", dueDate: record.pregnancyCheckDate || record.expectedCalvingDate || todayText, status: "待处理", priority: record.pregnancyResult === "未孕" ? "重要" : "普通", createdBy: "系统" }) : null;
      return withAudit({
        ...current,
        breedingRecords: [record, ...(current.breedingRecords || [])],
        breedingReminders: breedReminder ? [breedReminder, ...(current.breedingReminders || [])] : current.breedingReminders,
        cattleEvents: [event, ...(current.cattleEvents || [])],
        cattleRecords: (current.cattleRecords || []).map((cow) => cow.code === record.cattleCode ? { ...cow, recentBreeding: record.recordType, updatedAt: nowText() } : cow),
        messages: reminder ? [reminder, ...(current.messages || [])] : current.messages,
        myRecords: [createMyRecord(current, { type: "繁育记录", title: `${record.cattleCode} ${record.recordType}`, status: "已记录", relatedId: record.id, organizationName: record.organizationName }), ...(current.myRecords || [])]
      }, buildAuditLog({ operator: actor.name, module: "繁育管理", action: "新增", objectName: record.recordType, objectId: record.id, summary: `提交${record.cattleCode}${record.recordType}`, roleView: actor.role }));
    }),
    submitCattleEvent: (form) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const event = withMobileMeta(current, { ...form, id: nextId("cattle-event"), code: nextCode("CE"), cattleCode: form.cattleCode, eventTime: form.eventTime || nowText(), handler: form.handler || actor.name, status: "已记录" });
      const needsOrder = ["疾病", "用药", "死亡", "异常行为"].includes(form.type);
      const workOrder = needsOrder ? createMobileWorkOrder(current, { type: "牛只异常", title: `${form.cattleCode} ${form.type}处理`, content: form.method || form.remark || "请现场复核牛只状态。", source: "exception", relatedBusiness: "牛只事件", relatedObject: form.cattleCode, organizationName: event.organizationName }) : null;
      const medication = form.type === "用药" ? withMobileMeta(current, { id: nextId("med"), code: nextCode("MED"), cattleCode: form.cattleCode, medicineName: form.medicineName || "现场用药", dose: form.dose || "-", usedAt: form.eventTime || nowText(), operator: form.handler || actor.name, withdrawalDays: Number(form.withdrawalDays || 3), releaseDate: form.releaseDate || "", affectMilk: form.affectMilk !== false, status: "休药期", priority: "重要", remark: form.remark || "" }) : null;
      const withdrawalMessage = medication ? createMobileMessage(current, { title: `${form.cattleCode}进入休药期`, type: "休药期提醒", content: `${medication.medicineName}，休药期 ${medication.withdrawalDays} 天，产奶需隔离。`, priority: "重要", relatedBusiness: "牛只用药", relatedId: medication.id, organizationName: event.organizationName }) : null;
      return withAudit({
        ...current,
        cattleEvents: [event, ...(current.cattleEvents || [])],
        medicationRecords: medication ? [medication, ...(current.medicationRecords || [])] : current.medicationRecords,
        cattleRecords: (current.cattleRecords || []).map((cow) => cow.code === form.cattleCode ? { ...cow, currentStatus: nextCowStatus(form.type, cow.currentStatus), healthStatus: needsOrder ? "异常" : cow.healthStatus, updatedAt: nowText() } : cow),
        workOrders: workOrder ? [workOrder, ...(current.workOrders || [])] : current.workOrders,
        smartWorkOrders: workOrder ? [asSmartWorkOrder(workOrder), ...(current.smartWorkOrders || [])] : current.smartWorkOrders,
        messages: [...(workOrder ? [createMobileMessage(current, { title: "牛只异常工单", type: "工单提醒", content: workOrder.content, priority: "重要", relatedBusiness: "工单", relatedId: workOrder.id, organizationName: event.organizationName })] : []), ...(withdrawalMessage ? [withdrawalMessage] : []), ...(current.messages || [])],
        myRecords: [createMyRecord(current, { type: "牛只事件", title: `${form.cattleCode} ${form.type}`, status: "已记录", relatedId: event.id, organizationName: event.organizationName }), ...(current.myRecords || [])]
      }, buildAuditLog({ operator: actor.name, module: "牛只管理", action: "新增", objectName: "牛只事件", objectId: event.id, summary: `上报${form.cattleCode}${form.type}`, roleView: actor.role }));
    }),
    submitInventoryAction: (kind, form) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const quantity = Number(form.quantity || 0);
      const itemName = form.materialName || form.itemName;
      let inventoryItems = current.inventoryItems || [];
      let materialRequests = current.materialRequests || [];
      let inventoryMovements = current.inventoryMovements || [];
      let messages = current.messages || [];
      let workOrders = current.workOrders || [];
      let smartWorkOrders = current.smartWorkOrders || [];
      let status = "已提交";
      let relatedId = "";
      if (kind === "request") {
        const request = withMobileMeta(current, { ...form, id: nextId("mr"), code: nextCode("MR"), materialName: itemName, quantity, applicant: form.applicant || actor.name, status: "待审核" });
        materialRequests = [request, ...materialRequests];
        const order = createMobileWorkOrder(current, { type: "领料处理工单", title: `${itemName}领料申请`, content: `${actor.name}申请${itemName}${quantity}${form.unit || ""}，用途：${form.purpose || "-"}`, source: "inventory", relatedBusiness: "库存申请", relatedObject: itemName, organizationName: request.organizationName });
        workOrders = [order, ...workOrders];
        smartWorkOrders = [asSmartWorkOrder(order), ...smartWorkOrders];
        messages = [createMobileMessage(current, { title: "新的领料申请", type: "审批提醒", content: order.content, priority: form.urgent ? "紧急" : "普通", relatedBusiness: "工单", relatedId: order.id, organizationName: request.organizationName }), ...messages];
        status = "待审核";
        relatedId = request.id;
      } else {
        const movement = withMobileMeta(current, { ...form, id: nextId("move"), code: nextCode(kind === "in" ? "IN" : kind === "out" ? "OUT" : "COUNT"), movementType: kind === "in" ? "入库" : kind === "out" ? "出库" : "盘点", itemName, quantity, handler: form.handler || actor.name, status: "已完成" });
        inventoryMovements = [movement, ...inventoryMovements];
        inventoryItems = inventoryItems.map((item) => item.name === itemName ? { ...item, stock: kind === "in" ? Number(item.stock || 0) + quantity : kind === "out" ? Math.max(0, Number(item.stock || 0) - quantity) : Number(form.actualStock || item.stock || 0), supplier: form.supplier || item.supplier, expireAt: form.expireAt || item.expireAt, status: Number(item.stock || 0) <= Number(item.safeStock || 0) ? "低库存" : "正常", updatedAt: nowText() } : item);
        relatedId = movement.id;
      }
      const lowStocks = inventoryItems.filter((item) => Number(item.stock || 0) <= Number(item.safeStock || 0));
      const expiring = inventoryItems.filter((item) => item.expireAt && new Date(String(item.expireAt).replace(/-/g, "/")).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000);
      const stockOrders = lowStocks.map((item) => createMobileWorkOrder(current, { type: "库存盘点工单", title: `${item.name}低库存处理`, content: `当前库存 ${item.stock}${item.unit}，低于安全库存 ${item.safeStock}${item.unit}。`, source: "inventory", relatedBusiness: "库存预警", relatedObject: item.name, organizationName: item.organizationName }));
      messages = [...lowStocks.map((item) => createMobileMessage(current, { title: `${item.name}库存不足`, type: "库存低库存提醒", content: `当前库存 ${item.stock}${item.unit}，请及时补货或调拨。`, priority: "重要", relatedBusiness: "库存", relatedId: item.id, organizationName: item.organizationName })), ...expiring.map((item) => createMobileMessage(current, { title: `${item.name}临期提醒`, type: "库存临期提醒", content: `${item.batch} 到期日 ${item.expireAt}，请优先使用或复核。`, priority: "重要", relatedBusiness: "库存", relatedId: item.id, organizationName: item.organizationName })), ...messages];
      return withAudit({ ...current, inventoryItems, inventoryMovements, materialRequests, workOrders: [...stockOrders, ...workOrders], smartWorkOrders: [...stockOrders.map(asSmartWorkOrder), ...smartWorkOrders], messages, myRecords: [createMyRecord(current, { type: kind === "request" ? "库存申请" : "库存记录", title: `${itemName}${kind === "request" ? "领料申请" : kind === "in" ? "入库" : kind === "out" ? "出库" : "盘点"}`, status, relatedId, organizationName: form.organizationName || actor.organizationName }), ...(current.myRecords || [])], drafts: (current.drafts || []).filter((item) => item.id !== form.draftId) }, buildAuditLog({ operator: actor.name, module: "库存管理", action: "新增", objectName: itemName, objectId: relatedId, summary: `提交库存${kind}记录`, roleView: actor.role }));
    }),
    submitQualityInspection: (form) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const passed = form.passed === true || form.passed === "是" || form.result === "合格";
      const inspection = withMobileMeta(current, { ...form, id: nextId("qi"), code: nextCode("QI"), result: passed ? "合格" : "不合格", status: "已完成", inspector: form.inspector || actor.name });
      const workOrder = !passed ? createMobileWorkOrder(current, { type: "质检工单", title: `${form.batch || form.relatedBatch}质检不合格`, content: form.handleAdvice || form.reason || "请隔离批次并复核。", source: "quality", relatedBusiness: "质检", relatedObject: form.batch || form.relatedBatch, organizationName: inspection.organizationName }) : null;
      const inventoryItems = (current.inventoryItems || []).map((item) => !passed && item.batch === (form.batch || form.relatedBatch) ? { ...item, status: form.handleMethod === "复检合格" ? "正常" : "冻结", updatedAt: nowText() } : item);
      return withAudit({
        ...current,
        qualityInspections: [inspection, ...(current.qualityInspections || [])],
        qualityTasks: finishTask(current.qualityTasks, form.taskId, { status: passed ? "合格" : "不合格" }),
        inventoryItems,
        workOrders: workOrder ? [workOrder, ...(current.workOrders || [])] : current.workOrders,
        smartWorkOrders: workOrder ? [asSmartWorkOrder(workOrder), ...(current.smartWorkOrders || [])] : current.smartWorkOrders,
        messages: workOrder ? [createMobileMessage(current, { title: "质检不合格", type: "质检不合格提醒", content: workOrder.content, priority: "紧急", relatedBusiness: "工单", relatedId: workOrder.id, organizationName: inspection.organizationName }), ...(current.messages || [])] : current.messages,
        myRecords: [createMyRecord(current, { type: "质检记录", title: `${inspection.batch || inspection.relatedBatch} ${inspection.result}`, status: inspection.result, relatedId: inspection.id, organizationName: inspection.organizationName }), ...(current.myRecords || [])],
        drafts: (current.drafts || []).filter((item) => item.id !== form.draftId)
      }, buildAuditLog({ operator: actor.name, module: "质检管理", action: "新增", objectName: "质检记录", objectId: inspection.id, summary: `提交${inspection.result}质检记录`, roleView: actor.role }));
    }),
    submitShiftHandover: (form) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const handover = withMobileMeta(current, { ...form, id: nextId("handover"), code: nextCode("HO"), fromUser: form.fromUser || actor.name, status: form.confirmed ? "已交接" : "待确认", priority: form.unfinishedItems || form.abnormalCattle || form.abnormalInventory || form.abnormalQuality ? "重要" : "普通" });
      const needsOrder = Boolean(form.unfinishedItems || form.abnormalCattle || form.abnormalInventory || form.abnormalQuality);
      const order = needsOrder ? createMobileWorkOrder(current, { type: "交接班工单", title: `${form.shift || "班次"}交接异常跟进`, content: [form.unfinishedItems, form.abnormalCattle, form.abnormalInventory, form.abnormalQuality].filter(Boolean).join("；"), source: "system", relatedBusiness: "交接班", relatedObject: form.shift || "交接班", organizationName: handover.organizationName }) : null;
      const task = needsOrder ? withMobileMeta(current, { id: nextId("task"), code: nextCode("TASK"), type: "交接班", title: `${form.shift || "班次"}交接待办`, location: handover.organizationName, assignee: form.toUser || actor.name, plannedTime: form.handoverAt || nowText(), status: "待处理", priority: "重要", relatedId: handover.id, createdBy: "系统" }) : null;
      return withAudit({
        ...current,
        shiftHandovers: [handover, ...(current.shiftHandovers || [])],
        mobileTasks: task ? [task, ...(current.mobileTasks || [])] : current.mobileTasks,
        workOrders: order ? [order, ...(current.workOrders || [])] : current.workOrders,
        smartWorkOrders: order ? [asSmartWorkOrder(order), ...(current.smartWorkOrders || [])] : current.smartWorkOrders,
        messages: [createMobileMessage(current, { title: "交接班已提交", type: "交接班提醒", content: `${handover.fromUser} 已提交${handover.shift}交接班。`, priority: handover.priority, relatedBusiness: "交接班", relatedId: handover.id, receiver: form.toUser || "管理员", organizationName: handover.organizationName }), ...(current.messages || [])],
        myRecords: [createMyRecord(current, { type: "交接班记录", title: `${handover.shift}交接班`, status: handover.status, relatedId: handover.id, organizationName: handover.organizationName }), ...(current.myRecords || [])],
        drafts: (current.drafts || []).filter((item) => item.id !== form.draftId)
      }, buildAuditLog({ operator: actor.name, module: "交接班", action: "新增", objectName: `${handover.shift}交接班`, objectId: handover.id, summary: "提交交接班记录", roleView: actor.role }));
    }),
    submitExceptionReport: (form) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const report = withMobileMeta(current, { ...form, id: nextId("ex"), code: nextCode("EX"), reporter: form.reporter || actor.name, status: "已生成工单" });
      const order = createMobileWorkOrder(current, { type: form.exceptionType, title: `${form.exceptionType}处理`, content: form.description, source: "exception", priority: form.urgency || "普通", relatedBusiness: "异常上报", relatedObject: form.relatedObject || form.location, organizationName: report.organizationName });
      return withAudit({
        ...current,
        exceptionReports: [report, ...(current.exceptionReports || [])],
        workOrders: [order, ...(current.workOrders || [])],
        smartWorkOrders: [asSmartWorkOrder(order), ...(current.smartWorkOrders || [])],
        messages: [createMobileMessage(current, { title: `${form.exceptionType}待处理`, type: "工单提醒", content: form.description, priority: form.urgency || "普通", relatedBusiness: "工单", relatedId: order.id, organizationName: report.organizationName }), ...(current.messages || [])],
        myRecords: [createMyRecord(current, { type: "异常上报", title: form.exceptionType, status: "已生成工单", relatedId: report.id, organizationName: report.organizationName }), ...(current.myRecords || [])]
      }, buildAuditLog({ operator: actor.name, module: "异常上报", action: "新增", objectName: form.exceptionType, objectId: report.id, summary: `提交${form.exceptionType}异常并生成工单`, roleView: actor.role }));
    }),
    dispatchWorkOrder: (form) => updateData((current) => {
      assertAdmin(current);
      const actor = getActor(current);
      const organization = (current.organizations || []).find((item) => item.name === form.organizationName || item.id === form.organizationId);
      const order = createMobileWorkOrder(current, {
        type: form.type,
        title: form.title,
        content: form.content,
        source: "manual",
        handler: form.handler,
        priority: form.priority || "普通",
        relatedBusiness: form.relatedObjectType || "人工派发",
        relatedObject: `${form.relatedObjectType || "关联对象"}：${form.relatedObject || "未填写"}`,
        organizationId: organization?.id || actor.organizationId,
        organizationName: organization?.name || form.organizationName || actor.organizationName,
        deadline: form.deadline,
        operationRequirement: form.operationRequirement,
        requirePhoto: Boolean(form.requirePhoto),
        requireReview: Boolean(form.requireReview),
        remark: form.remark || ""
      });
      const manualOrder = {
        ...order,
        status: "待处理",
        assignedBy: actor.name,
        processLog: `${order.createdAt} ${actor.name} 手动派发给 ${form.handler}`
      };
      return withAudit({
        ...current,
        workOrders: [manualOrder, ...(current.workOrders || [])],
        smartWorkOrders: [asSmartWorkOrder(manualOrder), ...(current.smartWorkOrders || [])],
        messages: [createMobileMessage(current, { title: "收到新工单", type: "今日任务提醒", content: `${actor.name}派发：${manualOrder.title}`, priority: manualOrder.priority, relatedBusiness: "工单", relatedId: manualOrder.id, receiver: form.handler, organizationName: manualOrder.organizationName }), ...(current.messages || [])],
        myRecords: [createMyRecord(current, { type: "已派发工单", title: manualOrder.title, status: "待处理", relatedId: manualOrder.id, organizationName: manualOrder.organizationName }), ...(current.myRecords || [])]
      }, buildAuditLog({ operator: actor.name, module: "工单派发", action: "新增", objectName: manualOrder.title, objectId: manualOrder.id, summary: `派发给${form.handler}，截止${manualOrder.deadline}`, roleView: actor.role }));
    }),
    submitWorkOrderResult: (id, form) => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const target = (current.workOrders || []).find((item) => item.id === id);
      if (!target) throw new Error("未找到工单。");
      if (actor.role !== "管理员" && target.handler !== actor.name) throw new Error("只能处理分配给自己的工单。");
      const nextStatus = target.requireReview ? "待复核" : "已完成";
      const patch = {
        status: nextStatus,
        result: form.result || "",
        resultSubmittedAt: form.finishedAt || nowText(),
        resultPhoto: form.photo || "",
        resultException: form.exceptionNote || "",
        remark: form.remark || target.remark || "",
        updatedAt: nowText(),
        updatedBy: actor.name,
        processLog: `${target.processLog || ""}\n${nowText()} ${actor.name} 提交处理结果：${form.result || "已处理"}`
      };
      const workOrders = (current.workOrders || []).map((item) => item.id === id ? { ...item, ...patch } : item);
      const smartWorkOrders = (current.smartWorkOrders || []).map((item) => item.id === id ? { ...item, ...patch } : item);
      return withAudit({
        ...current,
        workOrders,
        smartWorkOrders,
        messages: [createMobileMessage(current, { title: target.requireReview ? "工单待复核" : "工单已完成", type: "工单状态提醒", content: `${target.title} 已由 ${actor.name} 提交处理结果。`, priority: target.priority, relatedBusiness: "工单", relatedId: id, receiver: target.initiator || "管理员", organizationName: target.organizationName }), ...(current.messages || [])],
        myRecords: [createMyRecord(current, { type: "工单处理", title: target.title, status: nextStatus, relatedId: id, organizationName: target.organizationName }), ...(current.myRecords || [])]
      }, buildAuditLog({ operator: actor.name, module: "工单处理", action: "提交结果", objectName: target.title, objectId: id, summary: `提交结果后状态为${nextStatus}`, roleView: actor.role, note: form.result || "" }));
    }),
    reviewWorkOrder: (id, action, reason = "") => updateData((current) => {
      assertAdmin(current);
      const actor = getActor(current);
      const target = (current.workOrders || []).find((item) => item.id === id);
      if (!target) throw new Error("未找到工单。");
      const nextStatus = action === "reject" ? "已驳回" : "已完成";
      const patch = {
        status: nextStatus,
        reviewOpinion: reason,
        reviewer: actor.name,
        reviewedAt: nowText(),
        updatedAt: nowText(),
        updatedBy: actor.name,
        processLog: `${target.processLog || ""}\n${nowText()} ${actor.name} ${nextStatus}${reason ? `：${reason}` : ""}`
      };
      const workOrders = (current.workOrders || []).map((item) => item.id === id ? { ...item, ...patch } : item);
      const smartWorkOrders = (current.smartWorkOrders || []).map((item) => item.id === id ? { ...item, ...patch } : item);
      return withAudit({
        ...current,
        workOrders,
        smartWorkOrders,
        messages: [createMobileMessage(current, { title: action === "reject" ? "工单被驳回" : "工单复核通过", type: "工单状态提醒", content: action === "reject" ? `${target.title} 被驳回：${reason || "请重新处理"}` : `${target.title} 已复核通过。`, priority: action === "reject" ? "重要" : "普通", relatedBusiness: "工单", relatedId: id, receiver: target.handler, organizationName: target.organizationName }), ...(current.messages || [])],
        myRecords: [createMyRecord(current, { type: "工单复核", title: target.title, status: nextStatus, relatedId: id, organizationName: target.organizationName }), ...(current.myRecords || [])]
      }, buildAuditLog({ operator: actor.name, module: "工单复核", action: action === "reject" ? "驳回" : "通过", objectName: target.title, objectId: id, summary: `复核结果：${nextStatus}`, roleView: actor.role, note: reason }));
    }),
    updateMobileWorkOrder: (id, status, result = "") => updateData((current) => {
      assertWritable(current);
      const actor = getActor(current);
      const target = (current.workOrders || []).find((item) => item.id === id);
      if (target && actor.role !== "管理员" && target.handler !== actor.name) throw new Error("只能处理分配给自己的工单。");
      const workOrders = (current.workOrders || []).map((item) => item.id === id ? { ...item, status, result: result || item.result, handler: item.handler || actor.name, updatedAt: nowText(), processLog: `${item.processLog || ""}\n${nowText()} ${actor.name} 将状态改为${status}` } : item);
      const smartWorkOrders = (current.smartWorkOrders || []).map((item) => item.id === id ? { ...item, status, result: result || item.result, handler: item.handler || actor.name, updatedAt: nowText(), updatedBy: actor.name } : item);
      return withAudit({
        ...current,
        workOrders,
        smartWorkOrders,
        messages: [createMobileMessage(current, { title: `工单${status}`, type: "工单提醒", content: `${target?.title || "工单"}状态已变更为${status}`, priority: status === "已驳回" ? "重要" : "普通", relatedBusiness: "工单", relatedId: id, receiver: target?.initiator || actor.name, organizationName: target?.organizationName || actor.organizationName }), ...(current.messages || [])],
        myRecords: [createMyRecord(current, { type: "工单处理", title: target?.title || "工单处理", status, relatedId: id, organizationName: target?.organizationName || actor.organizationName }), ...(current.myRecords || [])]
      }, buildAuditLog({ operator: actor.name, module: "工单处理", action: "状态变更", objectName: target?.title || "工单", objectId: id, summary: `工单状态变更为${status}`, roleView: actor.role, note: result }));
    }),
    markMobileMessageRead: (id) => updateData((current) => ({ ...current, messages: (current.messages || []).map((item) => item.id === id ? { ...item, status: "已读", updatedAt: nowText() } : item) })),
    markAllMessagesRead: () => updateData((current) => withAudit({ ...current, messages: current.messages.map((item) => item.status === "未读" ? { ...item, status: "已读" } : item) }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: "消息中心", action: "状态变更", objectName: "全部未读消息", objectId: "messages", summary: "一键标记所有未读消息为已读", roleView: current.settings.currentRole || "集团管理员" }))),
    updateMessageStatus: (id, status, handleNote = "") => updateData((current) => withAudit({ ...current, messages: current.messages.map((item) => item.id === id ? { ...item, status, handledAt: ["已处理", "已忽略"].includes(status) ? nowText() : item.handledAt, handleNote: handleNote || item.handleNote } : item) }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: "消息中心", action: "状态变更", objectName: "消息", objectId: id, summary: `消息状态变更为 ${status}`, roleView: current.settings.currentRole || "集团管理员" }))),
    upsertApproval: (approval) => updateData((current) => {
      const next = { ...approval, id: approval.id || `ap-${Date.now()}`, no: approval.no || `AP-${Date.now().toString().slice(-8)}`, appliedAt: approval.appliedAt || nowText(), status: approval.status || "待审批" };
      const list = approval.id ? current.approvalRequests.map((item) => item.id === approval.id ? next : item) : [next, ...current.approvalRequests];
      const message = approval.id ? current.messages : [{ id: `msg-ap-${Date.now()}`, type: "审批待办", businessUnit: next.businessUnit, title: `${next.type}待审批`, content: `${next.applicant}提交${next.type}，金额 ${next.amount || 0} 元。`, priority: Number(next.amount || 0) > 20000 ? "高" : "中", status: "未读", receiver: next.approver, relatedType: "审批中心", relatedId: next.id, createdAt: nowText(), handledAt: "", handleNote: "" }, ...current.messages];
      return withAudit({ ...current, approvalRequests: list, messages: message }, buildAuditLog({ operator: current.settings.currentRole || next.applicant, module: "审批中心", action: approval.id ? "编辑" : "新增", objectName: next.type, objectId: next.id, summary: `${approval.id ? "更新" : "新增"}审批申请 ${next.no}`, roleView: current.settings.currentRole || "集团管理员" }));
    }),
    setApprovalStatus: (id, status, opinion = "") => updateData((current) => {
      const approvals = current.approvalRequests.map((item) => item.id === id ? { ...item, status, opinion: opinion || item.opinion, approvedAt: ["已通过", "已驳回", "已撤回"].includes(status) ? nowText() : item.approvedAt } : item);
      const approval = approvals.find((item) => item.id === id);
      const messages = current.messages.map((item) => item.relatedId === id ? { ...item, status: status === "已通过" ? "已处理" : item.status, handledAt: status === "已通过" ? nowText() : item.handledAt, handleNote: opinion || item.handleNote } : item);
      return withAudit({ ...current, approvalRequests: approvals, messages }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: "审批中心", action: "审批", objectName: approval?.type || "审批", objectId: id, summary: `审批状态变更为 ${status}`, roleView: current.settings.currentRole || "集团管理员", note: opinion }));
    }),
    simulateInterfaceTest: (id) => updateData((current) => {
      const interfaces = current.externalInterfaces.map((item) => item.id === id ? { ...item, status: item.status === "连接正常" ? "连接异常" : "连接正常", lastSyncAt: nowText(), todaySyncCount: item.status === "连接正常" ? item.todaySyncCount : Number(item.todaySyncCount || 0) + 12 } : item);
      const target = interfaces.find((item) => item.id === id);
      return withAudit({ ...current, externalInterfaces: interfaces }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: "接口管理", action: "状态变更", objectName: target?.name || "接口", objectId: id, summary: `模拟测试连接，当前状态：${target?.status}`, roleView: current.settings.currentRole || "集团管理员", note: "未真实请求外部系统" }));
    }),
    upsertCowEvent: (event) => updateData((current) => {
      const next = { ...event, id: event.id || `ce-${Date.now()}`, date: event.date || todayText };
      const cowStatus = nextCowStatus(next.type, "");
      const patchDairy = current.dairyCows.map((cow) => cow.code === next.code && cowStatus ? { ...cow, status: cowStatus, watch: ["治疗中", "隔离中", "待妊检"].includes(cowStatus) || cow.watch } : cow);
      const patchBeef = current.beefCows.map((cow) => cow.code === next.code && cowStatus ? { ...cow, status: cowStatus } : cow);
      const events = event.id ? current.cowEvents.map((item) => item.id === event.id ? next : item) : [next, ...current.cowEvents];
      return withAudit({ ...current, cowEvents: events, dairyCows: patchDairy, beefCows: patchBeef }, buildAuditLog({ operator: current.settings.currentRole || next.handler, module: "牛只事件时间线", action: event.id ? "编辑" : "新增", objectName: next.type, objectId: next.id, summary: `${next.code} 新增${next.type}事件，模拟状态流转为 ${cowStatus || "不变"}`, roleView: current.settings.currentRole || "集团管理员" }));
    }),
    upsertNotice: (notice) =>
      updateData((current) => {
        const id = notice.id || `notice-${Date.now()}`;
        const nextNotice = { ...notice, id, createdAt: notice.createdAt || nowText() };
        const notices = notice.id ? current.notices.map((item) => (item.id === notice.id ? nextNotice : item)) : [nextNotice, ...current.notices];
        return { ...current, notices: nextNotice.pinned ? notices.map((item) => ({ ...item, pinned: item.id === id })) : notices };
      }),
    deleteNotice: (id) => updateData((current) => ({ ...current, notices: current.notices.filter((item) => item.id !== id) })),
    upsertBarn: (barn) => updateData((current) => ({ ...current, barns: barn.id ? current.barns.map((item) => (item.id === barn.id ? barn : item)) : [{ ...barn, id: `barn-${Date.now()}` }, ...current.barns] })),
    deleteBarn: (id) => updateData((current) => ({ ...current, barns: current.barns.filter((item) => item.id !== id) })),
    upsertCow: (cow) =>
      updateData((current) => {
        const nextCow = { ...cow, updatedAt: nowText() };
        const cows = cow.id ? current.cows.map((item) => (item.id === cow.id ? nextCow : item)) : [{ ...nextCow, id: `cow-${Date.now()}` }, ...current.cows];
        const watchCows = cows.filter((item) => item.watch).map((item) => ({ id: `watch-${item.id}`, code: item.code, barn: item.barn, status: item.status, issue: item.watchReason || item.note, personInCharge: item.personInCharge, note: item.note, updatedAt: item.updatedAt }));
        return { ...current, cows, watchCows, focusCows: watchCows };
      }),
    deleteCow: (id) => updateData((current) => ({ ...current, cows: current.cows.filter((item) => item.id !== id), watchCows: current.watchCows.filter((item) => item.id !== `watch-${id}`) })),
    upsertFocusCow: (cow) =>
      updateData((current) => {
        const nextCow = { ...cow, updatedAt: nowText() };
        return { ...current, watchCows: cow.id ? current.watchCows.map((item) => (item.id === cow.id ? nextCow : item)) : [{ ...nextCow, id: `watch-${Date.now()}` }, ...current.watchCows] };
      }),
    deleteFocusCow: (id) => updateData((current) => ({ ...current, watchCows: current.watchCows.filter((cow) => cow.id !== id), focusCows: current.watchCows.filter((cow) => cow.id !== id) })),
    upsertMilkRecord: (record) =>
      updateData((current) => {
        const normalized = { ...record, total: Number(record.total || 0), morning: Number(record.morning || 0), evening: Number(record.evening || 0), milkPrice: Number(record.milkPrice || current.settings.defaultMilkPrice || 0) };
        const ledgerId = normalized.ledgerId || `ledger-milk-${normalized.id || Date.now()}`;
        const nextRecord = normalized.syncIncome ? { ...normalized, ledgerId } : { ...normalized, ledgerId: "" };
        let ledgerRecords = normalized.ledgerId && !normalized.syncIncome ? removeLedger(current.ledgerRecords, normalized.ledgerId) : current.ledgerRecords;
        if (nextRecord.syncIncome) {
          ledgerRecords = addOrUpdateLedger(ledgerRecords, { id: ledgerId, date: nextRecord.date, businessUnit: "合力牧业奶牛场", type: "收入", category: "原奶销售", amount: Number((nextRecord.total * 1000 * nextRecord.milkPrice).toFixed(2)), operator: nextRecord.recorder, relatedBusiness: "产奶记录", relatedId: nextRecord.id || ledgerId, note: `${nextRecord.date} 合力牧业奶牛场原奶收入自动同步` });
        }
        return { ...current, ledgerRecords, milkRecords: nextRecord.id ? current.milkRecords.map((item) => (item.id === nextRecord.id ? nextRecord : item)) : [{ ...nextRecord, id: `milk-${Date.now()}` }, ...current.milkRecords] };
      }),
    deleteMilkRecord: (id) => updateData((current) => {
      const record = current.milkRecords.find((item) => item.id === id);
      return { ...current, ledgerRecords: removeLedger(current.ledgerRecords, record?.ledgerId), milkRecords: current.milkRecords.filter((item) => item.id !== id) };
    }),
    upsertDelivery: (delivery) =>
      updateData((current) => {
        const truck = current.trucks.find((item) => item.id === delivery.truckId);
        const normalized = { ...delivery, amount: Number(delivery.amount || 0), fee: Number(delivery.fee || 0), driver: delivery.driver || truck?.driver || "", createdAt: delivery.createdAt || nowText(), taskNo: delivery.taskNo || `PS-${Date.now().toString().slice(-5)}` };
        const ledgerId = normalized.ledgerId || `ledger-del-${normalized.id || Date.now()}`;
        const nextDelivery = normalized.syncExpense ? { ...normalized, ledgerId } : { ...normalized, ledgerId: "" };
        let ledgerRecords = normalized.ledgerId && !normalized.syncExpense ? removeLedger(current.ledgerRecords, normalized.ledgerId) : current.ledgerRecords;
        if (nextDelivery.syncExpense) {
          ledgerRecords = addOrUpdateLedger(ledgerRecords, { id: ledgerId, date: todayText, businessUnit: "集团", type: "支出", category: "车辆油费", amount: nextDelivery.fee, operator: nextDelivery.driver, relatedBusiness: "配送任务", relatedId: nextDelivery.id || ledgerId, note: `${nextDelivery.name} 配送费用自动同步` });
        }
        return { ...current, ledgerRecords, deliveries: nextDelivery.id ? current.deliveries.map((item) => (item.id === nextDelivery.id ? nextDelivery : item)) : [{ ...nextDelivery, id: `del-${Date.now()}` }, ...current.deliveries] };
      }),
    deleteDelivery: (id) => updateData((current) => {
      const item = current.deliveries.find((entry) => entry.id === id);
      return { ...current, ledgerRecords: removeLedger(current.ledgerRecords, item?.ledgerId), deliveries: current.deliveries.filter((entry) => entry.id !== id) };
    }),
    setDeliveryStatus: (deliveryId, status) =>
      updateData((current) => {
        const delivery = current.deliveries.find((item) => item.id === deliveryId);
        return {
          ...current,
          deliveries: current.deliveries.map((item) => (item.id === deliveryId ? { ...item, status, arrivedAt: status === "已到达" ? item.arrivedAt || nowText() : item.arrivedAt } : item)),
          trucks: current.trucks.map((truck) => truck.id === delivery?.truckId ? { ...truck, status: status === "已到达" ? "空闲" : status === "异常" ? "维修中" : "配送中", currentTask: status === "已到达" ? "" : delivery.name, recentDeliveryAt: nowText(), location: status === "已到达" ? "牧场" : `去${delivery.name}`, cargo: status === "已到达" ? "空车" : "鲜牛奶", load: status === "已到达" ? 0 : Number(delivery.amount || truck.load || 0) } : truck)
        };
      }),
    upsertTruck: (truck) => updateData((current) => ({ ...current, trucks: truck.id ? current.trucks.map((item) => (item.id === truck.id ? truck : item)) : [{ ...truck, id: `truck-${Date.now()}` }, ...current.trucks] })),
    deleteTruck: (id) => updateData((current) => ({ ...current, trucks: current.trucks.filter((item) => item.id !== id), deliveries: current.deliveries.map((item) => (item.truckId === id ? { ...item, truckId: "", driver: "" } : item)) })),
    setTruckStatus: (truckId, status) => updateData((current) => ({ ...current, trucks: current.trucks.map((truck) => truck.id === truckId ? { ...truck, status, currentTask: ["空闲", "维修中", "停用"].includes(status) ? "" : truck.currentTask, cargo: status === "空闲" ? "空车" : truck.cargo, load: status === "空闲" ? 0 : truck.load } : truck) })),
    upsertMaterial: (material) => updateData((current) => ({ ...current, materials: material.id ? current.materials.map((item) => (item.id === material.id ? material : item)) : [{ ...material, id: `mat-${Date.now()}` }, ...current.materials] })),
    deleteMaterial: (id) => updateData((current) => ({ ...current, materials: current.materials.filter((item) => item.id !== id) })),
    upsertStockIn: (record) => updateData((current) => {
      const old = current.stockInRecords.find((item) => item.id === record.id);
      const material = current.materials.find((item) => item.id === record.materialId);
      const next = { ...record, quantity: Number(record.quantity || 0), price: Number(record.price || material?.price || 0), total: Number(record.total || Number(record.quantity || 0) * Number(record.price || material?.price || 0)), materialName: record.materialName || material?.name || "", category: record.category || material?.category || "", unit: record.unit || material?.unit || "" };
      const delta = old ? next.quantity - Number(old.quantity || 0) : next.quantity;
      const ledgerId = next.ledgerId || `ledger-in-${next.id || Date.now()}`;
      const nextRecord = next.syncLedger ? { ...next, ledgerId } : { ...next, ledgerId: "" };
      let ledgerRecords = next.ledgerId && !next.syncLedger ? removeLedger(current.ledgerRecords, next.ledgerId) : current.ledgerRecords;
      if (nextRecord.syncLedger) ledgerRecords = addOrUpdateLedger(ledgerRecords, { id: ledgerId, date: nextRecord.date, businessUnit: nextRecord.category === "饲料" ? "欧力菲德饲料厂" : "合力牧业奶牛场", type: "支出", category: nextRecord.category === "饲料" ? "饲料原料采购" : nextRecord.category === "兽药" || nextRecord.category === "疫苗" ? "兽药疫苗" : "其他支出", amount: nextRecord.total, operator: nextRecord.operator, relatedBusiness: "入库记录", relatedId: nextRecord.id || ledgerId, note: `${nextRecord.materialName} 入库自动同步` });
      return { ...current, ledgerRecords, materials: adjustMaterial(current.materials, nextRecord.materialId, delta, { lastInAt: nextRecord.date, price: nextRecord.price, supplier: nextRecord.supplier }), stockInRecords: nextRecord.id ? current.stockInRecords.map((item) => (item.id === nextRecord.id ? nextRecord : item)) : [{ ...nextRecord, id: `in-${Date.now()}` }, ...current.stockInRecords] };
    }),
    deleteStockIn: (id) => updateData((current) => {
      const old = current.stockInRecords.find((item) => item.id === id);
      return { ...current, ledgerRecords: removeLedger(current.ledgerRecords, old?.ledgerId), materials: old ? adjustMaterial(current.materials, old.materialId, -Number(old.quantity || 0)) : current.materials, stockInRecords: current.stockInRecords.filter((item) => item.id !== id) };
    }),
    upsertStockOut: (record) => updateData((current) => {
      const old = current.stockOutRecords.find((item) => item.id === record.id);
      const material = current.materials.find((item) => item.id === record.materialId);
      const next = { ...record, quantity: Number(record.quantity || 0), materialName: record.materialName || material?.name || "", category: record.category || material?.category || "", unit: record.unit || material?.unit || "" };
      const stockAfterRevert = Number(material?.stock || 0) + Number(old?.quantity || 0);
      if (next.quantity > stockAfterRevert) throw new Error("出库数量不能大于当前库存");
      const delta = old ? Number(old.quantity || 0) - next.quantity : -next.quantity;
      return { ...current, materials: adjustMaterial(current.materials, next.materialId, delta, { lastOutAt: next.date }), stockOutRecords: next.id ? current.stockOutRecords.map((item) => (item.id === next.id ? next : item)) : [{ ...next, id: `out-${Date.now()}` }, ...current.stockOutRecords] };
    }),
    deleteStockOut: (id) => updateData((current) => {
      const old = current.stockOutRecords.find((item) => item.id === id);
      return { ...current, materials: old ? adjustMaterial(current.materials, old.materialId, Number(old.quantity || 0)) : current.materials, stockOutRecords: current.stockOutRecords.filter((item) => item.id !== id) };
    }),
    upsertLedger: (record) => updateData((current) => ({ ...current, ledgerRecords: record.id ? current.ledgerRecords.map((item) => (item.id === record.id ? record : item)) : [{ ...record, id: `ledger-${Date.now()}` }, ...current.ledgerRecords] })),
    deleteLedger: (id) => updateData((current) => ({ ...current, ledgerRecords: current.ledgerRecords.filter((item) => item.id !== id) }))
  };

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}
