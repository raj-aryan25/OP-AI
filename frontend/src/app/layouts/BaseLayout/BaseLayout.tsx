import type { ReactNode } from 'react';
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './BaseLayout.css';

interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode; // Changed to ReactNode to support Lucide components
}

interface BaseLayoutProps {
  sidebarTitle: string;
  sidebarItems: SidebarItem[];
  sidebarClassName?: string;
  className?: string; // To pass theme classes
  children?: ReactNode;
}

export default function BaseLayout({
  sidebarTitle,
  sidebarItems,
  sidebarClassName = '',
  className = '',
  children
}: BaseLayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    // Simple check for active path
    return location.pathname === href || (href !== '/user' && location.pathname.startsWith(href));
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={`base-layout ${className}`}>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="mobile-title">{sidebarTitle}</h2>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`base-sidebar ${sidebarClassName} ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{sidebarTitle}</h2>
          <button className="close-btn" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const isHashLink = item.href.startsWith('#');
            // Active state logic
            const active = isActive(item.href);
            const linkClass = `sidebar-link ${active ? 'active' : ''}`;

            return isHashLink ? (
              <a key={item.href} href={item.href} className={linkClass} onClick={closeSidebar}>
                {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                <span>{item.label}</span>
              </a>
            ) : (
              <Link key={item.href} to={item.href} className={linkClass} onClick={closeSidebar}>
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
