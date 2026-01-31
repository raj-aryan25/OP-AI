// Operator Types

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

export interface StationStatus {
  stationId: string;
  stationName: string;
  status: 'online' | 'offline' | 'degraded';
  activeChargers: number;
  totalChargers: number;
  currentQueue: number;
  batteryInventory: number;
  lastUpdate: string;
  alerts: number;
}
