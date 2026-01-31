import { useState } from 'react';
import type { FailureEvent } from '../../../types/operator';
import { mockFailureEvents } from '../../../mock/operatorData';
import './FailureLogsPage.css';

export default function FailureLogsPage() {
  const [selectedFailure, setSelectedFailure] = useState<FailureEvent | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'charger_malfunction': return '⚡';
      case 'battery_issue': return '🔋';
      case 'network_error': return '🌐';
      case 'temperature_alert': return '🌡️';
      case 'queue_overflow': return '📊';
      default: return '⚠️';
    }
  };

  const filteredFailures = filterSeverity === 'all' 
    ? mockFailureEvents 
    : mockFailureEvents.filter(f => f.severity === filterSeverity);

  return (
    <div className="failure-logs-page">
      <div className="page-header">
        <div>
          <h1>Failure Logs</h1>
          <p className="page-subtitle">Monitor and diagnose system failures</p>
        </div>
        <div className="filter-controls">
          <label htmlFor="severity-filter">Filter by Severity:</label>
          <select 
            id="severity-filter"
            value={filterSeverity} 
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="severity-select"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="failures-list">
        {filteredFailures.map((failure) => (
          <div 
            key={failure.id} 
            className="failure-item"
            onClick={() => setSelectedFailure(failure)}
          >
            <div className="failure-header">
              <div className="failure-title-section">
                <span className="category-icon">{getCategoryIcon(failure.category)}</span>
                <div>
                  <h3>{failure.stationName}</h3>
                  <p className="failure-id">{failure.id} • {failure.stationId}</p>
                </div>
              </div>
              <span className={`severity-badge ${getSeverityClass(failure.severity)}`}>
                {failure.severity}
              </span>
            </div>

            <div className="failure-details">
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{failure.category.replace(/_/g, ' ')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Error Codes:</span>
                <span className="detail-value error-codes">
                  {failure.errorCodeSequence.join(' → ')}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Predicted Root Cause:</span>
                <span className="detail-value">{failure.predictedRootCause}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Recurrence Probability:</span>
                <span className="detail-value">
                  <div className="probability-bar">
                    <div 
                      className="probability-fill"
                      style={{ width: `${failure.recurrenceProbability * 100}%` }}
                    />
                  </div>
                  {(failure.recurrenceProbability * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="failure-footer">
              <span className="timestamp">
                {new Date(failure.timestamp).toLocaleString()}
              </span>
              <button className="view-details-btn">View Details →</button>
            </div>
          </div>
        ))}
      </div>

      {selectedFailure && (
        <div className="modal-overlay" onClick={() => setSelectedFailure(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Failure Event Details</h2>
              <button className="close-btn" onClick={() => setSelectedFailure(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Basic Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Event ID:</span>
                    <span className="info-value">{selectedFailure.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Timestamp:</span>
                    <span className="info-value">{new Date(selectedFailure.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Station:</span>
                    <span className="info-value">{selectedFailure.stationName} ({selectedFailure.stationId})</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Severity:</span>
                    <span className={`severity-badge ${getSeverityClass(selectedFailure.severity)}`}>
                      {selectedFailure.severity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Error Analysis</h3>
                <div className="info-item full-width">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{selectedFailure.category.replace(/_/g, ' ')}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Error Code Sequence:</span>
                  <div className="error-sequence">
                    {selectedFailure.errorCodeSequence.map((code, idx) => (
                      <span key={idx} className="error-code-chip">{code}</span>
                    ))}
                  </div>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Description:</span>
                  <p className="info-value">{selectedFailure.description}</p>
                </div>
              </div>

              <div className="modal-section">
                <h3>Diagnostic Information</h3>
                <div className="info-item full-width">
                  <span className="info-label">Predicted Root Cause:</span>
                  <p className="info-value highlight">{selectedFailure.predictedRootCause}</p>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Affected Components:</span>
                  <div className="components-list">
                    {selectedFailure.affectedComponents.map((component, idx) => (
                      <span key={idx} className="component-chip">{component}</span>
                    ))}
                  </div>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Recurrence Probability:</span>
                    <span className="info-value">
                      {(selectedFailure.recurrenceProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Est. Downtime:</span>
                    <span className="info-value">{selectedFailure.estimatedDowntime} min</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedFailure(null)}>Close</button>
              <button className="btn-primary">Create Maintenance Action</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
