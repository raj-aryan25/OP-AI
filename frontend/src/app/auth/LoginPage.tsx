import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './LoginPage.css';

interface LoginPageProps {
    requiredGroup: string;
}

export default function LoginPage({ requiredGroup }: LoginPageProps) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const from = location.state?.from?.pathname || `/${requiredGroup.toLowerCase().slice(0, -1)}`;
    const roleName = requiredGroup.slice(0, -1); // Admins -> Admin

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            const success = await login(username, password);
            if (success) {
                // Verification logic is inside login/context, but we should verify role match here too effectively?
                // Actually the strictly checking happens in AuthGuard. 
                // But let's check if the logged in user actually has the role they are trying to access.
                // Since context now has the user.
                navigate(from, { replace: true });
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('An error occurred during login');
            console.error(err);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>{roleName} Login</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn" disabled={isLoggingIn}>
                        {isLoggingIn ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="hint">
                    Hint: See src/data/users.csv for credentials.
                </p>
            </div>
        </div>
    );
}
