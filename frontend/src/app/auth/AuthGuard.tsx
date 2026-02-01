import { useAuth } from './AuthContext';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

interface AuthGuardProps {
    requiredGroup: string;
}

export default function AuthGuard({ requiredGroup }: AuthGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        // Redirect to the specific login page for the section they tried to access
        return <Navigate to={`/login/${requiredGroup.toLowerCase().slice(0, -1)}`} state={{ from: location }} replace />;
    }

    // Check role
    // user.role from CSV is 'Admins', 'Operators', 'Users'
    // requiredGroup is passed as 'Admins', 'Operators', 'Users'
    if (user.role !== requiredGroup) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', marginTop: '100px' }}>
                <h1>Access Denied</h1>
                <p>You do not have permission to access this area.</p>
                <p>Required role: {requiredGroup}</p>
                <p>Your role: {user.role}</p>
            </div>
        );
    }

    return <Outlet />;
}
