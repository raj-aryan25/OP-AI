import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import OperatorLayout from './layouts/OperatorLayout';
import UserLayout from './layouts/UserLayout';

import AdminDashboard from '../dashboards/admin/AdminDashboard.tsx';
import StationConfigPage from '../dashboards/admin/pages/StationConfigPage.tsx';
import SimulationControlsPage from '../dashboards/admin/pages/SimulationControlsPage.tsx';
import GlobalNetworkViewPage from '../dashboards/admin/pages/GlobalNetworkViewPage.tsx';
import OperatorDashboard from '../dashboards/operator/OperatorDashboard.tsx';
import StationOverviewPage from '../dashboards/operator/pages/StationOverviewPage.tsx';
import FailureLogsPage from '../dashboards/operator/pages/FailureLogsPage.tsx';
import MaintenanceActionsPage from '../dashboards/operator/pages/MaintenanceActionsPage.tsx';
import UserDashboard from '../dashboards/user/UserDashboard.tsx';
import RoutePlannerPage from '../dashboards/user/pages/RoutePlannerPage.tsx';
import SwapRecommendationPage from '../dashboards/user/pages/SwapRecommendationPage.tsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/user" replace />} />

          {/* Admin routes with wildcard */}
          <Route path="admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="stations" element={<StationConfigPage />} />
            <Route path="simulation" element={<SimulationControlsPage />} />
            <Route path="network" element={<GlobalNetworkViewPage />} />
          </Route>

          {/* Operator routes with wildcard */}
          <Route path="operator/*" element={<OperatorLayout />}>
            <Route index element={<OperatorDashboard />} />
            <Route path="overview" element={<StationOverviewPage />} />
            <Route path="failures" element={<FailureLogsPage />} />
            <Route path="actions" element={<MaintenanceActionsPage />} />
          </Route>

          {/* User routes with wildcard */}
          <Route path="user/*" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="route" element={<RoutePlannerPage />} />
            <Route path="recommendation" element={<SwapRecommendationPage />} />
          </Route>
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
