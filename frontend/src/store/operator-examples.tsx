/**
 * OPERATOR DASHBOARD - READ-ONLY EXAMPLE
 * 
 * This example shows how operator components should consume station data
 * without the ability to mutate station configuration or operational state.
 */

import { useStations, useStationById, useOperationalStateById } from './stationStore';

// ============================================================================
// EXAMPLE 1: Display all stations (read-only)
// ============================================================================

export function StationListExample() {
  // Safe: read-only hook, no mutation possible
  const stations = useStations();
  
  return (
    <div>
      <h2>All Stations</h2>
      {stations.map(station => (
        <div key={station.id}>
          <h3>{station.name}</h3>
          <p>Load: {station.stationLoad}%</p>
          <p>Queue: {station.queueLength}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Display single station details (read-only)
// ============================================================================

export function StationDetailExample({ stationId }: { stationId: string }) {
  // Safe: read-only hook, retrieves single station
  const station = useStationById(stationId);
  const operationalState = useOperationalStateById(stationId);
  
  if (!station) {
    return <div>Station not found</div>;
  }
  
  return (
    <div>
      <h2>{station.name}</h2>
      <p>Configuration:</p>
      <ul>
        <li>Active Chargers: {station.activeChargers}</li>
        <li>Battery Inventory: {station.chargedBatteryInventory}</li>
        <li>Temperature: {station.temperature}°C</li>
      </ul>
      
      {operationalState && (
        <>
          <p>Operational State:</p>
          <ul>
            <li>Status: {operationalState.status}</li>
            <li>Current Queue: {operationalState.currentQueue}</li>
            <li>Alerts: {operationalState.alerts}</li>
            <li>Uptime: {operationalState.uptime?.toFixed(2)}%</li>
          </ul>
        </>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Use operator-specific hook with selectors
// ============================================================================

import { useOperatorStationStore } from './stationStore';

export function MaintenanceOverviewExample() {
  // Operator hook: can update maintenance actions, but NOT station config
  const { operatorActions, selectors, maintenanceActions } = useOperatorStationStore();
  
  const pendingActions = selectors.getPendingMaintenanceActions();
  const criticalFailures = selectors.getCriticalFailures();
  
  const handleAcknowledge = (actionId: string) => {
    // ✅ Allowed: Operators can update maintenance action status
    operatorActions.updateMaintenanceActionStatus(actionId, 'acknowledged');
  };
  
  // ❌ NOT AVAILABLE: Operators cannot do this
  // operatorActions.updateStationConfig(...) // TypeScript error!
  // operatorActions.updateOperationalState(...) // TypeScript error!
  
  return (
    <div>
      <h2>Pending Maintenance</h2>
      <p>Pending: {pendingActions.length}</p>
      <p>Critical Failures: {criticalFailures.length}</p>
      
      {maintenanceActions.map(action => (
        <div key={action.id}>
          <h3>{action.title}</h3>
          <button onClick={() => handleAcknowledge(action.id)}>
            Acknowledge
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Operator cannot mutate station state
// ============================================================================

export function OperatorDashboardExample() {
  const stations = useStations(); // Read-only
  const { operatorActions } = useOperatorStationStore();
  
  // ❌ THIS WILL NOT COMPILE - TypeScript prevents it!
  // operatorActions.updateStationConfig('ST-001', { stationLoad: 90 });
  
  // ✅ Operators can only:
  // - Read station data
  // - Update maintenance actions
  // - Acknowledge failures
  
  const handleAddMaintenanceAction = () => {
    operatorActions.addMaintenanceAction({
      id: 'MA-NEW',
      title: 'Routine Inspection',
      description: 'Weekly inspection',
      stationId: 'ST-001',
      stationName: stations[0]?.name || '',
      priority: 'medium',
      status: 'pending',
      category: 'Routine',
      estimatedDuration: 60,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000).toISOString()
    });
  };
  
  return (
    <div>
      <h2>Operator Dashboard</h2>
      <p>Total Stations: {stations.length}</p>
      <button onClick={handleAddMaintenanceAction}>
        Add Maintenance Action
      </button>
    </div>
  );
}

// ============================================================================
// ANTI-PATTERNS - What NOT to do
// ============================================================================

export function BadOperatorExample() {
  // ❌ DON'T use the base store directly in operator components
  // import { useStationStore } from './stationStore';
  // const state = useStationStore.getState();
  // state.adminActions.updateStationConfig(...); // This would bypass safety!
  
  // ✅ DO use role-appropriate hooks
  useStations(); // Safe read-only
  useOperatorStationStore(); // Limited actions
  
  return <div>...</div>;
}
