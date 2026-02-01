import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Station,
  StationStatus,
  FailureEvent,
  MaintenanceAction,
  ActionStatus,
  SimulationState,
} from '../../types/station';
import { mockStations, mockSimulationOutput } from '../../mock/adminData';
import { mockFailureEvents, mockMaintenanceActions, mockStationStatuses } from '../../mock/operatorData';

// Context Data Interface
interface StationDataContextValue {
  // Station Configuration
  stations: Station[];
  updateStation: (stationId: string, updates: Partial<Station>) => void;
  
  // Station Statuses
  stationStatuses: StationStatus[];
  
  // Failure Events
  failureEvents: FailureEvent[];
  
  // Maintenance Actions
  maintenanceActions: MaintenanceAction[];
  updateMaintenanceActionStatus: (actionId: string, status: ActionStatus) => void;
  
  // Simulation State
  simulationState: SimulationState;
  setSimulationState: (state: SimulationState) => void;
  simulationOutput: Record<string, unknown> | null;
  
  // Read-only derived data
  totalChargers: number;
  activeChargers: number;
  totalAlerts: number;
  onlineStations: number;
}

const StationDataContext = createContext<StationDataContextValue | undefined>(undefined);

// Helper function to sync stations with station statuses
function deriveStationStatuses(stations: Station[]): StationStatus[] {
  return stations.map((station) => {
    // Find existing status or create default
    const existingStatus = mockStationStatuses.find(s => s.stationId === station.id);
    return {
      stationId: station.id,
      stationName: station.name,
      status: existingStatus?.status || 'online',
      activeChargers: station.activeChargers,
      totalChargers: station.totalChargers || station.activeChargers,
      currentQueue: station.queueLength,
      batteryInventory: station.chargedBatteryInventory,
      lastUpdate: new Date().toISOString(),
      alerts: existingStatus?.alerts || 0,
    };
  });
}

// Provider Component
export function StationDataProvider({ children }: { children: ReactNode }) {
  // Initialize stations with totalChargers field
  const initialStations = mockStations.map(station => ({
    ...station,
    totalChargers: station.activeChargers + Math.floor(Math.random() * 3),
  }));

  const [stations, setStations] = useState<Station[]>(initialStations);
  const [failureEvents] = useState<FailureEvent[]>(mockFailureEvents);
  const [maintenanceActions, setMaintenanceActions] = useState<MaintenanceAction[]>(mockMaintenanceActions);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    status: 'idle',
    output: null,
    startTime: null,
    endTime: null,
  });

  // Derive station statuses from stations
  const stationStatuses = deriveStationStatuses(stations);

  // Update a single station (Admin only)
  const updateStation = (stationId: string, updates: Partial<Station>) => {
    setStations((prev) =>
      prev.map((station) =>
        station.id === stationId ? { ...station, ...updates } : station
      )
    );
  };

  // Update maintenance action status (Operator)
  const updateMaintenanceActionStatus = (actionId: string, status: ActionStatus) => {
    setMaintenanceActions((prev) =>
      prev.map((action) =>
        action.id === actionId ? { ...action, status } : action
      )
    );
  };

  // Derived/computed values
  const totalChargers = stationStatuses.reduce((sum, s) => sum + s.totalChargers, 0);
  const activeChargers = stationStatuses.reduce((sum, s) => sum + s.activeChargers, 0);
  const totalAlerts = stationStatuses.reduce((sum, s) => sum + s.alerts, 0);
  const onlineStations = stationStatuses.filter((s) => s.status === 'online').length;

  const value: StationDataContextValue = {
    stations,
    updateStation,
    stationStatuses,
    failureEvents,
    maintenanceActions,
    updateMaintenanceActionStatus,
    simulationState,
    setSimulationState,
    simulationOutput: simulationState.output || mockSimulationOutput,
    totalChargers,
    activeChargers,
    totalAlerts,
    onlineStations,
  };

  return (
    <StationDataContext.Provider value={value}>
      {children}
    </StationDataContext.Provider>
  );
}

// Custom hook to use the context
export function useStationData() {
  const context = useContext(StationDataContext);
  if (!context) {
    throw new Error('useStationData must be used within a StationDataProvider');
  }
  return context;
}
