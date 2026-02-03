import { useState, useMemo } from 'react';
import { useStations } from '../../store';
import type { Station } from '../../types/station';
import { Zap, MapPin, Navigation, Battery, Clock } from 'lucide-react';
import './MapSimulation.css';

interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'station' | 'user';
  station?: Station;
}

// Map bounds for the city (based on mock data coordinates)
const MAP_BOUNDS = {
  minLat: 40.64,
  maxLat: 40.77,
  minLng: -74.08,
  maxLng: -73.97
};

// Convert real coordinates to map pixel positions
const coordsToPixels = (lat: number, lng: number) => {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
};

// Station coordinates (matching location data)
const stationCoordinates: Record<string, { lat: number; lng: number }> = {
  'ST-001': { lat: 40.7128, lng: -74.0060 }, // Downtown
  'ST-002': { lat: 40.6413, lng: -73.7781 }, // Airport (adjusted to fit bounds)
  'ST-003': { lat: 40.7350, lng: -73.9950 }, // Central
  'ST-004': { lat: 40.7589, lng: -73.9851 }, // North
  'ST-005': { lat: 40.7180, lng: -74.0100 }, // South
};

export default function MapSimulation() {
  const stations = useStations();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [userLocation] = useState({ lat: 40.7282, lng: -74.0076 }); // Default user position
  const [showRoute, setShowRoute] = useState(false);

  // Create markers for all stations and user
  const markers: MapMarker[] = useMemo(() => {
    const stationMarkers: MapMarker[] = stations.map(station => ({
      id: station.id,
      name: station.name,
      lat: stationCoordinates[station.id]?.lat || 40.73,
      lng: stationCoordinates[station.id]?.lng || -74.0,
      type: 'station' as const,
      station
    }));

    const userMarker: MapMarker = {
      id: 'user',
      name: 'Your Location',
      lat: userLocation.lat,
      lng: userLocation.lng,
      type: 'user' as const
    };

    return [...stationMarkers, userMarker];
  }, [stations, userLocation]);

  const getStationStatus = (station: Station) => {
    if (station.stationLoad >= 85) return 'high-load';
    if (station.chargedBatteryInventory <= 5) return 'low-inventory';
    if (station.activeChargers < station.totalChargers) return 'available';
    return 'normal';
  };

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    setShowRoute(true);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    // Simple distance calculation (not accurate, just for simulation)
    const dx = (lat2 - lat1) * 111; // Rough km conversion
    const dy = (lng2 - lng1) * 111 * Math.cos(lat1 * Math.PI / 180);
    return Math.sqrt(dx * dx + dy * dy).toFixed(1);
  };

  return (
    <div className="map-simulation">
      <div className="map-header">
        <div className="map-title">
          <MapPin size={24} />
          <h2>City Network Map</h2>
        </div>
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-dot status-available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot status-normal"></span>
            <span>Normal</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot status-high-load"></span>
            <span>High Load</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot status-low-inventory"></span>
            <span>Low Battery</span>
          </div>
        </div>
      </div>

      <div className="map-container">
        <div className="map-canvas">
          {/* Grid overlay */}
          <div className="map-grid"></div>

          {/* Markers */}
          {markers.map(marker => {
            const pos = coordsToPixels(marker.lat, marker.lng);
            const isSelected = selectedStation?.id === marker.id;

            if (marker.type === 'user') {
              return (
                <div
                  key={marker.id}
                  className="map-marker user-marker"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  title="Your Location"
                >
                  <Navigation size={20} />
                  <div className="marker-pulse"></div>
                </div>
              );
            }

            const status = getStationStatus(marker.station!);
            return (
              <div
                key={marker.id}
                className={`map-marker station-marker ${status} ${isSelected ? 'selected' : ''}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => handleStationClick(marker.station!)}
                title={marker.name}
              >
                <Zap size={18} />
                <span className="marker-label">{marker.name}</span>
              </div>
            );
          })}

          {/* Route line */}
          {showRoute && selectedStation && (
            <svg className="route-overlay">
              {(() => {
                const userPos = coordsToPixels(userLocation.lat, userLocation.lng);
                const stationCoords = stationCoordinates[selectedStation.id];
                const stationPos = coordsToPixels(stationCoords.lat, stationCoords.lng);
                
                return (
                  <line
                    x1={`${userPos.x}%`}
                    y1={`${userPos.y}%`}
                    x2={`${stationPos.x}%`}
                    y2={`${stationPos.y}%`}
                    className="route-line"
                    strokeDasharray="5,5"
                  />
                );
              })()}
            </svg>
          )}
        </div>

        {/* Station Info Panel */}
        {selectedStation && (
          <div className="station-info-panel">
            <div className="info-header">
              <h3>{selectedStation.name}</h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  setSelectedStation(null);
                  setShowRoute(false);
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="info-content">
              <div className="info-row">
                <MapPin size={16} />
                <span>
                  {calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    stationCoordinates[selectedStation.id].lat,
                    stationCoordinates[selectedStation.id].lng
                  )} km away
                </span>
              </div>

              <div className="info-row">
                <Battery size={16} />
                <span>{selectedStation.chargedBatteryInventory} batteries available</span>
              </div>

              <div className="info-row">
                <Zap size={16} />
                <span>
                  {selectedStation.activeChargers}/{selectedStation.totalChargers} chargers active
                </span>
              </div>

              <div className="info-row">
                <Clock size={16} />
                <span>~{selectedStation.queueLength * 2} min wait</span>
              </div>

              <div className="info-stats">
                <div className="stat-item">
                  <span className="stat-label">Load</span>
                  <span className={`stat-value ${selectedStation.stationLoad >= 85 ? 'high' : ''}`}>
                    {selectedStation.stationLoad.toFixed(0)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Queue</span>
                  <span className="stat-value">{selectedStation.queueLength}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Temp</span>
                  <span className="stat-value">{selectedStation.temperature}°C</span>
                </div>
              </div>

              <button className="navigate-btn">
                <Navigation size={16} />
                Navigate to Station
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="map-footer">
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span>Live Network Status</span>
        </div>
        <div className="map-stats">
          <span>{stations.length} Stations</span>
          <span>•</span>
          <span>{stations.filter(s => s.stationLoad < 85).length} Available</span>
        </div>
      </div>
    </div>
  );
}
