const today = new Date().toISOString().slice(0, 10);
const now = () => new Date().toLocaleString("zh-CN", { hour12: false });

export const mobileModuleKeys = [
  "organizations",
  "mobileTasks",
  "smartWorkOrders",
  "feedingTasks",
  "feedingRecords",
  "milkTasks",
  "breedingRecords",
  "breedingReminders",
  "cattleRecords",
  "cattleEvents",
  "medicationRecords",
  "inventoryItems",
  "inventoryMovements",
  "materialRequests",
  "qualityTasks",
  "qualityInspections",
  "shiftHandovers",
  "operationManuals",
  "employeeStats",
  "exceptionReports",
  "workOrders",
  "messages",
  "myRecords",
  "drafts"
];

export function buildMobileModules() {
  return {
    currentUser: {
      id: "user-employee",
      name: "刘师傅",
      role: "员工",
      organizationId: "org-dairy",
      organizationName: "合力牧业奶牛场",
      phone: "13800000001"
    },
    roles: ["员工", "管理员", "只读访客"],
    organizations: [
      { id: "org-dairy", name: "合力牧业奶牛场", type: "奶牛场" },
      { id: "org-beef", name: "欧力菲德肉牛场", type: "肉牛场" },
      { id: "org-feed", name: "欧力菲德饲料厂", type: "饲料厂" },
      { id: "org-plant", name: "欧力菲德乳品厂", type: "乳品厂" }
    ],
    mobileTasks: [
      { id: "task-feed-am", code: "TASK-FEED-001", type: "饲喂", title: "A区泌乳牛舍早班饲喂", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", location: "A区泌乳牛舍", assignee: "刘师傅", plannedTime: `${today} 07:30`, status: "未开始", priority: "重要", relatedId: "feed-task-1", createdAt: `${today} 06:50`, updatedAt: `${today} 06:50`, createdBy: "管理员", remark: "先检查剩料再投料" },
      { id: "task-milk-am", code: "TASK-MILK-001", type: "产奶", title: "A区早班挤奶录入", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", location: "挤奶厅一线", assignee: "刘师傅", plannedTime: `${today} 08:20`, status: "进行中", priority: "紧急", relatedId: "milk-task-1", createdAt: `${today} 06:55`, updatedAt: `${today} 08:20`, createdBy: "管理员", remark: "完成后送检" },
      { id: "task-quality", code: "TASK-QA-001", type: "质检", title: "原奶批次 HL-MILK-AM 待检", organizationId: "org-plant", organizationName: "欧力菲德乳品厂", location: "质检室", assignee: "刘师傅", plannedTime: `${today} 10:00`, status: "未开始", priority: "重要", relatedId: "quality-task-1", createdAt: `${today} 08:40`, updatedAt: `${today} 08:40`, createdBy: "管理员", remark: "检测温度、蛋白、脂肪、体细胞" }
    ],
    feedingTasks: [
      { id: "feed-task-1", code: "FT-001", barn: "A区泌乳牛舍", herd: "泌乳高峰群", shift: "早", formula: "泌乳高峰日粮", feedBatch: "FD-N-20260704", plannedAmount: 8.5, unit: "吨", status: "未开始", owner: "刘师傅", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", createdAt: `${today} 06:30`, updatedAt: `${today} 06:30`, createdBy: "管理员", remark: "先投青贮，后投精补料" },
      { id: "feed-task-2", code: "FT-002", barn: "欧力菲德肉牛育肥一区", herd: "育肥后期群", shift: "中", formula: "育肥后期日粮", feedBatch: "FD-B-20260704", plannedAmount: 6.2, unit: "吨", status: "进行中", owner: "周师傅", organizationId: "org-beef", organizationName: "欧力菲德肉牛场", createdAt: `${today} 07:10`, updatedAt: `${today} 09:10`, createdBy: "管理员", remark: "观察采食速度" }
    ],
    smartWorkOrders: [
      { id: "swo-1", code: "SWO-001", no: "SWO-001", type: "饲喂工单", title: "A区泌乳牛舍早班饲喂", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", relatedObject: "A区泌乳牛舍 / 泌乳高峰群", priority: "重要", status: "处理中", initiator: "管理员", handler: "刘师傅", createdAt: `${today} 06:50`, deadline: `${today} 09:00`, result: "", updatedAt: `${today} 08:00`, createdBy: "管理员", updatedBy: "刘师傅", remark: "记录投料、剩料和采食" },
      { id: "swo-2", code: "SWO-002", no: "SWO-002", type: "产奶工单", title: "A区早班产奶录入并送检", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", relatedObject: "A区泌乳牛舍 / 1号奶罐", priority: "紧急", status: "待处理", initiator: "管理员", handler: "刘师傅", createdAt: `${today} 07:20`, deadline: `${today} 10:00`, result: "", updatedAt: `${today} 07:20`, createdBy: "管理员", updatedBy: "管理员", remark: "异常奶需单独登记" },
      { id: "swo-3", code: "SWO-003", no: "SWO-003", type: "库存工单", title: "育肥牛饲料低库存复核", organizationId: "org-beef", organizationName: "欧力菲德肉牛场", relatedObject: "育肥牛饲料 / FD-B-20260704", priority: "重要", status: "待处理", initiator: "系统", handler: "管理员", createdAt: `${today} 09:45`, deadline: `${today} 15:00`, result: "", updatedAt: `${today} 09:45`, createdBy: "系统", updatedBy: "系统", remark: "确认调拨或采购" }
    ],
    milkTasks: [
      { id: "milk-task-1", code: "MT-001", barn: "A区泌乳牛舍", herd: "泌乳高峰群", shift: "早班", plannedTime: `${today} 08:20`, owner: "刘师傅", status: "进行中", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", createdAt: `${today} 06:40`, updatedAt: `${today} 08:20`, createdBy: "管理员", remark: "结束后生成送检" },
      { id: "milk-task-2", code: "MT-002", barn: "B区泌乳牛舍", herd: "泌乳中期群", shift: "晚班", plannedTime: `${today} 18:30`, owner: "赵师傅", status: "未开始", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", createdAt: `${today} 06:40`, updatedAt: `${today} 06:40`, createdBy: "管理员", remark: "" }
    ],
    cattleRecords: [
      { id: "cattle-1", code: "HL-N-1028", earTag: "HL-N-1028", breed: "荷斯坦", gender: "母", monthAge: 48, barn: "A区泌乳牛舍", herd: "泌乳高峰群", currentStatus: "泌乳", healthStatus: "观察", recentFeeding: "早班采食偏低", recentMilk: "32.4 kg", recentBreeding: "待妊检", recentVaccine: "口蹄疫 2026-06-18", owner: "刘师傅", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "重点关注", createdAt: `${today} 06:00`, updatedAt: `${today} 08:00`, createdBy: "管理员", remark: "乳房炎恢复观察" },
      { id: "cattle-2", code: "HL-N-1160", earTag: "HL-N-1160", breed: "荷斯坦", gender: "母", monthAge: 62, barn: "B区泌乳牛舍", herd: "泌乳中期群", currentStatus: "泌乳", healthStatus: "正常", recentFeeding: "采食正常", recentMilk: "28.8 kg", recentBreeding: "空怀", recentVaccine: "驱虫 2026-06-12", owner: "赵师傅", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "正常", createdAt: `${today} 06:00`, updatedAt: `${today} 08:00`, createdBy: "管理员", remark: "" },
      { id: "cattle-3", code: "OLF-R-2088", earTag: "OLF-R-2088", breed: "西门塔尔", gender: "公", monthAge: 22, barn: "欧力菲德肉牛育肥一区", herd: "育肥后期群", currentStatus: "育肥", healthStatus: "正常", recentFeeding: "中班待执行", recentMilk: "-", recentBreeding: "-", recentVaccine: "口蹄疫 2026-06-20", owner: "周师傅", organizationId: "org-beef", organizationName: "欧力菲德肉牛场", status: "正常", createdAt: `${today} 06:00`, updatedAt: `${today} 08:00`, createdBy: "管理员", remark: "预计 9 月出栏" }
    ],
    cattleEvents: [
      { id: "ce-mobile-1", code: "CE-001", cattleCode: "HL-N-1028", type: "用药", eventTime: `${today} 07:50`, handler: "刘师傅", method: "乳房炎复查后继续观察", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "已记录", createdAt: `${today} 07:55`, updatedAt: `${today} 07:55`, createdBy: "刘师傅", remark: "不进入原奶罐" }
    ],
    breedingReminders: [
      { id: "br-rem-1", code: "BREED-REM-001", cattleCode: "HL-N-1028", type: "待妊检", dueDate: today, organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "待处理", priority: "重要", createdAt: `${today} 06:30`, updatedAt: `${today} 06:30`, createdBy: "系统", updatedBy: "系统", remark: "配种后妊检" },
      { id: "br-rem-2", code: "BREED-REM-002", cattleCode: "HL-N-1160", type: "空怀超期", dueDate: today, organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "待处理", priority: "普通", createdAt: `${today} 06:30`, updatedAt: `${today} 06:30`, createdBy: "系统", updatedBy: "系统", remark: "建议复查发情" }
    ],
    medicationRecords: [
      { id: "med-1", code: "MED-001", cattleCode: "HL-N-1028", medicineName: "乳房炎用药", dose: "20ml", usedAt: `${today} 07:50`, operator: "刘师傅", withdrawalDays: 3, releaseDate: "2026-07-08", affectMilk: true, organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "休药期", priority: "重要", createdAt: `${today} 07:55`, updatedAt: `${today} 07:55`, createdBy: "刘师傅", updatedBy: "刘师傅", remark: "休药期内不得入罐" }
    ],
    inventoryItems: [
      { id: "inv-feed-1", code: "INV-001", name: "奶牛精补料", type: "饲料库存", batch: "FD-N-20260704", stock: 28, unit: "吨", safeStock: 20, supplier: "欧力菲德饲料厂", warehouse: "奶牛场饲料库", inboundAt: `${today} 06:00`, shelfLifeDays: 90, expireAt: "2026-10-02", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "正常", priority: "普通", createdAt: `${today} 06:00`, updatedAt: `${today} 06:00`, createdBy: "库管", updatedBy: "库管", remark: "" },
      { id: "inv-feed-2", code: "INV-002", name: "育肥牛饲料", type: "饲料库存", batch: "FD-B-20260704", stock: 18, unit: "吨", safeStock: 30, supplier: "欧力菲德饲料厂", warehouse: "肉牛场饲料库", inboundAt: `${today} 06:00`, shelfLifeDays: 60, expireAt: "2026-09-02", organizationId: "org-beef", organizationName: "欧力菲德肉牛场", status: "低库存", priority: "重要", createdAt: `${today} 06:00`, updatedAt: `${today} 06:00`, createdBy: "库管", updatedBy: "库管", remark: "需补货" },
      { id: "inv-med-1", code: "INV-003", name: "乳房炎用药", type: "药品库存", batch: "MED-2606", stock: 36, unit: "盒", safeStock: 20, supplier: "兽药供应商", warehouse: "兽药库", inboundAt: "2026-06-20", shelfLifeDays: 365, expireAt: "2027-06-20", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "正常", priority: "普通", createdAt: `${today} 06:00`, updatedAt: `${today} 06:00`, createdBy: "库管", updatedBy: "库管", remark: "" },
      { id: "inv-milk-1", code: "INV-004", name: "原奶", type: "原奶库存", batch: "HL-MILK-AM", stock: 8.2, unit: "吨", safeStock: 2, supplier: "合力牧业奶牛场", warehouse: "1号冷罐", inboundAt: `${today} 09:10`, shelfLifeDays: 1, expireAt: today, organizationId: "org-plant", organizationName: "欧力菲德乳品厂", status: "待质检", priority: "重要", createdAt: `${today} 09:10`, updatedAt: `${today} 09:10`, createdBy: "刘师傅", updatedBy: "刘师傅", remark: "早班入罐" }
    ],
    inventoryMovements: [
      { id: "move-1", code: "OUT-001", movementType: "出库", itemName: "奶牛精补料", batch: "FD-N-20260704", quantity: 6, unit: "吨", purpose: "饲喂", handler: "库管", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "已完成", createdAt: `${today} 07:10`, updatedAt: `${today} 07:10`, createdBy: "库管", remark: "早班饲喂领用" }
    ],
    materialRequests: [
      { id: "mr-1", code: "MR-001", applicant: "刘师傅", materialType: "饲料", materialName: "奶牛精补料", quantity: 2, unit: "吨", purpose: "晚班饲喂备用", expectedAt: `${today} 16:00`, urgent: false, organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "待审核", createdAt: `${today} 09:30`, updatedAt: `${today} 09:30`, createdBy: "刘师傅", remark: "" }
    ],
    qualityTasks: [
      { id: "quality-task-1", code: "QT-001", sampleType: "原奶", relatedBatch: "HL-MILK-AM", sourceOrganization: "合力牧业奶牛场", sampledAt: `${today} 09:20`, sender: "刘师傅", status: "待检", organizationId: "org-plant", organizationName: "欧力菲德乳品厂", createdAt: `${today} 09:20`, updatedAt: `${today} 09:20`, createdBy: "系统", remark: "早班产奶自动生成" },
      { id: "quality-task-2", code: "QT-002", sampleType: "饲料", relatedBatch: "FD-B-20260704", sourceOrganization: "欧力菲德饲料厂", sampledAt: `${today} 10:10`, sender: "库管", status: "待检", organizationId: "org-feed", organizationName: "欧力菲德饲料厂", createdAt: `${today} 10:10`, updatedAt: `${today} 10:10`, createdBy: "库管", remark: "育肥料复检" }
    ],
    qualityInspections: [
      { id: "qi-1", code: "QI-001", inspectionType: "原奶质检", batch: "HL-MILK-AM", sampleType: "原奶", result: "合格", inspector: "质检员", organizationId: "org-plant", organizationName: "欧力菲德乳品厂", status: "已完成", createdAt: `${today} 10:40`, updatedAt: `${today} 10:40`, createdBy: "质检员", remark: "温度、蛋白、脂肪均合格" }
    ],
    shiftHandovers: [
      { id: "handover-1", code: "HO-001", fromUser: "夜班", toUser: "刘师傅", shift: "早班", handoverAt: `${today} 07:00`, unfinishedItems: "A区泌乳牛舍早班饲喂未完成", abnormalCattle: "HL-N-1028 继续观察", abnormalInventory: "育肥牛饲料低库存", abnormalQuality: "无", focusCattle: "HL-N-1028、HL-N-1160", notes: "先处理产奶送检", attachment: "图片占位", confirmed: true, organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "已交接", priority: "普通", createdAt: `${today} 07:00`, updatedAt: `${today} 07:00`, createdBy: "夜班", updatedBy: "刘师傅", remark: "" }
    ],
    operationManuals: [
      { id: "manual-feed", code: "MAN-001", title: "饲喂操作规范", scene: "TMR 投料与剩料检查", steps: ["核对牛舍牛群和配方", "先检查剩料和饲料霉变", "按计划投料并记录实际量", "发现采食异常立即上报"], cautions: ["投料偏差超过 10% 必须备注", "霉变饲料不得投喂"], organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "启用", priority: "普通", createdAt: `${today} 06:00`, updatedAt: `${today} 06:00`, createdBy: "管理员", updatedBy: "管理员", remark: "" },
      { id: "manual-milk", code: "MAN-002", title: "挤奶操作规范", scene: "早中晚班挤奶", steps: ["确认牛群和入罐编号", "异常奶单独登记", "记录温度、蛋白、脂肪等指标", "需要送检时勾选送检"], cautions: ["休药期牛奶不得入罐", "温度异常及时上报"], organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "启用", priority: "普通", createdAt: `${today} 06:00`, updatedAt: `${today} 06:00`, createdBy: "管理员", updatedBy: "管理员", remark: "" },
      { id: "manual-quality", code: "MAN-003", title: "质检采样规范", scene: "原奶、饲料、成品采样", steps: ["核对批次和来源", "填写采样时间和送检人", "录入检测项目", "不合格选择处理方式"], cautions: ["不合格批次先隔离", "复检前不得出库"], organizationId: "org-plant", organizationName: "欧力菲德乳品厂", status: "启用", priority: "普通", createdAt: `${today} 06:00`, updatedAt: `${today} 06:00`, createdBy: "管理员", updatedBy: "管理员", remark: "" }
    ],
    employeeStats: [
      { id: "stat-1", code: "STAT-001", employee: "刘师傅", todayDone: 4, weekDone: 23, pending: 3, exceptionCount: 1, rejectedCount: 0, feedingDeviationCount: 1, completionRate: 86, feedingAccuracy: 94, avgHandleMinutes: 28, organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "正常", priority: "普通", createdAt: `${today} 06:00`, updatedAt: `${today} 12:00`, createdBy: "系统", updatedBy: "系统", remark: "" },
      { id: "stat-2", code: "STAT-002", employee: "周师傅", todayDone: 2, weekDone: 18, pending: 2, exceptionCount: 2, rejectedCount: 1, feedingDeviationCount: 2, completionRate: 78, feedingAccuracy: 89, avgHandleMinutes: 42, organizationId: "org-beef", organizationName: "欧力菲德肉牛场", status: "关注", priority: "重要", createdAt: `${today} 06:00`, updatedAt: `${today} 12:00`, createdBy: "系统", updatedBy: "系统", remark: "低库存工单待处理" }
    ],
    exceptionReports: [
      { id: "ex-1", code: "EX-001", exceptionType: "库存异常", location: "肉牛场饲料库", relatedObject: "育肥牛饲料", description: "育肥牛饲料低于安全库存", urgency: "重要", reporter: "周师傅", organizationId: "org-beef", organizationName: "欧力菲德肉牛场", status: "已生成工单", createdAt: `${today} 09:40`, updatedAt: `${today} 09:40`, createdBy: "周师傅", remark: "" }
    ],
    workOrders: [
      { id: "wo-1", code: "WO-001", no: "WO-001", source: "异常上报", type: "库存异常", title: "育肥牛饲料低库存处理", content: "肉牛场饲料库低于安全库存，请确认调拨。", status: "待处理", initiator: "周师傅", handler: "管理员", businessUnit: "欧力菲德肉牛场", organizationId: "org-beef", organizationName: "欧力菲德肉牛场", relatedBusiness: "库存异常", createdAt: `${today} 09:45`, deadline: `${today} 15:00`, plannedAt: `${today} 15:00`, processLog: "系统由异常上报自动生成", result: "", reviewer: "", updatedAt: `${today} 09:45`, createdBy: "周师傅", remark: "" },
      { id: "wo-2", code: "WO-002", no: "WO-002", source: "饲喂任务", type: "饲喂工单", title: "A区泌乳牛舍早班饲喂", content: "执行泌乳高峰日粮投喂，并记录剩料。", status: "处理中", initiator: "管理员", handler: "刘师傅", businessUnit: "合力牧业奶牛场", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", relatedBusiness: "饲喂", createdAt: `${today} 06:50`, deadline: `${today} 09:00`, plannedAt: `${today} 09:00`, processLog: "已开始", result: "", reviewer: "", updatedAt: `${today} 08:00`, createdBy: "管理员", remark: "" }
    ],
    messages: [
      { id: "msg-mobile-1", code: "MSG-001", title: "早班产奶任务进行中", type: "今日任务提醒", relatedBusiness: "产奶", relatedId: "milk-task-1", priority: "紧急", status: "未读", receiver: "刘师傅", businessUnit: "合力牧业奶牛场", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", content: "请完成 A 区早班产奶录入并选择是否送检。", createdAt: `${today} 08:20`, updatedAt: `${today} 08:20`, createdBy: "系统", remark: "" },
      { id: "msg-mobile-2", code: "MSG-002", title: "育肥牛饲料库存偏低", type: "库存预警", relatedBusiness: "库存", relatedId: "inv-feed-2", priority: "重要", status: "未读", receiver: "管理员", businessUnit: "欧力菲德肉牛场", organizationId: "org-beef", organizationName: "欧力菲德肉牛场", content: "当前库存 18 吨，低于安全库存 30 吨。", createdAt: `${today} 09:40`, updatedAt: `${today} 09:40`, createdBy: "系统", remark: "" }
    ],
    myRecords: [
      { id: "my-1", code: "MY-001", type: "领料申请", title: "奶牛精补料晚班备用", status: "待审核", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", relatedId: "mr-1", createdAt: `${today} 09:30`, updatedAt: `${today} 09:30`, createdBy: "刘师傅", remark: "" },
      { id: "my-2", code: "MY-002", type: "牛只事件", title: "HL-N-1028 用药观察", status: "已记录", organizationId: "org-dairy", organizationName: "合力牧业奶牛场", relatedId: "ce-mobile-1", createdAt: `${today} 07:55`, updatedAt: `${today} 07:55`, createdBy: "刘师傅", remark: "" }
    ],
    drafts: [
      { id: "draft-1", code: "DRAFT-001", module: "饲喂管理", title: "A区泌乳牛舍晚班饲喂草稿", payload: { barn: "A区泌乳牛舍", shift: "晚", plannedAmount: 8.2 }, organizationId: "org-dairy", organizationName: "合力牧业奶牛场", status: "草稿", priority: "普通", createdAt: `${today} 11:20`, updatedAt: `${today} 11:20`, createdBy: "刘师傅", updatedBy: "刘师傅", remark: "模拟离线暂存能力" }
    ]
  };
}

export function mobileTimestamp() {
  return now();
}
