import type { ReactNode } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './BaseLayout.css';

interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
}

interface BaseLayoutProps {
  sidebarTitle: string;
  sidebarItems: SidebarItem[];
  sidebarClassName?: string;
  children?: ReactNode;
}

export default function BaseLayout({ 
  sidebarTitle, 
  sidebarItems, 
  sidebarClassName = '',
  children 
}: BaseLayoutProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    return location.pathname === href;
  };

  return (
    <div className="base-layout">
      <aside className={`base-sidebar ${sidebarClassName}`}>
        <h2 className="sidebar-title">{sidebarTitle}</h2>
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const isHashLink = item.href.startsWith('#');
            const linkClass = `sidebar-link ${isActive(item.href) ? 'active' : ''}`;
            
            return isHashLink ? (
              <a key={item.href} href={item.href} className={linkClass}>
                {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                <span>{item.label}</span>
              </a>
            ) : (
              <Link key={item.href} to={item.href} className={linkClass}>
                {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="base-content">
        {children || <Outlet />}
      </div>
    </div>
  );
}

export type { SidebarItem, BaseLayoutProps };
