import {
  Zap,
  Wallet,
  Star,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import { MapSimulation } from '../../components';
import './UserDashboard.css';

// Mock Data
const recentSwaps = [
  { id: 1, station: "Connaught Place Stn", time: "2 hrs ago", energy: "+2.4 kWh", cost: "₹450" },
  { id: 2, station: "Noida Sec 18", time: "Yesterday", energy: "+2.2 kWh", cost: "₹420" },
  { id: 3, station: "Guru Dronacharya", time: "3 days ago", energy: "+2.5 kWh", cost: "₹500" },
];

export default function UserDashboard() {
  return (
    <div className="user-dashboard-container">
      {/* Top Section */}
      <div className="ud-grid-top">
        {/* Main Stats Card */}
        <div className="ud-card main-stat-card">
          <div className="stat-header">
            <h3>Total Energy Swapped</h3>
            <MoreHorizontal className="icon-more" />
          </div>
          <div className="stat-number">8,527 <span className="unit">kWh</span></div>
          <p className="stat-desc">
            All your battery swaps contribute to a greener planet.
            Keep it up!
          </p>

          <div className="stat-toggle">
            <div className="toggle-item active">
              <div className="toggle-switch on"></div>
              <span>Show public contributions</span>
            </div>
            <div className="toggle-item">
              <div className="toggle-switch off"></div>
              <span>Show past week</span>
            </div>
          </div>
        </div>

        {/* Chart Card (Visual Mock) */}
        <div className="ud-card chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <span className="count">229</span> Swaps
            </div>
            <div className="chart-badge">+16% more than last week</div>
          </div>

          {/* Simple CSS Chart Graphic */}
          <div className="chart-graphic">
            <svg viewBox="0 0 300 100" className="chart-svg">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,80 C50,70 80,40 120,50 C160,60 200,20 250,30 C280,35 300,10 300,10 V100 H0 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M0,80 C50,70 80,40 120,50 C160,60 200,20 250,30 C280,35 300,10 300,10"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="200" cy="28" r="4" fill="white" stroke="#06B6D4" strokeWidth="2" />

              {/* Tooltip Mock */}
              <g transform="translate(170, -5)">
                <rect x="0" y="0" width="100" height="24" rx="12" fill="#06B6D4" />
                <text x="50" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">18 Swaps</text>
                <path d="M50,24 L45,30 L55,30 Z" fill="#06B6D4" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <h3 className="section-title">Details</h3>
      <div className="ud-grid-bottom">
        {/* Detail Grid */}
        <div className="details-grid">
          <div className="ud-card detail-item">
            <Zap className="detail-icon icon-cyan" />
            <div className="detail-text">
              <span className="detail-val">5,678</span>
              <span className="detail-label">Points</span>
            </div>
          </div>

          <div className="ud-card detail-item">
            <Wallet className="detail-icon icon-teal" />
            <div className="detail-text">
              <span className="detail-val">₹49k</span>
              <span className="detail-label">Saved</span>
            </div>
          </div>

          <div className="ud-card detail-item">
            <Star className="detail-icon icon-orange" />
            <div className="detail-text">
              <span className="detail-val">329</span>
              <span className="detail-label">Swaps</span>
            </div>
          </div>

          <div className="ud-card detail-item">
            <TrendingUp className="detail-icon icon-green" />
            <div className="detail-text">
              <span className="detail-val">2,520</span>
              <span className="detail-label">Ranking</span>
            </div>
          </div>
        </div>

        {/* Recent List */}
        <div className="ud-card list-card">
          <div className="list-header">
            <h3>Recent Swaps</h3>
            <a href="#" className="link-view-all">View all history</a>
          </div>
          <div className="list-content">
            {recentSwaps.map((swap, idx) => (
              <div key={swap.id} className="list-item">
                <div className={`rank-badge rank-${idx + 1}`}>{idx + 1}st</div>
                <div className="list-info">
                  <div className="list-main">{swap.station}</div>
                  <div className="list-sub">{swap.time}</div>
                </div>
                <div className="list-meta">
                  <span className="meta-energy">{swap.energy}</span>
                  <span className="meta-cost">{swap.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Simulation Section */}
      <div className="ud-map-section">
        <MapSimulation />
      </div>
    </div>
  );
}
