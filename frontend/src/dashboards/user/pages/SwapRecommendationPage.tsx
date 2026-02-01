import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStations } from '../../../store';
import type { SwapStation } from '../../../types/user';
import './SwapRecommendationPage.css';

export default function SwapRecommendationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeRequest = location.state?.routeRequest;

  // Subscribe to global store - recommendations derived from real-time station state
  const stations = useStations();

  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'waitTime' | 'comfort'>('comfort');
  
  // Compute recommendations dynamically from current station state
  // Updates automatically when admin changes load/availability
  const recommendations = useMemo<SwapStation[]>(() => {
    return stations.map((station, idx) => {
      // Derive metrics from real-time station state
      const availableSlots = station.totalChargers - station.activeChargers;
      const loadPercentage = station.stationLoad;
      const queueLength = station.queueLength;
      const batteryInventory = station.chargedBatteryInventory;
      
      // Calculate wait time based on queue and active chargers
      const estimatedWaitTime = station.activeChargers > 0 
        ? Math.ceil((queueLength / station.activeChargers) * 5)
        : 0;
      
      // Calculate comfort score based on multiple factors
      // Lower load = higher comfort, more inventory = higher comfort
      const loadFactor = (100 - loadPercentage) / 100; // 0-1
      const inventoryFactor = Math.min(batteryInventory / 20, 1); // 0-1
      const availabilityFactor = Math.min(availableSlots / 5, 1); // 0-1
      const queueFactor = Math.max(1 - (queueLength / 15), 0); // 0-1
      
      const comfortScore = Math.round(
        (loadFactor * 30) + 
        (inventoryFactor * 30) + 
        (availabilityFactor * 25) + 
        (queueFactor * 15)
      );
      
      // Simulate distance/travel metrics (in real app, would use route API)
      const distanceFromRoute = 0.5 + (idx * 1.2);
      const estimatedTravelTime = Math.ceil(distanceFromRoute * 3);
      
      return {
        id: station.id,
        name: station.name,
        location: {
          id: station.id,
          name: station.name,
          address: `${station.name} Battery Swap Station`,
          coordinates: { lat: 28.6 + (idx * 0.1), lng: 77.2 + (idx * 0.1) }
        },
        distanceFromRoute,
        estimatedTravelTime,
        estimatedWaitTime,
        availableSlots,
        batteryInventory,
        pricePerSwap: 12 + (idx * 0.5),
        comfortScore,
        rating: 4.2 + (comfortScore / 200), // Rating correlated with comfort
        amenities: [
          batteryInventory > 15 ? 'High Inventory' : 'Limited Stock',
          availableSlots > 3 ? 'Multiple Slots' : 'Limited Availability',
          loadPercentage < 70 ? 'Fast Service' : 'Busy'
        ].filter(Boolean)
      };
    });
  }, [stations]);

  if (!routeRequest) {
    return (
      <div className="swap-recommendation-page">
        <div className="no-route-message">
          <h2>No Route Selected</h2>
          <p>Please plan a route first to see swap station recommendations.</p>
          <button onClick={() => navigate('/user/route')} className="btn-back">
            Go to Route Planner
          </button>
        </div>
      </div>
    );
  }

  const handleSelectStation = (stationId: string) => {
    setSelectedStation(stationId);
  };

  const handleConfirmSelection = () => {
    const station = recommendations.find(s => s.id === selectedStation);
    if (station) {
      alert(`Booking confirmed for ${station.name}!\n\nYou will receive a confirmation email shortly.`);
    }
  };

  const getComfortClass = (score: number) => {
    if (score >= 90) return 'comfort-excellent';
    if (score >= 75) return 'comfort-good';
    if (score >= 60) return 'comfort-fair';
    return 'comfort-poor';
  };

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distanceFromRoute - b.distanceFromRoute;
      case 'waitTime':
        return a.estimatedWaitTime - b.estimatedWaitTime;
      case 'comfort':
      default:
        return b.comfortScore - a.comfortScore;
    }
  });

  return (
    <div className="swap-recommendation-page">
      <div className="page-header">
        <div>
          <h1>Swap Station Recommendations</h1>
          <p className="route-info">
            {routeRequest.origin?.name} → {routeRequest.destination?.name}
          </p>
        </div>
        <button onClick={() => navigate('/user/route')} className="btn-back-small">
          ← Back to Planner
        </button>
      </div>

      <div className="recommendations-controls">
        <div className="sort-controls">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'distance' | 'waitTime' | 'comfort')}
            className="sort-select"
          >
            <option value="comfort">Comfort Score</option>
            <option value="distance">Distance from Route</option>
            <option value="waitTime">Wait Time</option>
          </select>
        </div>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">Live recommendations based on current station availability</span>
        </div>
      </div>

      <div className="recommendations-container">
        <div className="stations-list">
          {sortedRecommendations.map((station, index) => (
            <div
              key={station.id}
              className={`station-card ${selectedStation === station.id ? 'selected' : ''}`}
              onClick={() => handleSelectStation(station.id)}
            >
              <div className="station-rank">#{index + 1}</div>
              
              <div className="station-header">
                <div>
                  <h3>{station.name}</h3>
                  <p className="station-address">{station.location.address}</p>
                </div>
                <div className="station-rating">
                  <span className="rating-value">⭐ {station.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="station-metrics">
                <div className="metric-item">
                  <div className="metric-icon">📍</div>
                  <div className="metric-content">
                    <span className="metric-label">Distance from Route</span>
                    <span className="metric-value">{station.distanceFromRoute} km</span>
                  </div>
                </div>

                <div className="metric-item">
                  <div className="metric-icon">🚗</div>
                  <div className="metric-content">
                    <span className="metric-label">Travel Time</span>
                    <span className="metric-value">{station.estimatedTravelTime} min</span>
                  </div>
                </div>

                <div className="metric-item">
                  <div className="metric-icon">⏱️</div>
                  <div className="metric-content">
                    <span className="metric-label">Wait Time</span>
                    <span className="metric-value">{station.estimatedWaitTime} min</span>
                  </div>
                </div>

                <div className="metric-item">
                  <div className="metric-icon">✨</div>
                  <div className="metric-content">
                    <span className="metric-label">Comfort Score</span>
                    <div className="comfort-score-container">
                      <div className="comfort-bar">
                        <div
                          className={`comfort-fill ${getComfortClass(station.comfortScore)}`}
                          style={{ width: `${station.comfortScore}%` }}
                        />
                      </div>
                      <span className="metric-value">{station.comfortScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="station-details">
                <div className="detail-row">
                  <span className="detail-label">Available Slots:</span>
                  <span className={`detail-value ${station.availableSlots < 5 ? 'low-availability' : ''}`}>
                    {station.availableSlots}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Battery Inventory:</span>
                  <span className="detail-value">{station.batteryInventory}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price per Swap:</span>
                  <span className="detail-value price">${station.pricePerSwap}</span>
                </div>
              </div>

              <div className="station-amenities">
                <span className="amenities-label">Amenities:</span>
                <div className="amenities-list">
                  {station.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-chip">{amenity}</span>
                  ))}
                </div>
              </div>

              {selectedStation === station.id && (
                <div className="selection-indicator">
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedStation && (
          <div className="selection-panel">
            <h3>Confirm Your Selection</h3>
            <p>You have selected:</p>
            <div className="selected-station-summary">
              <h4>{recommendations.find(s => s.id === selectedStation)?.name}</h4>
              <p>{recommendations.find(s => s.id === selectedStation)?.location.address}</p>
            </div>
            <div className="action-buttons">
              <button onClick={handleConfirmSelection} className="btn-confirm">
                ✓ Confirm Booking
              </button>
              <button onClick={() => setSelectedStation(null)} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
