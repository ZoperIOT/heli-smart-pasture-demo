export const today = "2026-06-27";

export const overview = [
  { label: "今日产奶量", value: "18.6", unit: "吨", tone: "green" },
  { label: "今日配送量", value: "16.8", unit: "吨", tone: "blue" },
  { label: "奶牛数量", value: "1260", unit: "头", tone: "green" },
  { label: "肉牛数量", value: "430", unit: "头", tone: "amber" },
  { label: "今日订单数", value: "28", unit: "单", tone: "blue" },
  { label: "质检合格率", value: "99.2", unit: "%", tone: "green" },
  { label: "在途车辆", value: "5", unit: "辆", tone: "sky" },
  { label: "门店库存预警", value: "3", unit: "家", tone: "red" }
];

export const milkTrend = [
  { day: "06/21", milk: 17.8, delivery: 15.9 },
  { day: "06/22", milk: 18.1, delivery: 16.2 },
  { day: "06/23", milk: 18.4, delivery: 16.7 },
  { day: "06/24", milk: 17.9, delivery: 16.0 },
  { day: "06/25", milk: 18.7, delivery: 17.2 },
  { day: "06/26", milk: 18.3, delivery: 16.4 },
  { day: "06/27", milk: 18.6, delivery: 16.8 }
];

export const cattle = [
  {
    id: "HL-D-0836",
    type: "奶牛",
    barn: "A2 高产牛舍",
    status: "健康",
    dailyMilk: "34.8 kg",
    health: "体温 38.5℃，采食正常",
    records: {
      milk: ["早班 13.2kg", "中班 10.6kg", "晚班 11.0kg"],
      health: ["06-27 自动项圈活动量正常", "06-20 兽医例检正常"],
      medicine: ["近 60 天无用药"],
      breeding: ["2026-05-18 已配种，待孕检"],
      feeding: ["TMR 日粮 42kg，精补料 6.5kg"]
    }
  },
  {
    id: "HL-D-0912",
    type: "奶牛",
    barn: "B1 泌乳牛舍",
    status: "观察",
    dailyMilk: "24.1 kg",
    health: "近三日产量下降 12%，建议复检",
    alert: true,
    records: {
      milk: ["早班 8.4kg", "中班 7.6kg", "晚班 8.1kg"],
      health: ["06-27 反刍时长偏低", "06-26 采食量下降"],
      medicine: ["06-12 维生素补充，已结束"],
      breeding: ["空怀，计划 07-05 配种"],
      feeding: ["TMR 日粮 39kg，增加青贮观察"]
    }
  },
  {
    id: "HL-D-0761",
    type: "奶牛",
    barn: "A1 高产牛舍",
    status: "待配种",
    dailyMilk: "31.6 kg",
    health: "健康记录稳定",
    records: {
      milk: ["早班 12.1kg", "中班 9.5kg", "晚班 10.0kg"],
      health: ["06-26 运动量达标"],
      medicine: ["无"],
      breeding: ["发情监测提醒，48 小时内复核"],
      feeding: ["TMR 日粮 41kg"]
    }
  },
  {
    id: "HL-B-0319",
    type: "肉牛",
    barn: "C3 育肥牛舍",
    status: "育肥中",
    weight: "468 kg",
    health: "日增重 1.32kg，状态良好",
    records: {
      milk: ["不适用"],
      health: ["06-27 采食与饮水正常"],
      medicine: ["近 45 天无用药"],
      breeding: ["不适用"],
      feeding: ["育肥日粮 18kg，青贮 11kg"]
    }
  },
  {
    id: "HL-B-0284",
    type: "肉牛",
    barn: "C1 隔离观察栏",
    status: "治疗",
    weight: "421 kg",
    health: "轻微跛行，兽医跟进",
    alert: true,
    records: {
      milk: ["不适用"],
      health: ["06-27 左后蹄复查", "06-25 转入观察栏"],
      medicine: ["06-26 外用消炎处理"],
      breeding: ["不适用"],
      feeding: ["采食下降 8%，单独记录"]
    }
  }
];

