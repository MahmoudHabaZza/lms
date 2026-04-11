import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

type User = {
    id: number;
    name: string;
    email: string;
    profile_picture?: string | null;
};

type AuthContextShape = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshUser() {
        try {
            const data = await api.get('/me');
            setUser(data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshUser();
    }, []);

    async function login(email: string, password: string) {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('api_token', res.token);
        await refreshUser();
    }

    async function register(name: string, email: string, password: string, password_confirmation: string) {
        const res = await api.post('/register', { name, email, password, password_confirmation });
        localStorage.setItem('api_token', res.token);
        await refreshUser();
    }

    async function logout() {
        try {
            await api.post('/logout');
        } catch (e) {
            // ignore
        }
        localStorage.removeItem('api_token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
