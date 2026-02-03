import {
  LayoutDashboard,
  Map,
  BatteryCharging,
  MapPin,
  User,
  Settings
} from 'lucide-react';
import ErrorBoundary from '../../../components/ErrorBoundary';
import BaseLayout, { type SidebarItem } from '../BaseLayout';
import './UserLayout.css';

const userSidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/user', icon: <LayoutDashboard size={20} /> },
  { label: 'Station Map', href: '/user/map', icon: <MapPin size={20} /> },
  { label: 'Route Planner', href: '/user/route', icon: <Map size={20} /> },
  { label: 'Swap Recommendations', href: '/user/recommendation', icon: <BatteryCharging size={20} /> },
  { label: 'My Profile', href: '/user/profile', icon: <User size={20} /> },
  { label: 'Settings', href: '/user/settings', icon: <Settings size={20} /> },
];

export default function UserLayout() {
  return (
    <ErrorBoundary dashboardName="User">
      <BaseLayout
        className="theme-light"
        sidebarTitle="My Space"
        sidebarItems={userSidebarItems}
        sidebarClassName="user-sidebar"
      />
    </ErrorBoundary>
  );
}
