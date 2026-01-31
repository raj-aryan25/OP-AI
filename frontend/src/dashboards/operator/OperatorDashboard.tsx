import './OperatorDashboard.css';

export default function OperatorDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Operator Dashboard</h1>
        <p className="dashboard-subtitle">Manage daily operations</p>
      </div>
      
      <div className="dashboard-content">
        <div className="card">
          <h2>Task Queue</h2>
          <p>View and manage pending operational tasks.</p>
        </div>
        
        <div className="card">
          <h2>Performance Metrics</h2>
          <p>Monitor real-time performance indicators.</p>
        </div>
        
        <div className="card">
          <h2>Notifications</h2>
          <p>Check important system alerts and updates.</p>
        </div>
      </div>
    </div>
  );
}
