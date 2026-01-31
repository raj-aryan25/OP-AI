import './UserDashboard.css';

export default function UserDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <p className="dashboard-subtitle">Your personalized workspace</p>
      </div>
      
      <div className="dashboard-content">
        <div className="card">
          <h2>My Profile</h2>
          <p>View and edit your personal information.</p>
        </div>
        
        <div className="card">
          <h2>Activity</h2>
          <p>Track your recent activities and progress.</p>
        </div>
        
        <div className="card">
          <h2>Settings</h2>
          <p>Customize your preferences and notifications.</p>
        </div>
      </div>
    </div>
  );
}
