export const roleMenuAccess = {
  集团管理员: "all",
  奶牛场场长: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/cow-search", "/dairy-workbench", "/dairy-cows", "/barns", "/herd-groups", "/feeding-plans", "/feeding-records", "/breeding", "/health-events", "/milk", "/raw-milk-delivery", "/dairy-farm-inventory", "/environment", "/cow-events", "/mobile-workbench", "/knowledge-base", "/system-plan", "/platform-overview"],
  肉牛场场长: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/cow-search", "/beef-workbench", "/beef-cows", "/beef-batches", "/weight-records", "/feeding-formulas", "/feeding-records", "/beef-sales", "/biological-assets", "/beef-farm-inventory", "/cow-events", "/mobile-workbench", "/knowledge-base", "/system-plan", "/platform-overview"],
  饲料厂厂长: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/feed-workbench", "/feed-raw-materials", "/feed-products", "/feed-production", "/feed-transfers", "/feed-purchases", "/partners", "/external-interfaces", "/rules", "/mobile-workbench", "/knowledge-base", "/system-plan", "/platform-overview"],
  乳品厂厂长: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/dairy-plant-workbench", "/milk-receiving", "/milk-quality", "/dairy-production-plans", "/dairy-production", "/filling-records", "/finished-quality", "/finished-in", "/finished-out", "/return-records", "/dairy-product-inventory", "/dairy-sales-orders", "/traceability-center", "/external-interfaces", "/mobile-workbench", "/knowledge-base", "/system-plan", "/platform-overview"],
  物流主管: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/delivery", "/trucks", "/driver", "/weighbridge", "/external-interfaces", "/mobile-workbench", "/knowledge-base", "/system-plan", "/platform-overview"],
  财务人员: ["/", "/dashboard", "/reports", "/ai", "/messages", "/approvals", "/ledger", "/cost-stats", "/profit-analysis", "/analysis", "/operation-logs", "/system-plan", "/platform-overview"],
  普通员工: ["/messages", "/work-orders", "/mobile-workbench", "/knowledge-base", "/cow-search"],
  司机: ["/messages", "/driver", "/delivery", "/trucks", "/mobile-workbench"],
  只读访客: ["/", "/dashboard", "/reports", "/system-plan", "/platform-overview"]
};

export const workModes = ["经营总览", "业务流", "资金流", "数据流", "消息流", "权限与配置"];

export const roleDefaultPath = {
  集团管理员: "/",
  奶牛场场长: "/dairy-workbench",
  肉牛场场长: "/beef-workbench",
  饲料厂厂长: "/feed-workbench",
  乳品厂厂长: "/dairy-plant-workbench",
  物流主管: "/delivery",
  财务人员: "/reports",
  普通员工: "/mobile-workbench",
  司机: "/delivery",
  只读访客: "/platform-overview"
};

export const roleDefaultMode = {
  集团管理员: "经营总览",
  奶牛场场长: "经营总览",
  肉牛场场长: "经营总览",
  饲料厂厂长: "经营总览",
  乳品厂厂长: "经营总览",
  物流主管: "业务流",
  财务人员: "资金流",
  普通员工: "业务流",
  司机: "业务流",
  只读访客: "经营总览"
};

export const roleOrganization = {
  集团管理员: "合力牧业集团",
  奶牛场场长: "合力牧业奶牛场",
  肉牛场场长: "欧力菲德肉牛场",
  饲料厂厂长: "欧力菲德饲料厂",
  乳品厂厂长: "欧力菲德乳品厂",
  物流主管: "物流车辆",
  财务人员: "财务经营",
  普通员工: "合力牧业集团",
  司机: "物流车辆",
  只读访客: "合力牧业集团"
};

export function canAccessPath(role, path) {
  const access = roleMenuAccess[role] || roleMenuAccess["集团管理员"];
  return access === "all" || access.includes(path);
}

export function filterMenuGroupsByRole(groups, role) {
  if ((roleMenuAccess[role] || "all") === "all") return groups;
  return groups
    .map((group) => ({ ...group, items: group.items.filter((item) => canAccessPath(role, item.to)) }))
    .filter((group) => group.items.length);
}

export function filterMenuGroups(groups, role, mode) {
  const byMode = groups.filter((group) => group.modes?.includes(mode));
  return filterMenuGroupsByRole(byMode, role);
}

export function isReadonlyRole(role) {
  return role === "只读访客";
}

export function summarizeRoleScope(role) {
  const map = {
    集团管理员: "全部组织、全部模块、全部 mock 数据",
    奶牛场场长: "合力牧业奶牛场：奶牛、产奶、繁育、防疫、饲喂",
    肉牛场场长: "欧力菲德肉牛场：育肥、体重、出栏、生物资产",
    饲料厂厂长: "欧力菲德饲料厂：原料、生产、成品、调拨、供应商",
    乳品厂厂长: "欧力菲德乳品厂：原奶、质检、生产、库存、销售",
    物流主管: "物流车辆：配送、货车、地磅过磅",
    财务人员: "财务经营：账本、成本、利润、报表、审批",
    普通员工: "个人任务、消息、工单和移动端工作台",
    司机: "本人配送任务、车辆状态和移动端工作台",
    只读访客: "只读查看首页、大屏、报表和建设方案"
  };
  return map[role] || map["集团管理员"];
}

export function getRoleOrganization(role) {
  return roleOrganization[role] || "合力牧业集团";
}
