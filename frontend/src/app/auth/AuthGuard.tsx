import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

interface AuthGuardProps {
    requiredGroup: string;
}

export default function AuthGuard({ requiredGroup }: AuthGuardProps) {
    const { authStatus } = useAuthenticator((context: any) => [context.authStatus]);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        async function checkGroup() {
            if (authStatus !== 'authenticated') {
                setIsAuthorized(false);
                return;
            }

            try {
                const session = await fetchAuthSession();
                const tokens = session.tokens;
                if (!tokens) {
                    setIsAuthorized(false);
                    return;
                }

                const groups = tokens.accessToken.payload['cognito:groups'] as string[] || [];
                // Check if user is in the required group
                // If requiredGroup is 'Admins', check for 'Admins'
                if (groups.includes(requiredGroup)) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error('Error checking auth session:', error);
                setIsAuthorized(false);
            }
        }

        if (authStatus === 'configuring') return;
        checkGroup();
    }, [authStatus, requiredGroup]);

    if (authStatus === 'configuring' || isAuthorized === null) {
        return <div>Loading...</div>; // TODO: Replace with a nice loading spinner
    }

    if (authStatus !== 'authenticated') {
        // Redirect to the specific login page for the section they tried to access
        return <Navigate to={`/login/${requiredGroup.toLowerCase().slice(0, -1)}`} state={{ from: location }} replace />;
    }

    if (!isAuthorized) {
        // Authenticated but wrong group
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Access Denied</h1>
                <p>You do not have permission to access this area.</p>
                <p>Required role: {requiredGroup}</p>
            </div>
        );
    }

    return <Outlet />;
}
