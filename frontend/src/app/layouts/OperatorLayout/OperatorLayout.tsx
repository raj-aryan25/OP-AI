import { Outlet } from 'react-router-dom';
import './OperatorLayout.css';

export default function OperatorLayout() {
  return (
    <div className="operator-layout">
      <aside className="operator-sidebar">
        <h2>Operations</h2>
        <nav className="operator-nav">
          <a href="#tasks">Tasks</a>
          <a href="#metrics">Metrics</a>
          <a href="#notifications">Notifications</a>
          <a href="#reports">Reports</a>
        </nav>
      </aside>
      <div className="operator-content">
        <Outlet />
      </div>
    </div>
  );
}
