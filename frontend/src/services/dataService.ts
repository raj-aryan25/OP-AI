import type { Station, SimulationState } from '../types/admin';
import type { FailureEvent, MaintenanceAction, StationStatus } from '../types/operator';
import type { Location, SwapStation, SwapRecommendation, RouteRequest } from '../types/user';
import { mockStations, mockSimulationOutput } from '../mock/adminData';
import { mockFailureEvents, mockMaintenanceActions, mockStationStatuses } from '../mock/operatorData';
import { mockLocations, mockSwapStations, mockSwapRecommendation } from '../mock/userData';

// ========================================
// In-Memory Data Store
// ========================================

let stations: Station[] = [...mockStations];
let simulationState: SimulationState = {
  status: 'idle',
  output: null,
  startTime: null,
  endTime: null
};

let failureEvents: FailureEvent[] = [...mockFailureEvents];
let maintenanceActions: MaintenanceAction[] = [...mockMaintenanceActions];
let stationStatuses: StationStatus[] = [...mockStationStatuses];

let locations: Location[] = [...mockLocations];
let swapStations: SwapStation[] = [...mockSwapStations];
let recommendations: SwapRecommendation = { ...mockSwapRecommendation };

// ========================================
// Admin Data Service
// ========================================

export const getStations = (): Station[] => {
  return [...stations];
};

export const getStationById = (id: string): Station | undefined => {
  return stations.find(station => station.id === id);
};

export const updateStation = (id: string, updates: Partial<Station>): Station | null => {
  const index = stations.findIndex(station => station.id === id);
  if (index === -1) return null;
  
  stations[index] = { ...stations[index], ...updates };
  return stations[index];
};

export const getSimulationState = (): SimulationState => {
  return { ...simulationState };
};

export const updateSimulationState = (updates: Partial<SimulationState>): SimulationState => {
  simulationState = { ...simulationState, ...updates };
  return { ...simulationState };
};

export const runCounterfactualSimulation = async (): Promise<SimulationState> => {
  simulationState = {
    status: 'running',
    output: null,
    startTime: new Date().toISOString(),
    endTime: null
  };

  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 2000));

  simulationState = {
    status: 'completed',
    output: mockSimulationOutput,
    startTime: simulationState.startTime,
    endTime: new Date().toISOString()
  };

  return { ...simulationState };
};

export const resetNetworkState = (): void => {
  stations = [...mockStations];
  simulationState = {
    status: 'idle',
    output: null,
    startTime: null,
    endTime: null
  };
};

// ========================================
// Operator Data Service
// ========================================

export const getFailures = (): FailureEvent[] => {
  return [...failureEvents];
};

export const getFailureById = (id: string): FailureEvent | undefined => {
  return failureEvents.find(failure => failure.id === id);
};

export const getFailuresBySeverity = (severity: string): FailureEvent[] => {
  if (severity === 'all') return [...failureEvents];
  return failureEvents.filter(failure => failure.severity === severity);
};

export const getFailuresByStation = (stationId: string): FailureEvent[] => {
  return failureEvents.filter(failure => failure.stationId === stationId);
};

export const addFailure = (failure: FailureEvent): FailureEvent => {
  failureEvents.push(failure);
  return failure;
};

export const getMaintenanceActions = (): MaintenanceAction[] => {
  return [...maintenanceActions];
};

export const getMaintenanceActionById = (id: string): MaintenanceAction | undefined => {
  return maintenanceActions.find(action => action.id === id);
};

export const getMaintenanceActionsByStatus = (status: string): MaintenanceAction[] => {
  if (status === 'all') return [...maintenanceActions];
  return maintenanceActions.filter(action => action.status === status);
};

export const getMaintenanceActionsByStation = (stationId: string): MaintenanceAction[] => {
  return maintenanceActions.filter(action => action.stationId === stationId);
};

export const updateMaintenanceAction = (id: string, updates: Partial<MaintenanceAction>): MaintenanceAction | null => {
  const index = maintenanceActions.findIndex(action => action.id === id);
  if (index === -1) return null;
  
  maintenanceActions[index] = { ...maintenanceActions[index], ...updates };
  return maintenanceActions[index];
};

export const getStationStatuses = (): StationStatus[] => {
  return [...stationStatuses];
};

export const getStationStatusById = (stationId: string): StationStatus | undefined => {
  return stationStatuses.find(status => status.stationId === stationId);
};

export const updateStationStatus = (stationId: string, updates: Partial<StationStatus>): StationStatus | null => {
  const index = stationStatuses.findIndex(status => status.stationId === stationId);
  if (index === -1) return null;
  
  stationStatuses[index] = { ...stationStatuses[index], ...updates };
  return stationStatuses[index];
};

// ========================================
// User Data Service
// ========================================

export const getLocations = (): Location[] => {
  return [...locations];
};

export const getLocationById = (id: string): Location | undefined => {
  return locations.find(location => location.id === id);
};

export const getSwapStations = (): SwapStation[] => {
  return [...swapStations];
};

export const getSwapStationById = (id: string): SwapStation | undefined => {
  return swapStations.find(station => station.id === id);
};

