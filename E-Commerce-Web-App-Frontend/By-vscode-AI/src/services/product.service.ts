import { APP_CONFIG } from "@/lib/config";
import { apiRequest } from "@/lib/http-client";
import type { Product } from "@/types/api";

const PRODUCT_BASE = APP_CONFIG.endpoints.products;

export const productService = {
    getAll() {
        return apiRequest<Product[]>(PRODUCT_BASE, { method: "GET" });
    },

    getById(id: string | number) {
        return apiRequest<Product>(`${PRODUCT_BASE}/${id}`, { method: "GET" });
    },
};
