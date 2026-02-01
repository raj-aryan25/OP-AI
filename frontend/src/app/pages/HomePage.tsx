import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Shield, Globe } from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-page theme-light">
            <nav className="home-nav">
                <div className="logo">
                    <Zap className="logo-icon" fill="currentColor" />
                    <span>OP-AI</span>
                </div>
                <div className="nav-actions">
                    <button className="btn-text" onClick={() => navigate('/login/admin')}>Admin</button>
                    <button className="btn-text" onClick={() => navigate('/login/operator')}>Partner</button>
                    <button className="btn btn-primary" onClick={() => navigate('/login/user')}>
                        Get Started <ArrowRight size={18} />
                    </button>
                </div>
            </nav>

            <header className="hero-section">
                <div className="content">
                    <div className="badge">
                        <span className="dot"></span> Limitless Mobility
                    </div>
                    <h1 className="hero-title">
                        Powering the <br />
                        <span className="text-gradient">EV Revolution</span>
                    </h1>
                    <h2 className="brand-subtitle">For Battery Smart</h2>
                    <p className="subtitle">
                        India's largest battery swapping network.
                        Smart. Sustainable. Non-stop.
                    </p>

                    <div className="cta-container">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/login/user')}>
                            Find a Station
                        </button>
                        <button className="btn btn-outline btn-lg" onClick={() => navigate('/login/operator')}>
                            For Partners
                        </button>
                    </div>
                </div>

                <div className="visuals">
                    <div className="glowing-orb"></div>
                    <div className="glass-card stat-card-1">
                        <Globe size={24} className="icon-blue" />
                        <div className="stat-info">
                            <span className="stat-value">1500+</span>
                            <span className="stat-label">Live Stations</span>
                        </div>
                    </div>
                    <div className="glass-card stat-card-2">
                        <Shield size={24} className="icon-green" />
                        <div className="stat-info">
                            <span className="stat-value">100M+</span>
                            <span className="stat-label">Swaps Done</span>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
