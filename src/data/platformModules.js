export const platformModuleKeys = [
  "messages",
  "alertRules",
  "approvalRequests",
  "operationLogs",
  "cowEvents",
  "analysisTemplates",
  "externalInterfaces",
  "knowledgeBase",
  "roleViews",
  "mobileTasks"
];

export const roleOptions = [
  "集团管理员",
  "奶牛场场长",
  "肉牛场场长",
  "饲料厂厂长",
  "乳品厂厂长",
  "物流主管",
  "财务人员",
  "普通员工",
  "司机",
  "只读访客"
];

export function buildPlatformModules(todayText, monthText, nowText) {
  return {
    roleViews: [
      { id: "role-admin", role: "集团管理员", organization: "集团", dataScope: "全部板块", canEdit: true, defaultPage: "/", note: "可查看全部模块和经营指标" },
      { id: "role-dairy", role: "奶牛场场长", organization: "合力牧业奶牛场", dataScope: "奶牛场", canEdit: true, defaultPage: "/milk", note: "重点查看奶牛、产奶、繁育、防疫和饲喂" },
      { id: "role-beef", role: "肉牛场场长", organization: "欧力菲德肉牛场", dataScope: "肉牛场", canEdit: true, defaultPage: "/beef-batches", note: "重点查看育肥、体重、出栏和生物资产" },
      { id: "role-feed", role: "饲料厂厂长", organization: "欧力菲德饲料厂", dataScope: "饲料厂", canEdit: true, defaultPage: "/feed-production", note: "重点查看原料、生产、成品和调拨" },
      { id: "role-dairy-plant", role: "乳品厂厂长", organization: "欧力菲德乳品厂", dataScope: "乳品厂", canEdit: true, defaultPage: "/milk-receiving", note: "重点查看原奶接收、质检、生产和销售" },
      { id: "role-logistics", role: "物流主管", organization: "物流车辆", dataScope: "物流", canEdit: true, defaultPage: "/delivery", note: "重点查看配送、货车和过磅" },
      { id: "role-finance", role: "财务人员", organization: "财务经营", dataScope: "财务", canEdit: true, defaultPage: "/ledger", note: "重点查看账本、成本、利润和报表" },
      { id: "role-worker", role: "普通员工", organization: "集团", dataScope: "个人任务", canEdit: true, defaultPage: "/mobile-workbench", note: "重点查看员工工作台和本人任务" },
      { id: "role-driver", role: "司机", organization: "物流车辆", dataScope: "本人车辆任务", canEdit: true, defaultPage: "/driver", note: "只看配送任务和车辆状态" },
      { id: "role-visitor", role: "只读访客", organization: "集团", dataScope: "只读总览", canEdit: false, defaultPage: "/", note: "只能查看首页、大屏、报表和方案" }
    ],
    messages: [
      { id: "msg-1", type: "库存预警", businessUnit: "欧力菲德饲料厂", title: "豆粕库存低于预警", content: "豆粕库存 65 吨，低于预警值 80 吨，建议采购员确认补货计划。", priority: "高", status: "未读", receiver: "饲料厂厂长", relatedType: "原料库存", relatedId: "raw-2", createdAt: `${todayText} 08:20`, handledAt: "", handleNote: "" },
      { id: "msg-2", type: "设备离线", businessUnit: "合力牧业奶牛场", title: "B区环境传感器离线", content: "B区环境传感器最近上传时间为 07:10，请设备员检查供电和网络。", priority: "紧急", status: "未读", receiver: "奶牛场场长", relatedType: "设备状态", relatedId: "dev-5", createdAt: `${todayText} 09:10`, handledAt: "", handleNote: "" },
      { id: "msg-3", type: "环境异常", businessUnit: "合力牧业奶牛场", title: "B区泌乳牛舍热应激风险", content: "温度 31.8°C、湿度 74%，舒适度指数 64，建议开启喷淋并复查通风。", priority: "高", status: "已读", receiver: "刘师傅", relatedType: "环境监控", relatedId: "env-2", createdAt: `${todayText} 09:25`, handledAt: "", handleNote: "" },
      { id: "msg-4", type: "防疫到期", businessUnit: "欧力菲德肉牛场", title: "育肥二区驱虫复核超时", content: "防疫工单 WO-VAC-004 未完成，请兽医下午优先处理。", priority: "中", status: "未读", receiver: "肉牛场场长", relatedType: "工单中心", relatedId: "wo-4", createdAt: `${todayText} 10:05`, handledAt: "", handleNote: "" },
      { id: "msg-5", type: "审批待办", businessUnit: "欧力菲德乳品厂", title: "乳品销售订单待审批", content: "SO-001 巴氏鲜奶销售订单金额 7800 元，等待乳品厂厂长确认。", priority: "中", status: "未读", receiver: "乳品厂厂长", relatedType: "审批中心", relatedId: "ap-3", createdAt: `${todayText} 10:30`, handledAt: "", handleNote: "" },
      { id: "msg-6", type: "系统通知", businessUnit: "集团", title: "本地演示数据已升级", content: "平台新增消息、审批、角色、事件、规则、接口、知识库和建设方案等平台级能力。", priority: "低", status: "已读", receiver: "集团管理员", relatedType: "系统", relatedId: "platform-upgrade", createdAt: nowText(), handledAt: "", handleNote: "" }
    ],
    alertRules: [
      { id: "rule-1", name: "库存不足规则", type: "库存不足规则", businessUnit: "集团", condition: "库存 <= 预警库存", threshold: "warningStock", enabled: true, priority: "高", suggestion: "生成库存预警消息并提醒采购或调拨", lastTriggeredAt: `${todayText} 08:20`, note: "扫描原料、成品、牧场库存" },
      { id: "rule-2", name: "设备离线规则", type: "设备离线规则", businessUnit: "集团", condition: "在线状态 != 在线", threshold: "离线", enabled: true, priority: "紧急", suggestion: "通知设备员检查供电、网关和接口状态", lastTriggeredAt: `${todayText} 09:10`, note: "当前触发 B区环境传感器" },
      { id: "rule-3", name: "环境异常规则", type: "环境异常规则", businessUnit: "合力牧业奶牛场", condition: "热应激风险 != 低 或 舒适度 < 70", threshold: "舒适度 70", enabled: true, priority: "高", suggestion: "开启风机/喷淋并复测牛舍环境", lastTriggeredAt: `${todayText} 09:25`, note: "B区泌乳牛舍触发" },
      { id: "rule-4", name: "账本大额支出规则", type: "账本大额支出规则", businessUnit: "财务经营", condition: "单笔支出 >= 20000", threshold: "20000 元", enabled: true, priority: "中", suggestion: "生成账本大额支出确认审批", lastTriggeredAt: `${todayText} 08:35`, note: "饲料原料采购触发" },
      { id: "rule-5", name: "饲喂误差过大规则", type: "饲喂误差过大规则", businessUnit: "集团", condition: "投料误差绝对值 > 3%", threshold: "3%", enabled: true, priority: "中", suggestion: "复核 TMR 设备和库存出库记录", lastTriggeredAt: "", note: "今日未触发" }
    ],
    approvalRequests: [
      { id: "ap-1", no: "AP-20260703-001", type: "采购申请", businessUnit: "欧力菲德饲料厂", applicant: "库管", appliedAt: `${todayText} 08:30`, approver: "饲料厂厂长", status: "待审批", relatedType: "采购记录", relatedId: "in-1", amount: 25600, reason: "玉米、豆粕采购补库", opinion: "", approvedAt: "" },
      { id: "ap-2", no: "AP-20260703-002", type: "肉牛出栏审批", businessUnit: "欧力菲德肉牛场", applicant: "周师傅", appliedAt: `${todayText} 09:15`, approver: "肉牛场场长", status: "已通过", relatedType: "出栏销售", relatedId: "beef-sale-1", amount: 186000, reason: "冬季育肥批次达到出栏标准", opinion: "同意出栏，注意过磅留痕", approvedAt: `${todayText} 09:40` },
      { id: "ap-3", no: "AP-20260703-003", type: "乳品销售审批", businessUnit: "欧力菲德乳品厂", applicant: "销售", appliedAt: `${todayText} 10:20`, approver: "乳品厂厂长", status: "待审批", relatedType: "销售订单", relatedId: "dairy-order-1", amount: 7800, reason: "城区自有门店补货订单", opinion: "", approvedAt: "" },
      { id: "ap-4", no: "AP-20260703-004", type: "设备维修申请", businessUnit: "欧力菲德饲料厂", applicant: "设备员", appliedAt: `${todayText} 10:45`, approver: "饲料厂厂长", status: "待审批", relatedType: "设备状态", relatedId: "dev-3", amount: 1800, reason: "TMR 皮带机异响检查", opinion: "", approvedAt: "" }
    ],
    cowEvents: [
      { id: "ce-1", code: "HL-N-1028", businessUnit: "合力牧业奶牛场", type: "建档", date: "2022-10-01", content: "奶牛建档入群，进入 A区泌乳牛舍。", handler: "档案员", relatedWorkOrder: "", relatedObject: "A区泌乳牛舍", note: "系统初始化事件" },
      { id: "ce-2", code: "HL-N-1028", businessUnit: "合力牧业奶牛场", type: "用药", date: todayText, content: "乳房炎治疗，用药后进入休药期。", handler: "兽医", relatedWorkOrder: "WO-VAC-004", relatedObject: "乳房炎用药", note: "状态建议：治疗中" },
      { id: "ce-3", code: "HL-N-1160", businessUnit: "合力牧业奶牛场", type: "饲喂", date: todayText, content: "泌乳中期群饲喂执行，明早复核产奶量。", handler: "赵师傅", relatedWorkOrder: "WO-FEED-001", relatedObject: "泌乳高峰群日粮", note: "产奶下降观察" },
      { id: "ce-4", code: "HL-N-1386", businessUnit: "合力牧业奶牛场", type: "配种", date: `${monthText}-18`, content: "发情后完成配种，进入待妊检状态。", handler: "繁育员", relatedWorkOrder: "", relatedObject: "breed-2", note: "状态建议：待妊检" },
      { id: "ce-5", code: "OLF-R-2088", businessUnit: "欧力菲德肉牛场", type: "称重", date: todayText, content: "自动称重 530kg，采食稳定。", handler: "周师傅", relatedWorkOrder: "", relatedObject: "weight-1", note: "育肥中" },
      { id: "ce-6", code: "OLF-R-2306", businessUnit: "欧力菲德肉牛场", type: "出栏", date: `${monthText}-20`, content: "达到出栏体重，完成销售审批和过磅。", handler: "周师傅", relatedWorkOrder: "", relatedObject: "beef-sale-1", note: "状态建议：已出栏" }
    ],
    analysisTemplates: [
      { id: "tpl-1", name: "近 7 天产奶趋势", object: "产奶记录", range: "近 7 天", dimension: "按牛舍 / 圈舍", metric: "产量", chartType: "折线图", pinned: true, owner: "集团管理员", note: "首页和报表可引用" },
      { id: "tpl-2", name: "欧力菲德肉牛场平均日增重", object: "肉牛体重", range: "本月", dimension: "按牛群", metric: "增长率", chartType: "柱状图", pinned: true, owner: "肉牛场场长", note: "用于出栏预测" },
      { id: "tpl-3", name: "饲料厂原料库存预警", object: "库存", range: "今日", dimension: "按物资分类", metric: "异常数", chartType: "表格", pinned: false, owner: "饲料厂厂长", note: "预警规则联动" },
      { id: "tpl-4", name: "本月分板块收入支出", object: "账本", range: "本月", dimension: "按业务板块", metric: "金额", chartType: "柱状图", pinned: true, owner: "财务人员", note: "经营报表引用" },
      { id: "tpl-5", name: "工单完成率", object: "工单", range: "今日", dimension: "按负责人", metric: "完成率", chartType: "饼图", pinned: false, owner: "集团管理员", note: "员工工作量统计" }
    ],
    externalInterfaces: [
      { id: "int-1", name: "奶厅系统接口", type: "奶厅系统接口", businessUnit: "合力牧业奶牛场", endpoint: "https://demo.local/milking", authType: "Token 占位", status: "已配置", lastSyncAt: `${todayText} 07:35`, todaySyncCount: 326, owner: "信息员", note: "不真实请求" },
      { id: "int-2", name: "TMR 饲喂设备接口", type: "TMR 饲喂设备接口", businessUnit: "欧力菲德饲料厂", endpoint: "https://demo.local/tmr", authType: "API Key 占位", status: "连接正常", lastSyncAt: `${todayText} 09:20`, todaySyncCount: 86, owner: "设备员", note: "用于展示未来设备联动" },
      { id: "int-3", name: "地磅接口", type: "地磅接口", businessUnit: "物流车辆", endpoint: "https://demo.local/weighbridge", authType: "内网白名单占位", status: "连接正常", lastSyncAt: `${todayText} 10:10`, todaySyncCount: 3, owner: "物流主管", note: "" },
      { id: "int-4", name: "乳品厂 MES 接口", type: "乳品厂 MES 接口", businessUnit: "欧力菲德乳品厂", endpoint: "https://demo.local/mes", authType: "OAuth 占位", status: "未配置", lastSyncAt: "", todaySyncCount: 0, owner: "信息员", note: "后续接生产批次和成品库存" },
      { id: "int-5", name: "AI 大模型接口", type: "AI 大模型接口", businessUnit: "集团", endpoint: "https://demo.local/ai", authType: "Key 占位", status: "连接异常", lastSyncAt: `${todayText} 08:00`, todaySyncCount: 0, owner: "信息员", note: "当前 AI 为本地 mock" }
    ],
    operationLogs: [
      { id: "log-1", operator: "集团管理员", operatedAt: `${todayText} 08:00`, module: "系统", action: "重置", objectName: "示例数据", objectId: "demo", summary: "加载农牧乳一体化平台示例数据", roleView: "集团管理员", note: "前端模拟审计日志" },
      { id: "log-2", operator: "饲料厂厂长", operatedAt: `${todayText} 08:30`, module: "审批中心", action: "新增", objectName: "采购申请", objectId: "ap-1", summary: "生成玉米、豆粕采购申请", roleView: "饲料厂厂长", note: "" },
      { id: "log-3", operator: "肉牛场场长", operatedAt: `${todayText} 09:40`, module: "审批中心", action: "审批", objectName: "肉牛出栏审批", objectId: "ap-2", summary: "同意冬季育肥批次出栏销售", roleView: "肉牛场场长", note: "" },
      { id: "log-4", operator: "信息员", operatedAt: `${todayText} 10:20`, module: "接口管理", action: "状态变更", objectName: "AI 大模型接口", objectId: "int-5", summary: "模拟测试连接后状态为连接异常", roleView: "集团管理员", note: "未真实请求外部接口" }
    ],
    knowledgeBase: [
      { id: "kb-1", title: "员工如何处理今日工单", category: "系统操作指南", summary: "查看工单、确认完成、填写异常备注和上传占位照片的标准步骤。", tags: "工单,员工工作台,移动端", roles: "普通员工,场长", updatedAt: todayText, pinned: true, content: "进入员工工作台，先处理高优先级和超时工单，完成后填写处理备注。" },
      { id: "kb-2", title: "奶牛休药期管理注意事项", category: "防疫健康", summary: "用药后必须记录休药期，休药期内原奶不得入罐。", tags: "休药期,用药,质检", roles: "兽医,奶牛场场长", updatedAt: todayText, pinned: true, content: "健康防疫记录中维护休药至日期，系统生成休药期提醒消息。" },
      { id: "kb-3", title: "肉牛出栏审批和过磅流程", category: "肉牛育肥", summary: "肉牛达到出栏标准后，先发起审批，再完成过磅和销售记录。", tags: "出栏,审批,过磅", roles: "肉牛场场长,财务人员", updatedAt: todayText, pinned: false, content: "审批通过后关联出栏销售，过磅净重用于收入和资产核算。" },
      { id: "kb-4", title: "乳品厂生产批次追溯规范", category: "乳品厂生产", summary: "原奶接收、质检、生产、灌装、入库、出库需要形成可追溯链路。", tags: "MES,质检,追溯", roles: "乳品厂厂长,质检员", updatedAt: todayText, pinned: false, content: "每个生产批次应关联原奶批次、质检记录和销售订单。" },
      { id: "kb-5", title: "设备接口异常排查", category: "设备使用", summary: "检查电源、网络、接口配置、最近同步时间和今日数据量。", tags: "接口,设备,运维", roles: "设备员,信息员", updatedAt: todayText, pinned: false, content: "接口管理中心的测试连接只做前端状态模拟，不请求真实系统。" }
    ],
    mobileTasks: [
      { id: "mt-1", title: "A区泌乳高峰群早班饲喂", type: "饲喂执行", businessUnit: "合力牧业奶牛场", owner: "刘师傅", plannedAt: `${todayText} 06:30`, status: "已完成", quickAction: "填写投料量", note: "关联 WO-FEED-001" },
      { id: "mt-2", title: "晚班挤奶录入", type: "产奶录入", businessUnit: "合力牧业奶牛场", owner: "赵师傅", plannedAt: `${todayText} 18:00`, status: "待处理", quickAction: "录入产奶", note: "关联 WO-MILK-002" },
      { id: "mt-3", title: "原奶配送到欧力菲德乳品厂", type: "配送任务", businessUnit: "物流车辆", owner: "王师傅", plannedAt: `${todayText} 09:00`, status: "配送中", quickAction: "确认到达", note: "关联 YN-001" },
      { id: "mt-4", title: "B区环境异常上报", type: "异常上报", businessUnit: "合力牧业奶牛场", owner: "刘师傅", plannedAt: `${todayText} 10:30`, status: "待处理", quickAction: "填写异常", note: "模拟移动端上报" }
    ]
  };
}
