import { Outlet } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import './MainLayout.css';

export default function MainLayout() {

  const { signOut } = useAuthenticator((context: any) => [context.signOut]);

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">Multi-Dashboard App</div>
          <div className="nav-links">
            <button onClick={signOut} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
