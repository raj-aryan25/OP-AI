import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <header className="hero-section">
                <div className="content">
                    <h1>Welcome to OP-AI</h1>
                    <p className="subtitle">Operational Intelligence & Network Management Platform</p>
                    <div className="description">
                        <p>
                            OP-AI is a comprehensive solution designed to optimize station operations,
                            manage simulation controls, and provide real-time network visibility.
                            Our platform empowers Admin, Operators, and Users with role-specific dashboards
                            to ensure seamless workflow and decision making.
                        </p>
                    </div>
                    <div className="cta-container">
                        <button className="primary-btn" onClick={() => navigate('/login/user')}>
                            Login as User
                        </button>
                        <div className="secondary-links">
                            <button className="text-btn" onClick={() => navigate('/login/admin')}>Admin Access</button>
                            <span className="separator">|</span>
                            <button className="text-btn" onClick={() => navigate('/login/operator')}>Operator Access</button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
