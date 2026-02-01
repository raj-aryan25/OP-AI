import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseUsers, type User } from './authUtils';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for persisted session
        const storedUser = localStorage.getItem('op_ai_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        // Simulate async network delay for realism
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = parseUsers();
        const userData = users.get(username);

        if (userData && userData.password === password) {
            const newUser = { username, role: userData.role };
            setUser(newUser);
            localStorage.setItem('op_ai_user', JSON.stringify(newUser));
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('op_ai_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
