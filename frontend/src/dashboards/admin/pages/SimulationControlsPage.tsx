import { useState } from 'react';
import type { SimulationState, SimulationStatus } from '../../../types/admin';
import { mockSimulationOutput } from '../../../mock/adminData';
import './SimulationControlsPage.css';

export default function SimulationControlsPage() {
  const [simulation, setSimulation] = useState<SimulationState>({
    status: 'idle',
    output: null,
    startTime: null,
    endTime: null,
  });

  const [failureInjected, setFailureInjected] = useState(false);

  const runCounterfactualSimulation = () => {
    setSimulation({
      status: 'running',
      output: null,
      startTime: new Date().toISOString(),
      endTime: null,
    });

    // Simulate async operation
    setTimeout(() => {
      setSimulation({
        status: 'completed',
        output: mockSimulationOutput,
        startTime: simulation.startTime,
        endTime: new Date().toISOString(),
      });
    }, 2000);
  };

  const injectFailureScenario = () => {
    setFailureInjected(true);
    const failureOutput = {
      ...mockSimulationOutput,
      scenario: 'failure_injection',
      failureDetails: {
        type: 'charger_malfunction',
        stationId: 'ST-003',
        severity: 'high',
        impact: 'Central Station chargers offline',
        affectedCustomers: 45,
      },
      metrics: {
        ...mockSimulationOutput.metrics,
        totalCustomersServed: 1102,
        averageWaitTime: 8.7,
        networkEfficiency: 62.3,
      },
    };

    setSimulation({
      status: 'running',
      output: null,
      startTime: new Date().toISOString(),
      endTime: null,
    });

    setTimeout(() => {
      setSimulation({
        status: 'completed',
        output: failureOutput,
        startTime: simulation.startTime,
        endTime: new Date().toISOString(),
      });
    }, 2000);
  };

  const resetNetworkState = () => {
    setSimulation({
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
      <span className={`status-badge ${statusClasses[simulation.status]}`}>
        {simulation.status === 'running' && '⏳ '}
        {simulation.status === 'completed' && '✓ '}
        {simulation.status.toUpperCase()}
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
          
          {simulation.startTime && (
            <div className="time-info">
              <p><strong>Started:</strong> {new Date(simulation.startTime).toLocaleTimeString()}</p>
              {simulation.endTime && (
                <p><strong>Completed:</strong> {new Date(simulation.endTime).toLocaleTimeString()}</p>
              )}
            </div>
          )}
        </div>

        <div className="control-card">
          <h2>Actions</h2>
          <div className="button-group">
            <button
              onClick={runCounterfactualSimulation}
              disabled={simulation.status === 'running'}
              className="btn-primary btn-large"
            >
              🔄 Run Counterfactual Simulation
            </button>
            
            <button
              onClick={injectFailureScenario}
              disabled={simulation.status === 'running'}
              className="btn-warning btn-large"
            >
              ⚠️ Inject Failure Scenario
            </button>
            
            <button
              onClick={resetNetworkState}
              disabled={simulation.status === 'running'}
              className="btn-secondary btn-large"
            >
              🔄 Reset Network State
            </button>
          </div>

          {failureInjected && simulation.status === 'idle' && (
            <div className="alert alert-warning">
              <strong>Note:</strong> Failure scenario will be applied on next simulation run
            </div>
          )}
        </div>
      </div>

      {simulation.status === 'running' && (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Running simulation... Please wait.</p>
        </div>
      )}

      {simulation.status === 'completed' && simulation.output && (
        <div className="output-section">
          <div className="output-header">
            <h2>Simulation Output</h2>
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(simulation.output, null, 2))} className="btn-copy">
              📋 Copy JSON
            </button>
          </div>
          
          <div className="json-viewer">
            <pre>{JSON.stringify(simulation.output, null, 2)}</pre>
          </div>

          {simulation.output.recommendations && 
           Array.isArray(simulation.output.recommendations) && 
           simulation.output.recommendations.length > 0 ? (
            <div className="recommendations">
              <h3>Recommendations</h3>
              <ul>
                {(simulation.output.recommendations as string[]).map((rec, idx) => (
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
