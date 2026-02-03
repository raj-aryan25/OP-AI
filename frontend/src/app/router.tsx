import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import OperatorLayout from './layouts/OperatorLayout';
import UserLayout from './layouts/UserLayout';
import AuthGuard from './auth/AuthGuard';
import LoginPage from './auth/LoginPage';
import HomePage from './pages/HomePage';

import AdminDashboard from '../dashboards/admin/AdminDashboard.tsx';
import StationConfigPage from '../dashboards/admin/pages/StationConfigPage.tsx';
import SimulationControlsPage from '../dashboards/admin/pages/SimulationControlsPage.tsx';
import GlobalNetworkViewPage from '../dashboards/admin/pages/GlobalNetworkViewPage.tsx';
import OperatorDashboard from '../dashboards/operator/OperatorDashboard.tsx';
import StationOverviewPage from '../dashboards/operator/pages/StationOverviewPage.tsx';
import FailureLogsPage from '../dashboards/operator/pages/FailureLogsPage.tsx';
import MaintenanceActionsPage from '../dashboards/operator/pages/MaintenanceActionsPage.tsx';
import ActivityLogPage from '../dashboards/operator/pages/ActivityLogPage.tsx';
import UserDashboard from '../dashboards/user/UserDashboard.tsx';
import RoutePlannerPage from '../dashboards/user/pages/RoutePlannerPage.tsx';
import SwapRecommendationPage from '../dashboards/user/pages/SwapRecommendationPage.tsx';
import StationMapPage from '../dashboards/user/pages/StationMapPage.tsx';
import MyProfilePage from '../dashboards/user/pages/MyProfilePage.tsx';
import SettingsPage from '../dashboards/user/pages/SettingsPage.tsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<MainLayout />}>
            {/* Login Routes */}
            <Route path="login">
              <Route path="admin" element={<LoginPage requiredGroup="Admins" />} />
              <Route path="operator" element={<LoginPage requiredGroup="Operators" />} />
              <Route path="user" element={<LoginPage requiredGroup="Users" />} />
            </Route>

            {/* Admin routes protected by AuthGuard */}
            <Route element={<AuthGuard requiredGroup="Admins" />}>
              <Route path="admin/*" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="stations" element={<StationConfigPage />} />
                <Route path="simulation" element={<SimulationControlsPage />} />
                <Route path="network" element={<GlobalNetworkViewPage />} />
              </Route>
            </Route>

            {/* Operator routes protected by AuthGuard */}
            <Route element={<AuthGuard requiredGroup="Operators" />}>
              <Route path="operator/*" element={<OperatorLayout />}>
                <Route index element={<OperatorDashboard />} />
                <Route path="overview" element={<StationOverviewPage />} />
                <Route path="failures" element={<FailureLogsPage />} />
                <Route path="actions" element={<MaintenanceActionsPage />} />
                <Route path="activity" element={<ActivityLogPage />} />
              </Route>
            </Route>

            {/* User routes protected by AuthGuard */}
            <Route element={<AuthGuard requiredGroup="Users" />}>
              <Route path="user/*" element={<UserLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="map" element={<StationMapPage />} />
                <Route path="route" element={<RoutePlannerPage />} />
                <Route path="recommendation" element={<SwapRecommendationPage />} />
                <Route path="profile" element={<MyProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  );
}
