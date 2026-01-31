import BaseLayout, { type SidebarItem } from '../BaseLayout';
import './OperatorLayout.css';

const operatorSidebarItems: SidebarItem[] = [
  { label: 'Task Queue', href: '#tasks', icon: '✓' },
  { label: 'Performance Metrics', href: '#metrics', icon: '📊' },
  { label: 'Notifications', href: '#notifications', icon: '🔔' },
  { label: 'Reports', href: '#reports', icon: '📋' },
  { label: 'Activity Log', href: '#activity', icon: '📝' },
];

export default function OperatorLayout() {
  return (
    <BaseLayout
      sidebarTitle="Operations"
      sidebarItems={operatorSidebarItems}
      sidebarClassName="operator-sidebar"
    />
  );
}
