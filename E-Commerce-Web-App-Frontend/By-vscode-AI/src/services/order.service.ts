import { APP_CONFIG } from "@/lib/config";
import { apiRequest } from "@/lib/http-client";
import type { CreateOrderPayload, Order } from "@/types/api";

const ORDERS_BASE = APP_CONFIG.endpoints.orders;

export const orderService = {
    getMine(token: string) {
        return apiRequest<Order[]>(ORDERS_BASE, {
            method: "GET",
            token,
        });
    },

    create(payload: CreateOrderPayload, token: string) {
        return apiRequest<Order>(ORDERS_BASE, {
            method: "POST",
            token,
            body: JSON.stringify(payload),
        });
    },
};
