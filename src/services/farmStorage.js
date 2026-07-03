export const FARM_STORE_KEY = "heli-smart-pasture-platform-v1";

export function loadFarmData(defaultData) {
  try {
    const stored = window.localStorage.getItem(FARM_STORE_KEY);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
}

export function saveFarmData(data) {
  try {
    window.localStorage.setItem(FARM_STORE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable in embedded previews.
  }
}

export function clearFarmData() {
  try {
    window.localStorage.removeItem(FARM_STORE_KEY);
  } catch {
    // Ignore storage errors in preview environments.
  }
}

export function saveModule(key, value) {
  const data = loadFarmData({});
  saveFarmData({ ...data, [key]: value });
}

export function getModule(key, fallback = []) {
  return loadFarmData({})[key] || fallback;
}

export const getAnnouncements = () => getModule("notices");
export const saveAnnouncements = (value) => saveModule("notices", value);
export const getBarns = () => getModule("barns");
export const saveBarns = (value) => saveModule("barns", value);
export const getCows = () => getModule("cows");
export const saveCows = (value) => saveModule("cows", value);
export const getWatchCows = () => getModule("watchCows");
export const saveWatchCows = (value) => saveModule("watchCows", value);
export const getMilkRecords = () => getModule("milkRecords");
export const saveMilkRecords = (value) => saveModule("milkRecords", value);
export const getDeliveryTasks = () => getModule("deliveries");
export const saveDeliveryTasks = (value) => saveModule("deliveries", value);
export const getTrucks = () => getModule("trucks");
export const saveTrucks = (value) => saveModule("trucks", value);
export const getMaterials = () => getModule("materials");
export const saveMaterials = (value) => saveModule("materials", value);
export const getStockInRecords = () => getModule("stockInRecords");
export const saveStockInRecords = (value) => saveModule("stockInRecords", value);
export const getStockOutRecords = () => getModule("stockOutRecords");
export const saveStockOutRecords = (value) => saveModule("stockOutRecords", value);
export const getLedgerRecords = () => getModule("ledgerRecords");
export const saveLedgerRecords = (value) => saveModule("ledgerRecords", value);
export const getSettings = () => getModule("settings", {});
export const saveSettings = (value) => saveModule("settings", value);
export const resetDemoData = (defaultData) => saveFarmData(defaultData);
export const exportAllData = (data) => JSON.stringify(data, null, 2);
export const importAllData = (data) => saveFarmData(data);

export function statusHas(status = "", words = []) {
  return words.some((word) => String(status).includes(word));
}

export function isToday(value = "") {
  const today = new Date().toISOString().slice(0, 10);
  return String(value).startsWith(today);
}

export function isThisMonth(value = "") {
  const month = new Date().toISOString().slice(0, 7);
  return String(value).startsWith(month);
}

export function isOverdueDelivery(item) {
  if (!item?.plannedAt || ["已到达", "异常"].includes(item.status)) return false;
  const text = String(item.plannedAt);
  const hourMatch = text.match(/(\d{1,2})[:：](\d{2})/);
  if (!hourMatch) return false;
  const now = new Date();
  const planned = new Date();
  planned.setHours(Number(hourMatch[1]), Number(hourMatch[2]), 0, 0);
  return now.getTime() - planned.getTime() > 30 * 60 * 1000;
}

export function isOverdueWorkOrder(item) {
  if (!item?.plannedAt || ["已完成", "已取消"].includes(item.status)) return false;
  if (item.status === "超时") return true;
  const planned = new Date(String(item.plannedAt).replace(/-/g, "/"));
  if (Number.isNaN(planned.getTime())) return false;
  return planned.getTime() < Date.now();
}

export function calculateInventoryWarnings(materials = []) {
  return materials.filter((item) => Number(item.stock || 0) <= Number(item.warningStock || 0));
}

export function calculateLedgerSummary(records = []) {
  const sum = (list, type) => list.filter((item) => item.type === type).reduce((total, item) => total + Number(item.amount || 0), 0);
  const todayRecords = records.filter((item) => isToday(item.date));
  const monthRecords = records.filter((item) => isThisMonth(item.date));
  const todayIncome = sum(todayRecords, "收入");
  const todayExpense = sum(todayRecords, "支出");
  const monthIncome = sum(monthRecords, "收入");
  const monthExpense = sum(monthRecords, "支出");
  return {
    todayIncome,
    todayExpense,
    monthIncome,
    monthExpense,
    monthBalance: monthIncome - monthExpense
  };
}

export function calculateDashboardStats(data) {
  const milkRecords = data.milkRecords || [];
  const latestMilk = milkRecords[0] || {};
  const yesterdayMilk = milkRecords[1] || {};
  const feedWarnings = [
    ...calculateInventoryWarnings(data.feedRawMaterials || []),
    ...calculateInventoryWarnings(data.feedProducts || [])
  ];
  const pastureWarnings = [
    ...calculateInventoryWarnings(data.dairyFarmInventory || []),
    ...calculateInventoryWarnings(data.beefFarmInventory || []),
    ...calculateInventoryWarnings(data.materials || [])
  ];
  const dairyProductWarnings = calculateInventoryWarnings(data.dairyProductInventory || []);
  const inventoryWarnings = [...feedWarnings, ...pastureWarnings, ...dairyProductWarnings];
  const ledgerSummary = calculateLedgerSummary(data.ledgerRecords || []);
  const cows = data.cows?.length ? data.cows : [];
  const watchCows = data.watchCows?.length ? data.watchCows : data.focusCows || [];
  const deliveryTasks = data.deliveries || [];
  const deliveryAmount = deliveryTasks.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const milkDrop = Number(yesterdayMilk.total || 0) > 0 && Number(latestMilk.total || 0) < Number(yesterdayMilk.total || 0) * 0.85;
  const abnormalBarns = (data.barns || []).filter((barn) => statusHas(barn.status, ["异常", "维修", "隔离"]));
  const abnormalCows = watchCows.filter((cow) => statusHas(`${cow.status}${cow.issue}${cow.watchReason}`, ["异常", "生病", "隔离", "观察", "发烧", "腿伤", "产奶下降"]));
  const repairTrucks = (data.trucks || []).filter((truck) => ["维修中", "停用"].includes(truck.status));
  const abnormalDeliveries = deliveryTasks.filter((item) => item.status === "异常" || isOverdueDelivery(item));
  const feedTodayOutput = (data.feedProductionRecords || []).filter((item) => isToday(item.date)).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const rawMilkReceivedToday = (data.milkReceivingRecords || []).filter((item) => isToday(item.date)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const dairySalesToday = (data.dairySalesOrders || []).filter((item) => isToday(item.date)).reduce((sum, item) => sum + Number(item.total || 0), 0);
  const dairyProductStock = (data.dairyProductInventory || []).reduce((sum, item) => sum + Number(item.stock || 0), 0);
  const workOrders = data.workOrders || [];
  const todayWorkOrders = workOrders.filter((item) => isToday(item.plannedAt));
  const openWorkOrders = workOrders.filter((item) => !["已完成", "已取消"].includes(item.status));
  const overdueWorkOrders = workOrders.filter(isOverdueWorkOrder);
  const deviceAlerts = (data.devices || []).filter((item) => item.online !== "在线" || !["正常", "无"].includes(item.alarm));
  const environmentAlerts = (data.environmentRecords || []).filter((item) => item.heatStressRisk !== "低" || Number(item.comfortIndex || 0) < 70 || Number(item.ammonia || 0) >= 15);
  const breedingReminders = (data.breedingRecords || []).filter((item) => isToday(item.pregnancyCheckDate) || isToday(item.dueDate) || String(item.note || "").includes("提醒"));
  const healthReminders = (data.healthEvents || []).filter((item) => item.status === "休药期" || item.status === "待复核" || isToday(item.withdrawalUntil));
  const feedingActualToday = (data.feedingRecords || []).filter((item) => isToday(item.date)).reduce((sum, item) => sum + Number(item.actualAmount || 0), 0);
  const weighbridgeToday = (data.weighbridgeRecords || []).filter((item) => isToday(item.weighedAt)).length;
  const traceabilityComplete = (data.traceabilityChains || []).filter((item) => item.status === "完整").length;
  const biologicalAssetValue = (data.biologicalAssets || []).reduce((sum, item) => sum + Number(item.estimatedValue || 0), 0);
  const readyForSaleAssets = (data.biologicalAssets || []).filter((item) => item.readyForSale === "是");
  const messages = data.messages || [];
  const unreadMessages = messages.filter((item) => item.status === "未读").length;
  const urgentAlerts = messages.filter((item) => item.priority === "紧急" && !["已处理", "已忽略"].includes(item.status)).length;
  const pendingMessages = messages.filter((item) => ["未读", "已读"].includes(item.status)).length;
  const pendingApprovals = (data.approvalRequests || []).filter((item) => item.status === "待审批").length;
  const interfaceAbnormalList = (data.externalInterfaces || []).filter((item) => ["连接异常", "未配置"].includes(item.status));
  const enabledRules = (data.alertRules || []).filter((item) => item.enabled);
  const ruleTriggeredCount = enabledRules.filter((item) => item.lastTriggeredAt).length + deviceAlerts.length + environmentAlerts.length;
  const workOrderCompletionRate = todayWorkOrders.length ? (todayWorkOrders.filter((item) => item.status === "已完成").length / todayWorkOrders.length) * 100 : 0;
  const deviceOnlineRate = (data.devices || []).length ? ((data.devices || []).filter((item) => item.online === "在线").length / (data.devices || []).length) * 100 : 100;
  const dataQualityIssues = ruleTriggeredCount + interfaceAbnormalList.length;
  const businessUnits = ["合力牧业奶牛场", "欧力菲德肉牛场", "欧力菲德饲料厂", "欧力菲德乳品厂", "集团"];
  const businessUnitStats = businessUnits.map((unit) => {
    const records = (data.ledgerRecords || []).filter((item) => (item.businessUnit || "集团") === unit);
    const income = records.filter((item) => item.type === "收入").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expense = records.filter((item) => item.type === "支出").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return { name: unit, income, expense, profit: income - expense };
  });
  const alerts = [];
  if (!latestMilk.id) alerts.push("今日暂无产奶记录，请及时录入。");
  if (milkDrop) alerts.push("今日产奶量较昨日下降超过 15%，建议排查饲喂、饮水和牛舍情况。");
  abnormalDeliveries.forEach((item) => alerts.push(`${item.name} 配送任务需要关注，当前状态：${item.status}。`));
  repairTrucks.forEach((truck) => alerts.push(`${truck.plate} 当前为 ${truck.status}，请勿安排配送。`));
  inventoryWarnings.forEach((item) => alerts.push(`${item.name} 库存 ${item.stock}${item.unit}，低于预警值 ${item.warningStock}${item.unit}。`));
  abnormalBarns.forEach((barn) => alerts.push(`${barn.name} 状态为 ${barn.status}，请安排检查。`));
  if (overdueWorkOrders.length) alerts.push(`当前有 ${overdueWorkOrders.length} 个超时工单，请优先处理工单中心。`);
  if (deviceAlerts.length) alerts.push(`设备状态中心有 ${deviceAlerts.length} 台设备离线或告警，建议设备员复核。`);
  if (environmentAlerts.length) alerts.push(`牛舍环境监控发现 ${environmentAlerts.length} 处热应激或氨气风险。`);
  if (breedingReminders.length) alerts.push(`合力牧业奶牛场有 ${breedingReminders.length} 条妊检/产犊提醒。`);
  if (healthReminders.length) alerts.push(`健康防疫模块有 ${healthReminders.length} 条休药期或防疫复核提醒。`);
  if (readyForSaleAssets.length) alerts.push(`欧力菲德肉牛场有 ${readyForSaleAssets.length} 头/批生物资产可安排出栏评估。`);
  if (urgentAlerts) alerts.push(`消息中心有 ${urgentAlerts} 条紧急预警待处理。`);
  if (pendingApprovals) alerts.push(`审批中心有 ${pendingApprovals} 条待审批事项。`);
  if (interfaceAbnormalList.length) alerts.push(`接口管理中心有 ${interfaceAbnormalList.length} 个接口异常或未配置。`);
  if (abnormalCows.length) alerts.push(`当前有 ${abnormalCows.length} 头特别关注牛只，请查看重点牛只页面。`);
  if (ledgerSummary.monthExpense > Math.max(1, ledgerSummary.monthIncome) * 0.8) alerts.push("本月支出占比较高，建议查看收支账本和采购记录。");
  return {
    latestMilk,
    yesterdayMilk,
    milkAmount: Number(latestMilk.total || 0),
    yesterdayMilkAmount: Number(yesterdayMilk.total || 0),
    morningMilk: Number(latestMilk.morning || 0),
    eveningMilk: Number(latestMilk.evening || 0),
    weekMilkAmount: milkRecords.slice(0, 7).reduce((sum, item) => sum + Number(item.total || 0), 0),
    monthMilkAmount: milkRecords.filter((item) => isThisMonth(item.date)).reduce((sum, item) => sum + Number(item.total || 0), 0),
    deliveryAmount,
    dairyCowCount: (data.dairyCows || []).length || cows.filter((cow) => !String(cow.barn).includes("肉牛")).length,
    beefCowCount: (data.beefCows || []).length || cows.filter((cow) => String(cow.barn).includes("肉牛")).length,
    totalCows: ((data.dairyCows || []).length + (data.beefCows || []).length) || cows.length || (data.barns || []).reduce((sum, barn) => sum + Number(barn.count || 0), 0),
    milkCowCount: (data.barns || []).filter((barn) => !barn.name.includes("肉牛")).reduce((sum, barn) => sum + Number(barn.count || 0), 0),
    beefCount: (data.barns || []).filter((barn) => barn.name.includes("肉牛")).reduce((sum, barn) => sum + Number(barn.count || 0), 0),
    barnCount: (data.barns || []).length,
    focusCount: watchCows.length,
    cowCount: cows.length,
    truckCount: (data.trucks || []).length,
    idleTrucks: (data.trucks || []).filter((truck) => truck.status === "空闲").length,
    runningTrucks: (data.trucks || []).filter((truck) => truck.status === "配送中").length,
    repairTrucks: (data.trucks || []).filter((truck) => truck.status === "维修中").length,
    disabledTrucks: (data.trucks || []).filter((truck) => truck.status === "停用").length,
    destinationCount: deliveryTasks.length,
    waitingDeliveries: deliveryTasks.filter((item) => item.status === "待配送").length,
    runningDeliveries: deliveryTasks.filter((item) => item.status === "配送中").length,
    arrivedDeliveries: deliveryTasks.filter((item) => item.status === "已到达").length,
    abnormalDeliveries: deliveryTasks.filter((item) => item.status === "异常").length,
    feedTodayOutput,
    rawMilkReceivedToday,
    dairyProductStock,
    dairySalesToday,
    todayWorkOrders: todayWorkOrders.length,
    openWorkOrders: openWorkOrders.length,
    overdueWorkOrders: overdueWorkOrders.length,
    deviceAlerts: deviceAlerts.length,
    environmentAlerts: environmentAlerts.length,
    breedingReminders: breedingReminders.length,
    healthReminders: healthReminders.length,
    feedingActualToday,
    weighbridgeToday,
    traceabilityComplete,
    biologicalAssetValue,
    readyForSaleAssets: readyForSaleAssets.length,
    unreadMessages,
    urgentAlerts,
    pendingMessages,
    pendingApprovals,
    interfaceAbnormalCount: interfaceAbnormalList.length,
    interfaceAbnormalList,
    ruleTriggeredCount,
    workOrderCompletionRate,
    deviceOnlineRate,
    dataQualityIssues,
    currentRole: data.settings?.currentRole || "集团管理员",
    feedWarnings,
    pastureWarnings,
    dairyProductWarnings,
    businessUnitStats,
    inventoryWarnings,
    inventoryWarningCount: inventoryWarnings.length,
    materialCount: (data.materials || []).length,
    ...ledgerSummary,
    alerts,
    milkDrop,
    abnormalBarns,
    abnormalCows,
    repairTruckList: repairTrucks,
    abnormalDeliveryList: abnormalDeliveries,
    deviceAlertList: deviceAlerts,
    environmentAlertList: environmentAlerts,
    overdueWorkOrderList: overdueWorkOrders
  };
}

export function generateLocalAIReport(data, metrics) {
  return `合力牧业农牧乳一体化平台今日运行概况：当前角色视图为${metrics.currentRole}。合力牧业奶牛场产奶 ${metrics.milkAmount.toFixed(1)} 吨，欧力菲德乳品厂接收原奶 ${metrics.rawMilkReceivedToday.toFixed(1)} 吨；欧力菲德饲料厂今日生产饲料 ${metrics.feedTodayOutput.toFixed(1)} 吨，并向合力牧业奶牛场、欧力菲德肉牛场执行内部调拨；欧力菲德肉牛场当前肉牛档案 ${metrics.beefCowCount} 头，生物资产估值 ${(metrics.biologicalAssetValue / 10000).toFixed(1)} 万元；欧力菲德乳品厂成品库存 ${metrics.dairyProductStock} 件，今日销售额 ${metrics.dairySalesToday.toFixed(0)} 元。今日工单 ${metrics.todayWorkOrders} 个，完成率 ${metrics.workOrderCompletionRate.toFixed(0)}%，超时 ${metrics.overdueWorkOrders} 个；未读消息 ${metrics.unreadMessages} 条，紧急预警 ${metrics.urgentAlerts} 条，待审批 ${metrics.pendingApprovals} 条；接口异常 ${metrics.interfaceAbnormalCount} 个，规则触发 ${metrics.ruleTriggeredCount} 次，设备在线率 ${metrics.deviceOnlineRate.toFixed(0)}%。本月集团收入 ${metrics.monthIncome.toFixed(0)} 元，支出 ${metrics.monthExpense.toFixed(0)} 元，结余 ${metrics.monthBalance.toFixed(0)} 元。${metrics.alerts.length ? `需要优先处理：${metrics.alerts.slice(0, 3).join("；")}` : "当前无明显异常，建议保持饲料供应、原奶入厂和成品销售节奏。"}`;
}
