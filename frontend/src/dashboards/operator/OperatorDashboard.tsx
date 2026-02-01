import { ClipboardList, Activity, Bell, Wrench } from 'lucide-react';
import './OperatorDashboard.css';

export default function OperatorDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Operator Dashboard</h1>
        <p className="dashboard-subtitle">Manage daily operations</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <ClipboardList size={24} />
            </div>
            <h2>Task Queue</h2>
          </div>
          <p>View and manage pending operational tasks, assignments, and priority items.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <Activity size={24} />
            </div>
            <h2>Performance Metrics</h2>
          </div>
          <p>Monitor real-time performance indicators, throughput, and efficiency stats.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <Bell size={24} />
            </div>
            <h2>Notifications</h2>
          </div>
          <p>Check important system alerts, updates, and communication channels.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <Wrench size={24} />
            </div>
            <h2>Maintenance</h2>
          </div>
          <p>Schedule and track maintenance activities for station equipment.</p>
        </div>
      </div>
    </div>
  );
}
