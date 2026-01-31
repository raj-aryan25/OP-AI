import BaseLayout, { type SidebarItem } from '../BaseLayout';
import './UserLayout.css';

const userSidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/user', icon: '🏠' },
  { label: 'Route Planner', href: '/user/route', icon: '🗺️' },
  { label: 'Swap Recommendations', href: '/user/recommendation', icon: '🔋' },
  { label: 'My Profile', href: '/user/profile', icon: '👤' },
  { label: 'Settings', href: '/user/settings', icon: '⚙️' },
];

export default function UserLayout() {
  return (
    <BaseLayout
      sidebarTitle="My Space"
      sidebarItems={userSidebarItems}
      sidebarClassName="user-sidebar"
    />
  );
}
