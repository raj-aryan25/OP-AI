// Unified Station Data Types
// This file consolidates all station-related types across dashboards

// Base Station Configuration (used by Admin and Operator dashboards)
export interface Station {
  id: string;
  name: string;
  queueLength: number;
  arrivalRate: number;
  activeChargers: number;
  totalChargers: number;
  chargedBatteryInventory: number;
  temperature: number;
  stationLoad: number;
}

// Station Operational State (used across all dashboards)
export type StationStatusType = 'online' | 'offline' | 'degraded';

export interface StationOperationalState {
  stationId: string;
  stationName: string;
  status: StationStatusType;
  activeChargers: number;
  totalChargers: number;
  currentQueue: number;
  batteryInventory: number;
  lastUpdate: string;
  alerts: number;
  uptime?: number; // percentage
  performanceMetrics?: {
    throughput: number;
    efficiency: number;
    averageWaitTime: number;
  };
}

// Legacy alias for backward compatibility
export interface StationStatus extends StationOperationalState {}

// Failure Events (used by Operator dashboard)
export type FailureSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FailureCategory = 'charger_malfunction' | 'battery_issue' | 'network_error' | 'temperature_alert' | 'queue_overflow';

export interface FailureEvent {
  id: string;
  timestamp: string;
  stationId: string;
  stationName: string;
  category: FailureCategory;
  severity: FailureSeverity;
  errorCodeSequence: string[];
  predictedRootCause: string;
  recurrenceProbability: number;
  description: string;
  affectedComponents: string[];
  estimatedDowntime: number;
}

// Maintenance Actions (used by Operator dashboard)
export type ActionStatus = 'pending' | 'acknowledged' | 'dismissed' | 'escalated' | 'completed';
export type ActionPriority = 'low' | 'medium' | 'high' | 'critical';

export interface MaintenanceAction {
  id: string;
  title: string;
  description: string;
  stationId: string;
  stationName: string;
  priority: ActionPriority;
  status: ActionStatus;
  category: string;
  estimatedDuration: number;
  createdAt: string;
  dueDate: string;
  relatedFailureId?: string;
}

// Simulation Types (used by Admin dashboard)
export type SimulationStatus = 'idle' | 'running' | 'completed';

export interface SimulationState {
  status: SimulationStatus;
  output: Record<string, unknown> | null;
  startTime: string | null;
  endTime: string | null;
}

export interface FailureScenario {
  type: string;
  stationId: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

// Network Recommendations (used across Admin and Operator dashboards)
export type RecommendationType = 
  | 'capacity_expansion' 
  | 'load_balancing' 
  | 'maintenance_required' 
  | 'inventory_redistribution'
  | 'operational_optimization';

export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface NetworkRecommendation {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  description: string;
  affectedStations: string[];
  estimatedImpact: {
    efficiency?: number; // percentage improvement
    throughput?: number; // customers per hour
    costSavings?: number; // monetary value
    waitTimeReduction?: number; // minutes
  };
  suggestedActions: string[];
  implementationComplexity: 'low' | 'medium' | 'high';
  estimatedCompletionTime: number; // hours
  createdAt: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'dismissed';
}
