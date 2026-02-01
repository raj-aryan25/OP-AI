import { BarChart, Users, Settings, Activity } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage system settings and users</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <Settings size={24} />
            </div>
            <h2>System Overview</h2>
          </div>
          <p>Monitor and manage system-wide configurations, server status, and global parameters.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <Users size={24} />
            </div>
            <h2>User Management</h2>
          </div>
          <p>Control user accounts, roles, access permissions, and activity logs.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <BarChart size={24} />
            </div>
            <h2>Analytics</h2>
          </div>
          <p>View detailed system analytics, performance reports, and usage trends.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <Activity size={24} />
            </div>
            <h2>System Health</h2>
          </div>
          <p>Real-time monitoring of infrastructure health and uptime status.</p>
        </div>
      </div>
    </div>
  );
}
