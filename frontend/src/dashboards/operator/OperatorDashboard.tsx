import { useMemo } from 'react';
import { ClipboardList, Activity, Bell, Wrench, AlertTriangle, Zap } from 'lucide-react';
import { 
  useStations,
  useOperatorStationStore, 
  useOverloadedStations, 
  useStationsWithLowInventory 
} from '../../store';
import './OperatorDashboard.css';

export default function OperatorDashboard() {
  // Subscribe to global store - reactive updates
  const stations = useStations();
  const { maintenanceActions, failureEvents } = useOperatorStationStore();
  
  // Use derived selectors - computed from base state, not stored
  const overloadedStations = useOverloadedStations();
  const lowInventoryStations = useStationsWithLowInventory();
  
  // Compute real-time metrics with threshold alerts
  const metrics = useMemo(() => {
    const pendingActions = maintenanceActions.filter(a => a.status === 'pending').length;
    const criticalFailures = failureEvents.filter(f => f.severity === 'critical').length;
    const highLoadStations = overloadedStations.length; // From derived selector
    const lowInventoryCount = lowInventoryStations.length; // From derived selector
    
    return { pendingActions, criticalFailures, highLoadStations, lowInventoryStations: lowInventoryCount };
  }, [overloadedStations, lowInventoryStations, maintenanceActions, failureEvents]);
  
  const hasAlerts = metrics.criticalFailures > 0 || metrics.highLoadStations > 0 || metrics.lowInventoryStations > 0;
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Operator Dashboard</h1>
        <p className="dashboard-subtitle">Manage daily operations</p>
      </div>

      {/* Real-time Alerts */}
      {hasAlerts && (
        <div className="operator-alerts">
          <div className="alert-header">
            <AlertTriangle size={20} />
            <span>Active Alerts Requiring Attention</span>
          </div>
          <div className="alert-items">
            {metrics.criticalFailures > 0 && (
              <div className="alert-pill critical">
                <Zap size={16} />
                {metrics.criticalFailures} Critical Failure{metrics.criticalFailures > 1 ? 's' : ''}
              </div>
            )}
            {metrics.highLoadStations > 0 && (
              <div className="alert-pill high">
                <Activity size={16} />
                {metrics.highLoadStations} Station{metrics.highLoadStations > 1 ? 's' : ''} with High Load
              </div>
            )}
            {metrics.lowInventoryStations > 0 && (
              <div className="alert-pill medium">
                <Bell size={16} />
                {metrics.lowInventoryStations} Station{metrics.lowInventoryStations > 1 ? 's' : ''} with Low Inventory
              </div>
            )}
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <ClipboardList size={24} />
            </div>
            <h2>Task Queue</h2>
            {metrics.pendingActions > 0 && (
              <span className="badge">{metrics.pendingActions}</span>
            )}
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
          <p>Monitor real-time performance indicators across {stations.length} stations.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <Bell size={24} />
            </div>
            <h2>Notifications</h2>
            {(metrics.criticalFailures + metrics.highLoadStations + metrics.lowInventoryStations) > 0 && (
              <span className="badge alert">
                {metrics.criticalFailures + metrics.highLoadStations + metrics.lowInventoryStations}
              </span>
            )}
          </div>
          <p>Check important system alerts, updates, and communication channels.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <Wrench size={24} />
            </div>
            <h2>Maintenance</h2>
            {metrics.pendingActions > 0 && (
              <span className="badge">{metrics.pendingActions}</span>
            )}
          </div>
          <p>Schedule and track maintenance activities for station equipment.</p>
        </div>
      </div>
    </div>
  );
}
