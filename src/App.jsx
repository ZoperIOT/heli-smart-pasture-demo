import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Cattle from "./pages/Cattle.jsx";
import Milk from "./pages/Milk.jsx";
import Delivery from "./pages/Delivery.jsx";
import Driver from "./pages/Driver.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AiAssistant from "./pages/AiAssistant.jsx";
import Announcements from "./pages/Announcements.jsx";
import Settings from "./pages/Settings.jsx";
import Cows from "./pages/Cows.jsx";
import Inventory from "./pages/Inventory.jsx";
import StockIn from "./pages/StockIn.jsx";
import StockOut from "./pages/StockOut.jsx";
import Ledger from "./pages/Ledger.jsx";
import Reports from "./pages/Reports.jsx";
import BusinessSection from "./pages/BusinessSection.jsx";
import CowSearchCenter from "./pages/CowSearchCenter.jsx";
import Messages from "./pages/Messages.jsx";
import Approvals from "./pages/Approvals.jsx";
import RoleSimulation from "./pages/RoleSimulation.jsx";
import CowEvents from "./pages/CowEvents.jsx";
import AnalysisCenter from "./pages/AnalysisCenter.jsx";
import IntegrationCenter from "./pages/IntegrationCenter.jsx";
import RuleCenter from "./pages/RuleCenter.jsx";
import OperationLogs from "./pages/OperationLogs.jsx";
import MobileWorkbench from "./pages/MobileWorkbench.jsx";
import KnowledgeBase from "./pages/KnowledgeBase.jsx";
import SystemPlan from "./pages/SystemPlan.jsx";
import BusinessWorkbench from "./pages/BusinessWorkbench.jsx";
import PlatformOverview from "./pages/PlatformOverview.jsx";
import { DemoProvider } from "./context/DemoContext.jsx";

export default function App() {
  return (
    <DemoProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/barns" element={<Cattle />} />
          <Route path="/trucks" element={<Driver />} />
          <Route path="/cattle" element={<Cattle />} />
          <Route path="/cows" element={<Cows />} />
          <Route path="/work-orders" element={<BusinessSection dataKey="workOrders" />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/platform-overview" element={<PlatformOverview />} />
          <Route path="/dairy-workbench" element={<BusinessWorkbench type="dairy" />} />
          <Route path="/beef-workbench" element={<BusinessWorkbench type="beef" />} />
          <Route path="/feed-workbench" element={<BusinessWorkbench type="feed" />} />
          <Route path="/dairy-plant-workbench" element={<BusinessWorkbench type="dairyPlant" />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/role-simulation" element={<RoleSimulation />} />
          <Route path="/cow-events" element={<CowEvents />} />
          <Route path="/analysis" element={<AnalysisCenter />} />
          <Route path="/external-interfaces" element={<IntegrationCenter />} />
          <Route path="/rules" element={<RuleCenter />} />
          <Route path="/operation-logs" element={<OperationLogs />} />
          <Route path="/mobile-workbench" element={<MobileWorkbench />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/system-plan" element={<SystemPlan />} />
          <Route path="/cow-search" element={<CowSearchCenter />} />
          <Route path="/traceability-center" element={<BusinessSection dataKey="traceabilityChains" />} />
          <Route path="/dairy-cows" element={<BusinessSection dataKey="dairyCows" />} />
          <Route path="/feeding-formulas" element={<BusinessSection dataKey="feedFormulas" />} />
          <Route path="/feeding-plans" element={<BusinessSection dataKey="feedingPlans" />} />
          <Route path="/feeding-records" element={<BusinessSection dataKey="feedingRecords" />} />
          <Route path="/herd-groups" element={<BusinessSection dataKey="herdGroups" />} />
          <Route path="/breeding" element={<BusinessSection dataKey="breedingRecords" />} />
          <Route path="/health-events" element={<BusinessSection dataKey="healthEvents" />} />
          <Route path="/environment" element={<BusinessSection dataKey="environmentRecords" />} />
          <Route path="/beef-cows" element={<BusinessSection dataKey="beefCows" />} />
          <Route path="/beef-batches" element={<BusinessSection dataKey="beefBatches" />} />
          <Route path="/weight-records" element={<BusinessSection dataKey="weightRecords" />} />
          <Route path="/beef-sales" element={<BusinessSection dataKey="beefSales" />} />
          <Route path="/biological-assets" element={<BusinessSection dataKey="biologicalAssets" />} />
          <Route path="/dairy-farm-inventory" element={<BusinessSection dataKey="dairyFarmInventory" />} />
          <Route path="/beef-farm-inventory" element={<BusinessSection dataKey="beefFarmInventory" />} />
          <Route path="/feed-raw-materials" element={<BusinessSection dataKey="feedRawMaterials" />} />
          <Route path="/feed-products" element={<BusinessSection dataKey="feedProducts" />} />
          <Route path="/feed-production" element={<BusinessSection dataKey="feedProductionRecords" />} />
          <Route path="/feed-transfers" element={<BusinessSection dataKey="feedTransfers" />} />
          <Route path="/feed-purchases" element={<StockIn />} />
          <Route path="/milk-receiving" element={<BusinessSection dataKey="milkReceivingRecords" />} />
          <Route path="/milk-quality" element={<BusinessSection dataKey="milkQualityRecords" />} />
          <Route path="/dairy-production" element={<BusinessSection dataKey="dairyProductionBatches" />} />
          <Route path="/dairy-production-plans" element={<BusinessSection dataKey="dairyProductionPlans" />} />
          <Route path="/filling-records" element={<BusinessSection dataKey="fillingRecords" />} />
          <Route path="/finished-quality" element={<BusinessSection dataKey="finishedQualityRecords" />} />
          <Route path="/finished-in" element={<BusinessSection dataKey="finishedInRecords" />} />
          <Route path="/finished-out" element={<BusinessSection dataKey="finishedOutRecords" />} />
          <Route path="/return-records" element={<BusinessSection dataKey="returnRecords" />} />
          <Route path="/dairy-product-inventory" element={<BusinessSection dataKey="dairyProductInventory" />} />
          <Route path="/dairy-sales-orders" element={<BusinessSection dataKey="dairySalesOrders" />} />
          <Route path="/devices" element={<BusinessSection dataKey="devices" />} />
          <Route path="/weighbridge" element={<BusinessSection dataKey="weighbridgeRecords" />} />
          <Route path="/partners" element={<BusinessSection dataKey="partners" />} />
          <Route path="/employees" element={<BusinessSection dataKey="employees" />} />
          <Route path="/raw-milk-delivery" element={<Delivery />} />
          <Route path="/watch-cows" element={<Cattle />} />
          <Route path="/milk" element={<Milk />} />
          <Route path="/milk-stats" element={<Reports />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory-warnings" element={<Inventory warningsOnly />} />
          <Route path="/stock-in" element={<StockIn />} />
          <Route path="/stock-out" element={<StockOut />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/cost-stats" element={<Reports />} />
          <Route path="/profit-analysis" element={<Reports />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai" element={<AiAssistant />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/data-tools" element={<Settings />} />
        </Route>
      </Routes>
    </DemoProvider>
  );
}
