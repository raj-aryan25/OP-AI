import { MapSimulation } from '../../../components';
import './StationMapPage.css';

export default function StationMapPage() {
  return (
    <div className="station-map-page">
      <div className="page-header">
        <h1>Station Network Map</h1>
        <p>Real-time view of all battery swap stations in your city</p>
      </div>
      
      <MapSimulation />
      
      <div className="map-tips">
        <div className="tip-card">
          <h3>🎯 Quick Tips</h3>
          <ul>
            <li>Click on any station marker to view detailed information</li>
            <li>Green stations have available capacity and low wait times</li>
            <li>Orange/Red stations may have high load or low battery inventory</li>
            <li>Use the navigation button to get directions to your selected station</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
