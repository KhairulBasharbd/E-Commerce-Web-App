"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { tokenStorage } from "@/lib/token-storage";
import { authService } from "@/services/auth.service";
import type { LoginPayload, RegisterPayload, User } from "@/types/api";

interface AuthContextValue {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const savedToken = tokenStorage.get();
            if (!savedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const me = await authService.me(savedToken);
                setUser(me);
                setToken(savedToken);
            } catch {
                tokenStorage.clear();
            } finally {
                setIsLoading(false);
            }
        };

        void restoreSession();
    }, []);

    const login = useCallback(async (payload: LoginPayload) => {
        const data = await authService.login(payload);
        tokenStorage.set(data.token);
        setToken(data.token);
        setUser(data.user);
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        const data = await authService.register(payload);
        tokenStorage.set(data.token);
        setToken(data.token);
        setUser(data.user);
    }, []);

    const logout = useCallback(() => {
        tokenStorage.clear();
        setToken(null);
        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            isLoading,
            isAuthenticated: Boolean(user && token),
            login,
            register,
            logout,
        }),
        [isLoading, login, logout, register, token, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
};
