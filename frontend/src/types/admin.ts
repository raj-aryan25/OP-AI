// Station Configuration Types
export interface Station {
  id: string;
  name: string;
  queueLength: number;
  arrivalRate: number;
  activeChargers: number;
  chargedBatteryInventory: number;
  temperature: number;
  stationLoad: number;
}

// Simulation Types
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
