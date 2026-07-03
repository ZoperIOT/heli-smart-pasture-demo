import { useState } from "react";
import { Bot, FileText, SendHorizonal, Sparkles, UserRound } from "lucide-react";
import { useDemo } from "../context/DemoContext.jsx";
import { buildSimpleReport, simpleAiQuestions } from "../data/demoFlow.js";
import { evaluateRules } from "../services/platformServices.js";

export default function AiAssistant() {
  const demo = useDemo();
  const report = buildSimpleReport(demo);
  const [messages, setMessages] = useState([
    { role: "assistant", content: report }
  ]);
  const [input, setInput] = useState("");

  function answer(text) {
    const running = demo.data.trucks.filter((truck) => truck.status === "配送中");
    const unfinished = demo.data.deliveries.filter((item) => item.status !== "已到达");
    const topUnit = [...(demo.metrics.businessUnitStats || [])].sort((a, b) => b.income - a.income)[0];
    const expenses = demo.data.ledgerRecords.filter((item) => item.type === "支出");
    const expenseMap = expenses.reduce((map, item) => ({ ...map, [item.category]: (map[item.category] || 0) + Number(item.amount || 0) }), {});
    const topExpense = Object.entries(expenseMap).sort((a, b) => b[1] - a[1])[0];
    const priorityWorkOrders = (demo.data.workOrders || []).filter((item) => item.status !== "已完成").slice(0, 4);
    const watchLocations = (demo.data.cowLocations || []).filter((item) => String(item.note || "").includes("重点") || String(item.note || "").includes("复核")).slice(0, 3);
    const feedingIssues = (demo.data.feedingRecords || []).filter((item) => String(item.errorRate || "").includes("-") || String(item.errorRate || "").includes("+"));
    const mesIn = (demo.data.finishedInRecords || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const mesOut = (demo.data.finishedOutRecords || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const urgentMessages = (demo.data.messages || []).filter((item) => item.priority === "紧急" && item.status !== "已处理");
    const abnormalInterfaces = demo.metrics.interfaceAbnormalList || [];
    const triggeredRules = evaluateRules(demo.data);
    const topWorker = [...(demo.data.employees || [])].sort((a, b) => Number(b.todayWorkOrders || 0) - Number(a.todayWorkOrders || 0))[0];
    const pendingApprovals = (demo.data.approvalRequests || []).filter((item) => item.status === "待审批");
    const recentCowEvents = [...(demo.data.cowEvents || [])].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 4);
    const offlineDevices = (demo.data.devices || []).filter((item) => item.online !== "在线");
    const map = {
      "今天集团整体经营情况怎么样？": report,
      "奶牛场今天产奶多少？": `合力牧业奶牛场今日产奶 ${demo.metrics.milkAmount.toFixed(1)} 吨，早班 ${demo.metrics.morningMilk.toFixed(1)} 吨，晚班 ${demo.metrics.eveningMilk.toFixed(1)} 吨。`,
      "肉牛场当前存栏多少？": `欧力菲德肉牛场当前肉牛档案 ${demo.metrics.beefCowCount} 头，育肥批次 ${demo.data.beefBatches.length} 个，当前主批次均重约 ${demo.data.beefBatches[0]?.avgWeight || 0} kg。`,
      "饲料厂有哪些库存预警？": demo.metrics.feedWarnings.length ? demo.metrics.feedWarnings.map((item) => `${item.name} 当前 ${item.stock}${item.unit}，预警 ${item.warningStock}${item.unit}`).join("；") : "欧力菲德饲料厂当前没有原料或成品库存预警。",
      "乳品厂今天接收了多少原奶？": `欧力菲德乳品厂今日接收来自合力牧业奶牛场的原奶 ${demo.metrics.rawMilkReceivedToday.toFixed(1)} 吨，质检记录 ${demo.data.milkQualityRecords.length} 条。`,
      "本月哪个板块收入最高？": topUnit ? `本月收入最高的板块是${topUnit.name}，收入 ${(topUnit.income / 10000).toFixed(1)} 万元。` : "暂无分板块收入数据。",
      "本月支出主要花在哪里？": topExpense ? `本月支出主要集中在${topExpense[0]}，金额 ${(topExpense[1] / 10000).toFixed(1)} 万元。` : "暂无支出记录。",
      "有哪些配送任务还没完成？": unfinished.length ? unfinished.map((item) => `${item.taskNo || item.id}：${item.businessType || item.type}，${item.startPoint || "起点"} -> ${item.endPoint || item.name}，状态 ${item.status}`).join("；") : "当前配送任务均已完成。",
      "哪些业务环节有异常？": demo.metrics.alerts.length ? demo.metrics.alerts.join("；") : "当前四大业务板块没有明显异常提醒。",
      "今天有哪些工单要优先处理？": priorityWorkOrders.length ? `今天建议优先处理 ${priorityWorkOrders.length} 个未完成工单：${priorityWorkOrders.map((item) => `${item.no} ${item.type}，${item.businessUnit}，${item.owner}负责，状态${item.status}`).join("；")}。其中超时工单 ${demo.metrics.overdueWorkOrders} 个。` : "今日工单都已完成，可以转入巡检和复盘。",
      "帮我查一下重点关注牛在哪里？": watchLocations.length ? watchLocations.map((item) => `${item.code} 在 ${item.position || item.area}，最近上传 ${item.lastSeenAt}，备注：${item.note}`).join("；") : "当前没有重点关注牛只的位置提醒。",
      "今天饲喂执行有没有偏差？": feedingIssues.length ? `今日饲喂执行 ${demo.data.feedingRecords.length} 条，发现投料偏差记录：${feedingIssues.map((item) => `${item.businessUnit}${item.target} 计划 ${item.plannedAmount} 吨、实际 ${item.actualAmount} 吨、误差 ${item.errorRate}`).join("；")}。建议与库存出库和采食情况一起复核。` : "今日饲喂执行记录未发现明显偏差。",
      "设备和牛舍环境有没有风险？": `设备告警 ${demo.metrics.deviceAlerts} 台，环境风险 ${demo.metrics.environmentAlerts} 处。${demo.metrics.deviceAlertList?.length ? demo.metrics.deviceAlertList.map((item) => `${item.name}：${item.alarm || item.online}`).join("；") : "设备暂无告警"}。${demo.metrics.environmentAlertList?.length ? demo.metrics.environmentAlertList.map((item) => `${item.barn}：${item.heatStressRisk}风险，舒适度${item.comfortIndex}`).join("；") : "牛舍环境整体正常"}。`,
      "质量追溯链路完整吗？": `当前追溯中心共有 ${(demo.data.traceabilityChains || []).length} 条链路，完整链路 ${demo.metrics.traceabilityComplete} 条。示例链路包括：饲料原料批次 -> 饲料生产批次 -> 奶牛/肉牛饲喂 -> 原奶批次/肉牛出栏批次 -> 乳品生产批次 -> 成品销售订单。`,
      "乳品厂今天生产入库出库情况？": `欧力菲德乳品厂今日生产计划 ${(demo.data.dairyProductionPlans || []).length} 条，灌装记录 ${(demo.data.fillingRecords || []).length} 条，成品入库 ${mesIn} 件，成品出库 ${mesOut} 件，退货记录 ${(demo.data.returnRecords || []).length} 条。`,
      "肉牛生物资产大概值多少钱？": `欧力菲德肉牛场生物资产台账当前估值合计 ${(demo.metrics.biologicalAssetValue / 10000).toFixed(1)} 万元，可出栏评估 ${demo.metrics.readyForSaleAssets} 头/批。该数据为前端 mock 估算，用于演示资产、成本和销售联动。`,
      "今天有哪些紧急预警？": urgentMessages.length ? urgentMessages.map((item) => `${item.businessUnit}：${item.title}，${item.content}`).join("；") : "今天没有紧急预警。",
      "哪些接口异常？": abnormalInterfaces.length ? abnormalInterfaces.map((item) => `${item.name}（${item.businessUnit}）状态为${item.status}，负责人${item.owner}`).join("；") : "当前接口均无异常或未配置风险。",
      "哪些规则被触发了？": triggeredRules.length ? triggeredRules.slice(0, 6).map((item) => `${item.ruleType}：${item.title}，原因是${item.reason}`).join("；") : "当前启用规则没有发现新的异常触发。",
      "今天谁的工单最多？": topWorker ? `今天工单最多的是${topWorker.name}，岗位${topWorker.role}，所属${topWorker.businessUnit}，今日工单 ${topWorker.todayWorkOrders} 个，已完成 ${topWorker.finishedWorkOrders} 个，超时 ${topWorker.overdueWorkOrders} 个。` : "暂无员工工单统计。",
      "哪些审批还没处理？": pendingApprovals.length ? pendingApprovals.map((item) => `${item.no} ${item.type}，${item.businessUnit}，申请人${item.applicant}，审批人${item.approver}，金额${item.amount}元`).join("；") : "当前没有待审批事项。",
      "某头牛最近发生了什么？": recentCowEvents.length ? recentCowEvents.map((item) => `${item.code} 在 ${item.date} 发生「${item.type}」：${item.content}`).join("；") : "暂无牛只事件时间线数据。",
      "哪些设备离线？": offlineDevices.length ? offlineDevices.map((item) => `${item.name} 位于 ${item.location}，最近上传 ${item.lastUploadAt}`).join("；") : "当前没有离线设备。",
      "本周经营风险有哪些？": `本周主要风险包括：紧急预警 ${demo.metrics.urgentAlerts} 条、待审批 ${demo.metrics.pendingApprovals} 条、接口异常 ${demo.metrics.interfaceAbnormalCount} 个、规则触发 ${demo.metrics.ruleTriggeredCount} 次、设备告警 ${demo.metrics.deviceAlerts} 台、环境风险 ${demo.metrics.environmentAlerts} 处。建议先处理消息中心和审批中心，再复核接口与设备。`,
      "给我生成一份集团日报。": `集团日报：今日合力牧业奶牛场产奶 ${demo.metrics.milkAmount.toFixed(1)} 吨，欧力菲德饲料厂生产饲料 ${demo.metrics.feedTodayOutput.toFixed(1)} 吨，欧力菲德乳品厂接收原奶 ${demo.metrics.rawMilkReceivedToday.toFixed(1)} 吨并销售 ${demo.metrics.dairySalesToday.toFixed(0)} 元，欧力菲德肉牛场生物资产估值 ${(demo.metrics.biologicalAssetValue / 10000).toFixed(1)} 万元。今日工单完成率 ${demo.metrics.workOrderCompletionRate.toFixed(0)}%，设备在线率 ${demo.metrics.deviceOnlineRate.toFixed(0)}%，未读消息 ${demo.metrics.unreadMessages} 条，待审批 ${demo.metrics.pendingApprovals} 条。本日报为前端 mock 数据生成。`,
      "这个系统后续上线需要做什么？": "建议分五步上线：第一步梳理真实业务字段和组织权限；第二步建设后端数据库、登录、角色和审计；第三步接入奶牛场、肉牛场、饲料厂、乳品厂、物流和财务核心流程；第四步接入奶厅、TMR、地磅、环境传感器、电子耳标和乳品厂 MES；第五步接入真实 AI 助手、消息推送、报表大屏和移动端。",
      "给出本周经营建议。": `本周建议：1. 合力牧业奶牛场继续关注产奶下降和重点奶牛；2. 欧力菲德饲料厂优先处理 ${demo.metrics.feedWarnings.length} 项库存预警，保障奶牛场和肉牛场调拨；3. 欧力菲德肉牛场跟踪育肥批次均重和出栏计划；4. 欧力菲德乳品厂关注原奶接收、质检合格和巴氏鲜奶/酸奶销售；5. 集团层面跟进 ${running.length} 辆配送中车辆和本月 ${(demo.metrics.monthBalance / 10000).toFixed(1)} 万元结余。`
    };
    return map[text] || report;
  }

  function ask(text) {
    if (!text.trim()) return;
    setMessages((current) => [
      ...current,
      { role: "user", content: text },
      { role: "assistant", content: answer(text) }
    ]);
    setInput("");
  }

  function generateReport() {
    ask("今天集团整体经营情况怎么样？");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-180px)] max-w-3xl flex-col gap-4">
      <section className="rounded-[8px] bg-slate-950 p-5 text-white shadow-soft">
        <div className="flex items-start gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/12">
            <Sparkles size={28} />
          </span>
          <div>
            <h1 className="text-3xl font-bold">AI 今日简报</h1>
            <p className="mt-2 text-lg leading-8 text-white/76">
              本页为本地模拟 AI，不调用外部模型；回答会读取当前本机数据。
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button onClick={generateReport} className="flex min-h-14 items-center justify-center gap-2 rounded-[8px] bg-pasture-700 px-4 text-lg font-bold text-white shadow-soft">
          <FileText size={22} /> 生成今日简报
        </button>
        {simpleAiQuestions.map((question) => (
          <button
            key={question}
            onClick={() => ask(question)}
            className="min-h-14 rounded-[8px] bg-white px-4 text-left text-lg font-bold text-slate-800 shadow-soft ring-1 ring-slate-100"
          >
            {question}
          </button>
        ))}
      </div>

      <section className="flex flex-1 flex-col rounded-[8px] bg-white shadow-soft ring-1 ring-slate-100">
        <div className="flex-1 space-y-4 p-4">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pasture-50 text-pasture-700">
                  <Bot size={20} />
                </span>
              )}
              <div className={`max-w-[84%] rounded-[8px] px-4 py-3 text-lg leading-8 ${
                message.role === "user" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700"
              }`}>
                {message.content}
              </div>
              {message.role === "user" && (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-900 text-white">
                  <UserRound size={20} />
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 p-3">
          <div className="flex gap-2 rounded-[8px] bg-slate-50 p-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && ask(input)}
              className="min-h-12 min-w-0 flex-1 bg-transparent px-3 text-lg font-semibold outline-none"
              placeholder="输入问题..."
            />
            <button onClick={() => ask(input)} className="grid h-12 w-14 place-items-center rounded-[8px] bg-pasture-700 text-white" aria-label="发送">
              <SendHorizonal size={22} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
