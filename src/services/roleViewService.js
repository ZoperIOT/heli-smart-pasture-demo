export const roleMenuAccess = {
  集团管理员: "all",
  奶牛场场长: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/cow-search", "/dairy-cows", "/barns", "/herd-groups", "/feeding-plans", "/feeding-records", "/breeding", "/health-events", "/milk", "/raw-milk-delivery", "/dairy-farm-inventory", "/environment", "/cow-events", "/mobile-workbench", "/knowledge-base", "/system-plan"],
  肉牛场场长: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/cow-search", "/beef-cows", "/beef-batches", "/weight-records", "/feeding-formulas", "/feeding-records", "/beef-sales", "/biological-assets", "/beef-farm-inventory", "/cow-events", "/mobile-workbench", "/knowledge-base", "/system-plan"],
  饲料厂厂长: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/feed-raw-materials", "/feed-products", "/feed-production", "/feed-transfers", "/feed-purchases", "/partners", "/external-interfaces", "/rules", "/mobile-workbench", "/knowledge-base", "/system-plan"],
  乳品厂厂长: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/milk-receiving", "/milk-quality", "/dairy-production-plans", "/dairy-production", "/filling-records", "/finished-quality", "/finished-in", "/finished-out", "/return-records", "/dairy-product-inventory", "/dairy-sales-orders", "/traceability-center", "/external-interfaces", "/mobile-workbench", "/knowledge-base", "/system-plan"],
  物流主管: ["/", "/dashboard", "/reports", "/ai", "/messages", "/work-orders", "/delivery", "/trucks", "/driver", "/weighbridge", "/external-interfaces", "/mobile-workbench", "/knowledge-base", "/system-plan"],
  财务人员: ["/", "/dashboard", "/reports", "/ai", "/messages", "/approvals", "/ledger", "/cost-stats", "/profit-analysis", "/analysis", "/operation-logs", "/system-plan"],
  普通员工: ["/", "/messages", "/work-orders", "/mobile-workbench", "/knowledge-base", "/cow-search"],
  司机: ["/", "/messages", "/driver", "/delivery", "/trucks", "/mobile-workbench"],
  只读访客: ["/", "/dashboard", "/reports", "/system-plan"]
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
