export function buildSimpleReport({ metrics, data }) {
  if (data && metrics && "inventoryWarningCount" in metrics) {
    return `集团今日经营概况：合力牧业奶牛场产奶 ${metrics.milkAmount.toFixed(1)} 吨，欧力菲德乳品厂原奶入厂 ${metrics.rawMilkReceivedToday.toFixed(1)} 吨；欧力菲德饲料厂生产饲料 ${metrics.feedTodayOutput.toFixed(1)} 吨，并向奶牛场、肉牛场内部调拨；欧力菲德肉牛场当前肉牛档案 ${metrics.beefCowCount} 头，生物资产估值 ${(metrics.biologicalAssetValue / 10000).toFixed(1)} 万元；乳品厂成品库存 ${metrics.dairyProductStock} 件，今日乳品销售 ${metrics.dairySalesToday.toFixed(0)} 元。今日工单 ${metrics.todayWorkOrders} 个，超时 ${metrics.overdueWorkOrders} 个；设备告警 ${metrics.deviceAlerts} 台，环境风险 ${metrics.environmentAlerts} 处。本月集团收入 ${(metrics.monthIncome / 10000).toFixed(1)} 万元，支出 ${(metrics.monthExpense / 10000).toFixed(1)} 万元，结余 ${(metrics.monthBalance / 10000).toFixed(1)} 万元。${metrics.alerts?.length ? `当前有 ${metrics.alerts.length} 条提醒需要处理。` : "当前无明显异常。"}`;
  }
  const focus = data.focusCows.map((cow) => cow.code).slice(0, 2).join("、");
  const pinned = (data.notices || []).find((notice) => notice.pinned);
  const note = data.milkRecords[0]?.note;
  const alertText = metrics.alerts?.length ? `当前有 ${metrics.alerts.length} 条提醒，需要优先处理。` : "当前没有明显异常提醒。";
  return `今日产奶 ${metrics.milkAmount.toFixed(1)} 吨，早班 ${metrics.morningMilk.toFixed(1)} 吨，晚班 ${metrics.eveningMilk.toFixed(1)} 吨。配送任务 ${metrics.destinationCount} 个，配送总量 ${metrics.deliveryAmount.toFixed(1)} 吨，其中待配送 ${metrics.waitingDeliveries} 单、配送中 ${metrics.runningDeliveries} 单、已到达 ${metrics.arrivedDeliveries} 单。当前牛舍 ${metrics.barnCount} 个，特别关注牛只 ${metrics.focusCount} 头，空闲货车 ${metrics.idleTrucks} 辆，维修货车 ${metrics.repairTrucks} 辆。${alertText}${note ? `今日产奶备注：${note}。` : ""}${pinned ? `置顶通知：${pinned.title}。` : ""}建议优先查看 ${focus || "重点关注牛只"}，并确认未完成配送任务。`;
}

export const simpleAiQuestions = [
  "今天集团整体经营情况怎么样？",
  "奶牛场今天产奶多少？",
  "肉牛场当前存栏多少？",
  "饲料厂有哪些库存预警？",
  "乳品厂今天接收了多少原奶？",
  "本月哪个板块收入最高？",
  "本月支出主要花在哪里？",
  "有哪些配送任务还没完成？",
  "哪些业务环节有异常？",
  "今天有哪些工单要优先处理？",
  "帮我查一下重点关注牛在哪里？",
  "今天饲喂执行有没有偏差？",
  "设备和牛舍环境有没有风险？",
  "质量追溯链路完整吗？",
  "乳品厂今天生产入库出库情况？",
  "肉牛生物资产大概值多少钱？",
  "今天有哪些紧急预警？",
  "哪些接口异常？",
  "哪些规则被触发了？",
  "今天谁的工单最多？",
  "哪些审批还没处理？",
  "某头牛最近发生了什么？",
  "哪些设备离线？",
  "本周经营风险有哪些？",
  "给我生成一份集团日报。",
  "这个系统后续上线需要做什么？",
  "给出本周经营建议。"
];

// Compatibility exports for older hidden pages that are no longer in the main flow.
export const demoBatches = [];
export const traceChain = [];
export const demoStores = [];
