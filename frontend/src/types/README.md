# Shared Domain Types

This directory contains TypeScript interfaces for shared domain data used across Admin, Operator, and User dashboards.

## Core Interfaces

### Station
Base station configuration containing operational parameters.

```typescript
import type { Station } from './station';

const station: Station = {
  id: 'ST-001',
  name: 'Downtown Hub',
  queueLength: 5,
  arrivalRate: 12.5,
  activeChargers: 8,
  totalChargers: 10,
  chargedBatteryInventory: 24,
  temperature: 22.5,
  stationLoad: 67.3
};
```

### StationOperationalState
Real-time operational state of a station including health metrics.

```typescript
import type { StationOperationalState } from './station';

const state: StationOperationalState = {
  stationId: 'ST-001',
  stationName: 'Downtown Hub',
  status: 'online',
  activeChargers: 8,
  totalChargers: 10,
  currentQueue: 5,
  batteryInventory: 24,
  lastUpdate: '2026-02-01T14:30:00Z',
  alerts: 1,
  uptime: 99.8,
  performanceMetrics: {
    throughput: 245,
    efficiency: 82.1,
    averageWaitTime: 4.3
  }
};
```

### FailureEvent
System failure events with diagnostics and predictions.

```typescript
import type { FailureEvent } from './station';

const failure: FailureEvent = {
  id: 'FE-001',
  timestamp: '2026-01-31T14:23:45Z',
  stationId: 'ST-003',
  stationName: 'Central Station',
  category: 'charger_malfunction',
  severity: 'critical',
  errorCodeSequence: ['E4011', 'E4023', 'E4011'],
  predictedRootCause: 'Power distribution unit failure',
  recurrenceProbability: 0.87,
  description: 'Multiple chargers offline',
  affectedComponents: ['Charger-04', 'Charger-05'],
  estimatedDowntime: 240
};
```

### NetworkRecommendation
AI-generated recommendations for network optimization.

```typescript
import type { NetworkRecommendation } from './station';

const recommendation: NetworkRecommendation = {
  id: 'REC-001',
  type: 'capacity_expansion',
  priority: 'high',
  title: 'Increase chargers at Central Station',
  description: 'Add 2 additional chargers during peak hours',
  affectedStations: ['ST-003'],
  estimatedImpact: {
    efficiency: 15,
    throughput: 50,
    waitTimeReduction: 3.5
  },
  suggestedActions: [
    'Install 2 fast chargers in bay 7-8',
    'Upgrade power distribution capacity',
    'Update scheduling algorithm'
  ],
  implementationComplexity: 'medium',
  estimatedCompletionTime: 48,
  createdAt: '2026-02-01T10:00:00Z',
  status: 'pending'
};
```

## Usage Across Dashboards

- **Admin Dashboard**: Can read and mutate all data types
- **Operator Dashboard**: Can read all types, update maintenance actions
- **User Dashboard**: Read-only access to station states and recommendations

## Import Examples

```typescript
// Import individual types
import type { Station, StationOperationalState, FailureEvent, NetworkRecommendation } from '@/types';

// Import supporting types
import type { FailureSeverity, RecommendationType, StationStatusType } from '@/types';
```
