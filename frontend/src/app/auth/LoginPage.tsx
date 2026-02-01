import { useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';

import { useNavigate, useLocation } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import './LoginPage.css';

interface LoginPageProps {
    requiredGroup: string;
}

export default function LoginPage({ requiredGroup }: LoginPageProps) {
    const { authStatus } = useAuthenticator(context => [context.authStatus]);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || `/${requiredGroup.toLowerCase().slice(0, -1)}`;

    useEffect(() => {
        if (authStatus === 'authenticated') {
            // Double check group before redirecting to prevent loops if they login with wrong user
            // But AuthGuard handles the "access denied" if they go to target.
            // So we can just redirect.
            navigate(from, { replace: true });
        }
    }, [authStatus, navigate, from]);

    // Map singular prop to plural group name for title if needed, 
    // but we passed plural group name like 'Admins', 'Operators'
    // Let's make a nice title.
    const roleName = requiredGroup.slice(0, -1); // Admins -> Admin

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>{roleName} Portal Login</h1>
                <Authenticator
                    hideSignUp={requiredGroup === 'Admins'} // Maybe hide signup for admins? Let's leave it open or configurable. User didn't specify.
                />
            </div>
        </div>
    );
}
