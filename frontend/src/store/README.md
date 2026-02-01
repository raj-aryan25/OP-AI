# Station Store Documentation

Global station store built with Zustand for managing station configuration and live operational state.

## Architecture

The store provides **role-based access** with three specialized hooks:
- **Admin**: Full mutation capabilities
- **Operator**: Limited mutations (maintenance actions only)
- **User**: Read-only access

---

## Usage Examples

### Admin Dashboard

Admins have full control over station configuration and can run simulations.

```typescript
import { useAdminStationStore } from '@/store';

function StationConfigPage() {
  const { adminActions, selectors, simulationState } = useAdminStationStore();
  
  // Get all stations
  const stations = selectors.getAllStations();
  
  // Update a station
  const handleUpdateStation = (stationId: string) => {
    adminActions.updateStation(stationId, {
      activeChargers: 12,
      stationLoad: 85.5,
      temperature: 23.2
    });
  };
  
  // Add a new station
  const handleAddStation = () => {
    adminActions.addStation({
      id: 'ST-006',
      name: 'New Station',
      queueLength: 0,
      arrivalRate: 5.0,
      activeChargers: 6,
      totalChargers: 8,
      chargedBatteryInventory: 20,
      temperature: 22.0,
      stationLoad: 0
    });
  };
  
  // Run simulation
  const handleRunSimulation = () => {
    adminActions.runSimulation('counterfactual');
  };
  
  // Bulk update multiple stations
  const handleBulkUpdate = () => {
    adminActions.bulkUpdateStations([
      { id: 'ST-001', data: { stationLoad: 75.0 } },
      { id: 'ST-002', data: { stationLoad: 80.5 } }
    ]);
  };
  
  return <div>{/* UI components */}</div>;
}
```

### Operator Dashboard

Operators can update maintenance actions and acknowledge failures, but cannot modify station configuration.

```typescript
import { useOperatorStationStore } from '@/store';

function MaintenanceActionsPage() {
  const { operatorActions, selectors, maintenanceActions, failureEvents } = useOperatorStationStore();
  
  // Get pending maintenance actions
  const pendingActions = selectors.getPendingMaintenanceActions();
  
  // Get critical failures
  const criticalFailures = selectors.getCriticalFailures();
  
  // Update maintenance action status
  const handleAcknowledge = (actionId: string) => {
    operatorActions.updateMaintenanceActionStatus(actionId, 'acknowledged');
  };
  
  // Add new maintenance action
  const handleAddAction = () => {
    operatorActions.addMaintenanceAction({
      id: 'MA-007',
      title: 'Replace Battery Pack',
      description: 'Battery degradation detected',
      stationId: 'ST-001',
      stationName: 'Downtown Hub',
      priority: 'high',
      status: 'pending',
      category: 'Component Replacement',
      estimatedDuration: 120,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000).toISOString()
    });
  };
  
  // Acknowledge a failure
  const handleAcknowledgeFailure = (failureId: string) => {
    operatorActions.acknowledgeFailure(failureId);
  };
  
  return <div>{/* UI components */}</div>;
}
```

### User Dashboard

Users have read-only access to station states and recommendations.

```typescript
import { useUserStationStore } from '@/store';

function StationFinderPage() {
  const { selectors, operationalStates, networkRecommendations } = useUserStationStore();
  
  // Get online stations
  const onlineStations = selectors.getOnlineStations();
  
  // Get station operational state
  const stationState = selectors.getStationOperationalState('ST-001');
  
  // Get network metrics
  const totalChargers = selectors.getTotalChargers();
  const activeChargers = selectors.getActiveChargers();
  const networkEfficiency = selectors.getNetworkEfficiency();
  
  // Get active recommendations
  const recommendations = selectors.getActiveRecommendations();
  
  return (
    <div>
      <h1>Available Stations</h1>
      <p>Network Efficiency: {networkEfficiency.toFixed(1)}%</p>
      <p>Active Chargers: {activeChargers}/{totalChargers}</p>
      
      <div>
        {onlineStations.map(station => (
          <div key={station.stationId}>
            <h3>{station.stationName}</h3>
            <p>Queue: {station.currentQueue}</p>
            <p>Available Batteries: {station.batteryInventory}</p>
            <p>Wait Time: {station.performanceMetrics?.averageWaitTime.toFixed(1)} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Available Selectors

All dashboards have access to these read-only selectors:

### Station Selectors
- `getStationById(id)` - Get station configuration by ID
- `getStationOperationalState(id)` - Get live operational state
- `getAllStations()` - Get all stations
- `getOnlineStations()` - Get only online stations
- `getDegradedStations()` - Get degraded stations
- `getOfflineStations()` - Get offline stations

### Metrics Selectors
- `getTotalChargers()` - Total chargers across network
- `getActiveChargers()` - Currently active chargers
- `getTotalAlerts()` - Total active alerts
- `getAverageStationLoad()` - Average load percentage
- `getNetworkEfficiency()` - Overall network efficiency

### Failure Selectors
- `getFailuresByStation(stationId)` - Failures for specific station
- `getCriticalFailures()` - Only critical severity failures
- `getRecentFailures(hours)` - Failures within time window

### Maintenance Selectors
- `getPendingMaintenanceActions()` - All pending actions
- `getMaintenanceActionsByStation(stationId)` - Actions for station
- `getCriticalMaintenanceActions()` - Critical priority actions

### Recommendation Selectors
- `getActiveRecommendations()` - Non-dismissed recommendations
- `getRecommendationsByPriority(priority)` - Filter by priority
- `getRecommendationsByStation(stationId)` - Recommendations affecting station

---

## Admin Actions

Only available via `useAdminStationStore()`:

```typescript
adminActions.updateStation(stationId, updates)
adminActions.addStation(station)
adminActions.removeStation(stationId)
adminActions.bulkUpdateStations(updates)
adminActions.updateOperationalState(stationId, updates)
adminActions.setSimulationState(state)
adminActions.runSimulation(type)
adminActions.resetSimulation()
adminActions.addRecommendation(recommendation)
adminActions.dismissRecommendation(recommendationId)
```

## Operator Actions

Only available via `useOperatorStationStore()`:

```typescript
operatorActions.updateMaintenanceActionStatus(actionId, status)
operatorActions.addMaintenanceAction(action)
operatorActions.acknowledgeFailure(failureId)
operatorActions.updateRecommendationStatus(recommendationId, status)
```

---

## DevTools

The store is configured with Zustand DevTools. Install the [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) to inspect state changes in your browser.

All actions are labeled for easy debugging:
- `admin/updateStation`
- `operator/updateMaintenanceActionStatus`
- etc.
