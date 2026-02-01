import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './MainLayout.css';

export default function MainLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">Multi-Dashboard App</div>
          <div className="nav-links">
            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
