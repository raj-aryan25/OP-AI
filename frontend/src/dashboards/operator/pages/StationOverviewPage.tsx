import { useMemo } from 'react';
import { useStations, useOperationalStates } from '../../../store';
import './StationOverviewPage.css';

export default function StationOverviewPage() {
  // Subscribe to global Zustand store - reactive updates
  const stations = useStations();
  const operationalStates = useOperationalStates();
  
  // Compute metrics with threshold alerts
  const metrics = useMemo(() => {
    const totalChargers = stations.reduce((sum, s) => sum + s.totalChargers, 0);
    const activeChargers = stations.reduce((sum, s) => sum + s.activeChargers, 0);
    const onlineStations = operationalStates.filter(s => s.status === 'online').length;
    
    // Detect threshold violations for alerts
    const alerts = {
      highLoad: stations.filter(s => s.stationLoad >= 85),
      lowInventory: stations.filter(s => s.chargedBatteryInventory <= 5),
      longQueue: stations.filter(s => s.queueLength >= 10),
      highTemp: stations.filter(s => s.temperature >= 35)
    };
    
    const totalAlerts = alerts.highLoad.length + alerts.lowInventory.length + 
                       alerts.longQueue.length + alerts.highTemp.length;
    
    return { totalChargers, activeChargers, onlineStations, totalAlerts, alerts };
  }, [stations, operationalStates]);
  
  // Build station status data from both stores
  const stationStatuses = useMemo(() => {
    return stations.map(station => {
      const opState = operationalStates.find(s => s.stationId === station.id);
      const alerts = [
        station.stationLoad >= 85 ? 1 : 0,
        station.chargedBatteryInventory <= 5 ? 1 : 0,
        station.queueLength >= 10 ? 1 : 0,
        station.temperature >= 35 ? 1 : 0
      ].reduce((sum, a) => sum + a, 0);
      
      return {
        stationId: station.id,
        stationName: station.name,
        status: opState?.status || 'unknown',
        activeChargers: station.activeChargers,
        totalChargers: station.totalChargers,
        currentQueue: station.queueLength,
        batteryInventory: station.chargedBatteryInventory,
        alerts,
        lastUpdate: opState?.lastUpdate || new Date().toISOString()
      };
    });
  }, [stations, operationalStates]);
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online': return 'status-online';
      case 'degraded': return 'status-degraded';
      case 'offline': return 'status-offline';
      default: return '';
    }
  };

  return (
    <div className="station-overview-page">
      <div className="page-header">
        <h1>Station Overview</h1>
        <p className="page-subtitle">Real-time monitoring of all charging stations</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Online Stations</h3>
          <p className="summary-value">{metrics.onlineStations}/{stationStatuses.length}</p>
          <p className="summary-label">Operational Status</p>
        </div>
        <div className="summary-card">
          <h3>Active Chargers</h3>
          <p className="summary-value">{metrics.activeChargers}/{metrics.totalChargers}</p>
          <p className="summary-label">Network Capacity</p>
        </div>
        <div className="summary-card">
          <h3>Active Alerts</h3>
          <p className="summary-value alert-count">{metrics.totalAlerts}</p>
          <p className="summary-label">Requires Attention</p>
        </div>
        <div className="summary-card">
          <h3>Total Queue</h3>
          <p className="summary-value">{stationStatuses.reduce((sum, s) => sum + s.currentQueue, 0)}</p>
          <p className="summary-label">Waiting Customers</p>
        </div>
      </div>
      
      {/* Reactive Threshold Alerts */}
      {metrics.totalAlerts > 0 && (
        <div className="alert-banner">
          <div className="alert-content">
            <span className="alert-icon">⚠️</span>
            <div className="alert-messages">
              {metrics.alerts.highLoad.length > 0 && (
                <div className="alert-item critical">
                  🔴 {metrics.alerts.highLoad.length} station(s) with HIGH LOAD (≥85%): {metrics.alerts.highLoad.map(s => s.name).join(', ')}
                </div>
              )}
              {metrics.alerts.lowInventory.length > 0 && (
                <div className="alert-item high">
                  🟠 {metrics.alerts.lowInventory.length} station(s) with LOW INVENTORY (≤5): {metrics.alerts.lowInventory.map(s => s.name).join(', ')}
                </div>
              )}
              {metrics.alerts.longQueue.length > 0 && (
                <div className="alert-item medium">
                  🟡 {metrics.alerts.longQueue.length} station(s) with LONG QUEUE (≥10): {metrics.alerts.longQueue.map(s => s.name).join(', ')}
                </div>
              )}
              {metrics.alerts.highTemp.length > 0 && (
                <div className="alert-item medium">
                  🌡️ {metrics.alerts.highTemp.length} station(s) with HIGH TEMPERATURE (≥35°C): {metrics.alerts.highTemp.map(s => s.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="stations-grid">
        {stationStatuses.map((station) => (
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
