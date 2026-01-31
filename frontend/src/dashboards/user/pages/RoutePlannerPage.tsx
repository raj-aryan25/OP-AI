import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RouteRequest } from '../../../types/user';
import { mockLocations } from '../../../mock/userData';
import './RoutePlannerPage.css';

export default function RoutePlannerPage() {
  const navigate = useNavigate();
  const [routeRequest, setRouteRequest] = useState<RouteRequest>({
    origin: null,
    destination: null,
    departureTime: undefined
  });

  const handleOriginChange = (locationId: string) => {
    const selectedLocation = mockLocations.find(loc => loc.id === locationId) || null;
    setRouteRequest(prev => ({ ...prev, origin: selectedLocation }));
  };

  const handleDestinationChange = (locationId: string) => {
    const selectedLocation = mockLocations.find(loc => loc.id === locationId) || null;
    setRouteRequest(prev => ({ ...prev, destination: selectedLocation }));
  };

  const handleFindStations = () => {
    if (!routeRequest.origin || !routeRequest.destination) {
      alert('Please select both origin and destination locations.');
      return;
    }

    // Navigate to swap recommendations page
    navigate('/user/recommendation', {
      state: { routeRequest }
    });
  };

  const handleSwapLocations = () => {
    setRouteRequest(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const calculateEstimatedDistance = () => {
    if (!routeRequest.origin || !routeRequest.destination) return null;
    
    // Simple placeholder calculation
    const dx = routeRequest.destination.coordinates.lat - routeRequest.origin.coordinates.lat;
    const dy = routeRequest.destination.coordinates.lng - routeRequest.origin.coordinates.lng;
    const distance = Math.sqrt(dx * dx + dy * dy) * 111; // Rough km conversion
    
    return distance.toFixed(1);
  };

  const estimatedDistance = calculateEstimatedDistance();

  return (
    <div className="route-planner-page">
      <div className="page-header">
        <h1>Route Planner</h1>
        <p className="page-subtitle">Plan your journey and find optimal battery swap stations</p>
      </div>

      <div className="planner-container">
        <div className="route-form">
          <div className="form-section">
            <h2>Journey Details</h2>
            
            <div className="input-group">
              <label htmlFor="origin">Origin Location</label>
              <select
                id="origin"
                value={routeRequest.origin?.id || ''}
                onChange={(e) => handleOriginChange(e.target.value)}
                className="location-select"
              >
                <option value="">Select origin...</option>
                {mockLocations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              {routeRequest.origin && (
                <p className="location-details">{routeRequest.origin.address}</p>
              )}
            </div>

            <div className="swap-button-container">
              <button
                onClick={handleSwapLocations}
                className="swap-locations-btn"
                title="Swap origin and destination"
              >
                ⇅
              </button>
            </div>

            <div className="input-group">
              <label htmlFor="destination">Destination Location</label>
              <select
                id="destination"
                value={routeRequest.destination?.id || ''}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="location-select"
              >
                <option value="">Select destination...</option>
                {mockLocations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              {routeRequest.destination && (
                <p className="location-details">{routeRequest.destination.address}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="departure">Departure Time (Optional)</label>
              <input
                id="departure"
                type="datetime-local"
                onChange={(e) => setRouteRequest(prev => ({
                  ...prev,
                  departureTime: e.target.value ? new Date(e.target.value) : undefined
                }))}
                className="time-input"
              />
            </div>

            <button
              onClick={handleFindStations}
              disabled={!routeRequest.origin || !routeRequest.destination}
              className="find-stations-btn"
            >
              🔍 Find Swap Stations
            </button>
          </div>

          {estimatedDistance && (
            <div className="route-summary">
              <h3>Route Summary</h3>
              <div className="summary-item">
                <span className="summary-label">From:</span>
                <span className="summary-value">{routeRequest.origin?.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">To:</span>
                <span className="summary-value">{routeRequest.destination?.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Est. Distance:</span>
                <span className="summary-value">{estimatedDistance} km</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Est. Duration:</span>
                <span className="summary-value">{(parseFloat(estimatedDistance) * 1.5).toFixed(0)} min</span>
              </div>
            </div>
          )}
        </div>

        <div className="map-placeholder">
          <div className="placeholder-content">
            <div className="map-icon">🗺️</div>
            <h3>Map View</h3>
            <p>Interactive map will be displayed here</p>
            <div className="placeholder-info">
              <p>Selected route will appear on the map with:</p>
              <ul>
                <li>Origin and destination markers</li>
                <li>Optimal route path</li>
                <li>Nearby swap stations</li>
                <li>Real-time traffic information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
