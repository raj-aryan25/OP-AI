import { Link, Outlet, useLocation } from 'react-router-dom';
import './MainLayout.css';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">Multi-Dashboard App</div>
          <div className="nav-links">
            <Link 
              to="/admin" 
              className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}
            >
              Admin
            </Link>
            <Link 
              to="/operator" 
              className={location.pathname === '/operator' ? 'nav-link active' : 'nav-link'}
            >
              Operator
            </Link>
            <Link 
              to="/user" 
              className={location.pathname === '/user' ? 'nav-link active' : 'nav-link'}
            >
              User
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
