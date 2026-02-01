# Global Station Store Implementation

## Overview

Implemented a **global station store** using **Zustand** that manages all station-related data with role-based access control.

---

## ✅ Implementation Complete

### Store Location
- **Main Store**: [src/store/stationStore.ts](src/store/stationStore.ts)
- **Exports**: [src/store/index.ts](src/store/index.ts)
- **Documentation**: [src/store/README.md](src/store/README.md)
- **Examples**: [src/store/examples.ts](src/store/examples.ts)
- **Migration Guide**: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

---

## 🎯 Key Features

### 1. Role-Based Access Control

Three specialized hooks enforce permissions:

```typescript
// Admin - Full mutation access
const { adminActions, selectors, simulationState } = useAdminStationStore();

// Operator - Limited mutations (maintenance only)
const { operatorActions, selectors, maintenanceActions } = useOperatorStationStore();

// User - Read-only access
const { selectors, operationalStates } = useUserStationStore();
```

### 2. Comprehensive State Management

**Data Stored:**
- ✅ Station configuration (admin editable)
- ✅ Live operational states (derived + admin override)
- ✅ Failure events
- ✅ Maintenance actions
- ✅ Network recommendations
- ✅ Simulation state

### 3. Admin-Only Actions

```typescript
adminActions.updateStation(stationId, updates)
adminActions.bulkUpdateStations(updates)
adminActions.addStation(station)
adminActions.removeStation(stationId)
adminActions.updateOperationalState(stationId, updates)
adminActions.runSimulation(type)
adminActions.resetSimulation()
adminActions.addRecommendation(recommendation)
adminActions.dismissRecommendation(id)
```

### 4. Operator Actions

```typescript
operatorActions.updateMaintenanceActionStatus(id, status)
operatorActions.addMaintenanceAction(action)
operatorActions.acknowledgeFailure(failureId)
operatorActions.updateRecommendationStatus(id, status)
```

### 5. Read-Only Selectors (All Dashboards)

**Station Selectors:**
- `getStationById(id)`
- `getStationOperationalState(id)`
- `getAllStations()`
- `getOnlineStations()`
- `getDegradedStations()`
- `getOfflineStations()`

**Metrics Selectors:**
- `getTotalChargers()`
- `getActiveChargers()`
- `getTotalAlerts()`
- `getAverageStationLoad()`
- `getNetworkEfficiency()`

**Failure Selectors:**
- `getFailuresByStation(stationId)`
- `getCriticalFailures()`
- `getRecentFailures(hours)`

**Maintenance Selectors:**
- `getPendingMaintenanceActions()`
- `getMaintenanceActionsByStation(stationId)`
- `getCriticalMaintenanceActions()`

**Recommendation Selectors:**
- `getActiveRecommendations()`
- `getRecommendationsByPriority(priority)`
- `getRecommendationsByStation(stationId)`

---

## 📊 Architecture Benefits

### 1. Type Safety
- TypeScript ensures only authorized mutations per role
- No accidental state changes from wrong dashboard

### 2. Performance
- Zustand only re-renders components that use changed data
- Selective subscriptions prevent unnecessary renders
- No Provider wrapper overhead

### 3. Developer Experience
- Redux DevTools integration for debugging
- All actions labeled (e.g., `admin/updateStation`)
- Clear separation of concerns
- Extensive documentation and examples

### 4. Scalability
- Easy to add new actions/selectors
- Middleware support (devtools, persist, etc.)
- Can work outside React components

---

## 🚀 Usage Examples

### Admin Dashboard
```typescript
import { useAdminStationStore } from '@/store';

function StationConfigPage() {
  const { adminActions, selectors } = useAdminStationStore();
  
  const handleUpdate = (id: string) => {
    adminActions.updateStation(id, { stationLoad: 92.5 });
  };
  
  return <div>{selectors.getAllStations().map(...)}</div>;
}
```

### Operator Dashboard
```typescript
import { useOperatorStationStore } from '@/store';

function MaintenanceActionsPage() {
  const { operatorActions, selectors } = useOperatorStationStore();
  
  const pending = selectors.getPendingMaintenanceActions();
  
  const handleAcknowledge = (id: string) => {
    operatorActions.updateMaintenanceActionStatus(id, 'acknowledged');
  };
  
  return <div>{pending.map(...)}</div>;
}
```

### User Dashboard
```typescript
import { useUserStationStore } from '@/store';

function StationFinderPage() {
  const { selectors } = useUserStationStore();
  
  const online = selectors.getOnlineStations();
  const efficiency = selectors.getNetworkEfficiency();
  
  return (
    <div>
      <p>Network Efficiency: {efficiency.toFixed(1)}%</p>
      {online.map(...)}
    </div>
  );
}
```

---

## 🔄 Migration from Context

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for step-by-step instructions to migrate existing dashboard pages from React Context to the new Zustand store.

**Key Changes:**
- `useStationData()` → `useAdminStationStore()` / `useOperatorStationStore()` / `useUserStationStore()`
- Direct data access → Selector-based access
- Automatic performance optimization

---

## 🛠️ DevTools Setup

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open browser DevTools
3. Navigate to Redux tab
4. Monitor store actions and state changes

All actions are labeled:
- `admin/updateStation`
- `admin/runSimulation`
- `operator/updateMaintenanceActionStatus`
- etc.

---

## ✅ Build Status

```
✓ TypeScript compilation successful
✓ No errors
✓ All types properly exported
✓ Zustand installed and configured
✓ DevTools middleware enabled
```

---

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "zustand": "latest"
  }
}
```

---

## Next Steps

1. **Optional**: Migrate existing dashboard pages from React Context to Zustand (see [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md))
2. **Optional**: Remove old `StationDataContext.tsx` after migration
3. **Optional**: Add persistence middleware to save state to localStorage
4. **Optional**: Add computed selectors for more complex queries

The store is production-ready and can be used immediately alongside the existing Context implementation!
