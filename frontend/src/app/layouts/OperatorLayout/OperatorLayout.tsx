import BaseLayout, { type SidebarItem } from '../BaseLayout';
import './OperatorLayout.css';

const operatorSidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/operator', icon: '🏠' },
  { label: 'Station Overview', href: '/operator/overview', icon: '⚡' },
  { label: 'Failure Logs', href: '/operator/failures', icon: '🚨' },
  { label: 'Maintenance Actions', href: '/operator/actions', icon: '🔧' },
  { label: 'Activity Log', href: '/operator/activity', icon: '📝' },
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
