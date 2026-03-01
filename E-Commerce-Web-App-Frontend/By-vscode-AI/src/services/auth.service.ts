import { APP_CONFIG } from "@/lib/config";
import { apiRequest } from "@/lib/http-client";
import type {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    User,
} from "@/types/api";

const AUTH_BASE = APP_CONFIG.endpoints.auth;

export const authService = {
    login(payload: LoginPayload) {
        return apiRequest<AuthResponse>(`${AUTH_BASE}/login`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    register(payload: RegisterPayload) {
        return apiRequest<AuthResponse>(`${AUTH_BASE}/register`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    me(token: string) {
        return apiRequest<User>(`${AUTH_BASE}/me`, {
            method: "GET",
            token,
        });
    },
};
