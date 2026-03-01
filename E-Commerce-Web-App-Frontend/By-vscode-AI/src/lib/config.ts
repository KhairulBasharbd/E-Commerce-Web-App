const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:8080";

export const APP_CONFIG = {
    appName: "E-Commerce Frontend",
    apiBaseUrl,
    endpoints: {
        auth: process.env.NEXT_PUBLIC_AUTH_PREFIX || "/api/auth",
        products: process.env.NEXT_PUBLIC_PRODUCTS_PREFIX || "/api/products",
        cart: process.env.NEXT_PUBLIC_CART_PREFIX || "/api/cart",
        orders: process.env.NEXT_PUBLIC_ORDERS_PREFIX || "/api/orders",
        payments: process.env.NEXT_PUBLIC_PAYMENTS_PREFIX || "/api/payments",
    },
};

export const buildApiUrl = (path: string): string => {
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${APP_CONFIG.apiBaseUrl}${normalized}`;
};
