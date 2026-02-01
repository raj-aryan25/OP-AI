// Store exports
export {
  // Core store (use sparingly - prefer role-based hooks)
  useStationStore,
  
  // Read-only hooks (safe for all dashboards)
  useStations,
  useStationById,
  useOperationalStates,
  useOperationalStateById,
  
  // Role-based hooks
  useAdminStationStore,
  useOperatorStationStore,
  useUserStationStore,
} from './stationStore';
