import BaseLayout, { type SidebarItem } from '../BaseLayout';
import './UserLayout.css';

const userSidebarItems: SidebarItem[] = [
  { label: 'My Profile', href: '#profile', icon: '👤' },
  { label: 'Activity', href: '#activity', icon: '⚡' },
  { label: 'Settings', href: '#settings', icon: '⚙️' },
  { label: 'Preferences', href: '#preferences', icon: '🎨' },
  { label: 'Help & Support', href: '#help', icon: '❓' },
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
