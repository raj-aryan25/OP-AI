import './AdminDashboard.css';

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage system settings and users</p>
      </div>
      
      <div className="dashboard-content">
        <div className="card">
          <h2>System Overview</h2>
          <p>Monitor and manage system-wide configurations.</p>
        </div>
        
        <div className="card">
          <h2>User Management</h2>
          <p>Control user accounts, roles, and permissions.</p>
        </div>
        
        <div className="card">
          <h2>Analytics</h2>
          <p>View system analytics and reports.</p>
        </div>
      </div>
    </div>
  );
}
