import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Station,
  StationOperationalState,
  FailureEvent,
  MaintenanceAction,
  ActionStatus,
  SimulationState,
  NetworkRecommendation,
} from '../types/station';
import { mockStations, mockSimulationOutput } from '../mock/adminData';
import { mockFailureEvents, mockMaintenanceActions, mockStationStatuses } from '../mock/operatorData';

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface StationStoreState {
  // -------------------------------------------------------------------------
  // STATE DATA
  // -------------------------------------------------------------------------
  stations: Station[];
  operationalStates: StationOperationalState[];
  failureEvents: FailureEvent[];
  maintenanceActions: MaintenanceAction[];
  networkRecommendations: NetworkRecommendation[];
  simulationState: SimulationState;

  // -------------------------------------------------------------------------
  // ADMIN ACTIONS (Mutations - Admin Only)
  // -------------------------------------------------------------------------
  adminActions: {
    // Station Configuration Management
    updateStationConfig: (stationId: string, updates: Partial<Station>) => void;
    addStation: (station: Station) => void;
    removeStation: (stationId: string) => void;
    bulkUpdateStationConfig: (updates: Array<{ id: string; data: Partial<Station> }>) => void;
    
    // Operational State Management (Admin override)
    updateOperationalState: (stationId: string, updates: Partial<StationOperationalState>) => void;
    
    // Simulation Control
    setSimulationState: (state: SimulationState) => void;
    runSimulation: (type: 'counterfactual' | 'failure_injection') => void;
    resetSimulation: () => void;
    
    // Network Recommendations (Admin can create/dismiss)
    addRecommendation: (recommendation: NetworkRecommendation) => void;
    dismissRecommendation: (recommendationId: string) => void;
  };

  // -------------------------------------------------------------------------
  // OPERATOR ACTIONS (Limited mutations)
  // -------------------------------------------------------------------------
  operatorActions: {
    // Maintenance Actions
    updateMaintenanceActionStatus: (actionId: string, status: ActionStatus) => void;
    addMaintenanceAction: (action: MaintenanceAction) => void;
    
    // Acknowledge failures
    acknowledgeFailure: (failureId: string) => void;
    
    // Update recommendation status (operator can mark in_progress/completed)
    updateRecommendationStatus: (
      recommendationId: string,
      status: 'in_progress' | 'completed'
    ) => void;
  };

  // -------------------------------------------------------------------------
  // READ-ONLY SELECTORS (For all dashboards)
  // -------------------------------------------------------------------------
  selectors: {
    // Station selectors
    getStationById: (id: string) => Station | undefined;
    getStationOperationalState: (id: string) => StationOperationalState | undefined;
    getAllStations: () => Station[];
    getOnlineStations: () => StationOperationalState[];
    getDegradedStations: () => StationOperationalState[];
    getOfflineStations: () => StationOperationalState[];
    
    // Metrics
    getTotalChargers: () => number;
    getActiveChargers: () => number;
    getTotalAlerts: () => number;
    getAverageStationLoad: () => number;
    getNetworkEfficiency: () => number;
    
    // Failure selectors
    getFailuresByStation: (stationId: string) => FailureEvent[];
    getCriticalFailures: () => FailureEvent[];
    getRecentFailures: (hours?: number) => FailureEvent[];
    
    // Maintenance selectors
    getPendingMaintenanceActions: () => MaintenanceAction[];
    getMaintenanceActionsByStation: (stationId: string) => MaintenanceAction[];
    getCriticalMaintenanceActions: () => MaintenanceAction[];
    
    // Recommendation selectors
    getActiveRecommendations: () => NetworkRecommendation[];
    getRecommendationsByPriority: (priority: 'critical' | 'high' | 'medium' | 'low') => NetworkRecommendation[];
    getRecommendationsByStation: (stationId: string) => NetworkRecommendation[];
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function deriveOperationalStates(stations: Station[]): StationOperationalState[] {
  return stations.map((station) => {
    const existingStatus = mockStationStatuses.find(s => s.stationId === station.id);
    return {
      stationId: station.id,
      stationName: station.name,
      status: existingStatus?.status || 'online',
      activeChargers: station.activeChargers,
      totalChargers: station.totalChargers,
      currentQueue: station.queueLength,
      batteryInventory: station.chargedBatteryInventory,
      lastUpdate: new Date().toISOString(),
      alerts: existingStatus?.alerts || 0,
      uptime: 95 + Math.random() * 4.9, // 95-99.9%
      performanceMetrics: {
        throughput: Math.floor(station.arrivalRate * 20),
        efficiency: 70 + Math.random() * 25,
        averageWaitTime: station.queueLength * 0.8,
      },
    };
  });
}

// ============================================================================
// STORE CREATION
// ============================================================================

export const useStationStore = create<StationStoreState>()(
  devtools(
    (set, get) => {
      // Initialize stations with totalChargers
      const initialStations = mockStations.map(station => ({
        ...station,
        totalChargers: station.activeChargers + Math.floor(Math.random() * 3),
      }));

      return {
        // ---------------------------------------------------------------------
        // INITIAL STATE
        // ---------------------------------------------------------------------
        stations: initialStations,
        operationalStates: deriveOperationalStates(initialStations),
        failureEvents: mockFailureEvents,
        maintenanceActions: mockMaintenanceActions,
        networkRecommendations: [],
        simulationState: {
          status: 'idle',
          output: null,
          startTime: null,
          endTime: null,
        },

        // ---------------------------------------------------------------------
        // ADMIN ACTIONS
        // ---------------------------------------------------------------------
        adminActions: {
          updateStationConfig: (stationId, updates) =>
            set((state) => {
              const updatedStations = state.stations.map((station) =>
                station.id === stationId ? { ...station, ...updates } : station
              );
              return {
                stations: updatedStations,
                operationalStates: deriveOperationalStates(updatedStations),
              };
            }, false, 'admin/updateStationConfig'),

          addStation: (station) =>
            set((state) => {
              const updatedStations = [...state.stations, station];
              return {
                stations: updatedStations,
                operationalStates: deriveOperationalStates(updatedStations),
              };
            }, false, 'admin/addStation'),

          removeStation: (stationId) =>
            set((state) => {
              const updatedStations = state.stations.filter(s => s.id !== stationId);
              return {
                stations: updatedStations,
                operationalStates: state.operationalStates.filter(
                  s => s.stationId !== stationId
                ),
              };
            }, false, 'admin/removeStation'),

          bulkUpdateStationConfig: (updates) =>
            set((state) => {
              const updateMap = new Map(updates.map(u => [u.id, u.data]));
              const updatedStations = state.stations.map((station) => {
                const update = updateMap.get(station.id);
                return update ? { ...station, ...update } : station;
              });
              return {
                stations: updatedStations,
                operationalStates: deriveOperationalStates(updatedStations),
              };
            }, false, 'admin/bulkUpdateStationConfig'),

          updateOperationalState: (stationId, updates) =>
            set((state) => ({
              operationalStates: state.operationalStates.map((opState) =>
                opState.stationId === stationId
                  ? { ...opState, ...updates, lastUpdate: new Date().toISOString() }
                  : opState
              ),
            }), false, 'admin/updateOperationalState'),

          setSimulationState: (simulationState) =>
            set({ simulationState }, false, 'admin/setSimulationState'),

          runSimulation: (type) => {
            set(
              { simulationState: { status: 'running', output: null, startTime: new Date().toISOString(), endTime: null } },
              false,
              'admin/runSimulation/start'
            );

            setTimeout(() => {
              const output = type === 'failure_injection'
                ? {
                    ...mockSimulationOutput,
                    scenario: 'failure_injection',
                    failureDetails: {
                      type: 'charger_malfunction',
                      stationId: 'ST-003',
                      severity: 'high',
                    },
                  }
                : mockSimulationOutput;

              set(
                (state) => ({
                  simulationState: {
                    status: 'completed',
                    output,
                    startTime: state.simulationState.startTime,
                    endTime: new Date().toISOString(),
                  },
                }),
                false,
                'admin/runSimulation/complete'
              );
            }, 2000);
          },

          resetSimulation: () =>
            set(
              { simulationState: { status: 'idle', output: null, startTime: null, endTime: null } },
              false,
              'admin/resetSimulation'
            ),

          addRecommendation: (recommendation) =>
            set((state) => ({
              networkRecommendations: [...state.networkRecommendations, recommendation],
            }), false, 'admin/addRecommendation'),

          dismissRecommendation: (recommendationId) =>
            set((state) => ({
              networkRecommendations: state.networkRecommendations.map((rec) =>
                rec.id === recommendationId ? { ...rec, status: 'dismissed' } : rec
              ),
            }), false, 'admin/dismissRecommendation'),
        },

        // ---------------------------------------------------------------------
        // OPERATOR ACTIONS
        // ---------------------------------------------------------------------
        operatorActions: {
          updateMaintenanceActionStatus: (actionId, status) =>
            set((state) => ({
              maintenanceActions: state.maintenanceActions.map((action) =>
                action.id === actionId ? { ...action, status } : action
              ),
            }), false, 'operator/updateMaintenanceActionStatus'),

          addMaintenanceAction: (action) =>
            set((state) => ({
              maintenanceActions: [...state.maintenanceActions, action],
            }), false, 'operator/addMaintenanceAction'),

          acknowledgeFailure: (failureId) =>
            set((state) => ({
              failureEvents: state.failureEvents.map((failure) =>
                failure.id === failureId
                  ? { ...failure, acknowledged: true } as FailureEvent
                  : failure
              ),
            }), false, 'operator/acknowledgeFailure'),

          updateRecommendationStatus: (recommendationId, status) =>
            set((state) => ({
              networkRecommendations: state.networkRecommendations.map((rec) =>
                rec.id === recommendationId ? { ...rec, status } : rec
              ),
            }), false, 'operator/updateRecommendationStatus'),
        },

        // ---------------------------------------------------------------------
        // READ-ONLY SELECTORS
        // ---------------------------------------------------------------------
        selectors: {
          getStationById: (id) => get().stations.find((s) => s.id === id),

          getStationOperationalState: (id) =>
            get().operationalStates.find((s) => s.stationId === id),

          getAllStations: () => get().stations,

          getOnlineStations: () =>
            get().operationalStates.filter((s) => s.status === 'online'),

          getDegradedStations: () =>
            get().operationalStates.filter((s) => s.status === 'degraded'),

          getOfflineStations: () =>
            get().operationalStates.filter((s) => s.status === 'offline'),

          getTotalChargers: () =>
            get().operationalStates.reduce((sum, s) => sum + s.totalChargers, 0),

          getActiveChargers: () =>
            get().operationalStates.reduce((sum, s) => sum + s.activeChargers, 0),

          getTotalAlerts: () =>
            get().operationalStates.reduce((sum, s) => sum + s.alerts, 0),

          getAverageStationLoad: () => {
            const stations = get().stations;
            if (stations.length === 0) return 0;
            return stations.reduce((sum, s) => sum + s.stationLoad, 0) / stations.length;
          },

          getNetworkEfficiency: () => {
            const states = get().operationalStates;
            if (states.length === 0) return 0;
            const avgEfficiency = states.reduce(
              (sum, s) => sum + (s.performanceMetrics?.efficiency || 0),
              0
            ) / states.length;
            return avgEfficiency;
          },

          getFailuresByStation: (stationId) =>
            get().failureEvents.filter((f) => f.stationId === stationId),

          getCriticalFailures: () =>
            get().failureEvents.filter((f) => f.severity === 'critical'),

          getRecentFailures: (hours = 24) => {
            const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
            return get().failureEvents.filter(
              (f) => new Date(f.timestamp) > cutoff
            );
          },

          getPendingMaintenanceActions: () =>
            get().maintenanceActions.filter((a) => a.status === 'pending'),

          getMaintenanceActionsByStation: (stationId) =>
            get().maintenanceActions.filter((a) => a.stationId === stationId),

          getCriticalMaintenanceActions: () =>
            get().maintenanceActions.filter((a) => a.priority === 'critical'),

          getActiveRecommendations: () =>
            get().networkRecommendations.filter(
              (r) => r.status !== 'dismissed' && r.status !== 'completed'
            ),

          getRecommendationsByPriority: (priority) =>
            get().networkRecommendations.filter((r) => r.priority === priority),

          getRecommendationsByStation: (stationId) =>
            get().networkRecommendations.filter((r) =>
              r.affectedStations.includes(stationId)
            ),
        },
      };
    },
    { name: 'StationStore' }
  )
);

// ============================================================================
// READ-ONLY HOOKS (Safe for all dashboards)
// ============================================================================

/**
 * Get all stations (read-only)
 * Safe for all dashboards - no mutation capabilities
 */
export const useStations = () => {
  return useStationStore((state) => state.stations);
};

/**
 * Get a single station by ID (read-only)
 * Safe for all dashboards - no mutation capabilities
 * 
 * @param stationId - The ID of the station to retrieve
 */
export const useStationById = (stationId: string) => {
  return useStationStore((state) => 
    state.stations.find(s => s.id === stationId)
  );
};

/**
 * Get all operational states (read-only)
 * Safe for all dashboards - no mutation capabilities
 */
export const useOperationalStates = () => {
  return useStationStore((state) => state.operationalStates);
};

/**
 * Get operational state for a specific station (read-only)
 * Safe for all dashboards - no mutation capabilities
 * 
 * @param stationId - The ID of the station
 */
export const useOperationalStateById = (stationId: string) => {
  return useStationStore((state) => 
    state.operationalStates.find(s => s.stationId === stationId)
  );
};

// ============================================================================
// ROLE-BASED HOOKS
// ============================================================================

/**
 * Admin hook - Full access with mutation capabilities
 * ONLY use in Admin dashboard components
 */
export const useAdminStationStore = () => {
  const adminActions = useStationStore((state) => state.adminActions);
  const selectors = useStationStore((state) => state.selectors);
  const simulationState = useStationStore((state) => state.simulationState);
  
  return { adminActions, selectors, simulationState };
};

/**
 * Operator hook - Limited mutations (maintenance actions only)
 * Use in Operator dashboard components
 * Cannot mutate station configuration or operational state
 */
export const useOperatorStationStore = () => {
  const operatorActions = useStationStore((state) => state.operatorActions);
  const selectors = useStationStore((state) => state.selectors);
  const maintenanceActions = useStationStore((state) => state.maintenanceActions);
  const failureEvents = useStationStore((state) => state.failureEvents);
  
  return { operatorActions, selectors, maintenanceActions, failureEvents };
};

/**
 * User hook - Read-only access
 * Use in User dashboard components
 * No mutation capabilities whatsoever
 */
export const useUserStationStore = () => {
  const selectors = useStationStore((state) => state.selectors);
  const operationalStates = useStationStore((state) => state.operationalStates);
  const networkRecommendations = useStationStore((state) => state.networkRecommendations);
  
  return { selectors, operationalStates, networkRecommendations };
};
