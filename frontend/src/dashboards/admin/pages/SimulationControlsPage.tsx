import { useState } from 'react';
import { useStationData } from '../../../app/context/StationDataContext';
import type { SimulationStatus } from '../../../types/station';
import './SimulationControlsPage.css';

export default function SimulationControlsPage() {
  const { simulationState, setSimulationState, simulationOutput } = useStationData();
  const [failureInjected, setFailureInjected] = useState(false);

  const runCounterfactualSimulation = () => {
    setSimulationState({
      status: 'running',
      output: null,
      startTime: new Date().toISOString(),
      endTime: null,
    });

    // Simulate async operation
    setTimeout(() => {
      setSimulationState({
        status: 'completed',
        output: simulationOutput,
        startTime: simulationState.startTime,
        endTime: new Date().toISOString(),
      });
    }, 2000);
  };

  const injectFailureScenario = () => {
    setFailureInjected(true);
    const failureOutput = {
      ...simulationOutput,
      scenario: 'failure_injection',
      failureDetails: {
        type: 'charger_malfunction',
        stationId: 'ST-003',
        severity: 'high',
        impact: 'Central Station chargers offline',
        affectedCustomers: 45,
      },
      metrics: {
        ...(simulationOutput?.metrics || {}),
        totalCustomersServed: 1102,
        averageWaitTime: 8.7,
        networkEfficiency: 62.3,
      },
    };

    setSimulationState({
      status: 'running',
      output: null,
      startTime: new Date().toISOString(),
      endTime: null,
    });

    setTimeout(() => {
      setSimulationState({
        status: 'completed',
        output: failureOutput,
        startTime: simulationState.startTime,
        endTime: new Date().toISOString(),
      });
    }, 2000);
  };

  const resetNetworkState = () => {
    setSimulationState({
      status: 'idle',
      output: null,
      startTime: null,
      endTime: null,
    });
    setFailureInjected(false);
  };

  const getStatusBadge = () => {
    const statusClasses: Record<SimulationStatus, string> = {
      idle: 'status-idle',
      running: 'status-running',
      completed: 'status-completed',
    };

    return (
      <span className={`status-badge ${statusClasses[simulationState.status]}`}>
        {simulationState.status === 'running' && '⏳ '}
        {simulationState.status === 'completed' && '✓ '}
        {simulationState.status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="simulation-controls-page">
      <div className="page-header">
        <h1>Simulation Controls</h1>
        <p className="page-subtitle">Run simulations and analyze network behavior</p>
      </div>

      <div className="controls-section">
        <div className="control-card">
          <div className="card-header">
            <h2>Simulation Status</h2>
            {getStatusBadge()}
          </div>
          
          {simulationState.startTime && (
            <div className="time-info">
              <p><strong>Started:</strong> {new Date(simulationState.startTime).toLocaleTimeString()}</p>
              {simulationState.endTime && (
                <p><strong>Completed:</strong> {new Date(simulationState.endTime).toLocaleTimeString()}</p>
              )}
            </div>
          )}
        </div>

        <div className="control-card">
          <h2>Actions</h2>
          <div className="button-group">
            <button
              onClick={runCounterfactualSimulation}
              disabled={simulationState.status === 'running'}
              className="btn-primary btn-large"
            >
              🔄 Run Counterfactual Simulation
            </button>
            
            <button
              onClick={injectFailureScenario}
              disabled={simulationState.status === 'running'}
              className="btn-warning btn-large"
            >
              ⚠️ Inject Failure Scenario
            </button>
            
            <button
              onClick={resetNetworkState}
              disabled={simulationState.status === 'running'}
              className="btn-secondary btn-large"
            >
              🔄 Reset Network State
            </button>
          </div>

          {failureInjected && simulationState.status === 'idle' && (
            <div className="alert alert-warning">
              <strong>Note:</strong> Failure scenario will be applied on next simulation run
            </div>
          )}
        </div>
      </div>

      {simulationState.status === 'running' && (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Running simulation... Please wait.</p>
        </div>
      )}

      {simulationState.status === 'completed' && simulationState.output && (
        <div className="output-section">
          <div className="output-header">
            <h2>Simulation Output</h2>
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(simulationState.output, null, 2))} className="btn-copy">
              📋 Copy JSON
            </button>
          </div>
          
          <div className="json-viewer">
            <pre>{JSON.stringify(simulationState.output, null, 2)}</pre>
          </div>

          {simulationState.output.recommendations && 
           Array.isArray(simulationState.output.recommendations) && 
           simulationState.output.recommendations.length > 0 ? (
            <div className="recommendations">
              <h3>Recommendations</h3>
              <ul>
                {(simulationState.output.recommendations as string[]).map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
