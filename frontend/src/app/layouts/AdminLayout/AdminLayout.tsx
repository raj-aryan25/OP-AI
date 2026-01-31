import BaseLayout, { type SidebarItem } from '../BaseLayout';
import './AdminLayout.css';

const adminSidebarItems: SidebarItem[] = [
  { label: 'Overview', href: '/admin', icon: '📊' },
  { label: 'Station Config', href: '/admin/stations', icon: '🔧' },
  { label: 'Simulation', href: '/admin/simulation', icon: '🎮' },
  { label: 'Network View', href: '/admin/network', icon: '🗺️' },
  { label: 'Analytics', href: '#analytics', icon: '📈' },
];

export default function AdminLayout() {
  return (
    <BaseLayout
      sidebarTitle="Admin Panel"
      sidebarItems={adminSidebarItems}
      sidebarClassName="admin-sidebar"
    />
  );
}
