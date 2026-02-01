/**
 * ADMIN DASHBOARD - FULL ACCESS EXAMPLE
 * 
 * This example shows how admin components can use the full mutation API
 * including updateStationConfig() and updateOperationalState()
 */

import { useStations, useStationById, useAdminStationStore } from './stationStore';
import type { Station } from '../types/station';
import React from 'react';
// EXAMPLE 1: Update station configuration
// ============================================================================

export function StationConfigEditor({ stationId }: { stationId: string }) {
  const station = useStationById(stationId);
  const { adminActions } = useAdminStationStore();
  
  const handleUpdateConfig = () => {
    // ✅ Admin can update station configuration
    adminActions.updateStationConfig(stationId, {
      activeChargers: 12,
      stationLoad: 85.5,
      temperature: 24.2,
      chargedBatteryInventory: 30
    });
  };
  
  const handleUpdateSingleField = (field: keyof Station, value: number) => {
    // ✅ Update individual fields
    adminActions.updateStationConfig(stationId, {
      [field]: value
    });
  };
  
  if (!station) return null;
  
  return (
    <div>
      <h2>Edit {station.name}</h2>
      <button onClick={handleUpdateConfig}>
        Update Configuration
      </button>
      <button onClick={() => handleUpdateSingleField('stationLoad', 92.0)}>
        Set Load to 92%
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Update operational state (admin override)
// ============================================================================

export function OperationalStateOverride({ stationId }: { stationId: string }) {
  const { adminActions, selectors } = useAdminStationStore();
  const opState = selectors.getStationOperationalState(stationId);
  
  const handleOverrideStatus = () => {
    // ✅ Admin can override operational state
    adminActions.updateOperationalState(stationId, {
      status: 'degraded',
      alerts: 5,
      uptime: 98.5
    });
  };
  
  const handleMarkOffline = () => {
    // ✅ Admin can manually set station offline
    adminActions.updateOperationalState(stationId, {
      status: 'offline',
      activeChargers: 0,
      alerts: 10
    });
  };
  
  return (
    <div>
      <h3>Operational State Controls</h3>
      <p>Current Status: {opState?.status}</p>
      <button onClick={handleOverrideStatus}>Mark as Degraded</button>
      <button onClick={handleMarkOffline}>Take Offline</button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Bulk update multiple stations
// ============================================================================

export function BulkStationUpdate() {
  const stations = useStations();
  const { adminActions } = useAdminStationStore();
  
  const handleBulkTemperatureUpdate = () => {
    // ✅ Admin can bulk update station configurations
    const updates = stations.map(station => ({
      id: station.id,
      data: { temperature: 22.0 } // Normalize all temperatures
    }));
    
    adminActions.bulkUpdateStationConfig(updates);
  };
  
  const handleReduceLoadAcrossNetwork = () => {
    // ✅ Reduce load on all high-load stations
    const updates = stations
      .filter(s => s.stationLoad > 80)
      .map(s => ({
        id: s.id,
        data: { stationLoad: s.stationLoad * 0.9 } // Reduce by 10%
      }));
    
    adminActions.bulkUpdateStationConfig(updates);
  };
  
  return (
    <div>
      <h2>Bulk Operations</h2>
      <button onClick={handleBulkTemperatureUpdate}>
        Normalize All Temperatures
      </button>
      <button onClick={handleReduceLoadAcrossNetwork}>
        Reduce High Loads
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Add and remove stations
// ============================================================================

export function StationManagement() {
  const { adminActions, selectors } = useAdminStationStore();
  const stations = selectors.getAllStations();
  
  const handleAddStation = () => {
    const newStation: Station = {
      id: `ST-${String(stations.length + 1).padStart(3, '0')}`,
      name: 'New Station',
      queueLength: 0,
      arrivalRate: 5.0,
      activeChargers: 6,
      totalChargers: 8,
      chargedBatteryInventory: 20,
      temperature: 22.0,
      stationLoad: 0
    };
    
    adminActions.addStation(newStation);
  };
  
  const handleRemoveStation = (stationId: string) => {
    if (confirm('Are you sure you want to remove this station?')) {
      adminActions.removeStation(stationId);
    }
  };
  
  return (
    <div>
      <h2>Station Management</h2>
      <button onClick={handleAddStation}>Add New Station</button>
      
      <ul>
        {stations.map(station => (
          <li key={station.id}>
            {station.name}
            <button onClick={() => handleRemoveStation(station.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Complete station configuration page
// ============================================================================

export function StationConfigPage() {
  const stations = useStations();
  const { adminActions } = useAdminStationStore();
  
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValues, setEditValues] = React.useState<Partial<Station>>({});
  
  const handleEdit = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (station) {
      setEditingId(stationId);
      setEditValues({ ...station });
    }
  };
  
  const handleSave = () => {
    if (editingId && editValues) {
      // ✅ Save configuration changes
      adminActions.updateStationConfig(editingId, editValues);
      setEditingId(null);
      setEditValues({});
    }
  };
  
  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };
  
  return (
    <div>
      <h1>Station Configuration</h1>
      {stations.map(station => {
        const isEditing = editingId === station.id;
        
        return (
          <div key={station.id}>
            <h3>{station.name}</h3>
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={editValues.stationLoad || 0}
                  onChange={(e) => setEditValues({
                    ...editValues,
                    stationLoad: parseFloat(e.target.value)
                  })}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <p>Load: {station.stationLoad}%</p>
                <button onClick={() => handleEdit(station.id)}>Edit</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Simulation control with state updates
// ============================================================================

export function SimulationControls() {
  const { adminActions, simulationState } = useAdminStationStore();
  
  const handleRunSimulation = () => {
    // Start simulation
    adminActions.runSimulation('counterfactual');
    
    // Simulation automatically updates state after 2 seconds
    // You can monitor simulationState to show loading/results
  };
  
  const handleInjectFailure = () => {
    // Run failure injection simulation
    adminActions.runSimulation('failure_injection');
  };
  
  const handleReset = () => {
    adminActions.resetSimulation();
  };
  
  return (
    <div>
      <h2>Simulation Controls</h2>
      <p>Status: {simulationState.status}</p>
      
      <button 
        onClick={handleRunSimulation}
        disabled={simulationState.status === 'running'}
      >
        Run Counterfactual
      </button>
      
      <button 
        onClick={handleInjectFailure}
        disabled={simulationState.status === 'running'}
      >
        Inject Failure Scenario
      </button>
      
      <button onClick={handleReset}>
        Reset
      </button>
      
      {simulationState.output && (
        <pre>{JSON.stringify(simulationState.output, null, 2)}</pre>
      )}
    </div>
  );
}
