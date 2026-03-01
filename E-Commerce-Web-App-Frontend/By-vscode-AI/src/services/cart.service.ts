import { APP_CONFIG } from "@/lib/config";
import { apiRequest } from "@/lib/http-client";
import type {
    AddToCartPayload,
    Cart,
    UpdateCartItemPayload,
} from "@/types/api";

const CART_BASE = APP_CONFIG.endpoints.cart;

export const cartService = {
    getCart(token: string) {
        return apiRequest<Cart>(CART_BASE, {
            method: "GET",
            token,
        });
    },

    addItem(payload: AddToCartPayload, token: string) {
        return apiRequest<Cart>(`${CART_BASE}/items`, {
            method: "POST",
            token,
            body: JSON.stringify(payload),
        });
    },

    updateItem(itemId: number, payload: UpdateCartItemPayload, token: string) {
        return apiRequest<Cart>(`${CART_BASE}/items/${itemId}`, {
            method: "PATCH",
            token,
            body: JSON.stringify(payload),
        });
    },

    removeItem(itemId: number, token: string) {
        return apiRequest<Cart>(`${CART_BASE}/items/${itemId}`, {
            method: "DELETE",
            token,
        });
    },

    clear(token: string) {
        return apiRequest<void>(`${CART_BASE}/clear`, {
            method: "DELETE",
            token,
        });
    },
};
