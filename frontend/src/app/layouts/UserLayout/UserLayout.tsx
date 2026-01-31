import { Outlet } from 'react-router-dom';
import './UserLayout.css';

export default function UserLayout() {
  return (
    <div className="user-layout">
      <aside className="user-sidebar">
        <h2>My Space</h2>
        <nav className="user-nav">
          <a href="#profile">Profile</a>
          <a href="#activity">Activity</a>
          <a href="#settings">Settings</a>
          <a href="#help">Help</a>
        </nav>
      </aside>
      <div className="user-content">
        <Outlet />
      </div>
    </div>
  );
}
