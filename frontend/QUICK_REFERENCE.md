# Station Store Quick Reference

## Import

```typescript
import {
  useStationStore,        // Full access (use sparingly)
  useAdminStationStore,   // Admin dashboard
  useOperatorStationStore,// Operator dashboard  
  useUserStationStore     // User dashboard (read-only)
} from '@/store';
```

---

## Admin Hook

```typescript
const { adminActions, selectors, simulationState } = useAdminStationStore();

// Update single station
adminActions.updateStation('ST-001', { stationLoad: 92.5 });

// Bulk update
adminActions.bulkUpdateStations([
  { id: 'ST-001', data: { temperature: 24.5 } },
  { id: 'ST-002', data: { temperature: 23.8 } }
]);

// Run simulation
adminActions.runSimulation('counterfactual');
adminActions.resetSimulation();

// Add station
adminActions.addStation({ id: 'ST-006', name: 'New Station', ... });

// Remove station
adminActions.removeStation('ST-006');
```

---

## Operator Hook

```typescript
const { operatorActions, selectors, maintenanceActions, failureEvents } = useOperatorStationStore();

// Update maintenance action
operatorActions.updateMaintenanceActionStatus('MA-001', 'acknowledged');

// Add maintenance action
operatorActions.addMaintenanceAction({ id: 'MA-007', ... });

// Acknowledge failure
operatorActions.acknowledgeFailure('FE-001');
```

---

## User Hook

```typescript
const { selectors, operationalStates, networkRecommendations } = useUserStationStore();

// Get online stations
const online = selectors.getOnlineStations();

// Get metrics
const efficiency = selectors.getNetworkEfficiency();
const totalChargers = selectors.getTotalChargers();
```

---

## Common Selectors

```typescript
// Stations
selectors.getStationById('ST-001')
selectors.getAllStations()
selectors.getOnlineStations()
selectors.getDegradedStations()

// Metrics
selectors.getTotalChargers()
selectors.getActiveChargers()
selectors.getTotalAlerts()
selectors.getAverageStationLoad()
selectors.getNetworkEfficiency()

// Failures
selectors.getCriticalFailures()
selectors.getFailuresByStation('ST-001')
selectors.getRecentFailures(24) // last 24 hours

// Maintenance
selectors.getPendingMaintenanceActions()
selectors.getCriticalMaintenanceActions()
selectors.getMaintenanceActionsByStation('ST-001')

// Recommendations
selectors.getActiveRecommendations()
selectors.getRecommendationsByPriority('high')
selectors.getRecommendationsByStation('ST-001')
```

---

## Direct Store Access (Outside React)

```typescript
// Get state
const state = useStationStore.getState();

// Access data
console.log(state.stations);
console.log(state.operationalStates);

// Call actions
state.adminActions.updateStation('ST-001', { temperature: 25 });

// Use selectors
const online = state.selectors.getOnlineStations();

// Subscribe to changes
const unsubscribe = useStationStore.subscribe(
  (state) => console.log('State changed:', state)
);
```

---

## Files

- **Store**: `src/store/stationStore.ts`
- **Documentation**: `src/store/README.md`
- **Examples**: `src/store/examples.ts`
- **Migration**: `MIGRATION_GUIDE.md`

---

## DevTools

Open Redux DevTools in browser to:
- Inspect current state
- View action history
- Time-travel debugging
- Monitor performance

All actions labeled: `admin/updateStation`, `operator/updateMaintenanceActionStatus`, etc.
