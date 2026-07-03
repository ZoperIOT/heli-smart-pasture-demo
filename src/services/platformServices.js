import { isOverdueDelivery } from "./farmStorage.js";

export function buildAuditLog({ operator = "系统", module = "系统", action = "状态变更", objectName = "", objectId = "", summary = "", roleView = "集团管理员", note = "" }) {
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

export function summarizeMessages(messages = []) {
  return {
    unread: messages.filter((item) => item.status === "未读").length,
    urgent: messages.filter((item) => item.priority === "紧急" && !["已处理", "已忽略"].includes(item.status)).length,
    pending: messages.filter((item) => ["未读", "已读"].includes(item.status)).length,
    handled: messages.filter((item) => item.status === "已处理").length
  };
}

export function summarizeApprovals(approvals = []) {
  return {
    pending: approvals.filter((item) => item.status === "待审批").length,
    passed: approvals.filter((item) => item.status === "已通过").length,
    rejected: approvals.filter((item) => item.status === "已驳回").length,
    withdrawn: approvals.filter((item) => item.status === "已撤回").length
  };
}

export function summarizeInterfaces(interfaces = []) {
  const abnormal = interfaces.filter((item) => ["连接异常", "未配置"].includes(item.status));
  return {
    total: interfaces.length,
    normal: interfaces.filter((item) => item.status === "连接正常").length,
    configured: interfaces.filter((item) => item.status === "已配置").length,
    abnormal: abnormal.length,
    abnormalList: abnormal
  };
}

export function evaluateRules(data = {}) {
  const triggered = [];
  const enabledRules = (data.alertRules || []).filter((item) => item.enabled);
  const hasRule = (type) => enabledRules.some((rule) => rule.type === type);
  const inventories = [
    ...(data.feedRawMaterials || []),
    ...(data.feedProducts || []),
    ...(data.dairyFarmInventory || []),
    ...(data.beefFarmInventory || []),
    ...(data.materials || []),
    ...(data.dairyProductInventory || [])
  ];
  if (hasRule("库存不足规则")) {
    inventories.filter((item) => Number(item.stock || 0) <= Number(item.warningStock || 0)).forEach((item) => triggered.push({
      ruleType: "库存不足规则",
      title: `${item.name} 库存不足`,
      reason: `当前 ${item.stock}${item.unit || ""} <= 预警 ${item.warningStock}${item.unit || ""}`,
      priority: "高"
    }));
  }
  if (hasRule("设备离线规则")) {
    (data.devices || []).filter((item) => item.online !== "在线").forEach((item) => triggered.push({
      ruleType: "设备离线规则",
      title: `${item.name} 离线`,
      reason: `在线状态为 ${item.online}，最近上传 ${item.lastUploadAt || "无"}`,
      priority: "紧急"
    }));
  }
  if (hasRule("环境异常规则")) {
    (data.environmentRecords || []).filter((item) => item.heatStressRisk !== "低" || Number(item.comfortIndex || 0) < 70).forEach((item) => triggered.push({
      ruleType: "环境异常规则",
      title: `${item.barn} 环境异常`,
      reason: `热应激 ${item.heatStressRisk}，舒适度 ${item.comfortIndex}`,
      priority: "高"
    }));
  }
  if (hasRule("配送超时规则")) {
    (data.deliveries || []).filter(isOverdueDelivery).forEach((item) => triggered.push({
      ruleType: "配送超时规则",
      title: `${item.name} 配送超时`,
      reason: `计划到达 ${item.plannedAt}，当前状态 ${item.status}`,
      priority: "中"
    }));
  }
  if (hasRule("账本大额支出规则")) {
    (data.ledgerRecords || []).filter((item) => item.type === "支出" && Number(item.amount || 0) >= 20000).forEach((item) => triggered.push({
      ruleType: "账本大额支出规则",
      title: `${item.category} 大额支出`,
      reason: `支出金额 ${item.amount} 元 >= 阈值 20000 元`,
      priority: "中"
    }));
  }
  return triggered;
}

export function explainRule(ruleType, data) {
  const found = evaluateRules(data).find((item) => item.ruleType === ruleType) || evaluateRules(data)[0];
  return found ? `${found.title}：${found.reason}。系统根据启用的「${found.ruleType}」生成预警。` : "当前启用规则未发现新的触发记录。";
}

export function runAnalysis(data, { object = "工单", dimension = "按状态", metric = "数量" } = {}) {
  const map = {};
  const add = (key, value = 1) => {
    const name = key || "未分配";
    map[name] = (map[name] || 0) + Number(value || 0);
  };
  const sourceMap = {
    产奶记录: data.milkRecords || [],
    肉牛体重: data.weightRecords || [],
    饲料生产: data.feedProductionRecords || [],
    饲喂执行: data.feedingRecords || [],
    库存: [...(data.feedRawMaterials || []), ...(data.feedProducts || []), ...(data.materials || [])],
    配送: data.deliveries || [],
    账本: data.ledgerRecords || [],
    设备: data.devices || [],
    工单: data.workOrders || []
  };
  const rows = sourceMap[object] || [];
  rows.forEach((item) => {
    const key =
      dimension === "按业务板块" ? item.businessUnit :
      dimension === "按牛舍 / 圈舍" ? item.barn || item.pen || item.target :
      dimension === "按物资分类" ? item.category || item.type :
      dimension === "按客户" ? item.customer || item.name :
      dimension === "按供应商" ? item.supplier :
      dimension === "按负责人" ? item.owner || item.manager || item.driver || item.operator || item.recorder :
      dimension === "按状态" ? item.status || item.alarm || item.online :
      item.name || item.date;
    const value =
      metric === "金额" ? item.amount || item.total || item.expectedIncome || 0 :
      metric === "库存" ? item.stock || 0 :
      metric === "产量" ? item.total || item.quantity || item.actualAmount || item.weight || 0 :
      metric === "成本" ? item.feedCost || item.costPrice || item.expense || 0 :
      1;
    add(key, value);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value, sales: value }));
}
