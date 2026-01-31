import { mockStationStatuses } from '../../../mock/operatorData';
import './StationOverviewPage.css';

export default function StationOverviewPage() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online': return 'status-online';
      case 'degraded': return 'status-degraded';
      case 'offline': return 'status-offline';
      default: return '';
    }
  };

  const totalChargers = mockStationStatuses.reduce((sum, s) => sum + s.totalChargers, 0);
  const activeChargers = mockStationStatuses.reduce((sum, s) => sum + s.activeChargers, 0);
  const totalAlerts = mockStationStatuses.reduce((sum, s) => sum + s.alerts, 0);
  const onlineStations = mockStationStatuses.filter(s => s.status === 'online').length;

  return (
    <div className="station-overview-page">
      <div className="page-header">
        <h1>Station Overview</h1>
        <p className="page-subtitle">Real-time monitoring of all charging stations</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Online Stations</h3>
          <p className="summary-value">{onlineStations}/{mockStationStatuses.length}</p>
          <p className="summary-label">Operational Status</p>
        </div>
        <div className="summary-card">
          <h3>Active Chargers</h3>
          <p className="summary-value">{activeChargers}/{totalChargers}</p>
          <p className="summary-label">Network Capacity</p>
        </div>
        <div className="summary-card">
          <h3>Active Alerts</h3>
          <p className="summary-value alert-count">{totalAlerts}</p>
          <p className="summary-label">Requires Attention</p>
        </div>
        <div className="summary-card">
          <h3>Total Queue</h3>
          <p className="summary-value">{mockStationStatuses.reduce((sum, s) => sum + s.currentQueue, 0)}</p>
          <p className="summary-label">Waiting Customers</p>
        </div>
      </div>

      <div className="stations-grid">
        {mockStationStatuses.map((station) => (
          <div key={station.stationId} className="station-card">
            <div className="station-card-header">
              <div>
                <h3>{station.stationName}</h3>
                <p className="station-id">{station.stationId}</p>
              </div>
              <span className={`status-badge ${getStatusClass(station.status)}`}>
                {station.status}
              </span>
            </div>

            <div className="station-metrics">
              <div className="metric">
                <span className="metric-label">Chargers</span>
                <span className="metric-value">
                  {station.activeChargers}/{station.totalChargers}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Queue</span>
                <span className="metric-value">{station.currentQueue}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Batteries</span>
                <span className="metric-value">{station.batteryInventory}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Alerts</span>
                <span className={`metric-value ${station.alerts > 0 ? 'has-alerts' : ''}`}>
                  {station.alerts}
                </span>
              </div>
            </div>

            <div className="station-footer">
              <span className="last-update">
                Updated: {new Date(station.lastUpdate).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
