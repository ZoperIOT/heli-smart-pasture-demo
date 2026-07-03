export const extendedModuleKeys = [
  "workOrders",
  "cowLocations",
  "feedFormulas",
  "feedingPlans",
  "feedingRecords",
  "herdGroups",
  "breedingRecords",
  "healthEvents",
  "devices",
  "environmentRecords",
  "weighbridgeRecords",
  "traceabilityChains",
  "dairyProductionPlans",
  "fillingRecords",
  "finishedQualityRecords",
  "finishedInRecords",
  "finishedOutRecords",
  "returnRecords",
  "partners",
  "employees",
  "biologicalAssets"
];

export function buildExtendedModules(todayText, monthText) {
  return {
    workOrders: [
      { id: "wo-1", no: "WO-FEED-001", type: "饲喂工单", businessUnit: "合力牧业奶牛场", content: "A区泌乳高峰群早班 TMR 投料", owner: "刘师傅", plannedAt: `${todayText} 06:30`, finishedAt: `${todayText} 07:05`, status: "已完成", priority: "高", relatedBusiness: "饲喂计划 FP-001", note: "实际投料略低于计划" },
      { id: "wo-2", no: "WO-MILK-002", type: "产奶工单", businessUnit: "合力牧业奶牛场", content: "晚班挤奶和冷罐温度复核", owner: "赵师傅", plannedAt: `${todayText} 18:00`, finishedAt: "", status: "待执行", priority: "高", relatedBusiness: "产奶记录 milk-today", note: "完成后同步产奶记录" },
      { id: "wo-3", no: "WO-QC-003", type: "质检工单", businessUnit: "欧力菲德乳品厂", content: "原奶批次 milk-rec-1 入厂质检", owner: "质检员", plannedAt: `${todayText} 10:20`, finishedAt: `${todayText} 10:46`, status: "已完成", priority: "高", relatedBusiness: "质检记录 quality-1", note: "抗生素残留阴性" },
      { id: "wo-4", no: "WO-VAC-004", type: "防疫工单", businessUnit: "欧力菲德肉牛场", content: "育肥二区驱虫复核", owner: "兽医", plannedAt: `${todayText} 09:00`, finishedAt: "", status: "超时", priority: "中", relatedBusiness: "健康防疫 HE-002", note: "上午未完成，下午优先处理" },
      { id: "wo-5", no: "WO-REP-005", type: "维修工单", businessUnit: "欧力菲德饲料厂", content: "TMR 皮带机异响检查", owner: "设备员", plannedAt: `${todayText} 14:30`, finishedAt: "", status: "待执行", priority: "中", relatedBusiness: "设备 DEV-005", note: "不影响当前生产" },
      { id: "wo-6", no: "WO-INV-006", type: "盘点工单", businessUnit: "欧力菲德乳品厂", content: "巴氏鲜奶成品库抽盘", owner: "库管", plannedAt: `${todayText} 16:00`, finishedAt: "", status: "待执行", priority: "低", relatedBusiness: "成品库存 dairy-stock-1", note: "盘点后更新库存" }
    ],
    cowLocations: [
      { id: "loc-1", code: "HL-N-1028", businessUnit: "合力牧业奶牛场", area: "A区泌乳牛舍", position: "A-03 采食通道附近", lastSeenAt: `${todayText} 09:42`, source: "模拟电子耳标", note: "重点关注" },
      { id: "loc-2", code: "HL-N-1160", businessUnit: "合力牧业奶牛场", area: "B区泌乳牛舍", position: "B-07 卧床区", lastSeenAt: `${todayText} 09:37`, source: "模拟项圈", note: "产奶下降复核" },
      { id: "loc-3", code: "OLF-R-2088", businessUnit: "欧力菲德肉牛场", area: "育肥一区", position: "1号栏东侧料槽", lastSeenAt: `${todayText} 09:45`, source: "模拟耳标", note: "采食正常" },
      { id: "loc-4", code: "OLF-R-2190", businessUnit: "欧力菲德肉牛场", area: "育肥二区", position: "2号栏饮水区", lastSeenAt: `${todayText} 09:40`, source: "模拟耳标", note: "" }
    ],
    feedFormulas: [
      { id: "formula-1", name: "泌乳高峰群日粮", businessUnit: "合力牧业奶牛场", target: "泌乳高峰群", composition: "青贮 45%、奶牛精补料 32%、苜蓿 18%、预混料 5%", plannedAmount: 15.2, unit: "吨/日", milkFeedRatio: "1.42:1", beefFeedRatio: "-", owner: "营养师", note: "关联高产奶牛" },
      { id: "formula-2", name: "育肥后期日粮", businessUnit: "欧力菲德肉牛场", target: "育肥后期群", composition: "玉米 48%、育肥牛饲料 34%、麦麸 12%、预混料 6%", plannedAmount: 18.5, unit: "吨/日", milkFeedRatio: "-", beefFeedRatio: "6.1:1", owner: "营养师", note: "预计 90 天出栏" }
    ],
    feedingPlans: [
      { id: "feed-plan-1", date: todayText, businessUnit: "合力牧业奶牛场", target: "泌乳高峰群", formula: "泌乳高峰群日粮", plannedAmount: 15.2, shift: "早班", owner: "刘师傅", status: "已下发", note: "联动奶牛场库存" },
      { id: "feed-plan-2", date: todayText, businessUnit: "欧力菲德肉牛场", target: "育肥后期群", formula: "育肥后期日粮", plannedAmount: 18.5, shift: "中班", owner: "周师傅", status: "执行中", note: "联动肉牛场库存" }
    ],
    feedingRecords: [
      { id: "feed-run-1", date: todayText, businessUnit: "合力牧业奶牛场", target: "泌乳高峰群", formula: "泌乳高峰群日粮", plannedAmount: 15.2, actualAmount: 14.9, errorRate: "-2.0%", shift: "早班", owner: "刘师傅", note: "奶牛精补料消耗 4.8 吨" },
      { id: "feed-run-2", date: todayText, businessUnit: "欧力菲德肉牛场", target: "育肥后期群", formula: "育肥后期日粮", plannedAmount: 18.5, actualAmount: 18.7, errorRate: "+1.1%", shift: "中班", owner: "周师傅", note: "育肥牛饲料消耗 6.4 吨" }
    ],
    herdGroups: [
      { id: "group-1", name: "泌乳高峰群", businessUnit: "合力牧业奶牛场", animalType: "奶牛", count: 186, formula: "泌乳高峰群日粮", healthPlan: "每周乳房炎筛查", statistic: "日产奶 7.8 吨", owner: "刘师傅", note: "重点经营群组" },
      { id: "group-2", name: "围产期群", businessUnit: "合力牧业奶牛场", animalType: "奶牛", count: 42, formula: "围产期过渡日粮", healthPlan: "每日观察", statistic: "即将产犊 3 头", owner: "赵师傅", note: "繁育重点" },
      { id: "group-3", name: "育肥后期群", businessUnit: "欧力菲德肉牛场", animalType: "肉牛", count: 126, formula: "育肥后期日粮", healthPlan: "驱虫到期复核", statistic: "均重 548kg", owner: "周师傅", note: "出栏预备" },
      { id: "group-4", name: "异常观察群", businessUnit: "欧力菲德肉牛场", animalType: "肉牛", count: 8, formula: "恢复期日粮", healthPlan: "兽医复诊", statistic: "2 头采食偏低", owner: "兽医", note: "需跟进" }
    ],
    breedingRecords: [
      { id: "breed-1", code: "HL-N-1028", heatDate: `${monthText}-18`, matingDate: `${monthText}-19`, pregnancyCheckDate: `${todayText}`, pregnancyResult: "待妊检", dueDate: "2027-04-03", calvingDate: "", calvingResult: "", owner: "繁育员", note: "今日妊检提醒" },
      { id: "breed-2", code: "HL-N-1386", heatDate: "2026-05-11", matingDate: "2026-05-12", pregnancyCheckDate: `${monthText}-28`, pregnancyResult: "已孕", dueDate: "2027-02-18", calvingDate: "", calvingResult: "", owner: "繁育员", note: "围产期前 60 天提醒" }
    ],
    healthEvents: [
      { id: "health-1", code: "HL-N-1028", date: todayText, businessUnit: "合力牧业奶牛场", eventType: "用药记录", treatment: "乳房炎治疗", medicine: "乳房炎用药", owner: "兽医", withdrawalUntil: "2026-07-08", status: "休药期", note: "该牛奶不得入罐" },
      { id: "health-2", code: "OLF-R-2190", date: todayText, businessUnit: "欧力菲德肉牛场", eventType: "驱虫记录", treatment: "育肥二区驱虫", medicine: "伊维菌素", owner: "兽医", withdrawalUntil: "2026-07-12", status: "待复核", note: "生成防疫工单" },
      { id: "health-3", code: "HL-N-1160", date: `${monthText}-25`, businessUnit: "合力牧业奶牛场", eventType: "疫苗记录", treatment: "口蹄疫免疫", medicine: "口蹄疫疫苗", owner: "兽医", withdrawalUntil: "", status: "已完成", note: "下次 12 月复免" }
    ],
    devices: [
      { id: "dev-1", name: "A区电子耳标网关", type: "电子耳标", businessUnit: "合力牧业奶牛场", location: "A区泌乳牛舍", online: "在线", lastUploadAt: `${todayText} 09:46`, todayDataCount: 12860, alarm: "正常", note: "模拟 IoT 数据" },
      { id: "dev-2", name: "育肥区自动称重栏", type: "自动称重", businessUnit: "欧力菲德肉牛场", location: "育肥一区入口", online: "在线", lastUploadAt: `${todayText} 09:30`, todayDataCount: 216, alarm: "正常", note: "称重数据进入体重记录" },
      { id: "dev-3", name: "饲料厂 TMR 设备", type: "TMR 饲喂设备", businessUnit: "欧力菲德饲料厂", location: "生产一线", online: "在线", lastUploadAt: `${todayText} 09:20`, todayDataCount: 86, alarm: "待检修", note: "皮带机异响" },
      { id: "dev-4", name: "乳品厂灌装线 A", type: "乳品厂生产设备", businessUnit: "欧力菲德乳品厂", location: "灌装车间", online: "在线", lastUploadAt: `${todayText} 09:35`, todayDataCount: 5200, alarm: "正常", note: "巴氏鲜奶批次" },
      { id: "dev-5", name: "B区环境传感器", type: "环境传感器", businessUnit: "合力牧业奶牛场", location: "B区泌乳牛舍", online: "离线", lastUploadAt: `${todayText} 07:10`, todayDataCount: 42, alarm: "离线", note: "需要检查供电" }
    ],
    environmentRecords: [
      { id: "env-1", barn: "A区泌乳牛舍", businessUnit: "合力牧业奶牛场", temperature: 25.6, humidity: 62, ammonia: 8, light: 420, fanStatus: "开启", sprayStatus: "关闭", comfortIndex: 82, heatStressRisk: "低", note: "舒适" },
      { id: "env-2", barn: "B区泌乳牛舍", businessUnit: "合力牧业奶牛场", temperature: 31.8, humidity: 74, ammonia: 16, light: 380, fanStatus: "开启", sprayStatus: "开启", comfortIndex: 64, heatStressRisk: "中", note: "温湿度偏高" },
      { id: "env-3", barn: "欧力菲德肉牛育肥区", businessUnit: "欧力菲德肉牛场", temperature: 28.4, humidity: 58, ammonia: 10, light: 460, fanStatus: "开启", sprayStatus: "关闭", comfortIndex: 78, heatStressRisk: "低", note: "正常" }
    ],
    weighbridgeRecords: [
      { id: "wb-1", no: "WB-20260703-001", vehicle: "鲁G·HL003", driver: "张师傅", goods: "奶牛精补料", businessType: "饲料成品出厂", grossWeight: 31.2, tareWeight: 19.0, netWeight: 12.2, relatedBusiness: "内部调拨 transfer-1", weighedAt: `${todayText} 08:35`, note: "联动调拨出库" },
      { id: "wb-2", no: "WB-20260703-002", vehicle: "鲁G·HL001", driver: "王师傅", goods: "原奶", businessType: "原奶配送", grossWeight: 27.5, tareWeight: 19.4, netWeight: 8.1, relatedBusiness: "原奶配送 YN-001", weighedAt: `${todayText} 09:05`, note: "联动原奶入厂" },
      { id: "wb-3", no: "WB-20260703-003", vehicle: "鲁G·HL006", driver: "外部司机", goods: "肉牛", businessType: "肉牛出栏", grossWeight: 42.6, tareWeight: 30.8, netWeight: 11.8, relatedBusiness: "出栏销售 beef-sale-1", weighedAt: `${todayText} 10:10`, note: "联动肉牛销售" }
    ],
    traceabilityChains: [
      { id: "trace-1", batch: "TRACE-MILK-001", product: "巴氏鲜奶", chain: "玉米/豆粕原料批次 RAW-001 -> 奶牛精补料 FEED-001 -> 合力牧业奶牛场泌乳高峰群饲喂 -> 原奶批次 milk-rec-1 -> 欧力菲德乳品厂巴氏鲜奶 dairy-prod-1 -> 销售订单 dairy-order-1", status: "完整", owner: "质检员", note: "从饲料到成品订单的演示链路" },
      { id: "trace-2", batch: "TRACE-BEEF-001", product: "育肥肉牛", chain: "玉米/麦麸原料批次 RAW-002 -> 育肥牛饲料 FEED-002 -> 欧力菲德肉牛场育肥后期群 -> 出栏批次 beef-sale-1 -> 肉牛销售收入", status: "完整", owner: "周师傅", note: "生物资产到销售链路" }
    ],
    dairyProductionPlans: [
      { id: "mes-plan-1", date: todayText, productName: "巴氏鲜奶", plannedQuantity: 5200, rawMilkNeed: 5.2, line: "灌装线 A", status: "已排产", owner: "乳品厂生产负责人", note: "减少原奶库存，增加成品库存" },
      { id: "mes-plan-2", date: todayText, productName: "酸奶", plannedQuantity: 2600, rawMilkNeed: 1.8, line: "发酵线 B", status: "生产中", owner: "乳品厂生产负责人", note: "发酵后入库" }
    ],
    fillingRecords: [
      { id: "fill-1", date: todayText, batch: "dairy-prod-1", productName: "巴氏鲜奶", line: "灌装线 A", quantity: 5200, unit: "瓶", operator: "灌装员", status: "已完成", note: "瓶装规格 950ml" }
    ],
    finishedQualityRecords: [
      { id: "fq-1", date: todayText, batch: "dairy-prod-1", productName: "巴氏鲜奶", temperature: 4.2, colony: "合格", sensory: "正常", result: "合格", inspector: "质检员", note: "成品质检通过" }
    ],
    finishedInRecords: [
      { id: "fin-in-1", date: todayText, batch: "dairy-prod-1", productName: "巴氏鲜奶", quantity: 5200, unit: "瓶", warehouse: "成品冷库一", operator: "库管", note: "生产入库" }
    ],
    finishedOutRecords: [
      { id: "fin-out-1", date: todayText, orderNo: "SO-001", productName: "巴氏鲜奶", quantity: 1200, unit: "瓶", customer: "城区自有门店", operator: "库管", note: "销售出库" }
    ],
    returnRecords: [
      { id: "return-1", date: todayText, customer: "城区二店", productName: "酸奶", quantity: 24, unit: "杯", reason: "临期退回", handler: "销售内勤", status: "已登记", note: "待报损审批" }
    ],
    partners: [
      { id: "partner-1", name: "城区自有门店", role: "客户", contact: "王店长", phone: "13800001001", address: "城区一店", cooperationType: "乳品客户", latestTrade: `${todayText} 巴氏鲜奶 1200 瓶`, note: "长期客户" },
      { id: "partner-2", name: "本地肉联厂", role: "客户", contact: "李经理", phone: "13800001002", address: "潍坊", cooperationType: "肉牛客户", latestTrade: `${monthText}-20 肉牛出栏`, note: "" },
      { id: "partner-3", name: "山东粮贸公司", role: "供应商", contact: "张经理", phone: "13800001003", address: "山东", cooperationType: "饲料原料供应商", latestTrade: `${todayText} 玉米采购`, note: "账期 30 天" },
      { id: "partner-4", name: "兽药公司", role: "供应商", contact: "刘经理", phone: "13800001004", address: "青州", cooperationType: "兽药供应商", latestTrade: "乳房炎用药采购", note: "" }
    ],
    employees: [
      { id: "emp-1", name: "刘师傅", role: "奶牛饲养员", businessUnit: "合力牧业奶牛场", phone: "13800002001", todayWorkOrders: 3, finishedWorkOrders: 2, overdueWorkOrders: 0, note: "负责 A 区" },
      { id: "emp-2", name: "周师傅", role: "肉牛场班长", businessUnit: "欧力菲德肉牛场", phone: "13800002002", todayWorkOrders: 2, finishedWorkOrders: 1, overdueWorkOrders: 1, note: "负责育肥区" },
      { id: "emp-3", name: "饲料厂班长", role: "生产班长", businessUnit: "欧力菲德饲料厂", phone: "13800002003", todayWorkOrders: 2, finishedWorkOrders: 1, overdueWorkOrders: 0, note: "负责生产线" },
      { id: "emp-4", name: "质检员", role: "质检员", businessUnit: "欧力菲德乳品厂", phone: "13800002004", todayWorkOrders: 3, finishedWorkOrders: 2, overdueWorkOrders: 0, note: "负责原奶和成品质检" }
    ],
    biologicalAssets: [
      { id: "asset-1", code: "OLF-R-2088", batch: "2026春季育肥批次", currentWeight: 530, estimatedUnitPrice: 31.8, estimatedValue: 16854, feedCost: 3580, medicineCost: 126, grossProfitEstimate: 3920, readyForSale: "否", note: "继续育肥" },
      { id: "asset-2", code: "OLF-R-2190", batch: "2026春季育肥批次", currentWeight: 505, estimatedUnitPrice: 31.2, estimatedValue: 15756, feedCost: 3420, medicineCost: 98, grossProfitEstimate: 3650, readyForSale: "否", note: "采食正常" },
      { id: "asset-3", code: "OLF-R-2306", batch: "2025冬季育肥批次", currentWeight: 650, estimatedUnitPrice: 32.0, estimatedValue: 20800, feedCost: 4860, medicineCost: 210, grossProfitEstimate: 5100, readyForSale: "是", note: "可安排出栏" }
    ]
  };
}
