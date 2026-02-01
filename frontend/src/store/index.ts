// Store exports
export {
  // Core store (use sparingly - prefer role-based hooks)
  useStationStore,
  
  // Read-only hooks (safe for all dashboards)
  useStations,
  useStationById,
  useOperationalStates,
  useOperationalStateById,
  
  // Derived selector hooks (computed from base state)
  useAvailableStations,
  useOverloadedStations,
  useStationsWithLowInventory,
  
  // Role-based hooks
  useAdminStationStore,
  useOperatorStationStore,
  useUserStationStore,
} from './stationStore';
