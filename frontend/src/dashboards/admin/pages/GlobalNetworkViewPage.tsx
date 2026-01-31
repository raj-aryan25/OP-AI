import './GlobalNetworkViewPage.css';

export default function GlobalNetworkViewPage() {
  return (
    <div className="network-view-page">
      <div className="page-header">
        <h1>Global Network View</h1>
        <p className="page-subtitle">Visualize the entire charging network topology</p>
      </div>

      <div className="network-container">
        <div className="placeholder-view">
          <div className="placeholder-icon">🗺️</div>
          <h2>Network Visualization Coming Soon</h2>
          <p>This page will display an interactive network topology map showing:</p>
          <ul className="feature-list">
            <li>Station locations and connections</li>
            <li>Real-time traffic flow</li>
            <li>Network health indicators</li>
            <li>Battery distribution across stations</li>
            <li>Critical path analysis</li>
          </ul>
        </div>

        <div className="network-stats">
          <div className="stat-box">
            <h3>Network Coverage</h3>
            <p className="stat-number">5</p>
            <p className="stat-label">Active Stations</p>
          </div>
          <div className="stat-box">
            <h3>Network Health</h3>
            <p className="stat-number">94%</p>
            <p className="stat-label">Overall Status</p>
          </div>
          <div className="stat-box">
            <h3>Total Capacity</h3>
            <p className="stat-number">45</p>
            <p className="stat-label">Chargers Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
