'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser, Role } from '@/types';
import { decodeToken } from '@/lib/utils';

interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    isAdmin: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

// Rehydrate from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded) {
                setUser({ email: decoded.email, role: decoded.role, token });
                // Ensure cookie is in sync for middleware
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
            } else {
                localStorage.removeItem('token');
                document.cookie = 'token=; path=/; max-age=0';
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        const decoded = decodeToken(token);
        if (decoded) {
            const authUser: AuthUser = { ...decoded, token };
            localStorage.setItem('token', token);
            // Set cookie for middleware
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
            setUser(authUser);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        // Remove cookie
        document.cookie = 'token=; path=/; max-age=0';
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAdmin: user?.role === 'ADMIN',
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
