/**
 * Station Store Test Examples
 * 
 * These examples demonstrate the store's functionality.
 * Run these in a component or console to test the store.
 */

import { useStationStore, useAdminStationStore, useOperatorStationStore } from '../store';

// ============================================================================
// EXAMPLE 1: Admin Updates Station Configuration
// ============================================================================

export function testAdminUpdateStation() {
  const { adminActions, selectors } = useAdminStationStore();
  
  console.log('Before update:', selectors.getStationById('ST-001'));
  
  // Update station load and chargers
  adminActions.updateStationConfig('ST-001', {
    activeChargers: 10,
    stationLoad: 92.5,
    temperature: 24.8
  });
  
  console.log('After update:', selectors.getStationById('ST-001'));
}

// ============================================================================
// EXAMPLE 2: Bulk Update Multiple Stations
// ============================================================================

export function testBulkUpdate() {
  const { adminActions, selectors } = useAdminStationStore();
  
  const updates = [
    { id: 'ST-001', data: { stationLoad: 75.0 } },
    { id: 'ST-002', data: { stationLoad: 68.5 } },
    { id: 'ST-003', data: { stationLoad: 89.2 } }
  ];
  
  console.log('Before bulk update:', selectors.getAllStations());
  adminActions.bulkUpdateStationConfig(updates);
  console.log('After bulk update:', selectors.getAllStations());
}

// ============================================================================
// EXAMPLE 3: Operator Updates Maintenance Action
// ============================================================================

export function testOperatorMaintenance() {
  const { operatorActions, selectors } = useOperatorStationStore();
  
  const pendingBefore = selectors.getPendingMaintenanceActions();
  console.log('Pending actions before:', pendingBefore.length);
  
  // Acknowledge first pending action
  if (pendingBefore.length > 0) {
    operatorActions.updateMaintenanceActionStatus(
      pendingBefore[0].id,
      'acknowledged'
    );
  }
  
  const pendingAfter = selectors.getPendingMaintenanceActions();
  console.log('Pending actions after:', pendingAfter.length);
}

// ============================================================================
// EXAMPLE 4: Get Network Metrics
// ============================================================================

export function testNetworkMetrics() {
  const store = useStationStore.getState();
  const { selectors } = store;
  
  console.log('Network Metrics:', {
    totalChargers: selectors.getTotalChargers(),
    activeChargers: selectors.getActiveChargers(),
    totalAlerts: selectors.getTotalAlerts(),
    averageLoad: selectors.getAverageStationLoad().toFixed(2) + '%',
    networkEfficiency: selectors.getNetworkEfficiency().toFixed(2) + '%',
    onlineStations: selectors.getOnlineStations().length,
    degradedStations: selectors.getDegradedStations().length,
    offlineStations: selectors.getOfflineStations().length
  });
}

// ============================================================================
// EXAMPLE 5: Filter Failures by Station
// ============================================================================

export function testFailureFiltering() {
  const { selectors } = useOperatorStationStore();
  
  const stationId = 'ST-003';
  const stationFailures = selectors.getFailuresByStation(stationId);
  const criticalFailures = selectors.getCriticalFailures();
  const recentFailures = selectors.getRecentFailures(24);
  
  console.log('Failures for ST-003:', stationFailures.length);
  console.log('Critical failures:', criticalFailures.length);
  console.log('Recent failures (24h):', recentFailures.length);
}

// ============================================================================
// EXAMPLE 6: Run Simulation (Admin Only)
// ============================================================================

export function testSimulation() {
  const { adminActions, simulationState } = useAdminStationStore();
  
  console.log('Initial state:', simulationState);
  
  // Run counterfactual simulation
  adminActions.runSimulation('counterfactual');
  
  console.log('Running...', useStationStore.getState().simulationState);
  
  // After 2 seconds, it will be completed
  setTimeout(() => {
    console.log('Completed:', useStationStore.getState().simulationState);
  }, 2500);
}

// ============================================================================
// EXAMPLE 7: Direct Store Access (Outside React Components)
// ============================================================================

export function testDirectStoreAccess() {
  // Get current state
  const state = useStationStore.getState();
  
  // Access data directly
  console.log('All stations:', state.stations);
  console.log('Operational states:', state.operationalStates);
  
  // Call admin actions directly
  state.adminActions.updateStationConfig('ST-001', { temperature: 25.5 });
  
  // Use selectors directly
  const onlineCount = state.selectors.getOnlineStations().length;
  console.log('Online stations:', onlineCount);
}

// ============================================================================
// EXAMPLE 8: Subscribe to Store Changes
// ============================================================================

export function testSubscription() {
  // Subscribe to store changes
  const unsubscribe = useStationStore.subscribe(
    (state) => {
      console.log('Store state changed. Total stations:', state.stations.length);
    }
  );
  
  // Trigger an update
  const { adminActions } = useStationStore.getState();
  adminActions.updateStationConfig('ST-001', { stationLoad: 88.0 });
  
  // Clean up subscription when done
  return unsubscribe;
}

// ============================================================================
// EXAMPLE 9: Read-Only Access (User Dashboard)
// ============================================================================

export function testUserReadOnlyAccess() {
  // Users can only access selectors and operational states
  const store = useStationStore.getState();
  
  // This works - read-only
  const onlineStations = store.selectors.getOnlineStations();
  console.log('Available stations for users:', onlineStations);
  
  // Users should NOT have access to adminActions or operatorActions
  // Only through useUserStationStore which doesn't expose them
}

// ============================================================================
// EXAMPLE 10: Add Network Recommendation (Admin)
// ============================================================================

export function testAddRecommendation() {
  const { adminActions, selectors } = useAdminStationStore();
  
  const recommendation = {
    id: 'REC-001',
    type: 'capacity_expansion' as const,
    priority: 'high' as const,
    title: 'Add chargers at Downtown Hub',
    description: 'Install 2 additional fast chargers to handle peak demand',
    affectedStations: ['ST-001'],
    estimatedImpact: {
      efficiency: 15,
      throughput: 50,
      waitTimeReduction: 3.5
    },
    suggestedActions: [
      'Install chargers in bay 9-10',
      'Upgrade power capacity',
      'Update load balancing'
    ],
    implementationComplexity: 'medium' as const,
    estimatedCompletionTime: 48,
    createdAt: new Date().toISOString(),
    status: 'pending' as const
  };
  
  adminActions.addRecommendation(recommendation);
  
  const activeRecs = selectors.getActiveRecommendations();
  console.log('Active recommendations:', activeRecs);
}