export const milkBatches = [
  {
    id: "HL20260627-AM-001",
    time: "06:18",
    tank: "1 号奶罐",
    barn: "A1/A2",
    volume: "7.2 吨",
    temperature: "3.8℃",
    status: "已合格",
    fat: "3.92%",
    protein: "3.31%",
    somatic: "18 万/ml",
    bacteria: "3,600 CFU/ml",
    antibiotic: "未检出"
  },
  {
    id: "HL20260627-MD-002",
    time: "12:12",
    tank: "2 号奶罐",
    barn: "B1/B2",
    volume: "5.9 吨",
    temperature: "4.0℃",
    status: "已出库",
    fat: "3.86%",
    protein: "3.27%",
    somatic: "21 万/ml",
    bacteria: "4,100 CFU/ml",
    antibiotic: "未检出"
  },
  {
    id: "HL20260627-PM-003",
    time: "19:04",
    tank: "3 号奶罐",
    barn: "A2/B3",
    volume: "5.5 吨",
    temperature: "4.2℃",
    status: "待质检",
    fat: "待检",
    protein: "待检",
    somatic: "待检",
    bacteria: "待检",
    antibiotic: "待检"
  },
  {
    id: "HL20260626-PM-004",
    time: "20:10",
    tank: "4 号奶罐",
    barn: "B2",
    volume: "1.1 吨",
    temperature: "5.8℃",
    status: "异常锁定",
    fat: "3.74%",
    protein: "3.18%",
    somatic: "39 万/ml",
    bacteria: "8,900 CFU/ml",
    antibiotic: "未检出"
  }
];

export const traceSteps = [
  "早班挤奶完成",
  "进入 1 号奶罐",
  "质检合格",
  "装车冷链配送",
  "客户签收",
  "门店入库或乳企接收"
];

export const deliveries = [
  {
    customer: "雀巢乳品",
    type: "乳企客户",
    amount: "9.6 吨",
    batch: "HL20260627-AM-001",
    car: "鲁Q·A3188 冷链罐车",
    driver: "李师傅",
    loadTime: "08:20",
    eta: "10:40",
    status: "配送中",
    temp: "3.7℃ / 3.9℃ / 3.8℃",
    photo: "待上传",
    note: "高速入口排队，预计延迟 12 分钟"
  },
  {
    customer: "城区一店",
    type: "自有门店",
    amount: "680 kg",
    batch: "HL20260627-MD-002",
    car: "鲁Q·B0626 冷藏车",
    driver: "王师傅",
    loadTime: "13:05",
    eta: "14:10",
    status: "已签收",
    temp: "3.6℃ / 3.7℃",
    photo: "已留存",
    note: "无异常"
  },
  {
    customer: "城区二店",
    type: "自有门店",
    amount: "520 kg",
    batch: "HL20260627-MD-002",
    car: "鲁Q·B0626 冷藏车",
    driver: "王师傅",
    loadTime: "13:05",
    eta: "14:45",
    status: "配送中",
    temp: "3.8℃ / 3.8℃",
    photo: "待上传",
    note: "门店要求加配酸奶 40 箱"
  },
  {
    customer: "社区团购客户",
    type: "团购客户",
    amount: "420 kg",
    batch: "HL20260627-AM-001",
    car: "鲁Q·C1129 厢式冷藏",
    driver: "赵师傅",
    loadTime: "09:30",
    eta: "11:20",
    status: "已签收",
    temp: "4.1℃ / 4.0℃",
    photo: "已留存",
    note: "分拣点签收"
  },
  {
    customer: "学校食堂",
    type: "团餐客户",
    amount: "360 kg",
    batch: "HL20260627-AM-001",
    car: "鲁Q·D7702 冷藏车",
    driver: "陈师傅",
    loadTime: "10:00",
    eta: "11:05",
    status: "异常",
    temp: "4.3℃ / 4.9℃",
    photo: "待补传",
    note: "收货人临时变更，需主管确认"
  },
  {
    customer: "牧场体验店",
    type: "自有门店",
    amount: "280 kg",
    batch: "HL20260627-PM-003",
    car: "待分配",
    driver: "待分配",
    loadTime: "20:30",
    eta: "21:15",
    status: "待装车",
    temp: "待记录",
    photo: "待上传",
    note: "等待晚班批次质检"
  }
];