export const getRecommendations = (_routeRequest?: RouteRequest): SwapRecommendation => {
  // In a real app, this would calculate recommendations based on the route
  // For now, return mock data with optional filtering
  return { ...recommendations };
};

export const getRecommendationsByComfortScore = (minScore: number = 0): SwapStation[] => {
  return swapStations.filter(station => station.comfortScore >= minScore);
};

export const getRecommendationsByDistance = (maxDistance: number): SwapStation[] => {
  return swapStations.filter(station => station.distanceFromRoute <= maxDistance);
};

export const getRecommendationsByWaitTime = (maxWaitTime: number): SwapStation[] => {
  return swapStations.filter(station => station.estimatedWaitTime <= maxWaitTime);
};

export const getSortedRecommendations = (
  sortBy: 'comfort' | 'distance' | 'waitTime' | 'price' = 'comfort'
): SwapStation[] => {
  const sorted = [...swapStations];
  
  switch (sortBy) {
    case 'distance':
      return sorted.sort((a, b) => a.distanceFromRoute - b.distanceFromRoute);
    case 'waitTime':
      return sorted.sort((a, b) => a.estimatedWaitTime - b.estimatedWaitTime);
    case 'price':
      return sorted.sort((a, b) => a.pricePerSwap - b.pricePerSwap);
    case 'comfort':
    default:
      return sorted.sort((a, b) => b.comfortScore - a.comfortScore);
  }
};

// ========================================
// Analytics & Aggregation Functions
// ========================================

export const getStationMetrics = () => {
  const totalStations = stations.length;
  const totalChargers = stations.reduce((sum, s) => sum + s.activeChargers, 0);
  const totalQueue = stations.reduce((sum, s) => sum + s.queueLength, 0);
  const totalBatteries = stations.reduce((sum, s) => sum + s.chargedBatteryInventory, 0);
  const avgLoad = stations.reduce((sum, s) => sum + s.stationLoad, 0) / totalStations;
  const avgTemp = stations.reduce((sum, s) => sum + s.temperature, 0) / totalStations;

  return {
    totalStations,
    totalChargers,
    totalQueue,
    totalBatteries,
    averageLoad: Math.round(avgLoad),
    averageTemperature: Math.round(avgTemp * 10) / 10
  };
};

export const getFailureMetrics = () => {
  const totalFailures = failureEvents.length;
  const critical = failureEvents.filter(f => f.severity === 'critical').length;
  const high = failureEvents.filter(f => f.severity === 'high').length;
  const medium = failureEvents.filter(f => f.severity === 'medium').length;
  const low = failureEvents.filter(f => f.severity === 'low').length;

  return {
    totalFailures,
    bySeverity: { critical, high, medium, low }
  };
};

export const getMaintenanceMetrics = () => {
  const totalActions = maintenanceActions.length;
  const pending = maintenanceActions.filter(a => a.status === 'pending').length;
  const acknowledged = maintenanceActions.filter(a => a.status === 'acknowledged').length;
  const escalated = maintenanceActions.filter(a => a.status === 'escalated').length;
  const completed = maintenanceActions.filter(a => a.status === 'completed').length;
  const dismissed = maintenanceActions.filter(a => a.status === 'dismissed').length;

  return {
    totalActions,
    byStatus: { pending, acknowledged, escalated, completed, dismissed }
  };
};

export const getOperationalMetrics = () => {
  const onlineStations = stationStatuses.filter(s => s.status === 'online').length;
  const degradedStations = stationStatuses.filter(s => s.status === 'degraded').length;
  const offlineStations = stationStatuses.filter(s => s.status === 'offline').length;
  const totalAlerts = stationStatuses.reduce((sum, s) => sum + s.alerts, 0);
  const totalActiveChargers = stationStatuses.reduce((sum, s) => sum + s.activeChargers, 0);

  return {
    totalStations: stationStatuses.length,
    onlineStations,
    degradedStations,
    offlineStations,
    totalAlerts,
    totalActiveChargers
  };
};

// ========================================
// Data Reset Functions
// ========================================

export const resetAllData = (): void => {
  stations = [...mockStations];
  simulationState = {
    status: 'idle',
    output: null,
    startTime: null,
    endTime: null
  };
  failureEvents = [...mockFailureEvents];
  maintenanceActions = [...mockMaintenanceActions];
  stationStatuses = [...mockStationStatuses];
  locations = [...mockLocations];
  swapStations = [...mockSwapStations];
  recommendations = { ...mockSwapRecommendation };
};

export const resetAdminData = (): void => {
  stations = [...mockStations];
  simulationState = {
    status: 'idle',
    output: null,
    startTime: null,
    endTime: null
  };
};

export const resetOperatorData = (): void => {
  failureEvents = [...mockFailureEvents];
  maintenanceActions = [...mockMaintenanceActions];
  stationStatuses = [...mockStationStatuses];
};

export const resetUserData = (): void => {
  locations = [...mockLocations];
  swapStations = [...mockSwapStations];
  recommendations = { ...mockSwapRecommendation };
};
