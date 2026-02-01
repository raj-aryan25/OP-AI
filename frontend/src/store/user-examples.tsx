/**
 * USER DASHBOARD - READ-ONLY EXAMPLE
 * 
 * This example shows how user components can only read station data
 * with absolutely no mutation capabilities.
 */

import { useStations, useStationById, useOperationalStates, useUserStationStore } from './stationStore';

// ============================================================================
// EXAMPLE 1: Display available stations for users
// ============================================================================

export function AvailableStationsExample() {
  // ✅ Read-only: Users can see all stations
  const stations = useStations();
  const operationalStates = useOperationalStates();
  
  // Filter to show only online stations
  const onlineStations = operationalStates.filter(s => s.status === 'online');
  
  return (
    <div>
      <h2>Available Swap Stations</h2>
      <p>{onlineStations.length} stations online</p>
      
      {onlineStations.map(state => {
        const station = stations.find(s => s.id === state.stationId);
        if (!station) return null;
        
        return (
          <div key={state.stationId}>
            <h3>{state.stationName}</h3>
            <p>Queue: {state.currentQueue} customers</p>
            <p>Available Batteries: {state.batteryInventory}</p>
            <p>Est. Wait: {state.performanceMetrics?.averageWaitTime.toFixed(1)} min</p>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Station finder with details
// ============================================================================

export function StationFinderExample({ stationId }: { stationId: string }) {
  // ✅ Read-only: Get specific station details
  const station = useStationById(stationId);
  const { selectors } = useUserStationStore();
  const opState = selectors.getStationOperationalState(stationId);
  
  if (!station || !opState) {
    return <div>Station not available</div>;
  }
  
  // Check if station is suitable for user
  const isAvailable = opState.status === 'online' && opState.batteryInventory > 0;
  const estimatedWait = opState.performanceMetrics?.averageWaitTime || 0;
  
  return (
    <div className={isAvailable ? 'available' : 'unavailable'}>
      <h2>{station.name}</h2>
      
      <div className="station-info">
        <p><strong>Status:</strong> {opState.status}</p>
        <p><strong>Queue:</strong> {opState.currentQueue} people</p>
        <p><strong>Available Batteries:</strong> {opState.batteryInventory}</p>
        <p><strong>Est. Wait Time:</strong> {estimatedWait.toFixed(0)} minutes</p>
        <p><strong>Station Load:</strong> {station.stationLoad.toFixed(1)}%</p>
      </div>
      
      {isAvailable ? (
        <button>Navigate to Station</button>
      ) : (
        <p className="warning">Station currently unavailable</p>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Network overview for users
// ============================================================================

export function NetworkOverviewExample() {
  const { selectors } = useUserStationStore();
  
  // ✅ Read-only: Use selectors to get aggregated data
  const totalChargers = selectors.getTotalChargers();
  const activeChargers = selectors.getActiveChargers();
  const networkEfficiency = selectors.getNetworkEfficiency();
  const onlineStations = selectors.getOnlineStations();
  
  return (
    <div>
      <h2>Network Status</h2>
      
      <div className="metrics">
        <div className="metric">
          <h3>Network Efficiency</h3>
          <p className="value">{networkEfficiency.toFixed(1)}%</p>
        </div>
        
        <div className="metric">
          <h3>Active Chargers</h3>
          <p className="value">{activeChargers} / {totalChargers}</p>
        </div>
        
        <div className="metric">
          <h3>Stations Online</h3>
          <p className="value">{onlineStations.length}</p>
        </div>
      </div>
      
      <h3>Station Details</h3>
      {onlineStations.map(station => (
        <div key={station.stationId} className="station-card">
          <h4>{station.stationName}</h4>
          <p>Queue: {station.currentQueue}</p>
          <p>Batteries: {station.batteryInventory}</p>
          {station.performanceMetrics && (
            <p>Efficiency: {station.performanceMetrics.efficiency.toFixed(1)}%</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Recommendations for users
// ============================================================================

export function StationRecommendationsExample() {
  const { selectors, networkRecommendations } = useUserStationStore();
  
  // Filter recommendations relevant to users (e.g., service improvements)
  const userRelevantRecs = networkRecommendations.filter(
    rec => rec.type === 'capacity_expansion' || rec.type === 'operational_optimization'
  );
  
  return (
    <div>
      <h2>Service Improvements Coming Soon</h2>
      
      {userRelevantRecs.map(rec => (
        <div key={rec.id} className="recommendation">
          <h3>{rec.title}</h3>
          <p>{rec.description}</p>
          
          {rec.estimatedImpact.waitTimeReduction && (
            <p className="benefit">
              Expected wait time reduction: {rec.estimatedImpact.waitTimeReduction} minutes
            </p>
          )}
          
          {rec.affectedStations.map(stationId => {
            const station = selectors.getStationById(stationId);
            return station ? (
              <span key={stationId} className="station-tag">
                {station.name}
              </span>
            ) : null;
          })}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Best station recommendation for user
// ============================================================================

export function BestStationRecommendation() {
  const stations = useStations();
  const { selectors } = useUserStationStore();
  const onlineStations = selectors.getOnlineStations();
  
  // Find best station based on availability and queue
  const bestStation = onlineStations
    .filter(s => s.batteryInventory > 0)
    .sort((a, b) => {
      // Prioritize by queue length and wait time
      const scoreA = a.currentQueue + (a.performanceMetrics?.averageWaitTime || 0);
      const scoreB = b.currentQueue + (b.performanceMetrics?.averageWaitTime || 0);
      return scoreA - scoreB;
    })[0];
  
  if (!bestStation) {
    return <div>No stations available at this time</div>;
  }
  
  const stationConfig = stations.find(s => s.id === bestStation.stationId);
  
  return (
    <div className="recommendation-card">
      <h2>Recommended Station</h2>
      <h3>{bestStation.stationName}</h3>
      
      <div className="details">
        <p><strong>Current Queue:</strong> {bestStation.currentQueue} customers</p>
        <p><strong>Est. Wait:</strong> {bestStation.performanceMetrics?.averageWaitTime.toFixed(0)} min</p>
        <p><strong>Batteries Available:</strong> {bestStation.batteryInventory}</p>
        {stationConfig && (
          <p><strong>Station Load:</strong> {stationConfig.stationLoad.toFixed(1)}%</p>
        )}
      </div>
      
      <button className="navigate-btn">Navigate Now</button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: User CANNOT mutate anything
// ============================================================================

export function UserDashboardExample() {
  useStations(); // ✅ Read-only
  const { selectors } = useUserStationStore(); // ✅ Read-only selectors
  
  // ❌ Users have NO ACCESS to these - TypeScript will error:
  // const { adminActions } = useAdminStationStore(); // Not for users!
  // const { operatorActions } = useOperatorStationStore(); // Not for users!
  
  // ❌ Even if you tried to access the base store:
  // import { useStationStore } from '@/store';
  // const state = useStationStore.getState();
  // state.adminActions.updateStationConfig(...); // Bypasses safety - DON'T DO THIS!
  
  // ✅ Users can only:
  // - Read station data
  // - Use selectors for computed values
  // - View recommendations (read-only)
  
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Available Stations: {selectors.getOnlineStations().length}</p>
      <p>Network Efficiency: {selectors.getNetworkEfficiency().toFixed(1)}%</p>
    </div>
  );
}

// ============================================================================
// Type Safety Demo
// ============================================================================

export function TypeSafetyDemo() {
  const { selectors } = useUserStationStore();
  
  // ✅ This compiles - users can call selectors
  selectors.getAllStations();
  
  // ❌ This would NOT compile - TypeScript error!
  // selectors.updateStationConfig('ST-001', { ... });
  
  // ❌ This would NOT compile - adminActions not in useUserStationStore
  // const { adminActions } = useUserStationStore();
  
  return <div>Type safety enforced by TypeScript</div>;
}
