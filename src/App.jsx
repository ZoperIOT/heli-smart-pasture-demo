import { Navigate, Route, Routes } from "react-router-dom";
import { MobileShell } from "./components/mobile/MobileComponents.jsx";
import { DemoProvider } from "./context/DemoContext.jsx";
import {
  BreedingPage,
  CattlePage,
  ExceptionReportPage,
  FeedingPage,
  HandoverPage,
  InventoryPage,
  ManualsPage,
  MessagesPage,
  MilkPage,
  MobileHomePage,
  ProfilePage,
  QualityPage,
  RecordsPage,
  TasksPage,
  WorkOrdersPage
} from "./pages/mobile/MobilePages.jsx";

export default function App() {
  return (
    <DemoProvider>
      <Routes>
        <Route element={<MobileShell />}>
          <Route path="/" element={<MobileHomePage />} />
          <Route path="/app" element={<MobileHomePage />} />
          <Route path="/mobile" element={<MobileHomePage />} />
          <Route path="/mobile-workbench" element={<MobileHomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/work" element={<TasksPage />} />
          <Route path="/feeding" element={<FeedingPage />} />
          <Route path="/feeding-records" element={<FeedingPage />} />
          <Route path="/feeding-plans" element={<FeedingPage />} />
          <Route path="/milk" element={<MilkPage />} />
          <Route path="/milk-stats" element={<MilkPage />} />
          <Route path="/breeding" element={<BreedingPage />} />
          <Route path="/cattle" element={<CattlePage />} />
          <Route path="/cows" element={<CattlePage />} />
          <Route path="/cow-search" element={<CattlePage />} />
          <Route path="/dairy-cows" element={<CattlePage />} />
          <Route path="/beef-cows" element={<CattlePage />} />
          <Route path="/health-events" element={<CattlePage />} />
          <Route path="/cow-events" element={<CattlePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory-warnings" element={<InventoryPage />} />
          <Route path="/stock-in" element={<InventoryPage />} />
          <Route path="/stock-out" element={<InventoryPage />} />
          <Route path="/quality" element={<QualityPage />} />
          <Route path="/milk-quality" element={<QualityPage />} />
          <Route path="/finished-quality" element={<QualityPage />} />
          <Route path="/work-orders" element={<WorkOrdersPage />} />
          <Route path="/exceptions" element={<ExceptionReportPage />} />
          <Route path="/exception-reports" element={<ExceptionReportPage />} />
          <Route path="/handover" element={<HandoverPage />} />
          <Route path="/manuals" element={<ManualsPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/ai" element={<Navigate to="/app" replace />} />
          <Route path="/platform-overview" element={<Navigate to="/app" replace />} />
          <Route path="/system-plan" element={<Navigate to="/app" replace />} />
          <Route path="/external-interfaces" element={<Navigate to="/app" replace />} />
          <Route path="/analysis" element={<Navigate to="/app" replace />} />
          <Route path="/rules" element={<Navigate to="/app" replace />} />
          <Route path="/knowledge-base" element={<Navigate to="/app" replace />} />
          <Route path="/devices" element={<Navigate to="/app" replace />} />
          <Route path="/environment" element={<Navigate to="/app" replace />} />
          <Route path="/dairy-workbench" element={<Navigate to="/app" replace />} />
          <Route path="/beef-workbench" element={<Navigate to="/app" replace />} />
          <Route path="/feed-workbench" element={<Navigate to="/app" replace />} />
          <Route path="/dairy-plant-workbench" element={<Navigate to="/app" replace />} />
          <Route path="/settings" element={<Navigate to="/profile" replace />} />
          <Route path="/data-tools" element={<Navigate to="/profile" replace />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Routes>
    </DemoProvider>
  );
}