export const stores = [
  {
    name: "城区一店",
    replenishment: "680 kg",
    inventory: "212 kg",
    sales: "438 kg",
    loss: "7 kg",
    status: "正常",
    freshMilk: 212,
    yogurt: 86,
    ecology: 45,
    suggest: "明日建议补货 720 kg，酸奶 90 箱",
    trend: [410, 426, 398, 452, 470, 441, 438]
  },
  {
    name: "城区二店",
    replenishment: "520 kg",
    inventory: "68 kg",
    sales: "419 kg",
    loss: "4 kg",
    status: "偏低",
    freshMilk: 68,
    yogurt: 42,
    ecology: 28,
    suggest: "明早优先补货 640 kg，鲜奶加配 120 kg",
    trend: [320, 360, 384, 401, 428, 432, 419]
  },
  {
    name: "牧场体验店",
    replenishment: "280 kg",
    inventory: "54 kg",
    sales: "196 kg",
    loss: "3 kg",
    status: "即将过期",
    freshMilk: 54,
    yogurt: 31,
    ecology: 62,
    suggest: "先促销临期库存，明日补货降至 220 kg",
    trend: [188, 174, 205, 218, 232, 210, 196]
  },
  {
    name: "社区便利点",
    replenishment: "160 kg",
    inventory: "38 kg",
    sales: "126 kg",
    loss: "2 kg",
    status: "偏低",
    freshMilk: 38,
    yogurt: 18,
    ecology: 12,
    suggest: "加入早班配送路线，补货 210 kg",
    trend: [92, 104, 119, 121, 138, 132, 126]
  }
];

export const dashboard = {
  deliveryShare: [
    { name: "乳企客户", value: 58 },
    { name: "自有门店", value: 26 },
    { name: "团购团餐", value: 16 }
  ],
  salesRank: [
    { name: "城区一店", sales: 438 },
    { name: "城区二店", sales: 419 },
    { name: "牧场体验店", sales: 196 },
    { name: "社区便利点", sales: 126 }
  ],
  exceptions: [
    "学校食堂签收人变更，需主管确认",
    "HL-D-0912 产奶下降 12%，已加入观察",
    "牧场体验店 54kg 鲜奶临期，建议促销",
    "HL20260626-PM-004 批次异常锁定"
  ],
  finance: {
    feedCost: "8.7 万元",
    milkCost: "3.18 元/kg",
    monthDelivery: "486.2 吨",
    receivable: "286.4 万元"
  }
};

export const aiAnswers = {
  "今天一共生产了多少牛奶？":
    "今日共产奶 18.6 吨，其中 16.8 吨已安排配送，1.2 吨进入自有门店库存，0.6 吨待质检。当前有 2 个批次正在配送中，建议继续关注晚班批次质检进度。",
  "哪些门店需要补货？":
    "城区二店和社区便利点库存偏低，牧场体验店存在即将过期库存。建议明早优先给城区二店补货 640 kg，社区便利点补货 210 kg，牧场体验店先做临期促销后再补货。",
  "今天有哪些配送异常？":
    "今日有 1 条配送异常：学校食堂收货人临时变更，当前需要主管确认签收信息。另外雀巢乳品线路预计延迟 12 分钟，但温度记录稳定，暂不影响质量。",
  "哪些牛产奶下降明显？":
    "HL-D-0912 近三日产量下降约 12%，反刍时长偏低，建议安排兽医复检并观察采食量。其余高产牛舍产奶波动处于正常范围。",
  "本月给雀巢配送了多少？":
    "模拟数据下，本月累计向雀巢乳品配送约 286.8 吨，今日计划配送 9.6 吨。建议在月末对账时按批次、质检单、签收单三项自动核对。",
  "明天应该安排几辆车配送？":
    "按近 7 天趋势和门店预警估算，明天建议安排 6 辆车：2 辆乳企客户干线车、3 辆门店冷藏配送车、1 辆团购团餐机动车，并预留 1 名司机备用。"
};
