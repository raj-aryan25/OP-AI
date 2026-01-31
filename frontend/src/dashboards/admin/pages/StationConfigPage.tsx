import { useState } from 'react';
import type { Station } from '../../../types/admin';
import { mockStations } from '../../../mock/adminData';
import './StationConfigPage.css';

export default function StationConfigPage() {
  const [stations, setStations] = useState<Station[]>(mockStations);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (stationId: string) => {
    setEditingId(stationId);
  };

  const handleSave = () => {
    setEditingId(null);
    // In a real app, this would persist to backend
    console.log('Saved stations:', stations);
  };

  const handleCancel = () => {
    setEditingId(null);
    // Reset to original data
    setStations(mockStations);
  };

  const handleChange = (id: string, field: keyof Station, value: string | number) => {
    setStations(prevStations =>
      prevStations.map(station =>
        station.id === id
          ? { ...station, [field]: typeof value === 'string' ? parseFloat(value) || 0 : value }
          : station
      )
    );
  };

  const getLoadClass = (load: number) => {
    if (load >= 80) return 'load-high';
    if (load >= 60) return 'load-medium';
    return 'load-low';
  };

  return (
    <div className="station-config-page">
      <div className="page-header">
        <h1>Station Configuration</h1>
        <p className="page-subtitle">Monitor and configure all charging stations</p>
      </div>

      <div className="table-container">
        <table className="station-table">
          <thead>
            <tr>
              <th>Station ID</th>
              <th>Name</th>
              <th>Queue Length</th>
              <th>Arrival Rate</th>
              <th>Active Chargers</th>
              <th>Battery Inventory</th>
              <th>Temperature (°C)</th>
              <th>Station Load (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => {
              const isEditing = editingId === station.id;
              return (
                <tr key={station.id} className={isEditing ? 'editing' : ''}>
                  <td className="station-id">{station.id}</td>
                  <td className="station-name">{station.name}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={station.queueLength}
                        onChange={(e) => handleChange(station.id, 'queueLength', e.target.value)}
                        min="0"
                        className="table-input"
                      />
                    ) : (
                      station.queueLength
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={station.arrivalRate}
                        onChange={(e) => handleChange(station.id, 'arrivalRate', e.target.value)}
                        min="0"
                        step="0.1"
                        className="table-input"
                      />
                    ) : (
                      `${station.arrivalRate.toFixed(1)}/hr`
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={station.activeChargers}
                        onChange={(e) => handleChange(station.id, 'activeChargers', e.target.value)}
                        min="0"
                        className="table-input"
                      />
                    ) : (
                      station.activeChargers
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={station.chargedBatteryInventory}
                        onChange={(e) => handleChange(station.id, 'chargedBatteryInventory', e.target.value)}
                        min="0"
                        className="table-input"
                      />
                    ) : (
                      station.chargedBatteryInventory
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={station.temperature}
                        onChange={(e) => handleChange(station.id, 'temperature', e.target.value)}
                        step="0.1"
                        className="table-input"
                      />
                    ) : (
                      `${station.temperature.toFixed(1)}°`
                    )}
                  </td>
                  <td>
                    <span className={`load-badge ${getLoadClass(station.stationLoad)}`}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={station.stationLoad}
                          onChange={(e) => handleChange(station.id, 'stationLoad', e.target.value)}
                          min="0"
                          max="100"
                          step="0.1"
                          className="table-input load-input"
                        />
                      ) : (
                        `${station.stationLoad.toFixed(1)}%`
                      )}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="action-buttons">
                        <button onClick={handleSave} className="btn-save">Save</button>
                        <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => handleEdit(station.id)} className="btn-edit">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total Stations</h3>
          <p className="stat-value">{stations.length}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Queue Length</h3>
          <p className="stat-value">
            {(stations.reduce((sum, s) => sum + s.queueLength, 0) / stations.length).toFixed(1)}
          </p>
        </div>
        <div className="stat-card">
          <h3>Total Active Chargers</h3>
          <p className="stat-value">
            {stations.reduce((sum, s) => sum + s.activeChargers, 0)}
          </p>
        </div>
        <div className="stat-card">
          <h3>Avg Station Load</h3>
          <p className="stat-value">
            {(stations.reduce((sum, s) => sum + s.stationLoad, 0) / stations.length).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
