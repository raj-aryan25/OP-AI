import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './MainLayout.css';
import { Zap } from 'lucide-react';

export default function MainLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if we are in consumer view (User Dashboard) to apply specific styles if needed
  const isUserView = location.pathname.startsWith('/user');

  return (
    <div className={`main-layout ${isUserView ? 'theme-light' : ''}`}>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => navigate('/')}>
            <Zap className="brand-icon" size={24} />
            <span>OP AI</span>
          </div>
          <div className="nav-actions">
            <button onClick={handleLogout} className="btn-logout">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
