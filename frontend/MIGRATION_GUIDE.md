# Migration Guide: Context → Zustand Store

This guide shows how to migrate existing dashboard pages from the React Context (`useStationData`) to the new Zustand store.

---

## Admin Dashboard Migration

### Before (Context)
```typescript
import { useStationData } from '../../../app/context/StationDataContext';

function StationConfigPage() {
  const { stations, updateStation } = useStationData();
  
  const handleUpdate = (id: string) => {
    updateStation(id, { stationLoad: 85 });
  };
  
  return <div>{stations.map(s => ...)}</div>;
}
```

### After (Zustand)
```typescript
import { useAdminStationStore } from '@/store';

function StationConfigPage() {
  const { adminActions, selectors } = useAdminStationStore();
  const stations = selectors.getAllStations();
  
  const handleUpdate = (id: string) => {
    adminActions.updateStation(id, { stationLoad: 85 });
  };
  
  return <div>{stations.map(s => ...)}</div>;
}
```

**Key Changes:**
- Import `useAdminStationStore` instead of `useStationData`
- Access stations via `selectors.getAllStations()`
- Use `adminActions.updateStation()` instead of `updateStation()`

---

## Operator Dashboard Migration

### Before (Context)
```typescript
import { useStationData } from '../../../app/context/StationDataContext';

function MaintenanceActionsPage() {
  const { maintenanceActions, updateMaintenanceActionStatus } = useStationData();
  
  const handleStatusChange = (id: string, status: ActionStatus) => {
    updateMaintenanceActionStatus(id, status);
  };
  
  return <div>{maintenanceActions.map(a => ...)}</div>;
}
```

### After (Zustand)
```typescript
import { useOperatorStationStore } from '@/store';

function MaintenanceActionsPage() {
  const { operatorActions, maintenanceActions } = useOperatorStationStore();
  
  const handleStatusChange = (id: string, status: ActionStatus) => {
    operatorActions.updateMaintenanceActionStatus(id, status);
  };
  
  return <div>{maintenanceActions.map(a => ...)}</div>;
}
```

**Key Changes:**
- Import `useOperatorStationStore` instead of `useStationData`
- Access actions via `operatorActions.*`
- Direct access to `maintenanceActions` (no selector needed)

---

## Station Overview Migration

### Before (Context)
```typescript
import { useStationData } from '../../../app/context/StationDataContext';

function StationOverviewPage() {
  const { stationStatuses, totalChargers, activeChargers } = useStationData();
  
  return (
    <div>
      <p>{activeChargers}/{totalChargers}</p>
      {stationStatuses.map(s => <div key={s.stationId}>...</div>)}
    </div>
  );
}
```

### After (Zustand)
```typescript
import { useOperatorStationStore } from '@/store';

function StationOverviewPage() {
  const { selectors } = useOperatorStationStore();
  const operationalStates = selectors.getOnlineStations(); // or getAllStations()
  const totalChargers = selectors.getTotalChargers();
  const activeChargers = selectors.getActiveChargers();
  
  return (
    <div>
      <p>{activeChargers}/{totalChargers}</p>
      {operationalStates.map(s => <div key={s.stationId}>...</div>)}
    </div>
  );
}
```

**Key Changes:**
- Import `useOperatorStationStore`
- Use `selectors.*` for all computed values
- `stationStatuses` → `operationalStates` (via selectors)

---

## Failure Logs Migration

### Before (Context)
```typescript
import { useStationData } from '../../../app/context/StationDataContext';

function FailureLogsPage() {
  const { failureEvents } = useStationData();
  const criticalFailures = failureEvents.filter(f => f.severity === 'critical');
  
  return <div>{criticalFailures.map(f => ...)}</div>;
}
```

### After (Zustand)
```typescript
import { useOperatorStationStore } from '@/store';

function FailureLogsPage() {
  const { selectors, failureEvents } = useOperatorStationStore();
  const criticalFailures = selectors.getCriticalFailures(); // Built-in selector!
  
  return <div>{criticalFailures.map(f => ...)}</div>;
}
```

**Key Changes:**
- Use built-in selectors instead of manual filtering
- `selectors.getCriticalFailures()` replaces filter logic

---

## Benefits of Migration

1. **Type Safety**: Role-based hooks prevent unauthorized mutations
2. **Performance**: Zustand only re-renders components that use changed state
3. **DevTools**: Better debugging with action labels
4. **Selectors**: Pre-built computed values (no manual filtering)
5. **No Provider**: No need to wrap app in provider (Zustand works globally)

---

## Optional: Remove Old Context

After migrating all pages, you can optionally remove:
- `src/app/context/StationDataContext.tsx`
- Provider wrapper in `src/app/router.tsx`

The Zustand store works globally without a provider!
