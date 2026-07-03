import { createContext, useContext, useMemo, useState } from "react";
import {
  calculateDashboardStats,
  clearFarmData,
  exportAllData,
  generateLocalAIReport,
  loadFarmData,
  saveFarmData
} from "../services/farmStorage.js";
import { buildExtendedModules, extendedModuleKeys } from "../data/extendedModules.js";
import { buildPlatformModules, platformModuleKeys } from "../data/platformModules.js";
import { buildAuditLog } from "../services/platformServices.js";

const todayText = new Date().toISOString().slice(0, 10);
const monthText = todayText.slice(0, 7);
const nowText = () => new Date().toLocaleString("zh-CN", { hour12: false });

export const defaultFarmData = {
  settings: {
    farmName: "合力牧业农牧乳一体化经营管理平台",
    manager: "场长",
    phone: "13800000000",
    defaultMilkPrice: 4.2,
    defaultDeliveryType: "门店",
    defaultRecorder: "值班员",
    defaultInventoryWarning: 20,
    currentRole: "集团管理员"
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
  ...buildExtendedModules(todayText, monthText),
  ...buildPlatformModules(todayText, monthText, nowText)
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
    ...Object.fromEntries(extendedModuleKeys.map((key) => [key, source[key] || defaultFarmData[key] || []])),
    ...Object.fromEntries(platformModuleKeys.map((key) => [key, source[key] || defaultFarmData[key] || []]))
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

export function DemoProvider({ children }) {
  const [data, setData] = useState(() => normalizeData(loadFarmData(defaultFarmData)));

  function updateData(updater) {
    setData((current) => {
      const next = normalizeData(typeof updater === "function" ? updater(current) : updater);
      saveFarmData(next);
      return next;
    });
  }

  const metrics = useMemo(() => calculateDashboardStats(data), [data]);
  const aiReport = useMemo(() => generateLocalAIReport(data, metrics), [data, metrics]);

  const api = {
    data,
    metrics,
    aiReport,
    currentRole: data.settings.currentRole || "集团管理员",
    resetDemo: () => updateData({ ...defaultFarmData, operationLogs: [buildAuditLog({ operator: data.settings.currentRole || "集团管理员", module: "系统设置", action: "重置", objectName: "示例数据", objectId: "demo", summary: "重置为最新平台级示例数据", roleView: data.settings.currentRole || "集团管理员" }), ...(defaultFarmData.operationLogs || [])] }),
    clearAllData: () => {
      clearFarmData();
      setData(normalizeData(defaultFarmData));
    },
    exportData: () => exportAllData(data),
    importData: (nextData) => updateData((current) => withAudit({ ...normalizeData(nextData) }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: "系统设置", action: "导入", objectName: "JSON 数据", objectId: "import", summary: "导入本地 JSON 数据", roleView: current.settings.currentRole || "集团管理员" }))),
    updateSettings: (settings) => updateData((current) => withAudit({ ...current, settings: { ...current.settings, ...settings } }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: "系统设置", action: "编辑", objectName: "基础设置", objectId: "settings", summary: "更新系统设置或角色视图", roleView: settings.currentRole || current.settings.currentRole || "集团管理员" }))),
    updateCollection: (key, nextList) => updateData((current) => withAudit({ ...current, [key]: nextList }, buildAuditLog({ operator: current.settings.currentRole || "集团管理员", module: key, action: "编辑", objectName: key, objectId: key, summary: `更新 ${key} 集合，共 ${nextList.length} 条`, roleView: current.settings.currentRole || "集团管理员" }))),
    setCurrentRole: (role) => updateData((current) => withAudit({ ...current, settings: { ...current.settings, currentRole: role } }, buildAuditLog({ operator: role, module: "角色与组织模拟", action: "状态变更", objectName: "当前角色视图", objectId: role, summary: `切换到 ${role} 视图`, roleView: role }))),
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
