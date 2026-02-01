import { useState } from 'react';
import { useOperatorStationStore } from '../../../store';
import type { ActionStatus, MaintenanceAction } from '../../../types/station';
import './MaintenanceActionsPage.css';

export default function MaintenanceActionsPage() {
  // Subscribe to global Zustand store - reactive updates
  const { operatorActions, maintenanceActions } = useOperatorStationStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleStatusChange = (actionId: string, newStatus: ActionStatus) => {
    // Update global store - changes propagate to all dashboards
    operatorActions.updateMaintenanceActionStatus(actionId, newStatus);
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'acknowledged': return 'status-acknowledged';
      case 'dismissed': return 'status-dismissed';
      case 'escalated': return 'status-escalated';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const filteredActions = filterStatus === 'all'
    ? maintenanceActions
    : maintenanceActions.filter((a: MaintenanceAction) => a.status === filterStatus);

  const pendingCount = maintenanceActions.filter((a: MaintenanceAction) => a.status === 'pending').length;
  const acknowledgedCount = maintenanceActions.filter((a: MaintenanceAction) => a.status === 'acknowledged').length;
  const escalatedCount = maintenanceActions.filter((a: MaintenanceAction) => a.status === 'escalated').length;

  return (
    <div className="maintenance-actions-page">
      <div className="page-header">
        <div>
          <h1>Maintenance Actions</h1>
          <p className="page-subtitle">Manage recommended maintenance tasks</p>
        </div>
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="dismissed">Dismissed</option>
            <option value="escalated">Escalated</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-box">
          <span className="stat-label">Pending</span>
          <span className="stat-value pending">{pendingCount}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Acknowledged</span>
          <span className="stat-value acknowledged">{acknowledgedCount}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Escalated</span>
          <span className="stat-value escalated">{escalatedCount}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Actions</span>
          <span className="stat-value total">{maintenanceActions.length}</span>
        </div>
      </div>

      <div className="actions-list">
        {filteredActions.map((action) => (
          <div key={action.id} className={`action-card ${getStatusClass(action.status)}`}>
            <div className="action-header">
              <div className="action-title-section">
                <h3>{action.title}</h3>
                <p className="action-id">{action.id}</p>
              </div>
              <div className="badges">
                <span className={`priority-badge ${getPriorityClass(action.priority)}`}>
                  {action.priority}
                </span>
                <span className={`status-badge ${getStatusClass(action.status)}`}>
                  {action.status}
                </span>
              </div>
            </div>

            <div className="action-body">
              <p className="action-description">{action.description}</p>
              
              <div className="action-details">
                <div className="detail-item">
                  <span className="detail-label">Station:</span>
                  <span className="detail-value">{action.stationName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{action.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{action.estimatedDuration} min</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Due Date:</span>
                  <span className="detail-value">
                    {new Date(action.dueDate).toLocaleDateString()} {new Date(action.dueDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </span>
                </div>
              </div>
            </div>

            {action.status === 'pending' && (
              <div className="action-footer">
                <div className="action-controls">
                  <button
                    onClick={() => handleStatusChange(action.id, 'acknowledged')}
                    className="btn-acknowledge"
                  >
                    ✓ Acknowledge
                  </button>
                  <button
                    onClick={() => handleStatusChange(action.id, 'dismissed')}
                    className="btn-dismiss"
                  >
                    ✗ Dismiss
                  </button>
                  <button
                    onClick={() => handleStatusChange(action.id, 'escalated')}
                    className="btn-escalate"
                  >
                    ⬆ Escalate
                  </button>
                </div>
              </div>
            )}

            {action.status === 'acknowledged' && (
              <div className="action-footer">
                <div className="action-controls">
                  <button
                    onClick={() => handleStatusChange(action.id, 'completed')}
                    className="btn-complete"
                  >
                    ✓ Mark Complete
                  </button>
                  <button
                    onClick={() => handleStatusChange(action.id, 'escalated')}
                    className="btn-escalate"
                  >
                    ⬆ Escalate
                  </button>
                  <button
                    onClick={() => handleStatusChange(action.id, 'pending')}
                    className="btn-revert"
                  >
                    ↩ Revert to Pending
                  </button>
                </div>
              </div>
            )}

            {(action.status === 'dismissed' || action.status === 'escalated' || action.status === 'completed') && (
              <div className="action-footer status-footer">
                <span className="status-message">
                  {action.status === 'dismissed' && 'This action has been dismissed'}
                  {action.status === 'escalated' && 'This action has been escalated to management'}
                  {action.status === 'completed' && 'This action has been completed'}
                </span>
                {action.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange(action.id, 'pending')}
                    className="btn-revert-small"
                  >
                    ↩ Revert
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
